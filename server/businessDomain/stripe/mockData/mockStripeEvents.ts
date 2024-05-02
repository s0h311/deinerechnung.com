import Stripe from 'stripe'

export const mockChargeSucceededEvent = {
  id: 'evt_3PByiHBzByKpK8241OncjruC',
  object: 'event',
  api_version: '2024-04-10',
  created: 1714652774,
  data: {
    object: {
      id: 'ch_3PByiHBzByKpK8241qoRaN60',
      object: 'charge',
      amount: 799,
      amount_captured: 799,
      amount_refunded: 0,
      application: null,
      application_fee: null,
      application_fee_amount: null,
      balance_transaction: 'txn_3PByiHBzByKpK82417vNrGAg',
      billing_details: {
        address: {
          city: 'Hamburg',
          country: 'DE',
          line1: 'Kühlungsborner Straße 26',
          line2: null,
          postal_code: '22147',
          state: null,
        },
        email: 'testing@deinerechnung.com',
        name: 'Testing Testington',
        phone: null,
      },
      calculated_statement_descriptor: 'DEINERECHNUNG.COM',
      captured: true,
      created: 1714652774,
      currency: 'eur',
      customer: 'cus_Q22nRgmiqwzCaY',
      description: 'Subscription creation',
      destination: null,
      dispute: null,
      disputed: false,
      failure_balance_transaction: null,
      failure_code: null,
      failure_message: null,
      fraud_details: {},
      invoice: 'in_1PByiGBzByKpK8246v3yaKy4',
      livemode: false,
      metadata: {},
      on_behalf_of: null,
      order: null,
      outcome: {
        network_status: 'approved_by_network',
        reason: null,
        risk_level: 'normal',
        risk_score: 38,
        seller_message: 'Payment complete.',
        type: 'authorized',
      },
      paid: true,
      payment_intent: 'pi_3PByiHBzByKpK8241PYAhQIk',
      payment_method: 'pm_1PByiFBzByKpK824quK7Yz7D',
      payment_method_details: {
        card: {
          amount_authorized: 799,
          brand: 'visa',
          checks: {
            address_line1_check: 'pass',
            address_postal_code_check: 'pass',
            cvc_check: 'pass',
          },
          country: 'US',
          exp_month: 1,
          exp_year: 2028,
          extended_authorization: {
            status: 'disabled',
          },
          fingerprint: 'Jm6ng35T01QJkWFN',
          funding: 'credit',
          incremental_authorization: {
            status: 'unavailable',
          },
          installments: null,
          last4: '4242',
          mandate: null,
          multicapture: {
            status: 'unavailable',
          },
          network: 'visa',
          network_token: {
            used: false,
          },
          overcapture: {
            maximum_amount_capturable: 799,
            status: 'unavailable',
          },
          three_d_secure: null,
          wallet: null,
        },
        type: 'card',
      },
      radar_options: {},
      receipt_email: null,
      receipt_number: null,
      receipt_url:
        'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xUDgzaVpCekJ5S3BLODI0KOeMzrEGMgYzNbYusyM6LBbn9bS2rUaFCtoSq7mKWO3k9oYLErXkoVDCTxvbjvXkzvnqwYK6jm6KfazP?s=ap',
      refunded: false,
      review: null,
      shipping: null,
      source: null,
      source_transfer: null,
      statement_descriptor: null,
      statement_descriptor_suffix: null,
      status: 'succeeded',
      transfer_data: null,
      transfer_group: null,
    },
  },
  livemode: false,
  pending_webhooks: 2,
  request: {
    id: 'req_lFYXQPh0iOfFzJ',
    idempotency_key: '56483984-3075-41b0-a005-341f9432de01',
  },
  type: 'charge.succeeded',
}

export const mockCheckoutSessionCompletedEvent = {
  id: 'evt_1PByiLBzByKpK824xpkIXpEj',
  object: 'event',
  api_version: '2024-04-10',
  created: 1714652777,
  data: {
    object: {
      id: 'cs_test_a1GNiyGFoWcmhdLdRHYwnzLSyO3076wi280WB6UBIjLjc3HTS0jfX8WrWT',
      object: 'checkout.session',
      after_expiration: null,
      allow_promotion_codes: null,
      amount_subtotal: 799,
      amount_total: 799,
      automatic_tax: {
        enabled: false,
        liability: null,
        status: null,
      },
      billing_address_collection: 'required',
      cancel_url: 'http://localhost:3000/',
      client_reference_id: null,
      client_secret: null,
      consent: null,
      consent_collection: null,
      created: 1714652706,
      currency: 'eur',
      currency_conversion: null,
      custom_fields: [],
      custom_text: {
        after_submit: null,
        shipping_address: null,
        submit: null,
        terms_of_service_acceptance: null,
      },
      customer: 'cus_Q22nRgmiqwzCaY',
      customer_creation: 'always',
      customer_details: {
        address: {
          city: 'Hamburg',
          country: 'DE',
          line1: 'Kühlungsborner Straße 26',
          line2: null,
          postal_code: '22147',
          state: null,
        },
        email: 'testing@deinerechnung.com',
        name: 'Testing Testington',
        phone: null,
        tax_exempt: 'none',
        tax_ids: [],
      },
      customer_email: null,
      expires_at: 1714739105,
      invoice: 'in_1PByiGBzByKpK8246v3yaKy4',
      invoice_creation: null,
      livemode: false,
      locale: null,
      metadata: {},
      mode: 'subscription',
      payment_intent: null,
      payment_link: null,
      payment_method_collection: 'always',
      payment_method_configuration_details: {
        id: 'pmc_1P8PqgBzByKpK8243io4SBau',
        parent: null,
      },
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
      payment_method_types: ['card', 'sepa_debit', 'paypal'],
      payment_status: 'paid',
      phone_number_collection: {
        enabled: false,
      },
      recovered_from: null,
      saved_payment_method_options: {
        allow_redisplay_filters: ['always'],
        payment_method_save: null,
      },
      setup_intent: null,
      shipping_address_collection: null,
      shipping_cost: null,
      shipping_details: null,
      shipping_options: [],
      status: 'complete',
      submit_type: null,
      subscription: 'sub_1PByiGBzByKpK8247BDeRLum',
      success_url: 'http://localhost:3000/checkout/success',
      total_details: {
        amount_discount: 0,
        amount_shipping: 0,
        amount_tax: 0,
      },
      ui_mode: 'hosted',
      url: null,
    },
  },
  livemode: false,
  pending_webhooks: 3,
  request: {
    id: null,
    idempotency_key: null,
  },
  type: 'checkout.session.completed',
}

