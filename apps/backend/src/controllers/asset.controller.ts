import Send from '@utils/response.util';
import { Request, Response } from 'express';
import AssetService from 'services/asset.service';
import SnapshotService from 'services/snapshot.service';

// TODO: Handle the error better in here, the service throw, find a way to write less code
export default class AssetController {
  private static assetService: AssetService = new AssetService();
  private static snapshotService: SnapshotService = new SnapshotService();

  static getAllAssets = async (req: Request, res: Response) => {
    try {
      const { accountId } = req.params;
      const { split, snapshots } =
        await this.snapshotService.getSplitAndSnapshots(Number(accountId));
      return Send.success(res, { split, snapshots });
    } catch (error) {
      console.error('Error getting all assets:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };

  static createAsset = async (req: Request, res: Response) => {
    try {
      const { accountId, ...formData } = req.body;

      const newAsset = await this.assetService.createAsset(
        Number(accountId),
        formData,
      );

      const { split, snapshots } =
        await this.snapshotService.getSplitAndSnapshots(Number(accountId));

      return Send.success(res, { split, snapshots });
    } catch (error) {
      console.error('Error creating asset:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };

  static editAsset = async (req: Request, res: Response) => {
    try {
      const assetId = Number(req.params.assetId);
      const { accountId, ...formData } = req.body;

      console.log('assetId', assetId);
      console.log('accountId', accountId);
      console.log('formData', formData);

      const updatedAsset = await this.assetService.editAsset(
        accountId,
        assetId,
        formData,
      );

      const { split, snapshots } =
        await this.snapshotService.getSplitAndSnapshots(Number(accountId));

      return Send.success(res, { split, snapshots });
    } catch (error) {
      console.error('Error updating asset:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };

  static deleteAsset = async (req: Request, res: Response) => {
    try {
      const assetId = Number(req.params.assetId);
      const { accountId } = req.body;

      const deletedAsset = await this.assetService.deleteAsset(
        accountId,
        assetId,
      );

      const { split, snapshots } =
        await this.snapshotService.getSplitAndSnapshots(Number(accountId));

      return Send.success(res, { split, snapshots });
    } catch (error) {
      console.error('Error deleting asset:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };
}
