<template>
  <div class="grid grid-flow-col gap-10">
    <SettingsAddressForm />
    <SettingsLogo />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-grid',
  middleware: ['auth'],
})
</script>
