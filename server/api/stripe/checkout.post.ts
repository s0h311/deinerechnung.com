import { Stripe } from 'stripe'

export default defineEventHandler(async (event): Promise<string> => {
  if (process.env.STRIPE_SECRET_KEY === undefined) {
    throw new Error('stripe secret key is missing')
  }

  const { paymentPeriod } = await readBody(event)

  const priceId = paymentPeriod === 'monthly' ? 'price_1P8d4dBzByKpK8243H8OtprY' : 'price_1P8PhnBzByKpK824TzMU45Qq'
  const mode = paymentPeriod === 'monthly' ? 'subscription' : 'payment'

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode,
      success_url: 'http://localhost:3000/checkout/success',
      cancel_url: 'http://localhost:3000/',
      billing_address_collection: 'required',
    })

    if (!session.url) {
      throw new Error('cannot find stripe session url')
    }

    return session.url
  } catch (e) {
    console.error(e)
    return '/checkout/error'
  }
})
