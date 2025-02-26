<template>
  <div>
    <h2>Passwort</h2>

    <UICta
      secondary
      wide
      :is-loading="isLoadingRequestOtp"
      :disabled="!!requestOtpButtonDisabled"
      @handle-click="requestOtp"
    >
      {{ requestOtpButtonDisabled ? requestOtpButtonDisabled : 'Code anfordern' }}
    </UICta>

    <form
      v-if="showPasswordResetForm"
      class="grid space-y-7"
      @submit.prevent="submit(handleSubmit)"
    >
      <input
        v-model="fields.newPassword"
        class="input input-bordered"
        type="text"
        placeholder="Neues Password"
      />

      <p
        v-if="errors.newPassword"
        class="text-red-400 -mt-6"
      >
        {{ errors.newPassword }}
      </p>

      <input
        v-model="fields.otp"
        class="input input-bordered"
        type="text"
        placeholder="Bestätigungscode"
      />

      <p
        v-if="errors.otp"
        class="text-red-400 -mt-6"
      >
        {{ errors.otp }}
      </p>

      <UICta
        primary
        wide
        type="submit"
        :is-loading="isLoadingResetPassword"
        >Aktualisieren</UICta
      >
    </form>

    <p class="text-xs max-w-md text-gray-500">Sie erhalten einen Code per E-Mail, diesen müssen Sie hier angeben.</p>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import logger from '~/utils/logger'

const supabase = useSupabaseClient()
const isLoadingRequestOtp = ref<boolean>(false)
const requestOtpButtonDisabled = ref<string>('')
const isLoadingResetPassword = ref<boolean>(false)
const showPasswordResetForm = ref<boolean>(false)

const { fields, errors, submit, reset } = useForm({
  initialValue: {
    newPassword: '',
    otp: '',
  },
  resolver: z.object({
    newPassword: z.string().min(6),
    otp: z.string().min(6),
  }),
})

async function requestOtp(): Promise<void> {
  isLoadingRequestOtp.value = true

  const { error } = await supabase.auth.reauthenticate()

  if (error) {
    logger.error(error.message, 'AccountSettingsPasswordForm - requestOtp')
  }

  isLoadingRequestOtp.value = false
  showPasswordResetForm.value = true
  requestOtpButtonDisabled.value = 'Nächste Anfrage in 60 Sekunden möglich'

  setTimeout(() => {
    requestOtpButtonDisabled.value = ''
  }, 1000 * 60)
}

async function handleSubmit({ newPassword, otp }: { newPassword: string; otp: string }): Promise<void> {
  isLoadingResetPassword.value = true
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
    nonce: otp,
  })

  if (error) {
    logger.error(error.message, 'AccountSettingsPasswordForm - handleSubmit')
    return
  }

  isLoadingResetPassword.value = false
  requestOtpButtonDisabled.value = ''
  reset()
}
</script>
