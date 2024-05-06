import Stripe from 'stripe'
import UserService from '../../dataLayer/services/userService'
import logger from '~/utils/logger'
import SubscriptionService from '../../dataLayer/services/subscriptionService'
import type { Sender } from '~/server/types'
import type { Storage } from 'unstorage'

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
  private cache: Storage

  constructor() {
    this.stripe = new Stripe(this.getStripeSecret())
    this.userService = new UserService()
    this.subscriptionService = new SubscriptionService()
    this.cache = useStorage('cache')
  }

  public async execute({
    rawEvent,
    stripeSignatureHeader,
  }: StripeWebhookHandlerQuery): Promise<StripeWebhookHandlerResponse> {
    const event = this.getVerifiedEvent(rawEvent, stripeSignatureHeader)

    if (event.type === 'checkout.session.completed') {
      const sender = await this.createUser(event.data.object.customer_details)

      const subscriptionType = event.data.object.mode === 'subscription' ? 'monthly' : 'lifetime'

      await this.subscriptionService.create(sender.id, subscriptionType)

      const email = event.data.object.customer_details?.email

      if (!email) {
        throw logger.error('Unable to update last payment, email is null', 'WebhookHandler', true, { email })
      }

      const hasEmail = await this.cache.hasItem(email)
      if (hasEmail) {
        await this.subscriptionService.updateLastPayment(sender.id, new Date())
        await this.cache.removeItem(email)
      }
    } else if (event.type === 'charge.succeeded') {
      const email = event.data.object.billing_details.email

      if (!email) {
        throw logger.error('Unable to update last payment, email is null', 'WebhookHandler', true, { email })
      }

      await this.cache.setItem(email, 'charge.succeeded')
    }

    return { received: true }
  }

  private async createUser(customerDetails: Stripe.Checkout.Session.CustomerDetails | null): Promise<Sender> {
    if (!customerDetails) {
      throw logger.error('Unable to create user, customerDetails is null', 'WebhookHandler', true)
    }

    if (!customerDetails.address) {
      throw logger.error('Unable to create user, address is null', 'WebhookHandler', true)
    }

    if (!customerDetails.name) {
      throw logger.error('Unable to create user, name is null', 'WebhookHandler', true)
    }

    if (!customerDetails.email) {
      throw logger.error('Unable to create user, email is null', 'WebhookHandler', true)
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
      throw logger.error('Stripe event could not be verified', 'StripeWebhookHandler - getVerifiedEvent', true, {
        error: err,
      })
    }
  }

  private getStripeSecret(): string {
    if (process.env.STRIPE_SECRET_KEY === undefined) {
      throw logger.error('Stripe secret key is missing', 'StripeWebhookHandler - getStripeSecret', true)
    }

    return process.env.STRIPE_SECRET_KEY
  }

  private getStripeWebhookSecret(): string {
    if (process.env.STRIPE_WHSEC === undefined) {
      throw logger.error('Stripe webhook secret key is missing', 'StripeWebhookHandler - getStripeWebhookSecret', true)
    }

    return process.env.STRIPE_WHSEC
  }
}
