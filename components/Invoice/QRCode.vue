<template>
  <NuxtImg
    :src="shouldUseQrCode ? qrCodeSrc : 'dummy-qr-code.png'"
    width="45"
    height="45"
  />
</template>

<script setup lang="ts">
const sender = (await useSender()).value!
const invoice = await useCurrentInvoice()
const shouldUseQrCode = useQrCode()

const total = computed(() => {
  if (invoice.value.positions.length === 0) {
    return 0
  }

  return invoice.value.positions.map((position) => position.quantity * position.price).reduce((a, b) => a + b)
})

const qrCodeData = computed(
  () =>
    `BCD%0A
002%0A
1%0A
SCT%0A
%0A
${sender.name}%0A
DE12200505501501417032%0A
EUR${total.value}%0A
%0A
%0A
${sender.runningInvoiceNumber}
`
)

const qrCodeSrc = computed(
  () => `https://api.qrserver.com/v1/create-qr-code/?size=150x150&charset-source=UTF-8&data=${qrCodeData.value}`
)
</script>
