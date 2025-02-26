import { z } from 'zod'
import type { StripeWebhookHandlerResponse } from '../../../businessLayer/stripe/webhookHandler'
import StripeWebhookHandler from '../../../businessLayer/stripe/webhookHandler'

export default defineEventHandler(async (event): Promise<StripeWebhookHandlerResponse> => {
  const rawEvent = parseRawBody(await readRawBody(event))
  const stripeSignatureHeader = parseStripeSignatureHeader(getRequestHeader(event, 'stripe-signature'))

  const stripeWebhookHandler = new StripeWebhookHandler()
  return await stripeWebhookHandler.execute({ rawEvent, stripeSignatureHeader })
})

function parseStripeSignatureHeader(stripeSignatureHeader: unknown): string {
  return z.string().min(1).parse(stripeSignatureHeader)
}

function parseRawBody(rawBody: unknown): string {
  return z.string().min(1).parse(rawBody)
}
