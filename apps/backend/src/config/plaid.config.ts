import { PlaidEnvironments } from 'plaid';

const plaidConfig = {
  configuration: {
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID as string,
        'PLAID-SECRET': process.env.PLAID_SECRET_KEY as string,
      },
    },
  },
};

export default plaidConfig;
