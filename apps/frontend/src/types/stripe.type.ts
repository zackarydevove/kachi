export type StripeInvoice = {
  id: string;
  date: string;
  status: string;
  amount: number;
  link: string;
};

export type StripeGetInvoicesResponse = StripeInvoice[];
