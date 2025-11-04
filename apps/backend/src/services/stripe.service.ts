import RedisUtil from '@utils/redis.util';
import { prisma } from 'db';
import UserService from './user.service';

export default class StripeService {
  // Utility function to format Stripe timestamp to readable date
  private static formatStripeDate(timestamp: number): string {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Utility function to format Stripe amount (cents) to currency string
  private static formatStripeAmount(amountInCents: number): string {
    const amountInDollars = amountInCents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amountInDollars);
  }

  static async handleCheckoutSessionCompleted(event: any, stripe: any) {
    const session = await stripe.checkout.sessions.retrieve(
      event.data.object.id,
      {
        expand: ['line_items'],
      },
    );
    const customerId = session?.customer;
    const customer = await stripe.customers.retrieve(customerId);
    const priceId = session?.line_items?.data[0]?.price.id;

    let user = await prisma.user.findUnique({
      where: { email: customer.email },
    });
    if (!user) {
      throw new Error('No user found');
    }

    // Grant access to pro
    const updatedUser = await prisma.user.update({
      where: { id: user?.id },
      select: {
        id: true,
        email: true,
        twoFactorEnabled: true,
        password: true,
        isPro: true,
      },
      data: {
        priceId,
        customerId,
        isPro: true,
      },
    });

    // Update the user in the cache
    await UserService.setUserAndAccountsCache(user.id);

    // TODO: send successful email with link to dashboard
    // EmailService.sendProAccessEmail(updatedUser.email);

    return updatedUser;
  }

  static async handleCustomerSubscriptionDeleted(event: any, stripe: any) {
    const subscription = await stripe.subscriptions.retrieve(
      event.data.object.id,
    );

    const user = await prisma.user.findUnique({
      where: { customerId: subscription.customer },
    });
    if (!user) {
      throw new Error('No user found');
    }

    // Revoke access to pro
    const updatedUser = await prisma.user.update({
      where: { id: user?.id },
      data: {
        isPro: false,
        priceId: null,
      },
    });

    // Update the user in the cache
    await UserService.setUserAndAccountsCache(user.id);

    // TODO: send email to form why he revoke the subscription
    // EmailService.sendProRevokeEmail(updatedUser.email);

    return updatedUser;
  }

  static async getCustomerInvoices(userId: number, stripe: any) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        customerId: true,
      },
    });
    if (!user) {
      throw new Error('No user found');
    }
    if (!user.customerId) {
      throw new Error('No customerId found');
    }
    const invoices = await stripe.invoices.list({
      customer: user.customerId,
    });
    if (!invoices) {
      throw new Error('No invoices found');
    }

    const formattedInvoices = invoices.data.map((invoice: any) => ({
      id: invoice.id,
      date: this.formatStripeDate(invoice.created),
      status: invoice.status,
      amount: this.formatStripeAmount(invoice.total),
      link: invoice.hosted_invoice_url,
    }));

    return formattedInvoices;
  }
}
