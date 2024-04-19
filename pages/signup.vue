<template>
  <form
    class="grid gap-7 place-items-center"
    @submit.prevent="submit(handleSubmit)"
  >
    <label class="input input-bordered flex items-center gap-2">
      <IconCompany />
      <input
        class="grow"
        type="text"
        v-model="fields.name"
        placeholder="Firmenname"
      />
    </label>

    <p
      v-if="errors.name"
      class="text-red-400 -mt-6"
    >
      {{ errors.name }}
    </p>

    <label class="input input-bordered flex items-center gap-2">
      <input
        class="grow"
        type="text"
        v-model="fields.addressLine"
        placeholder="Straße und Hausnummer"
      />
    </label>

    <p
      v-if="errors.addressLine"
      class="text-red-400 -mt-6"
    >
      {{ errors.addressLine }}
    </p>

    <label class="input input-bordered flex items-center gap-2">
      <input
        class="grow"
        type="text"
        v-model="fields.zipCode"
        placeholder="PLZ"
      />
    </label>

    <p
      v-if="errors.zipCode"
      class="text-red-400 -mt-6"
    >
      {{ errors.zipCode }}
    </p>

    <label class="input input-bordered flex items-center gap-2">
      <input
        class="grow"
        type="text"
        v-model="fields.city"
        placeholder="Ort"
      />
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
        class="grow"
        type="email"
        v-model="fields.email"
        placeholder="E-Mail"
      />
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
        class="grow"
        type="password"
        v-model="fields.password"
        minlength="6"
        placeholder="Passwort"
      />
    </label>

    <p
      v-if="errors.password"
      class="text-red-400 -mt-6"
    >
      {{ errors.password }}
    </p>

    <button
      class="btn btn-wide"
      type="submit"
    >
      <span
        v-if="isLoading"
        class="loading loading-spinner"
      ></span>
      <p v-else>Registrieren</p>
    </button>
  </form>
</template>

<script setup lang="ts">
import { objectToCamel } from 'ts-case-convert'
import { z } from 'zod'
import type { Sender } from '~/server/types'
import type { Database } from '~/supabase/database.types'

definePageMeta({
  middleware: ['not-auth'],
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

  if (signupError || !signupData.user) {
    console.error(signupError)
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
    console.error(insertSenderError)
    return
  }

  sender.value = objectToCamel(insertSenderData)

  isLoading.value = false
  navigateTo('/dashboard')
}
</script>
