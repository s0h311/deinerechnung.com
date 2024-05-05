<template>
  <section>
    <UICta
      class="w-full"
      secondary
      @handle-click="showDialog"
    >
      Fortfahren
    </UICta>

    <dialog
      ref="dialog"
      class="p-4 rounded-lg"
    >
      <form
        class="grid gap-7"
        @submit.prevent="handleSendViaEmail"
      >
        <input
          v-model="recipientEmail"
          class="input input-bordered"
          type="email"
          placeholder="empfänger@email.de"
        />

        <UICta
          primary
          wide
          type="submit"
          :is-loading="isLoadingSendViaEmail"
        >
          Senden
        </UICta>

        <UICta
          secondary
          wide
          :is-loading="isLoadingDownload"
          @handle-click="handleDownload"
        >
          Herunterladen
        </UICta>
      </form>
    </dialog>
  </section>
</template>

<script setup lang="ts">
import { jsPDF } from 'jspdf'
import type { Database } from '~/supabase/database.types'
import logger from '~/utils/logger'

const supabase = useSupabaseClient<Database>()
const sender = (await useSender()).value!
const recipientEmail = ref<string>('')
const shouldUseQrCode = useQrCode()

const dialog = ref<HTMLDialogElement>()

const isLoadingSendViaEmail = ref<boolean>(false)
const isLoadingDownload = ref<boolean>(false)

function showDialog(): void {
  dialog.value?.showModal()
}

async function handleDownload(): Promise<void> {
  isLoadingDownload.value = true

  const invoiceName = sender.runningInvoiceNumber.toString().padStart(4, '0') + '-rechnung.pdf'

  if (sender.iban) {
    shouldUseQrCode.value = true
  }

  createPdf(async (doc) => {
    doc.save(invoiceName)

    await uploadInvoice()
    await increaseRunningInvoiceNumber()
    resetInvoice()
    shouldUseQrCode.value = false

    setTimeout(() => (isLoadingDownload.value = false))
    dialog.value?.close()
  })
}

async function handleSendViaEmail(): Promise<void> {
  isLoadingSendViaEmail.value = true

  if (sender.iban) {
    shouldUseQrCode.value = true
  }

  await uploadInvoice()
  await increaseRunningInvoiceNumber()
  resetInvoice()
  shouldUseQrCode.value = false

  setTimeout(() => (isLoadingSendViaEmail.value = false))
  dialog.value?.close()
}

async function uploadInvoice(): Promise<void> {
  const invoiceName = `${sender.runningInvoiceNumber.toString().padStart(4, '0')}-rechnung-${new Date().getTime()}.pdf`
  const invoicePath = `${sender.userId}/${invoiceName}`

  return new Promise((resolve, reject) => {
    createPdf(async (doc) => {
      const invoiceBlob: Blob = doc.output('blob')

      const invoiceFile: File = new File([invoiceBlob], invoiceName, {
        type: 'application/pdf',
      })

      const { error: uploadInvoiceError } = await supabase.storage.from('invoice').upload(invoicePath, invoiceFile)

      if (uploadInvoiceError) {
        logger.error(uploadInvoiceError.message, 'InvoiceNextSteps - uploadInvoice')
        reject()
      }

      resolve()
    })
  })
}

async function increaseRunningInvoiceNumber(): Promise<void> {
  const { error: increaseRunningInvoiceNumberError } = await supabase.rpc('increase_running_invoice_number', {
    user_id: sender.id,
  })

  if (increaseRunningInvoiceNumberError) {
    logger.error(increaseRunningInvoiceNumberError.message, 'InvoiceNextSteps - increaseRunningInvoiceNumber')
    return
  }

  sender.runningInvoiceNumber++
}

function createPdf(callback: (jsPdf: jsPDF) => void): void {
  const doc = new jsPDF('p', 'pt', 'a4', true)

  const invoice = document.getElementById('invoiceDocument')

  if (!invoice) {
    logger.error('Unable to find invoiceDocument', 'InvoiceNextSteps - createPdf')
    return
  }

  doc.html(invoice, {
    callback: (doc) => {
      doc.deletePage(2) // TODO Just a hack
      callback(doc)
    },
  })
}
</script>
