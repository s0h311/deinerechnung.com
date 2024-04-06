<template>
  <div class="space-y-7">
    <h2>Logo</h2>

    <NuxtImg
      v-if="logoPreview"
      class="rounded-lg"
      :src="logoPreview"
      :width="300"
      :height="300"
    />

    <SettingsLogoUpload
      @image-change="handleImageChange"
      @preview-change="handlePreviewChange"
    />

    <div class="flex items-center gap-4">
      <button
        class="btn btn-neutral"
        @click="handleSaveImage"
      >
        <span
          v-if="isUploadLoading"
          class="loading loading-spinner"
        />

        <p v-else>{{ sender?.logoUrl ? 'Aktualisieren' : 'Speichern' }}</p>
      </button>

      <button
        class="btn btn-md btn-outline btn-error w-fit"
        @click="handleDeleteImage"
      >
        <span
          v-if="isDeleteLoading"
          class="loading loading-spinner"
        />

        <p
          v-else
          class="flex items-center gap-1"
        >
          Löschen <IconDelete />
        </p>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/server/data/models/database.types'

const sender = await useSender()
const user = useSupabaseUser()
const supabase = useSupabaseClient<Database>()
const logoPreview = ref<string>(sender.value?.logoUrl ?? '')
const imageFile = ref<File | null>(null)
const isUploadLoading = ref<boolean>(false)
const isDeleteLoading = ref<boolean>(false)

function handlePreviewChange(data: string): void {
  if (data) {
    logoPreview.value = data
  }
}

function handleImageChange(file: File): void {
  imageFile.value = file
}

async function handleSaveImage(): Promise<void> {
  if (!user.value || !imageFile.value) {
    return
  }

  isUploadLoading.value = true

  const fileExtension = imageFile.value.name.split('.').pop()
  const imageName = `${user.value.id}/logo.${fileExtension}`

  const { data: uploadLogoData, error: uploadLogoError } = await supabase.storage
    .from('pictures')
    .upload(imageName, imageFile.value, {
      upsert: true,
    })

  if (uploadLogoError || !uploadLogoData) {
    console.error(uploadLogoError)
    isUploadLoading.value = false
    return
  }

  if (!sender.value) {
    console.error('No sender')
    isUploadLoading.value = false
    return
  }

  const { data: signedLogoUrlData, error: signedLogoUrlError } = await supabase.storage
    .from('pictures')
    .createSignedUrl(uploadLogoData.path, 60 * 60 * 24)

  if (signedLogoUrlError) {
    isUploadLoading.value = false
    return
  }

  sender.value.logoUrl = signedLogoUrlData.signedUrl

  const { error: updateLogoUrlError } = await supabase
    .from('sender')
    .update({
      logo_url: uploadLogoData.path,
    })
    .eq('id', sender.value.id)

  if (updateLogoUrlError) {
    console.error(updateLogoUrlError)
  }

  isUploadLoading.value = false
}

async function handleDeleteImage(): Promise<void> {
  isDeleteLoading.value = true

  const { error: senderUpdateError } = await supabase
    .from('sender')
    .update({
      logo_url: null,
    })
    .eq('id', sender.value!.id)

  if (senderUpdateError) {
    console.error(senderUpdateError)
    return
  }

  const logoPathMatch = sender.value!.logoUrl!.match(/pictures\/(.+\/logo.+)\?/)

  if (!logoPathMatch || logoPathMatch.length === 0) {
    console.error('Could not extract logo path from signed url')
    return
  }

  const { error } = await supabase.storage.from('pictures').remove([logoPathMatch[1]])

  if (error) {
    console.error(error)
  }

  sender.value!.logoUrl = null
  logoPreview.value = ''

  isDeleteLoading.value = false
}
</script>
