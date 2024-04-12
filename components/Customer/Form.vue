<template>
  <form
    class="grid gap-7"
    @submit.prevent="handleSubmit"
  >
    <h2>Neuer Kunde</h2>

    <input
      class="input input-bordered"
      type="text"
      v-model="recipient.name"
      placeholder="Name"
    />

    <input
      class="input input-bordered"
      type="email"
      v-model="recipient.emailAddress"
      placeholder="hi@reffect.org"
    />

    <input
      class="input input-bordered"
      type="text"
      v-model="recipient.addressLine"
      placeholder="Straße und Hausnummer"
    />

    <input
      class="input input-bordered"
      type="number"
      v-model="recipient.zipCode"
      placeholder="PZL"
    />

    <input
      class="input input-bordered"
      type="text"
      v-model="recipient.city"
      placeholder="Ort"
    />

    <input
      class="input input-bordered"
      type="text"
      v-model="recipient.country"
      placeholder="Land"
    />

    <button
      class="btn btn-wide btn-primary"
      type="submit"
    >
      <span
        v-if="isLoading"
        class="loading loading-spinner"
      />

      <p v-else>{{ editingRecipient ? 'Aktualisieren' : 'Hinzufügen' }}</p>
    </button>
  </form>
</template>

<script setup lang="ts">
import { objectToCamel } from 'ts-case-convert'
import type { Recipient } from '~/server/types'
import type { Database } from '~/supabase/database.types'

const recipients = await useRecipients()
const editingRecipient = useEditingRecipient()
const sender = await useSender()
const supabase = useSupabaseClient<Database>()

const isLoading = ref<boolean>(false)

const recipient = reactive<Omit<Recipient, 'id' | 'senderId'>>({
  name: '',
  addressLine: '',
  zipCode: 0,
  city: '',
  country: '',
  emailAddress: null,
})

watch(editingRecipient, (newRecipient, _) => {
  if (newRecipient) {
    recipient.name = newRecipient.name
    recipient.addressLine = newRecipient.addressLine
    recipient.zipCode = newRecipient.zipCode
    recipient.city = newRecipient.city
    recipient.country = newRecipient.country
  }
})

async function handleSubmit(): Promise<void> {
  // TODO test this?

  isLoading.value = true

  if (
    !sender.value ||
    !recipient.addressLine ||
    !recipient.zipCode ||
    !recipient.city ||
    !recipient.country ||
    !recipient.name
  ) {
    // TODO display error message
    return
  }

  if (editingRecipient.value) {
    updateRecipient()
  } else {
    addRecipient()
  }

  resetForm()
  isLoading.value = false
  // TODO display toast notification
}

async function updateRecipient(): Promise<void> {
  if (!editingRecipient.value) {
    return
  }

  const { data: updateRecipientData, error: updateRecipientError } = await supabase
    .from('recipient')
    .update({
      name: recipient.name,
      address_line: recipient.addressLine,
      zip_code: recipient.zipCode,
      city: recipient.city,
      country: recipient.country,
    })
    .eq('id', editingRecipient.value.id)
    .select()
    .single()

  if (updateRecipientError) {
    console.error(updateRecipientError)
    return
  }

  const recipientIndex = recipients.value.findIndex(
    (currentRecipient) => currentRecipient.id === editingRecipient.value?.id
  )

  recipients.value = recipients.value.toSpliced(recipientIndex, 1, objectToCamel(updateRecipientData))

  editingRecipient.value = null
}

async function addRecipient(): Promise<void> {
  if (!sender.value) {
    return
  }

  const { data: insertRecipientData, error: insertRecipientError } = await supabase
    .from('recipient')
    .insert({
      name: recipient.name,
      address_line: recipient.addressLine,
      zip_code: recipient.zipCode,
      city: recipient.city,
      country: recipient.country,
      sender_id: sender.value.id,
    })
    .select()
    .single()

  if (insertRecipientError) {
    console.error(insertRecipientError)
    return
  }

  recipients.value.push(objectToCamel(insertRecipientData))
}

function resetForm(): void {
  recipient.addressLine = ''
  recipient.zipCode = 0
  recipient.city = ''
  recipient.country = ''
  recipient.name = ''
}
</script>
