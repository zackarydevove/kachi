import { prisma } from 'db';
import { AssetTypeEnum } from '../../generated/prisma';
import { Asset } from 'types/asset.type';

export default class SnapshotService {
  public today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  private async getSplit(accountId: number) {
    // Get all assets of accountId
    const assets = await prisma.asset.findMany({
      where: { accountId },
    });

    // Get oldest and most recent snapshot of type 'networth'
    const networth = {
      recentSnapshot: await prisma.assetSnapshot.findFirst({
        where: {
          type: AssetTypeEnum.networth,
          date: this.today,
          accountId,
          assetId: null,
        },
        orderBy: { date: 'desc' },
        select: { value: true },
      }),
      oldestSnapshot: await prisma.assetSnapshot.findFirst({
        where: {
          type: AssetTypeEnum.networth,
          date: this.today,
          accountId,
          assetId: null,
        },
        orderBy: { date: 'asc' },
        select: { value: true },
      }),
    };

    // Create split, an object with each type as key
    const split: Record<
      AssetTypeEnum,
      {
        value: number;
        pnl: number;
        split: number;
        assets: (Asset & { value: number; pnl: number; split: number })[];
      }
    > = {
      networth: { value: 0, pnl: 0, split: 0, assets: [] },
      crypto: { value: 0, pnl: 0, split: 0, assets: [] },
      realEstate: { value: 0, pnl: 0, split: 0, assets: [] },
      stock: { value: 0, pnl: 0, split: 0, assets: [] },
      cash: { value: 0, pnl: 0, split: 0, assets: [] },
      exotic: { value: 0, pnl: 0, split: 0, assets: [] },
    };

    for (const type of Object.values(AssetTypeEnum)) {
      const recentSnapshot = await prisma.assetSnapshot.findFirst({
        where: {
          type,
          date: this.today,
          accountId,
          assetId: null,
        },
        orderBy: { date: 'desc' },
        select: { value: true },
      });
      const oldestSnapshot = await prisma.assetSnapshot.findFirst({
        where: {
          type,
          date: this.today,
          accountId,
          assetId: null,
        },
        orderBy: { date: 'asc' },
        select: { value: true },
      });
      split[type] = {
        value: recentSnapshot?.value ?? 0,
        pnl:
          recentSnapshot?.value && oldestSnapshot?.value
            ? (recentSnapshot.value - oldestSnapshot.value) /
              oldestSnapshot.value
            : 0,
        split:
          recentSnapshot?.value && networth.recentSnapshot?.value
            ? (recentSnapshot.value / networth.recentSnapshot.value) * 100
            : 0,
        assets: [],
      };
    }

    for (const asset of assets) {
      const recentSnapshot = await prisma.assetSnapshot.findFirst({
        where: {
          assetId: asset.id,
          date: this.today,
          accountId,
          type: null,
        },
        orderBy: { date: 'desc' },
        select: { value: true },
      });
      const oldestSnapshot = await prisma.assetSnapshot.findFirst({
        where: {
          assetId: asset.id,
          date: this.today,
          accountId,
          type: null,
        },
        orderBy: { date: 'asc' },
        select: { value: true },
      });

      const assetType = asset.type;
      if (assetType && split[assetType]) {
        split[assetType].assets.push({
          ...asset,
          value: recentSnapshot?.value ?? 0,
          pnl:
            recentSnapshot?.value && oldestSnapshot?.value
              ? (recentSnapshot.value - oldestSnapshot.value) /
                oldestSnapshot.value
              : 0,
          split:
            recentSnapshot?.value && split[assetType].value
              ? (recentSnapshot.value / split[assetType].value) * 100
              : 0,
        });
      }
    }
    return split;
  }

  private async getSnapshots(accountId: number) {
    // Get all the snapshots type of accountId (type snapshots only, no assetId)
    const snapshots = await prisma.assetSnapshot.findMany({
      where: {
        accountId,
        type: { not: null },
        assetId: null,
      },
      select: {
        date: true,
        type: true,
        value: true,
      },
    });

    // Get all the snapshots by Date
    const snapshotByDate: Record<string, Record<AssetTypeEnum, number>> = {};
    for (const snapshot of snapshots) {
      const { type, value, date } = snapshot;
      if (type) {
        if (!snapshotByDate[date]) {
          snapshotByDate[date] =
            (snapshotByDate[date] as Record<AssetTypeEnum, number>) ||
            ({} as Record<AssetTypeEnum, number>);
        }
        (snapshotByDate[date] as Record<AssetTypeEnum, number>)[type] = value;
      }
    }

    // Flatten the object so the date is a key and the value is the date, then we'll have an array { date: xxx, type: value }
    const snapshotsArray = Object.entries(snapshotByDate).map(
      ([date, snapshots]) => ({
        date,
        ...snapshots,
      }),
    );
    return snapshotsArray;
  }

