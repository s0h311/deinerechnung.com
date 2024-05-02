<template>
  <div class="space-y-10">
    <h2 class="text-3xl text-center">{{ title }}</h2>

    <div class="grid grid-cols-2 gap-20">
      <div
        v-for="(option, indexPricing) in pricingOptions"
        :key="'option' + indexPricing"
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
            v-for="(benefit, indexBenetifs) in option.benefits"
            :key="'benefit' + indexBenetifs"
            class="flex items-center gap-2 text-sm"
          >
            <IconCheck /> {{ benefit }}
          </li>
        </ul>

        <UICta
          class="w-full"
          :primary="option.isPremium"
          :is-loading="isLoading === indexPricing"
          @handle-click="handleSubmit(indexPricing)"
        >
          {{ ctaTitle }}
        </UICta>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export type PricingOption = {
  title: string
  oldPrice: number
  newPrice: number
  paymentPeriod: 'monthly' | 'yearly' | 'lifetime'
  paymentPeriodText: string
  benefits: string[]
  isPremium: boolean
}

type Props = {
  title: string
  pricingOptions: PricingOption[]
  ctaTitle: string
  handleFn: (pricingOptionIndex: number) => Promise<void>
}

const props = defineProps<Props>()

const isLoading = ref<number | null>(null)

async function handleSubmit(pricingOptionIndex: number): Promise<void> {
  isLoading.value = pricingOptionIndex

  props.handleFn(pricingOptionIndex).then(() => {
    isLoading.value = null
  })
}
</script>
