<template>
  <section class="flex gap-10 w-fit">
    <div>
      <AccountSettingsEmailForm />
      <AccountSettingsPasswordForm />
    </div>

    <div>
      <AccountSettingsSubscriptionOverview />
      <AccountSettingsDeleteAccountForm />
    </div>
  </section>
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

<style scoped>
section div div {
  @apply bg-base-200 px-4 py-3 rounded-lg space-y-7 first:mb-10;
}
</style>
