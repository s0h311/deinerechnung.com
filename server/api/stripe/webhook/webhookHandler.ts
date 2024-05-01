import Stripe from 'stripe'
import UserService from '../../data/userService'
import type { H3Event } from 'h3'
import logger from '~/utils/logger'

type StripeWebhookHandlerQuery = {
  rawEvent: string
  h3Event: H3Event
  stripeSignatureHeader: string
}

export type StripeWebhookHandlerResponse = {
  received: boolean
}

export default class StripeWebhookHandler {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(this.getStripeSecret())
  }

  public async execute({
    rawEvent,
    h3Event,
    stripeSignatureHeader,
  }: StripeWebhookHandlerQuery): Promise<StripeWebhookHandlerResponse> {
    const event = this.getVerifiedEvent(rawEvent, stripeSignatureHeader)

    if (event.type === 'checkout.session.completed') {
      await this.sendCreateUser(h3Event, event.data.object.customer_details)
    }

    return { received: true }
  }

  private async sendCreateUser(
    h3Event: H3Event,
    customerDetails: Stripe.Checkout.Session.CustomerDetails | null
  ): Promise<void> {
    if (!customerDetails) {
      logger.error('Unable to create user, customerDetails is null', 'WebhookHandler')
      return
    }

    if (!customerDetails.address) {
      logger.error('Unable to create user, address is null', 'WebhookHandler')
      return
    }

    if (!customerDetails.name) {
      logger.error('Unable to create user, name is null', 'WebhookHandler')
      return
    }

    if (!customerDetails.email) {
      logger.error('Unable to create user, email is null', 'WebhookHandler')
      return
    }

    const userService = new UserService(h3Event)

    await userService.create({
      name: customerDetails.name,
      email: customerDetails.email,
      address: {
        addressLine: customerDetails.address.line1!,
        zipCode: customerDetails.address.postal_code!,
        city: customerDetails.address.city!,
        country: customerDetails.address.country!,
      },
    })
  }

  private getVerifiedEvent(rawEvent: string, stripeSignatureHeader: string): Stripe.Event {
    const whsec = this.getStripeWebhookSecret()

    try {
      return this.stripe.webhooks.constructEvent(rawEvent, stripeSignatureHeader, whsec)
    } catch (err) {
      logger.error('Stripe event could not be verified', 'StripeWebhookHandler - getVerifiedEvent')

      throw createError({
        statusCode: 500,
        statusMessage: 'Unable to verify request',
      })
    }
  }

  private getStripeSecret(): string {
    if (process.env.STRIPE_SECRET_KEY === undefined) {
      logger.error('Stripe secret key is missing', 'StripeWebhookHandler - getStripeSecret')

      throw createError({
        statusCode: 500,
        statusMessage: 'Unable to handle webhook',
      })
    }

    return process.env.STRIPE_SECRET_KEY
  }

  private getStripeWebhookSecret(): string {
    if (process.env.STRIPE_WHSEC === undefined) {
      logger.error('Stripe webhook secret key is missing', 'StripeWebhookHandler - getStripeWebhookSecret')

      throw createError({
        statusCode: 500,
        statusMessage: 'Unable to handle webhook',
      })
    }

    return process.env.STRIPE_WHSEC
  }
}
