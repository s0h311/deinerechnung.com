<template>
  <div class="flex gap-10">
    <SettingsAddressForm />
    <SettingsPaymentForm />
    <SettingsLogo />
    <SettingsFootnotesForm />
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