  public async getSplitAndSnapshots(accountId: number) {
    const split = await this.getSplit(accountId);
    const snapshots = await this.getSnapshots(accountId);
    return { split, snapshots };
  }

  public async editTypeAndNetworthSnapshots(
    accountId: number,
    value: number,
    type: AssetTypeEnum,
    isIncrement: boolean,
  ) {
    // Find the type snapshot first, then update it by ID
    const typeSnapshot = await prisma.assetSnapshot.findFirst({
      where: {
        type: type,
        date: this.today,
        accountId,
        assetId: null,
      },
    });

    if (!typeSnapshot) {
      throw new Error(
        `${type} snapshot of ${accountId} not found on ${this.today}`,
      );
    }

    // Edit type snapshot (because now that we have a new asset of that type, the total changed)
    const editTypeSnapshot = await prisma.assetSnapshot.update({
      where: { id: typeSnapshot.id },
      data: {
        value: isIncrement ? { increment: value } : { decrement: value },
      },
    });
    // Find the networth snapshot first, then update it by ID
    const networthSnapshot = await prisma.assetSnapshot.findFirst({
      where: {
        type: AssetTypeEnum.networth,
        date: this.today,
        accountId,
        assetId: null,
      },
    });

    if (!networthSnapshot) {
      throw new Error(`Networth snapshot not found on ${this.today}`);
    }

    // Edit networth snapshot (because now that we have a new asset, the total changed)
    const editNetworthSnapshot = await prisma.assetSnapshot.update({
      where: { id: networthSnapshot.id },
      data: {
        value: isIncrement ? { increment: value } : { decrement: value },
      },
    });
    return { editTypeSnapshot, editNetworthSnapshot };
  }

  // Create snapshots for all assets of an account
  public async createTodaySnapshots() {
    // Get all accountIds
    const accountIds = await prisma.account.findMany({
      select: { id: true },
    });

    // Get yesterday date
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    // Get all yesterday snapshots
    const yesterdaySnapshots = await prisma.assetSnapshot.findMany({
      where: {
        accountId: { in: accountIds.map((account) => account.id) },
        date: yesterday,
      },
      select: {
        accountId: true,
        assetId: true,
        type: true,
        value: true,
      },
    });

    // Duplicate them with today's date
    const todaySnapshots = yesterdaySnapshots.map((snapshot) => ({
      ...snapshot,
      date: this.today,
    }));

    // Create today snapshots
    await prisma.assetSnapshot.createMany({
      data: todaySnapshots,
    });
  }

  // Initialize snapshots for a new account
  public async initializeAccountSnapshots(accountId: number) {
    const today = this.today;

    // Create type snapshots for all asset types
    const typeSnapshots = Object.values(AssetTypeEnum).map((type) => ({
      accountId,
      assetId: null,
      type,
      date: today,
      value: 0,
    }));

    // Create all snapshots
    await prisma.assetSnapshot.createMany({
      data: typeSnapshots,
    });

    return typeSnapshots;
  }

  // Create snapshot
  public async createSnapshot(
    accountId: number,
    assetId: number,
    value: number,
    type: AssetTypeEnum,
  ) {
    // Create asset snapshot (assetId only, no type)
    const newAssetSnapshot = await prisma.assetSnapshot.create({
      data: {
        accountId,
        assetId,
        type: null,
        date: this.today,
        value,
      },
    });

    // Edit type and networth snapshots
    const isIncrement = true;
    await this.editTypeAndNetworthSnapshots(
      accountId,
      value,
      type,
      isIncrement,
    );

    return newAssetSnapshot;
  }

  // Edit snapshot
  public async editSnapshot(
    accountId: number,
    assetId: number,
    value: number,
    type: AssetTypeEnum,
  ) {
    // Get current value
    const existingSnapshot = await prisma.assetSnapshot.findFirst({
      where: {
        assetId,
        date: this.today,
        accountId,
        type: null,
      },
      select: { value: true, id: true },
    });

    if (!existingSnapshot) {
      throw new Error('Snapshot not found');
    }

    // Update snapshot
    const snapshot = await prisma.assetSnapshot.update({
      where: { id: existingSnapshot.id },
      data: { value },
    });

    // Edit type and networth snapshots
    const isIncrement = value > existingSnapshot?.value;
    const val = isIncrement
      ? value - existingSnapshot.value
      : existingSnapshot.value - value;
    if (val > 0)
      await this.editTypeAndNetworthSnapshots(
        accountId,
        val,
        type,
        isIncrement,
      );

    return snapshot;
  }
}
