<template>
  <div class="grid gap-7">
    <AccountSettingsEmailForm />
    <AccountSettingsPasswordForm />
    <AccountSettingsDeleteAccountForm />
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
