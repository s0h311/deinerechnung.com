<template>
  <form
    v-if="sender"
    class="grid gap-7 h-fit"
    @submit.prevent="submit(handleSubmit)"
  >
    <h2>Zahlungsdaten</h2>

    <input
      class="input input-bordered"
      type="text"
      v-model="fields.creditInstitution"
      placeholder="Kreditinstitut"
    />

    <p
      v-if="errors.creditInstitution"
      class="text-red-400 -mt-6"
    >
      {{ errors.creditInstitution }}
    </p>

    <input
      class="input input-bordered"
      type="text"
      :value="prettifyIban(fields.iban ?? '')"
      placeholder="IBAN"
      @input="(e) => set({iban: (e.target as HTMLInputElement).value})
      "
    />

    <p
      v-if="errors.iban"
      class="text-red-400 -mt-6"
    >
      {{ errors.iban }}
    </p>

    <input
      class="input input-bordered"
      type="text"
      v-model="fields.bic"
      placeholder="BIC"
    />

    <p
      v-if="errors.bic"
      class="text-red-400 -mt-6"
    >
      {{ errors.bic }}
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
import uglifyIban from '~/utils/iban'
import logger from '~/utils/logger'

const sender = (await useSender()).value!
const supabase = useSupabaseClient<Database>()
const isLoading = ref<boolean>(false)

const { fields, errors, submit, set } = useForm({
  initialValue: {
    creditInstitution: sender.creditInstitution,
    iban: sender.iban,
    bic: sender.bic,
  },
  resolver: z.object({
    creditInstitution: z.string().min(2),
    iban: z.string().min(15).max(34),
    bic: z.string().min(8).max(11),
  }),
})

async function handleSubmit(paymentData: Pick<Sender, 'creditInstitution' | 'iban' | 'bic'>): Promise<void> {
  isLoading.value = true
  const { data, error } = await supabase
    .from('sender')
    .update({
      credit_institution: paymentData.creditInstitution,
      iban: uglifyIban(paymentData.iban ?? ''),
      bic: paymentData.bic,
    })
    .eq('id', sender.id)
    .select()
    .single()

  if (error) {
    logger.error(error.message, 'InvoiceSettingsPaymentForm - handleSubmit')
    return
  }

  sender.creditInstitution = data.credit_institution
  sender.iban = data.iban
  sender.bic = data.bic

  isLoading.value = false
}
</script>