export const mockPaymentIntentEvent = {
  id: 'evt_3PByiHBzByKpK8241wGjW2DT',
  object: 'event',
  api_version: '2024-04-10',
  created: 1714652773,
  data: {
    object: {
      id: 'pi_3PByiHBzByKpK8241PYAhQIk',
      object: 'payment_intent',
      amount: 799,
      amount_capturable: 0,
      amount_details: {
        tip: {},
      },
      amount_received: 0,
      application: null,
      application_fee_amount: null,
      automatic_payment_methods: null,
      canceled_at: null,
      cancellation_reason: null,
      capture_method: 'automatic',
      client_secret: 'pi_3PByiHBzByKpK8241PYAhQIk_secret_dQ4PmR87VMCwf2FVlyrEYbDzp',
      confirmation_method: 'automatic',
      created: 1714652773,
      currency: 'eur',
      customer: 'cus_Q22nRgmiqwzCaY',
      description: 'Subscription creation',
      invoice: 'in_1PByiGBzByKpK8246v3yaKy4',
      last_payment_error: null,
      latest_charge: null,
      livemode: false,
      metadata: {},
      next_action: null,
      on_behalf_of: null,
      payment_method: null,
      payment_method_configuration_details: null,
      payment_method_options: {
        card: {
          installments: null,
          mandate_options: null,
          network: null,
          request_three_d_secure: 'automatic',
        },
        link: {
          persistent_token: null,
        },
        paypal: {
          preferred_locale: null,
          reference: null,
        },
        sepa_debit: {},
      },
      payment_method_types: ['card', 'link', 'paypal', 'sepa_debit'],
      processing: null,
      receipt_email: null,
      review: null,
      setup_future_usage: 'off_session',
      shipping: null,
      source: null,
      statement_descriptor: null,
      statement_descriptor_suffix: null,
      status: 'requires_payment_method',
      transfer_data: null,
      transfer_group: null,
    },
  },
  livemode: false,
  pending_webhooks: 2,
  request: {
    id: 'req_lFYXQPh0iOfFzJ',
    idempotency_key: '56483984-3075-41b0-a005-341f9432de01',
  },
  type: 'payment_intent.created',
}

export const mockCustomerDetails = {
  address: {
    city: 'Hamburg',
    country: 'DE',
    addressLine: 'Kühlungsborner Straße 26',
    zipCode: '22147',
  },
  email: 'testing@deinerechnung.com',
  name: 'Testing Testington',
}

export const mockSender = {
  addressLine: 'Kühlungsborner Straße 26',
  bic: null,
  city: 'Hamburg',
  country: 'DE',
  creditInstitution: null,
  footnotes: null,
  iban: null,
  id: 1,
  logoUrl: null,
  name: 'Testing Testington',
  runningInvoiceNumber: 1,
  userId: 1,
  zipCode: 22147,
}

export function getMockStripeSigntarueHeader(event: unknown): string {
  const mockEvent = JSON.stringify(event)

  return Stripe.webhooks.generateTestHeaderString({
    payload: mockEvent,
    secret: process.env.STRIPE_WHSEC!,
  })
}

const emails = [
  'hi@reffect.org',
  'refactor@reffect.org',
  'wontfix@reffect.org',
  'who@are.de',
  'bastian.schweinsteiger@dfb.de',
]

export function getCheckoutSessionCompletedEventWithDifferentEmail(event: unknown, emailIndex: number): unknown {
  const clone = structuredClone(event)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  clone.data.object.customer_details.email = emails[emailIndex]

  return clone
}

export function getChargeSucceededEventWithDifferentEmail(event: unknown, emailIndex: number): unknown {
  const clone = structuredClone(event)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  clone.data.object.billing_details.email = emails[emailIndex]

  return clone
}
