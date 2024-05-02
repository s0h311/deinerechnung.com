<template>
  <UIPricing
    id="pricing"
    title="Preise"
    :pricing-options="pricingOptions"
    cta-title="Jetzt holen"
    :handle-fn="handleGoToCheckout"
  />
</template>

<script setup lang="ts">
import type { PricingOption } from '../UI/Pricing.vue'

const pricingOptions: PricingOption[] = [
  {
    title: 'Monatlich',
    oldPrice: 9.99,
    newPrice: 7.99,
    paymentPeriod: 'monthly',
    paymentPeriodText: 'monatlich',
    benefits: ['Automatische Verbesserungen', '24/7 Kundenservice', 'Flexibel monatlich zahlen'],
    isPremium: false,
  },

  {
    title: 'Einmalig, für immer',
    oldPrice: 69.99,
    newPrice: 39.99,
    paymentPeriod: 'lifetime',
    paymentPeriodText: 'einmalig',
    benefits: ['Automatische Verbesserungen', '24/7 Kundenservice', 'Einmal zahlen, für immer benutzen'],
    isPremium: true,
  },
]

async function handleGoToCheckout(pricingOptionIndex: number): Promise<void> {
  const stripeCheckoutUrl = await $fetch('/api/stripe/checkout', {
    method: 'post',
    body: {
      paymentPeriod: pricingOptions[pricingOptionIndex].paymentPeriod,
    },
  })

  await navigateTo(stripeCheckoutUrl, { external: true })
}
</script>
