import plaidConfig from '@config/plaid.config';
import {
  AccountType,
  Configuration,
  CountryCode,
  PlaidApi,
  Products,
} from 'plaid';
import { AssetFormData } from 'types/asset.type';
import AssetService from '@services/asset.service';
import { AssetTypeEnum, Prisma } from '@generated/prisma';
import RedisUtil from '@utils/redis.util';
import SnapshotService from './snapshot.service';

const configuration = new Configuration(plaidConfig.configuration);
const plaidClient = new PlaidApi(configuration);

export default class PlaidService {
  private static getAssetType(accountType: AccountType) {
    switch (accountType) {
      case AccountType.Investment:
        return AssetTypeEnum.stock;
      case AccountType.Credit:
        return AssetTypeEnum.cash;
      case AccountType.Depository:
        return AssetTypeEnum.cash;
      //   case AccountType.Loan:
      //     return AssetTypeEnum.loan;
      case AccountType.Brokerage:
        return AssetTypeEnum.stock;
      case AccountType.Other:
        return AssetTypeEnum.exotic;
      default:
        return null;
    }
  }

  public static async generateLinkToken(accountId: number) {
    const configs = {
      client_name: 'Kachi Networth',
      user: {
        client_user_id: accountId.toString(),
      },
      country_codes: [CountryCode.Us],
      language: 'en',
      products: [Products.Investments],
    };

    const createTokenResponse = await plaidClient.linkTokenCreate(configs);
    if (!createTokenResponse.data.link_token)
      throw new Error('Failed to generate link token');

    return createTokenResponse.data.link_token;
  }

  public static async exchangePublicToken(
    accountId: number,
    publicTokenFromClient: string,
    transaction: Prisma.TransactionClient,
  ) {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicTokenFromClient,
    });
    if (!response.data.access_token)
      throw new Error('Failed to exchange public token');

    // Store access token in database
    await transaction.account.update({
      where: { id: accountId },
      data: {
        plaidAccessToken: response.data.access_token,
      },
    });
  }

  public static async getPlaidAssets(
    accountId: number,
    transaction: Prisma.TransactionClient,
  ) {
    const account = await transaction.account.findUnique({
      where: { id: accountId },
      select: { plaidAccessToken: true },
    });

    if (!account) throw new Error('Account not found');

    if (!account.plaidAccessToken)
      throw new Error("Account doesn't have access token");

    const holdingsResponse = await plaidClient.investmentsHoldingsGet({
      access_token: account.plaidAccessToken,
    });

    return holdingsResponse.data;
  }

  public static async createOrUpdatePlaidAssets(
    accountId: number,
    userId: number,
    transaction: Prisma.TransactionClient,
  ) {
    // Fetch the plaid assets
    const holdings = await this.getPlaidAssets(accountId, transaction);

    // Parse .accounts
    for (const plaidAccount of holdings.accounts) {
      const assetType = this.getAssetType(plaidAccount.type);
      if (!assetType) continue;

      const formData: AssetFormData = {
        name: plaidAccount.name,
        value: plaidAccount.balances.current as number,
        type: assetType,
      };

      // Check if  plaidAccount.id === plaidAccountId  already exist, then update today's snapshot with new value
      const existingAsset = await transaction.asset.findFirst({
        where: { plaidAccountId: plaidAccount.account_id },
        select: { id: true },
      });
      if (existingAsset) {
        // update today's snapshot of that asset, that type and networth
        await AssetService.editAsset(
          accountId,
          existingAsset.id,
          formData,
          transaction,
        );
      }
      // Else create new asset and snapshots
      else {
        // create new asset, new snapshot, update today's snapshot of that type and networth
        const plaidAccountId = plaidAccount.account_id;
        await AssetService.createAsset(
          accountId,
          formData,
          transaction,
          plaidAccountId,
        );
      }
    }
    // Note: Cache update is handled in the controller after transaction commits
    // to ensure we read the committed data
  }
}
