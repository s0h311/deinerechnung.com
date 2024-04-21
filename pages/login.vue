<template>
  <div class="grid gap-7 place-items-center">
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
      <p v-else>Einloggen</p>
    </button>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['not-auth'],
})

useSeoMeta({
  title: 'Einloggen',
})

const supabase = useSupabaseClient()

const credentials = reactive({
  email: '',
  password: '',
})

const isLoading = ref<boolean>(false)

async function handleLogin(): Promise<void> {
  if (!credentials.email || !credentials.password) {
    return
  }

  isLoading.value = true

  const {} = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  })

  isLoading.value = false
  navigateTo('/dashboard/newInvoice')
}
</script>
