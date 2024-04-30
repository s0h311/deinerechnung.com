<template>
  <div class="space-y-7">
    <AccountSettingsEmailForm />
    <AccountSettingsPasswordForm />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-grid',
  middleware: ['auth'],
})

useSeoMeta({
  title: 'Kontoeinstellungen',
})
</script>
