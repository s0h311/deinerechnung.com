<template>
  <div class="flex flex-col gap-7">
    <button
      class="btn btn-secondary"
      @click="handleDownload"
    >
      Herunterladen
    </button>

    <div class="divider">oder direkt senden</div>

    <input
      class="input input-bordered"
      v-model="recipientEmail"
      type="email"
      placeholder="hi@reffect.org"
    />

    <button
      class="btn btn-primary"
      @click="handleSendViaEmail"
    >
      Senden
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Sender } from '@prisma/client'
import type jsPDF from 'jspdf'

type Props = {
  document: jsPDF
  sender: Sender
}

const props = defineProps<Props>()

const recipientEmail = ref<string>('')

function handleDownload(): void {
  props.document.save(props.sender.runningInvoiceNumber + '.pdf')
}

async function handleSendViaEmail(): Promise<void> {}
</script>
