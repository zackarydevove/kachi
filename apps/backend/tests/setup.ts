import SnapshotService from '@services/snapshot.service';
import bcrypt from 'bcryptjs';
import App from 'app';
import { prisma } from 'db';

// Load test environment variables
jest.mock('@middlewares/auth.middleware', () => {
  const actual = jest.requireActual('@middlewares/auth.middleware');

  return {
    __esModule: true,
    default: {
      // Keep original implementations for these methods
      authenticateAccount: actual.default.authenticateAccount,
      authenticatePro: actual.default.authenticatePro,
      // Mock these methods
      authenticateUser: (req: any, _res: any, next: any) => {
        req.userId = (globalThis as any).testUserId || 1; // inject a dynamic id
        next();
      },
      refreshTokenValidation: (req: any, _res: any, next: any) => next(),
    },
  };
});

// Create Express app for testing
export const appTest = new App();

// Clean up database before test
beforeAll(async () => {
  await prisma.assetSnapshot.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
});

// Clean up after all tests
afterAll(async () => {
  await prisma.assetSnapshot.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

// Helper function to create a test user
export async function createTestUser(
  userData = {
    email: 'test@example.com',
    password: 'testpassword123',
    accountName: 'Test User',
  },
) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const data = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        isVerified: true,
      },
      select: { id: true, email: true },
    });

    const newAccount = await tx.account.create({
      data: {
        name: userData.accountName,
        userId: newUser.id,
      },
      select: { id: true, name: true, avatar: true },
    });

    await SnapshotService.initializeAccountSnapshots(newAccount.id, tx);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
      },
      accounts: [
        {
          id: newAccount.id,
          name: newAccount.name,
          avatar: newAccount.avatar,
        },
      ],
    };
  });

  return data;
}
