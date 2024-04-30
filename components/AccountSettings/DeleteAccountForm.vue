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

  <dialog
    ref="confirmationDialogRef"
    class="p-4 rounded-lg grid gap-5"
  >
    <h2>Möchten Sie wirklich Ihr Konto löschen</h2>

    <p class="text-sm">Sie verlieren alle Ihre Daten.</p>

    <div class="flex justify-end gap-5">
      <UICta primary>Abbrechen</UICta>

      <UICta
        error
        outline
        @handle-click="handleDeleteAccount"
      >
        Unwiderruflich löschen
      </UICta>
    </div>
  </dialog>
</template>

<script setup lang="ts">
const confirmationDialogRef = ref<HTMLDialogElement>()

function showConfirmationDialog(): void {
  confirmationDialogRef.value?.showModal()
}

async function handleDeleteAccount(): Promise<void> {
  const stripeCheckoutUrl = await $fetch('/api/account/delete', {
    method: 'delete',
  })
}
</script>
