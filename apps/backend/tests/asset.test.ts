import request from 'supertest';
import { createTestUser, appTest } from './setup';
import { AssetTypeEnum } from '@generated/prisma';
import { Asset } from 'types/asset.type';

describe('Asset Endpoints', () => {
  const app = appTest.app;
  let testUserId: number;
  let testAccountId: number;
  let testAsset: Asset;

  beforeAll(async () => {
    // Create test user and account
    const { user, accounts } = await createTestUser();
    testAccountId = accounts[0].id;
    testUserId = user.id;

    // Set global userId for mocked middleware
    (globalThis as any).testUserId = testUserId;
  });

  describe('POST /api/asset', () => {
    it('should create a new asset with valid data', async () => {
      const assetData = {
        accountId: testAccountId,
        type: AssetTypeEnum.cash,
        name: 'Test Cash Asset',
        value: 1500,
      };

      const res = await request(app)
        .post('/api/asset')
        .send(assetData)
        .expect(200);

      expect(res.body.data).toHaveProperty('split');
      expect(res.body.data).toHaveProperty('snapshots');
      expect(res.body.data.split).toHaveProperty('cash');
      expect(res.body.data.split.cash).toHaveProperty('assets');
      expect(res.body.data.split.cash.assets).toHaveLength(1);
      expect(res.body.data.split.cash.assets[0].type).toBe(AssetTypeEnum.cash);
      expect(res.body.data.split.cash.assets[0].name).toBe('Test Cash Asset');
      expect(res.body.data.split.cash.assets[0].value).toBe(1500);
      testAsset = res.body.data.split.cash.assets[0];
    });

    it('should reject asset creation with invalid asset type', async () => {
      const assetData = {
        accountId: testAccountId,
        type: 'invalid-type',
        name: 'Test Asset',
        value: 1000,
      };

      await request(app).post('/api/asset').send(assetData).expect(422);
    });

    it('should reject asset creation with empty name', async () => {
      const assetData = {
        accountId: testAccountId,
        type: AssetTypeEnum.cash,
        name: '',
        value: 1000,
      };

      await request(app).post('/api/asset').send(assetData).expect(422);
    });

    it('should reject asset creation with missing accountId', async () => {
      const assetData = {
        type: AssetTypeEnum.cash,
        name: 'Test Asset',
        value: 1000,
      };

      await request(app).post('/api/asset').send(assetData).expect(422);
    });
  });

  describe('GET /api/asset/all/:accountId', () => {
    it('should get all assets for a valid account', async () => {
      const res = await request(app)
        .get(`/api/asset/all/${testAccountId}`)
        .expect(200);

      expect(res.body.data).toHaveProperty('split');
      expect(res.body.data).toHaveProperty('snapshots');
      expect(res.body.data.split).toHaveProperty('cash');
      expect(res.body.data.split.cash).toHaveProperty('assets');
      expect(res.body.data.split.cash.assets).toHaveLength(1);
      expect(res.body.data.split.cash.assets[0].id).toBe(testAsset.id);
      expect(res.body.data.split.cash.assets[0].type).toBe(AssetTypeEnum.cash);
      expect(res.body.data.split.cash.assets[0].name).toBe('Test Cash Asset');
      expect(res.body.data.split.cash.assets[0].value).toBe(1500);
    });

    it('should return 404 for non-existent account', async () => {
      await request(app).get('/api/asset/all/99999').expect(404);
    });

    it("shouldn't be able to get assets for another account", async () => {
      const { accounts } = await createTestUser({
        email: 'test2@example.com',
        password: 'testpassword123',
        accountName: 'Test User 2',
      });
      const accountId = accounts[0].id;
      // globalThis.userId is the first user's id, and this accountId is the second user's accountId
      await request(app).get(`/api/asset/all/${accountId}`).expect(403);
    });
  });

  describe('PUT /api/asset/:assetId', () => {
    it('should update an asset with valid data', async () => {
      const updateData = {
        accountId: testAccountId,
        type: AssetTypeEnum.crypto,
        name: 'Updated Crypto Asset',
        value: 2500,
      };

      const res = await request(app)
        .put(`/api/asset/${testAsset.id}`)
        .send(updateData)
        .expect(200);

      expect(res.body.data).toHaveProperty('split');
      expect(res.body.data).toHaveProperty('snapshots');
      expect(res.body.data.split).toHaveProperty('crypto');
      expect(res.body.data.split.crypto).toHaveProperty('assets');
      expect(res.body.data.split.crypto.assets).toHaveLength(1);
      expect(res.body.data.split.crypto.assets[0].id).toBe(testAsset.id);
      expect(res.body.data.split.crypto.assets[0].type).toBe(
        AssetTypeEnum.crypto,
      );
      expect(res.body.data.split.crypto.assets[0].name).toBe(
        'Updated Crypto Asset',
      );
      expect(res.body.data.split.crypto.assets[0].value).toBe(2500);
    });

    it('should reject update with invalid asset type', async () => {
      const updateData = {
        accountId: testAccountId,
        type: 'invalid-type',
        name: 'Updated Asset',
        value: 2500,
      };

      await request(app)
        .put(`/api/asset/${testAsset.id}`)
        .send(updateData)
        .expect(422);
    });

    it('should reject update with empty name', async () => {
      const updateData = {
        accountId: testAccountId,
        type: AssetTypeEnum.crypto,
        name: '',
        value: 2500,
      };

      await request(app)
        .put(`/api/asset/${testAsset.id}`)
        .send(updateData)
        .expect(422);
    });

    it('should reject update for non-existent asset', async () => {
      const updateData = {
        accountId: testAccountId,
        type: AssetTypeEnum.crypto,
        name: 'Updated Asset',
        value: 2500,
      };

      await request(app).put('/api/asset/99999').send(updateData).expect(404);
    });
  });

  describe('DELETE /api/asset/:assetId', () => {
    it('should delete an asset successfully', async () => {
      const res = await request(app)
        .delete(`/api/asset/${testAsset.id}`)
        .send({ accountId: testAccountId })
        .expect(200);
      expect(res.body.data).toHaveProperty('split');
      expect(res.body.data).toHaveProperty('snapshots');
      expect(res.body.data.split).toHaveProperty('crypto');
      expect(res.body.data.split.crypto.assets).toHaveLength(0);
    });

    it('should reject deletion for non-existent asset', async () => {
      await request(app)
        .delete('/api/asset/99999')
        .send({ accountId: testAccountId })
        .expect(404);
    });

    it('should reject deletion with missing accountId', async () => {
      await request(app)
        .delete(`/api/asset/${testAsset.id}`)
        .send({})
        .expect(422);
    });
  });
});
