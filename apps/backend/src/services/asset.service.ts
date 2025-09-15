import { prisma } from 'db';
import { AssetFormData } from 'types/asset.type';
import SnapshotService from './snapshot.service';

export default class AssetService {
  // Create asset
  public static async createAsset(
    accountId: number,
    formData: AssetFormData,
    plaidAccountId?: string,
  ) {
    const { type, name, value } = formData;

    // TO DO IN SAME TRANSACTION
    // Create asset first
    const newAsset = await prisma.asset.create({
      data: { accountId, type, name, plaidAccountId },
    });

    await SnapshotService.createSnapshot(accountId, newAsset.id, value, type);

    return newAsset;
  }

  // Edit asset
  public static async editAsset(
    accountId: number,
    assetId: number,
    formData: AssetFormData,
  ) {
    const { type, name, value } = formData;

    // TO DO IN SAME TRANSACTION
    const updatedAsset = await prisma.asset.update({
      where: { id: assetId },
      data: { type, name },
    });

    await SnapshotService.editSnapshot(accountId, updatedAsset.id, value, type);
    return updatedAsset;
  }

  // Delete asset
  public static async deleteAsset(accountId: number, assetId: number) {
    // TODO IN SAME TRANSACTION
    const existingSnapshot = await prisma.assetSnapshot.findFirst({
      where: {
        assetId,
        date: SnapshotService.today,
        accountId,
        type: null,
      },
      select: { value: true, id: true },
    });

    if (!existingSnapshot) {
      throw new Error('Snapshot not found');
    }

    const deletedAsset = await prisma.asset.delete({
      where: { id: assetId },
      select: { type: true },
    });

    // Edit type and networth snapshots
    const isIncrement = false;
    await SnapshotService.editTypeAndNetworthSnapshots(
      accountId,
      existingSnapshot.value,
      deletedAsset.type,
      isIncrement,
    );

    return deletedAsset;
  }
}
