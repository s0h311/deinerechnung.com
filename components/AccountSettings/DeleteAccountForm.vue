<template>
  <UICta
    class="w-fit"
    error
    outline
    small
    @handle-click="showConfirmationDialog"
  >
    Konto löschen
  </UICta>

  <UIConfirmationDialog
    ref="deleteAccountConfirmationDialog"
    title="Möchten Sie wirklich Ihr Konto löschen?"
    text="Bitte laden Sie alle Rechnungen herunter, bevor Sie Ihr Konto löschen. Mit der Löschung werden die Rechnungen
      unwiderruflich gelöscht."
    continue-button-text="Unwiderruflich löschen"
    @continue-click="handleDeleteAccount"
  />
</template>

<script setup lang="ts">
import type { UIConfirmationDialog } from '#build/components'

const sender = await useSender()

const deleteAccountConfirmationDialog = ref<InstanceType<typeof UIConfirmationDialog>>()

function showConfirmationDialog(): void {
  deleteAccountConfirmationDialog.value?.showModal()
}

async function handleDeleteAccount(): Promise<void> {
  await $fetch('/api/account', {
    method: 'delete',
  })

  deleteAccountConfirmationDialog.value?.closeModal()

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)

    if (key?.includes('auth-token')) {
      localStorage.removeItem(key)
      break
    }
  }

  sender.value = null
  await navigateTo('/')
}
</script>
