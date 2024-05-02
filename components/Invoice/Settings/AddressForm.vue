<template>
  <form
    v-if="sender"
    class="grid gap-7 h-fit"
    @submit.prevent="submit(handleSubmit)"
  >
    <h2>Adresse</h2>

    <input
      v-model="fields.name"
      class="input input-bordered"
      type="text"
      placeholder="Name"
    />

    <p
      v-if="errors.name"
      class="text-red-400 -mt-6"
    >
      {{ errors.name }}
    </p>

    <input
      v-model="fields.addressLine"
      class="input input-bordered"
      type="text"
      placeholder="Straße und Hausnummer"
    />

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
    />

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
    />

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
    />

    <p
      v-if="errors.country"
      class="text-red-400 -mt-6"
    >
      {{ errors.country }}
    </p>

    <UICta
      primary
      wide
      :is-loading="isLoading"
      type="submit"
    >
      {{ sender.addressLine ? 'Aktualisieren' : 'Hinzufügen' }}
    </UICta>
  </form>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { Sender } from '~/server/types'
import type { Database } from '~/supabase/database.types'
import logger from '~/utils/logger'

const sender = (await useSender()).value!
const supabase = useSupabaseClient<Database>()
const isLoading = ref<boolean>(false)

const { fields, errors, submit } = useForm({
  initialValue: {
    name: sender.name,
    addressLine: sender.addressLine,
    zipCode: sender.zipCode,
    city: sender.city,
    country: sender.country,
  },
  resolver: z.object({
    name: z.string().min(2),
    addressLine: z.string().min(2),
    zipCode: z.string().min(4).max(5),
    city: z.string().min(2),
    country: z.string().min(2),
  }),
})

async function handleSubmit(
  senderAddress: Pick<Sender, 'name' | 'addressLine' | 'zipCode' | 'city' | 'country'>
): Promise<void> {
  isLoading.value = true

  const { data, error } = await supabase
    .from('sender')
    .update({
      name: senderAddress.name,
      address_line: senderAddress.addressLine,
      zip_code: senderAddress.zipCode,
      city: senderAddress.city,
      country: senderAddress.country,
    })
    .eq('id', sender.id)
    .select()
    .single()

  if (error) {
    logger.error(error.message, 'InvoiceSettingsAddressForm - handleSubmit')
    return
  }

  sender.name = data.name
  sender.addressLine = data.address_line
  sender.zipCode = data.zip_code
  sender.city = data.city
  sender.country = data.country

  isLoading.value = false
}
</script>
