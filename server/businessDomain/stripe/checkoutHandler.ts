import Stripe from 'stripe'
import logger from '~/utils/logger'

type StripeCheckoutQuery = {
  paymentPeriod: 'monthly' | 'oneTime'
  requestHost: string
  requestProtocol: 'http' | 'https'
}

export default class StripeCheckoutHandler {
  private PRICE_ID_MONTHLY = 'price_1P8d4dBzByKpK8243H8OtprY'
  private PRICE_ID_ONE_TIME = 'price_1P8PhnBzByKpK824TzMU45Qq'

  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(this.getStripeSecret())
  }

  public async execute(query: StripeCheckoutQuery): Promise<string> {
    const priceId = query.paymentPeriod === 'monthly' ? this.PRICE_ID_MONTHLY : this.PRICE_ID_ONE_TIME
    const mode = query.paymentPeriod === 'monthly' ? 'subscription' : 'payment'

    const successUrl = `${query.requestProtocol}://${query.requestHost}/checkout/success`
    const cancelUrl = `${query.requestProtocol}://${query.requestHost}/`

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
        logger.error('Unable to find stripe session url', 'CheckoutHandler')

        throw createError({
          statusCode: 500,
          statusMessage: 'Unable to complete checkout',
        })
      }

      return session.url
    } catch (e) {
      logger.error(JSON.stringify(e), 'CheckoutHandler')
      return '/checkout/error'
    }
  }

  private getStripeSecret(): string {
    if (process.env.STRIPE_SECRET_KEY === undefined) {
      logger.error('Stripe secret key is missing', 'CheckoutHandler - getStripeSecret')

      throw createError({
        statusCode: 500,
        statusMessage: 'Unable to complete checkout',
      })
    }

    return process.env.STRIPE_SECRET_KEY
  }
}
