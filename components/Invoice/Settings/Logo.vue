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

    <InvoiceSettingsLogoUpload
      @image-change="handleImageChange"
      @preview-change="handlePreviewChange"
    />

    <div class="flex items-center gap-4">
      <UICta
        :is-loading="isUploadLoading"
        @handle-click="handleSaveImage"
      >
        {{ sender?.logoUrl ? 'Aktualisieren' : 'Speichern' }}
      </UICta>

      <UICta
        medium
        outline
        error
        :is-loading="isDeleteLoading"
        @handle-click="handleDeleteImage"
      >
        Löschen <IconDelete />
      </UICta>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/supabase/database.types'
import logger from '~/utils/logger'

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

  if (uploadLogoError) {
    logger.error(uploadLogoError.message, 'InvoiceSettingsLogo - handleSaveImage')
    isUploadLoading.value = false
    return
  }

  if (!sender.value) {
    logger.error('Unable to find sender', 'InvoiceSettingsLogo - handleSaveImage')
    isUploadLoading.value = false
    return
  }

  const { data: signedLogoUrlData, error: signedLogoUrlError } = await supabase.storage
    .from('pictures')
    .createSignedUrl(uploadLogoData.path, 60 * 60 * 24)

  if (signedLogoUrlError) {
    logger.error(signedLogoUrlError.message, 'InvoiceSettingsLogo - handleSaveImage')
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
    logger.error(updateLogoUrlError.message, 'InvoiceSettingsLogo - handleSaveImage')
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
    logger.error(senderUpdateError.message, 'InvoiceSettingsLogo - handleDeleteImage')
    return
  }

  const logoPathMatch = sender.value!.logoUrl!.match(/pictures\/(.+\/logo.+)\?/)

  if (!logoPathMatch || logoPathMatch.length === 0) {
    logger.error('Unable to extract logo path from signed url', 'InvoiceSettingsLogo - handleDeleteImage')
    return
  }

  const { error } = await supabase.storage.from('pictures').remove([logoPathMatch[1]])

  if (error) {
    logger.error(error.message, 'InvoiceSettingsLogo - handleDeleteImage')
  }

  sender.value!.logoUrl = null
  logoPreview.value = ''

  isDeleteLoading.value = false
}
</script>
