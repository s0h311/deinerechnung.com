<template>
  <form
    class="bg-base-200 grid w-fit px-4 py-3 rounded-lg space-y-7"
    @submit.prevent="submit(handleSubmit)"
  >
    <h2>E-Mail</h2>

    <input
      v-model="fields.email"
      class="input input-bordered"
      type="text"
      :placeholder="user.email"
    />

    <p
      v-if="errors.email"
      class="text-red-400 -mt-6"
    >
      {{ errors.email }}
    </p>

    <UICta
      primary
      wide
      type="submit"
      :is-loading="isLoading"
      >Aktualisieren</UICta
    >
  </form>
</template>

<script setup lang="ts">
import { z } from 'zod'
import logger from '~/utils/logger'

const user = useSupabaseUser().value!
const supabase = useSupabaseClient()
const isLoading = ref<boolean>(false)

const { fields, errors, submit } = useForm({
  initialValue: {
    email: user.email as string,
  },
  resolver: z.object({
    email: z.string().email(),
  }),
})

async function handleSubmit({ email }: { email: string }): Promise<void> {
  isLoading.value = true
  const { data, error } = await supabase.auth.updateUser({
    email,
  })

  if (error) {
    logger.error(error.message, 'AccountSettingsEmailForm - handleSubmit')
    return
  }

  isLoading.value = false
}
</script>
