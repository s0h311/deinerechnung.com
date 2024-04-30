<template>
  <dialog
    ref="confirmationDialogRef"
    class="p-4 rounded-lg space-y-5 w-[30%]"
  >
    <h2>{{ title }}</h2>

    <p
      v-if="text"
      class="text-sm"
    >
      {{ text }}
    </p>

    <div class="flex justify-end gap-5">
      <UICta
        primary
        @handle-click="closeModal"
      >
        Abbrechen
      </UICta>

      <UICta
        error
        outline
        @handle-click="emits('continueClick')"
      >
        {{ continueButtonText }}
      </UICta>
    </div>
  </dialog>
</template>

<script setup lang="ts">
type Props = {
  title: string
  text?: string
  continueButtonText: string
}

type Emits = {
  continueClick: []
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
defineExpose({
  closeModal,
  showModal,
})

const confirmationDialogRef = ref<HTMLDialogElement>()

function closeModal(): void {
  confirmationDialogRef.value?.close()
}

function showModal(): void {
  confirmationDialogRef.value?.showModal()
}
</script>
