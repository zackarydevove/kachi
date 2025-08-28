import { prisma } from 'db';
import { AssetFormData } from 'types/asset.type';
import SnapshotService from './snapshot.service';

export default class AssetService {
  private snapshotService: SnapshotService = new SnapshotService();

  // Create asset
  public async createAsset(accountId: number, formData: AssetFormData) {
    const { type, name, value } = formData;

    // TO DO IN SAME TRANSACTION
    // Create asset first
    const newAsset = await prisma.asset.create({
      data: { accountId, type, name },
    });

    await this.snapshotService.createSnapshot(
      accountId,
      newAsset.id,
      value,
      type,
    );

    return newAsset;
  }

  // Edit asset
  public async editAsset(
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

    await this.snapshotService.editSnapshot(
      accountId,
      updatedAsset.id,
      value,
      type,
    );
    return updatedAsset;
  }

  // Delete asset
  public async deleteAsset(accountId: number, assetId: number) {
    // TODO IN SAME TRANSACTION
    const existingSnapshot = await prisma.assetSnapshot.findFirst({
      where: {
        assetId,
        date: this.snapshotService.today,
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
    await this.snapshotService.editTypeAndNetworthSnapshots(
      accountId,
      existingSnapshot.value,
      deletedAsset.type,
      isIncrement,
    );

    return deletedAsset;
  }
}
