<template>
  <section class="space-y-7">
    <h2>Kunden</h2>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Adresse</th>
          <th>Aktionen</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(recipient, index) in recipients"
          :key="recipient.id"
        >
          <td>{{ recipient.name }}</td>
          <td>{{ recipient.addressLine }}, {{ recipient.city }}</td>
          <td class="flex items-center gap-2">
            <UICta
              small
              outline
              secondary
              @handle-click="handleEdit(recipient)"
            >
              bearbeiten
            </UICta>

            <UICta
              small
              outline
              error
              @handle-click="handleDelete(recipient.id, index)"
            >
              <IconDelete />
            </UICta>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import type { Recipient } from '~/server/types'
import type { Database } from '~/supabase/database.types'
import logger from '~/utils/logger'

const recipients = await useRecipients()
const supabase = useSupabaseClient<Database>()

const editingRecipient = useEditingRecipient()

function handleEdit(recipient: Recipient) {
  editingRecipient.value = recipient
}

async function handleDelete(recipientId: Recipient['id'], recipientIndex: number) {
  const { error } = await supabase.from('recipient').delete().eq('id', recipientId)

  if (error) {
    logger.error(error.message, 'CustomerList - handleDelete')
  }

  recipients.value = recipients.value.toSpliced(recipientIndex, 1)
}
</script>

<style scoped>
li {
  grid-template-columns: 2fr 3fr 1.5fr;
}
</style>
