import Stripe from 'stripe'
import UserService from '../../dataDomain/services/userService'
import type { H3Event } from 'h3'
import logger from '~/utils/logger'
import SubscriptionService from '../../dataDomain/services/subscriptionService'
import type { Sender } from '~/server/types'

type StripeWebhookHandlerQuery = {
  rawEvent: string
  stripeSignatureHeader: string
}

export type StripeWebhookHandlerResponse = {
  received: boolean
}

export default class StripeWebhookHandler {
  private stripe: Stripe
  private userService: UserService
  private subscriptionService: SubscriptionService

  constructor() {
    this.stripe = new Stripe(this.getStripeSecret())
    this.userService = new UserService()
    this.subscriptionService = new SubscriptionService()
  }

  public async execute({
    rawEvent,
    stripeSignatureHeader,
  }: StripeWebhookHandlerQuery): Promise<StripeWebhookHandlerResponse> {
    const event = this.getVerifiedEvent(rawEvent, stripeSignatureHeader)

    if (event.type === 'checkout.session.completed') {
      const sender = await this.sendCreateUser(event.data.object.customer_details)

      const subscriptionType = event.data.object.mode === 'subscription' ? 'monthly' : 'lifetime'

      await this.subscriptionService.create(sender.id, subscriptionType)
    }

    if (event.type === 'charge.succeeded') {
      const email = event.data.object.billing_details.email

      if (!email) {
        logger.error('Unable to update last payment, email is null', 'WebhookHandler')

        throw createError({
          statusCode: 500,
          statusMessage: 'Unable to update last payment, email is null',
          data: {
            email,
          },
        })
      }

      const senderId = await this.userService.getSenderFromEmail(email)
      await this.subscriptionService.updateLastPayment(senderId, new Date())
    }

    return { received: true }
  }

  private async sendCreateUser(customerDetails: Stripe.Checkout.Session.CustomerDetails | null): Promise<Sender> {
    if (!customerDetails) {
      logger.error('Unable to create user, customerDetails is null', 'WebhookHandler')

      throw createError({
        statusCode: 500,
        statusMessage: 'Unable to create user',
      })
    }

    if (!customerDetails.address) {
      logger.error('Unable to create user, address is null', 'WebhookHandler')

      throw createError({
        statusCode: 500,
        statusMessage: 'Unable to create user',
      })
    }

    if (!customerDetails.name) {
      logger.error('Unable to create user, name is null', 'WebhookHandler')

      throw createError({
        statusCode: 500,
        statusMessage: 'Unable to create user',
      })
    }

    if (!customerDetails.email) {
      logger.error('Unable to create user, email is null', 'WebhookHandler')

      throw createError({
        statusCode: 500,
        statusMessage: 'Unable to create user',
      })
    }

    const sender = await this.userService.create({
      name: customerDetails.name,
      email: customerDetails.email,
      address: {
        addressLine: customerDetails.address.line1!,
        zipCode: customerDetails.address.postal_code!,
        city: customerDetails.address.city!,
        country: customerDetails.address.country!,
      },
    })

    return sender
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
