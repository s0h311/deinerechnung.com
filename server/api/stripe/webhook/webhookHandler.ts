import Stripe from 'stripe'
import { createUser } from '../../data/user'
import type { H3Event } from 'h3'

type StripeWebhookHandlerQuery = {
  rawEvent: string
  h3Event: H3Event
  stripeSignatureHeader: string
}

type StripeWebhookHandlerResponse = {
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
      console.error('cannot create user, customerDetails is null')
      return
    }

    if (!customerDetails.address) {
      console.error('cannot create user, address is null')
      return
    }

    if (!customerDetails.name) {
      console.error('cannot create user, name is null')
      return
    }

    if (!customerDetails.email) {
      console.error('cannot create user, email is null')
      return
    }

    await createUser(h3Event, customerDetails.address, customerDetails.name, customerDetails.email)
  }

  private getVerifiedEvent(rawEvent: string, stripeSignatureHeader: string): Stripe.Event {
    const whsec = this.getStripeWebhookSecret()

    try {
      return this.stripe.webhooks.constructEvent(rawEvent, stripeSignatureHeader, whsec)
    } catch (err) {
      throw new Error('stripe event could not be verified')
    }
  }

  private getStripeSecret(): string {
    if (process.env.STRIPE_SECRET_KEY === undefined) {
      throw new Error('stripe secret key is missing')
    }

    return process.env.STRIPE_SECRET_KEY
  }

  private getStripeWebhookSecret(): string {
    if (process.env.STRIPE_WHSEC === undefined) {
      throw new Error('stripe secret key is missing')
    }

    return process.env.STRIPE_WHSEC
  }
}
