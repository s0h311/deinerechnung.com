import StripeCheckoutHandler from './checkoutHandler'

export default defineEventHandler(async (event): Promise<string> => {
  const requestHost = getRequestHost(event)
  const requestProtocol = getRequestProtocol(event)
  const { paymentPeriod } = await readBody(event)

  const stripeCheckoutHandler = new StripeCheckoutHandler()
  return await stripeCheckoutHandler.execute({ paymentPeriod, requestHost, requestProtocol })
})
