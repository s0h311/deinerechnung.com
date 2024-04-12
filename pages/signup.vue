<template>
  <div class="grid gap-7 place-items-center">
    <label class="input input-bordered flex items-center gap-2">
      <IconCompany />
      <input
        type="text"
        class="grow"
        v-model="credentials.companyName"
        placeholder="Firmenname"
      />
    </label>

    <label class="input input-bordered flex items-center gap-2">
      <IconEmail />
      <input
        type="text"
        class="grow"
        v-model="credentials.email"
        placeholder="E-Mail"
      />
    </label>

    <label class="input input-bordered flex items-center gap-2">
      <IconPassword />
      <input
        type="password"
        class="grow"
        v-model="credentials.password"
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
import type { Database } from '~/supabase/database.types'

definePageMeta({
  middleware: ['not-auth'],
})

const supabase = useSupabaseClient<Database>()
const sender = await useSender()

const credentials = reactive({
  companyName: '',
  email: '',
  password: '',
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
      name: credentials.companyName,
      address_line: 'Steindamm 1',
      city: 'Hamburg',
      zip_code: 20099,
      country: 'Germany',
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
