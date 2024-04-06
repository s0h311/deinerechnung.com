<template>
  <ul class="py-4 px-5 border rounded-lg space-y-4">
    <li
      v-for="(recipient, index) in recipients"
      :key="recipient.id"
      class="grid items-center gap-10 justify-items-end"
    >
      <p class="justify-self-start">{{ recipient.name }}</p>

      <p class="text-sm">{{ recipient.addressLine }}, {{ recipient.city }}</p>

      <div class="flex items-center gap-2">
        <button
          class="btn btn-sm btn-outline btn-secondary w-fit"
          @click="handleEdit(recipient)"
        >
          bearbeiten
        </button>

        <button
          class="btn btn-sm btn-outline btn-error w-fit"
          @click="handleDelete(recipient.id, index)"
        >
          <IconDelete />
        </button>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Recipient } from '@prisma/client'
import type { Database } from '~/server/data/models/database.types'

const recipients = await useRecipients()
const supabase = useSupabaseClient<Database>()

const editingRecipient = useEditingRecipient()

function handleEdit(recipient: Recipient) {
  editingRecipient.value = recipient
}

async function handleDelete(recipientId: Recipient['id'], recipientIndex: number) {
  const { error } = await supabase.from('recipient').delete().eq('id', recipientId)

  if (error) {
    console.error(error)
  }

  recipients.value = recipients.value.toSpliced(recipientIndex, 1)
}
</script>

<style scoped>
li {
  grid-template-columns: 2fr 3fr 1.5fr;
}
</style>
