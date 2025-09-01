const stripeConfig = {
  secret: process.env.STRIPE_SECRET_KEY as string,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string,
};

export default stripeConfig;
