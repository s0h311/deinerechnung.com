<template>
  <form
    class="grid gap-7 place-items-center"
    @submit.prevent="submit(handleSubmit)"
  >
    <label class="input input-bordered flex items-center gap-2">
      <IconCompany />
      <input
        v-model="fields.name"
        class="grow"
        type="text"
        placeholder="Firmenname"
      >
    </label>

    <p
      v-if="errors.name"
      class="text-red-400 -mt-6"
    >
      {{ errors.name }}
    </p>

    <label class="input input-bordered flex items-center gap-2">
      <input
        v-model="fields.addressLine"
        class="grow"
        type="text"
        placeholder="Straße und Hausnummer"
      >
    </label>

    <p
      v-if="errors.addressLine"
      class="text-red-400 -mt-6"
    >
      {{ errors.addressLine }}
    </p>

    <label class="input input-bordered flex items-center gap-2">
      <input
        v-model="fields.zipCode"
        class="grow"
        type="text"
        placeholder="PLZ"
      >
    </label>

    <p
      v-if="errors.zipCode"
      class="text-red-400 -mt-6"
    >
      {{ errors.zipCode }}
    </p>

    <label class="input input-bordered flex items-center gap-2">
      <input
        v-model="fields.city"
        class="grow"
        type="text"
        placeholder="Ort"
      >
    </label>

    <p
      v-if="errors.city"
      class="text-red-400 -mt-6"
    >
      {{ errors.city }}
    </p>

    <label class="input input-bordered flex items-center gap-2">
      <IconEmail />
      <input
        v-model="fields.email"
        class="grow"
        type="email"
        placeholder="E-Mail"
      >
    </label>

    <p
      v-if="errors.email"
      class="text-red-400 -mt-6"
    >
      {{ errors.email }}
    </p>

    <label class="input input-bordered flex items-center gap-2">
      <IconPassword />
      <input
        v-model="fields.password"
        class="grow"
        type="password"
        minlength="6"
        placeholder="Passwort"
      >
    </label>

    <p
      v-if="errors.password"
      class="text-red-400 -mt-6"
    >
      {{ errors.password }}
    </p>

    <UICta
      wide
      type="submit"
      :is-loading="isLoading"
    >
      Registrieren
    </UICta>
  </form>
</template>

<script setup lang="ts">
import { objectToCamel } from 'ts-case-convert'
import { z } from 'zod'
import type { Sender } from '~/server/types'
import type { Database } from '~/supabase/database.types'
import logger from '~/utils/logger'

definePageMeta({
  middleware: [
    // 'not-auth'
    // Using Stripe Webhook to signup the user
    () => {
      return navigateTo('/')
    },
  ],
})

useSeoMeta({
  title: 'Registrieren',
})

const supabase = useSupabaseClient<Database>()
const sender = await useSender()

const { fields, errors, submit } = useForm({
  initialValue: {
    name: '',
    email: '',
    password: '',
    addressLine: '',
    zipCode: '',
    city: '',
    country: 'DE',
  },
  resolver: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    addressLine: z.string().min(2),
    zipCode: z.string().min(4).max(5),
    city: z.string().min(2),
    country: z.string().min(2),
  }),
})

const isLoading = ref<boolean>(false)

async function handleSubmit(
  newSender: Pick<Sender, 'name' | 'addressLine' | 'zipCode' | 'city' | 'country'> & { email: string; password: string }
): Promise<void> {
  isLoading.value = true

  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email: newSender.email,
    password: newSender.password,
  })

  if (signupError) {
    logger.error(signupError.message, 'Signup - handleSubmit')
    return
  }

  if (!signupData.user) {
    logger.error('No user found', 'Signup - handleSubmit')
    return
  }

  const { data: insertSenderData, error: insertSenderError } = await supabase
    .from('sender')
    .insert({
      user_id: signupData.user.id,
      name: newSender.name,
      address_line: newSender.addressLine,
      zip_code: newSender.zipCode,
      city: newSender.city,
      country: newSender.country,
    })
    .select()
    .single()

  if (insertSenderError) {
    logger.error(insertSenderError.message, 'Signup - handleSubmit')
    return
  }

  sender.value = objectToCamel(insertSenderData)

  isLoading.value = false
  navigateTo('/dashboard/newInvoice')
}
</script>
