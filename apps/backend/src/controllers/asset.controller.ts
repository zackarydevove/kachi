import Send from '@utils/response.util';
import { Request, Response } from 'express';
import AssetService from 'services/asset.service';

// TODO: Handle the error better in here, the service throw, find a way to write less code
export default class AssetController {
  private static assetService: AssetService = new AssetService();

  static createAsset = async (req: Request, res: Response) => {
    try {
      const { accountId, ...formData } = req.body;

      const newAsset = await this.assetService.createAsset(
        Number(accountId),
        formData,
      );

      return Send.success(res, { newAsset });
    } catch (error) {
      console.error('Error creating asset:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };

  static editAsset = async (req: Request, res: Response) => {
    try {
      const assetId = Number(req.params.id);
      const { accountId, ...formData } = req.body;

      const updatedAsset = await this.assetService.editAsset(
        accountId,
        assetId,
        formData,
      );

      return Send.success(res, { updatedAsset });
    } catch (error) {
      console.error('Error updating asset:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };

  static deleteAsset = async (req: Request, res: Response) => {
    try {
      const assetId = Number(req.params.id);
      const { accountId } = req.body;

      const deletedAsset = await this.assetService.deleteAsset(
        accountId,
        assetId,
      );

      return Send.success(res, { deletedAsset });
    } catch (error) {
      console.error('Error deleting asset:', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };
}
