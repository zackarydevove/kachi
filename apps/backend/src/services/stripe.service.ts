import { prisma } from 'db';

export default class StripeService {
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
      data: {
        priceId,
        customerId,
        isPro: true,
      },
    });

    // TODO: send email to dashboard
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

    // TODO: send email to form why he revoke the subscription
    // EmailService.sendProRevokeEmail(updatedUser.email);

    return updatedUser;
  }
}
