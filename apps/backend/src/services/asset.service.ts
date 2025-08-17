import { prisma } from 'db';
import { AssetFormData } from 'types/asset.type';
import SnapshotService from './snapshot.service';

export default class AssetService {
  private snapshotService: SnapshotService = new SnapshotService();

  public async getAsset(assetId: number) {
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
    });
    return asset;
  }

  // Create asset
  public async createAsset(accountId: number, formData: AssetFormData) {
    const createAssetData = { accountId, ...formData };
    const newAsset = await prisma.asset.create({
      data: createAssetData,
    });

    const newSnapshot = await this.snapshotService.createSnapshot(
      accountId,
      newAsset.id,
      formData.value,
      formData.type,
    );

    return newAsset;
  }

  // Edit asset
  public async editAsset(
    accountId: number,
    assetId: number,
    formData: AssetFormData,
  ) {
    const updatedAsset = await prisma.asset.update({
      where: { id: assetId },
      data: { ...formData },
    });

    const updatedSnapshot = await this.snapshotService.editSnapshot(
      accountId,
      updatedAsset.id,
      formData.value,
      formData.type,
    );

    return updatedAsset;
  }

  // Delete asset
  public async deleteAsset(accountId: number, assetId: number) {
    const deletedAsset = await prisma.asset.delete({
      where: { id: assetId },
      select: { type: true },
    });

    const deletedSnapshot = await this.snapshotService.deleteSnapshot(
      accountId,
      assetId,
      deletedAsset.type,
    );

    return deletedAsset;
  }
}
