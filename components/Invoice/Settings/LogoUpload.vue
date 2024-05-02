<template>
  <div class="space-y-7">
    <input
      type="file"
      class="file-input file-input-bordered file-input-primary w-full max-w-xs"
      accept="image/*"
      @change="handleImage"
    >
  </div>
</template>

<script setup lang="ts">
type Emits = {
  imageChange: [imageFile: File]
  previewChange: [imageData: string]
}

const emits = defineEmits<Emits>()

async function handleImage(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement

  if (!input.files) {
    return
  }

  const file = input.files[0]
  const reader = new FileReader()

  reader.onload = (e) => {
    const data = e.target!.result

    emits('previewChange', data as string)
  }

  reader.readAsDataURL(file)
  emits('imageChange', file)
}
</script>
