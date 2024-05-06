import Stripe from 'stripe'
import logger from '~/utils/logger'
import { buildUrl } from '~/utils/url'

type StripeCheckoutQuery = {
  paymentPeriod: 'monthly' | 'yearly' | 'lifetime'
  requestHost: string
  requestProtocol: 'http' | 'https'
}

export default class StripeCheckoutHandler {
  private stripe: Stripe

  private priceIds: Record<string, string> = {
    monthly: 'price_1P8d4dBzByKpK8243H8OtprY',
    yearly: 'price_1PCcAZBzByKpK824npFeIyNK',
  }

  private modes: Record<string, Stripe.Checkout.Session.Mode> = {
    monthly: 'subscription',
    yearly: 'subscription',
    lifetime: 'payment',
  }

  constructor() {
    this.stripe = new Stripe(this.getStripeSecret())
  }

  public async execute(query: StripeCheckoutQuery): Promise<string> {
    const priceId = this.priceIds[query.paymentPeriod]
    const mode = this.modes[query.paymentPeriod]

    const successUrl = buildUrl(query.requestProtocol, query.requestHost, 'checkout/success')
    const cancelUrl = buildUrl(query.requestProtocol, query.requestHost)

    try {
      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode,
        success_url: successUrl,
        cancel_url: cancelUrl,
        billing_address_collection: 'required',
      })

      if (!session.url) {
        throw logger.error('Unable to find stripe session url', 'CheckoutHandler', true)
      }

      return session.url
    } catch (e) {
      logger.error(JSON.stringify(e), 'CheckoutHandler')
      return '/checkout/error'
    }
  }

  private getStripeSecret(): string {
    if (process.env.STRIPE_SECRET_KEY === undefined) {
      throw logger.error('Stripe secret key is missing', 'CheckoutHandler - getStripeSecret', true)
    }

    return process.env.STRIPE_SECRET_KEY
  }
}
