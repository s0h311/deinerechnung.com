<template>
  <form
    class="grid gap-7"
    @submit.prevent="submit(handleSubmit)"
  >
    <h2>Neuer Kunde</h2>

    <input
      v-model="fields.name"
      class="input input-bordered"
      type="text"
      placeholder="Name"
    >

    <p
      v-if="errors.name"
      class="text-red-400 -mt-6"
    >
      {{ errors.name }}
    </p>

    <input
      v-model="fields.emailAddress"
      class="input input-bordered"
      type="email"
      placeholder="hi@reffect.org"
    >

    <p
      v-if="errors.emailAddress"
      class="text-red-400 -mt-6"
    >
      {{ errors.emailAddress }}
    </p>

    <input
      v-model="fields.addressLine"
      class="input input-bordered"
      type="text"
      placeholder="Straße und Hausnummer"
    >

    <p
      v-if="errors.addressLine"
      class="text-red-400 -mt-6"
    >
      {{ errors.addressLine }}
    </p>

    <input
      v-model="fields.zipCode"
      class="input input-bordered"
      type="text"
      placeholder="PZL"
    >

    <p
      v-if="errors.zipCode"
      class="text-red-400 -mt-6"
    >
      {{ errors.zipCode }}
    </p>

    <input
      v-model="fields.city"
      class="input input-bordered"
      type="text"
      placeholder="Ort"
    >

    <p
      v-if="errors.city"
      class="text-red-400 -mt-6"
    >
      {{ errors.city }}
    </p>

    <input
      v-model="fields.country"
      class="input input-bordered"
      type="text"
      placeholder="Land"
    >

    <p
      v-if="errors.country"
      class="text-red-400 -mt-6"
    >
      {{ errors.country }}
    </p>

    <UICta
      primary
      wide
      type="submit"
      :is-loading="isLoading"
    >
      {{ editingRecipient ? 'Aktualisieren' : 'Hinzufügen' }}
    </UICta>
  </form>
</template>

<script setup lang="ts">
import { objectToCamel } from 'ts-case-convert'
import { z } from 'zod'
import type { Recipient } from '~/server/types'
import type { Database } from '~/supabase/database.types'
import logger from '~/utils/logger'

const recipients = await useRecipients()
const editingRecipient = useEditingRecipient()
const sender = await useSender()
const supabase = useSupabaseClient<Database>()

const isLoading = ref<boolean>(false)

const { fields, errors, reset, set, submit } = useForm({
  initialValue: {
    name: '',
    addressLine: '',
    zipCode: '',
    city: '',
    country: '',
    emailAddress: null,
  },
  resolver: z.object({
    name: z.string().min(2),
    addressLine: z.string().min(2),
    zipCode: z.string().min(4).max(5),
    city: z.string().min(2),
    country: z.string().min(2),
    emailAddress: z.string().email().nullable(),
  }),
})

watch(editingRecipient, (newRecipient, _) => {
  if (newRecipient) {
    set(newRecipient)
  }
})

async function handleSubmit(recipient: Omit<Recipient, 'id' | 'senderId'>): Promise<void> {
  // TODO test this?

  isLoading.value = true

  if (editingRecipient.value) {
    updateRecipient(recipient)
  } else {
    addRecipient(recipient)
  }

  reset()
  isLoading.value = false
  // TODO display toast notification
}

async function updateRecipient(recipient: Omit<Recipient, 'id' | 'senderId'>): Promise<void> {
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
      email_address: recipient.emailAddress,
    })
    .eq('id', editingRecipient.value.id)
    .select()
    .single()

  if (updateRecipientError) {
    logger.error(updateRecipientError.message, 'CustomerForm - updateRecipient')
    return
  }

  const recipientIndex = recipients.value.findIndex(
    (currentRecipient) => currentRecipient.id === editingRecipient.value?.id
  )

  recipients.value = recipients.value.toSpliced(recipientIndex, 1, objectToCamel(updateRecipientData))

  editingRecipient.value = null
}

async function addRecipient(recipient: Omit<Recipient, 'id' | 'senderId'>): Promise<void> {
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
      email_address: recipient.emailAddress,
    })
    .select()
    .single()

  if (insertRecipientError) {
    logger.error(insertRecipientError.message, 'CustomerForm - addRecipient')
    return
  }

  recipients.value.push(objectToCamel(insertRecipientData))
}
</script>
