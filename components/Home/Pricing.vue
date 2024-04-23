<template>
  <div
    id="pricing"
    class="space-y-10"
  >
    <h2 class="text-3xl text-center">Preise</h2>

    <div class="grid grid-cols-2 gap-20">
      <div
        v-for="(option, index) in pricingOptions"
        :key="'option' + index"
        class="border-2 p-8 rounded-xl space-y-10 shadow-md"
        :class="option.isPremium ? 'border-primary' : 'border-neutral'"
      >
        <p
          class="line-through text-sm -mb-8"
          :class="option.oldPrice ? '' : 'invisible'"
        >
          {{ option.oldPrice }}€
        </p>
        <div class="flex items-center gap-2">
          <p class="text-3xl font-semibold">{{ option.newPrice }}€</p>
          <p class="text-sm">/ {{ option.paymentPeriodText }}</p>
        </div>

        <ul>
          <li
            v-for="(benefit, index) in option.benefits"
            :key="'benefit' + index"
            class="flex items-center gap-2 text-sm"
          >
            <IconCheck /> {{ benefit }}
          </li>
        </ul>

        <NuxtLink
          class="btn w-full"
          :class="option.isPremium ? 'btn-primary' : 'btn-neutral'"
          @click="handleGoToCheckout(index)"
        >
          <span
            v-if="isLoading === index"
            class="loading loading-spinner"
          />

          <p v-else>Jetzt holen</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isLoading = ref<number | null>(null)

const pricingOptions = [
  {
    title: 'Monatlich',
    oldPrice: 9.99,
    newPrice: 7.99,
    paymentPeriod: 'monthly',
    paymentPeriodText: 'monatlich',
    benefits: ['Automatische Verbesserungen', '24/7 Kundenservice', 'Flexible monatlich zahlen'],
    isPremium: false,
  },

  {
    title: 'Einmalig, für immer',
    oldPrice: 69.99,
    newPrice: 39.99,
    paymentPeriod: 'oneTime',
    paymentPeriodText: 'einmalig',
    benefits: ['Automatische Verbesserungen', '24/7 Kundenservice', 'Einmal zahlen, für immer benutzen'],
    isPremium: true,
  },
]

async function handleGoToCheckout(pricingOptionIndex: number): Promise<void> {
  isLoading.value = pricingOptionIndex

  const stripeCheckoutUrl = await $fetch('/api/stripe/checkout', {
    method: 'post',
    body: {
      paymentPeriod: pricingOptions[pricingOptionIndex].paymentPeriod,
    },
  })

  isLoading.value = null

  await navigateTo(stripeCheckoutUrl, { external: true })
}
</script>
