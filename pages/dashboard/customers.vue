<template>
  <div class="flex gap-10">
    <CustomerForm />
    <CustomerList v-if="recipients.length > 0" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-grid',
  middleware: ['auth'],
})

const recipients = await useRecipients()
</script>
