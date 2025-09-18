import { AssetFormData } from 'types/asset.type';
import SnapshotService from './snapshot.service';
import { Prisma } from '../../generated/prisma';

export default class AssetService {
  // Create asset
  public static async createAsset(
    accountId: number,
    formData: AssetFormData,
    transaction: Prisma.TransactionClient,
    plaidAccountId?: string,
  ) {
    const { type, name, value } = formData;

    const newAsset = await transaction.asset.create({
      data: { accountId, type, name, plaidAccountId },
    });

    await SnapshotService.createSnapshot(
      accountId,
      newAsset.id,
      value,
      type,
      transaction,
    );

    return newAsset;
  }

  // Edit asset
  public static async editAsset(
    accountId: number,
    assetId: number,
    formData: AssetFormData,
    transaction: Prisma.TransactionClient,
  ) {
    const { type, name, value } = formData;

    // TO DO IN SAME TRANSACTION
    const updatedAsset = await transaction.asset.update({
      where: { id: assetId },
      data: { type, name },
    });

    await SnapshotService.editSnapshot(
      accountId,
      updatedAsset.id,
      value,
      type,
      transaction,
    );
    return updatedAsset;
  }

  // Delete asset
  public static async deleteAsset(
    accountId: number,
    assetId: number,
    transaction: Prisma.TransactionClient,
  ) {
    const existingSnapshot = await transaction.assetSnapshot.findFirst({
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

    const deletedAsset = await transaction.asset.delete({
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
      transaction,
    );

    return deletedAsset;
  }
}
