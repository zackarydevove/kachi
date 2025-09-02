import { Request, Response } from 'express';
import stripeConfig from '@config/stripe.config';
import Send from '@utils/response.util';
import StripeService from 'services/stripe.service';

const stripe = require('stripe')(stripeConfig.secret);

export default class StripeController {
  static webhookListener = async (req: Request, res: Response) => {
    const webhookSecret = stripeConfig.webhookSecret;

    // Verify stripe event is legit (coming from stripe)
    if (webhookSecret) {
      // Get the signature sent by Stripe
      const signature = req.headers['stripe-signature'];

      let event;
      try {
        event = stripe.webhooks.constructEvent(
          (req as any).rawBody,
          signature,
          webhookSecret,
        );
      } catch (error) {
        console.error(`⚠️  Webhook signature verification failed.`, error);
        return Send.error(res, {}, 'Webhook error');
      }

      try {
        switch (event.type) {
          // User has purchased a subscription -- Grant access to pro
          case 'checkout.session.completed':
            StripeService.handleCheckoutSessionCompleted(event, stripe);
            break;
          // User has cancelled their subscription -- Revoke access to pro
          case 'customer.subscription.deleted':
            StripeService.handleCustomerSubscriptionDeleted(event, stripe);
            break;
          default:
            console.log(`Unhandled event type ${event.type}`);
        }
      } catch (error) {
        console.error(error);
        return Send.error(res, {}, 'Webhook error');
      }
    }

    return Send.success(res, {}, 'Webhook received');
  };

  static getCustomerInvoices = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    try {
      const invoices = await StripeService.getCustomerInvoices(userId, stripe);
      return Send.success(res, invoices);
    } catch (error) {
      console.error('Error getting customer invoices: ', error);
      return Send.error(res, {}, 'Internal server error');
    }
  };
}
