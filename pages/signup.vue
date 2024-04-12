<template>
  <div class="grid gap-7 place-items-center">
    <label class="input input-bordered flex items-center gap-2">
      <IconCompany />
      <input
        class="grow"
        type="text"
        v-model="credentials.name"
        placeholder="Firmenname"
      />
    </label>

    <label class="input input-bordered flex items-center gap-2">
      <input
        class="grow"
        type="text"
        v-model="credentials.addressLine"
        placeholder="Straße und Hausnummer"
      />
    </label>

    <label class="input input-bordered flex items-center gap-2">
      <input
        class="grow"
        type="number"
        v-model="credentials.zipCode"
        min="00001"
        max="99999"
        placeholder="PLZ"
      />
    </label>

    <label class="input input-bordered flex items-center gap-2">
      <input
        class="grow"
        type="text"
        v-model="credentials.city"
        placeholder="Ort"
      />
    </label>

    <label class="input input-bordered flex items-center gap-2">
      <IconEmail />
      <input
        class="grow"
        type="email"
        v-model="credentials.email"
        placeholder="E-Mail"
      />
    </label>

    <label class="input input-bordered flex items-center gap-2">
      <IconPassword />
      <input
        class="grow"
        type="password"
        v-model="credentials.password"
        minlength="6"
        placeholder="Passwort"
      />
    </label>

    <button
      class="btn btn-wide"
      @click="handleLogin"
    >
      <span
        v-if="isLoading"
        class="loading loading-spinner"
      ></span>
      <p v-else>Registrieren</p>
    </button>
  </div>
</template>

<script setup lang="ts">
import { objectToCamel } from 'ts-case-convert'
import { reactive, ref } from 'vue'
import type { Sender } from '~/server/types'
import type { Database } from '~/supabase/database.types'

definePageMeta({
  middleware: ['not-auth'],
})

const supabase = useSupabaseClient<Database>()
const sender = await useSender()

const credentials = reactive<
  Pick<Sender, 'name' | 'addressLine' | 'zipCode' | 'city' | 'country'> & { email: string; password: string }
>({
  name: '',
  email: '',
  password: '',
  addressLine: '',
  zipCode: 0,
  city: '',
  country: 'DE',
})

const isLoading = ref<boolean>(false)

async function handleLogin(): Promise<void> {
  if (!credentials.email || !credentials.password) {
    return
  }

  isLoading.value = true

  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
  })

  if (signupError || !signupData.user) {
    console.error(signupError)
    return
  }

  const { data: insertSenderData, error: insertSenderError } = await supabase
    .from('sender')
    .insert({
      user_id: signupData.user.id,
      name: credentials.name,
      address_line: credentials.addressLine,
      zip_code: credentials.zipCode,
      city: credentials.city,
      country: credentials.country,
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
