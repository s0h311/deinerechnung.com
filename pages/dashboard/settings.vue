<template>
  <div class="flex gap-10">
    <SettingsAddressForm />
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
  title: 'Einstellungen',
})
</script>
