<template>
  <div>
    <form
      class="grid gap-7 w-fit"
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

    <p class="text-xs max-w-md text-gray-500">
      Die Änderung müssen Sie bestätigen. Dazu erhalten Sie eine E-Mail zu Ihrer neuen E-Mail Adresse
    </p>
  </div>
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
  const { error } = await supabase.auth.updateUser({
    email,
  })

  if (error) {
    logger.error(error.message, 'AccountSettingsEmailForm - handleSubmit')
    return
  }

  isLoading.value = false
}
</script>
