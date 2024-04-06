<template>
  <ul class="py-4 px-5 border rounded-lg space-y-4">
    <li
      v-for="recipient in recipients"
      :key="recipient.id"
      class="grid items-center gap-10 justify-items-end"
    >
      <p class="justify-self-start">{{ recipient.name }}</p>

      <p class="text-sm">{{ recipient.addressLine }}, {{ recipient.city }}</p>

      <button
        class="btn btn-sm btn-outline btn-primary w-fit"
        @click="handleEdit(recipient)"
      >
        bearbeiten
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Recipient } from '@prisma/client'

const recipients = await useRecipients()

const editingRecipient = useEditingRecipient()

function handleEdit(recipient: Recipient) {
  editingRecipient.value = recipient
}
</script>

<style scoped>
li {
  grid-template-columns: 2fr 3fr 1fr;
}
</style>
