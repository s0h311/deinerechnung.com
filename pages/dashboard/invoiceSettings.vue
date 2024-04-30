<template>
  <div class="flex gap-10">
    <InvoiceSettingsAddressForm />
    <InvoiceSettingsPaymentForm />
    <InvoiceSettingsLogo />
    <InvoiceSettingsFootnotesForm />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-grid',
  middleware: ['auth'],
})

useSeoMeta({
  title: 'Rechnungeinstellungen',
})
</script>
