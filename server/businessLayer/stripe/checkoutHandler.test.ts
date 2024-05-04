import { expect, it, describe } from 'vitest'
import StripeCheckoutHandler from './checkoutHandler'

describe('StripeCheckoutHandler', () => {
  it('should initialize', () => {
    const stripeCheckoutHandler = new StripeCheckoutHandler()

    expect(stripeCheckoutHandler).toBeDefined()
  })
})
