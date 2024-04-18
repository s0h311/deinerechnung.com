<template>
  <section>
    <button
      class="btn btn-secondary w-full"
      @click="showDialog"
    >
      Fortfahren
    </button>

    <dialog
      ref="dialog"
      class="p-4 rounded-lg"
    >
      <form
        class="grid gap-7"
        @submit.prevent="handleSendViaEmail"
      >
        <input
          class="input input-bordered"
          v-model="recipientEmail"
          type="email"
          placeholder="empfänger@email.de"
        />

        <button
          class="btn btn-wide btn-primary"
          type="submit"
        >
          <span
            v-if="isLoadingSendViaEmail"
            class="loading loading-spinner"
          />

          <p v-else>Senden</p>
        </button>

        <button
          class="btn btn-wide btn-secondary"
          type="button"
          @click="handleDownload"
        >
          <span
            v-if="isLoadingDownload"
            class="loading loading-spinner"
          />

          <p v-else>Herunterladen</p>
        </button>
      </form>
    </dialog>
  </section>
</template>

<script setup lang="ts">
import { jsPDF } from 'jspdf'
import type { Database } from '~/supabase/database.types'

const supabase = useSupabaseClient<Database>()
const sender = (await useSender()).value!
const recipientEmail = ref<string>('')

const dialog = ref<HTMLDialogElement>()

const isLoadingSendViaEmail = ref<boolean>(false)
const isLoadingDownload = ref<boolean>(false)

function showDialog(): void {
  dialog.value?.showModal()
}

function handleDownload(): void {
  isLoadingDownload.value = true

  const invoiceName = sender.runningInvoiceNumber.toString().padStart(4, '0') + '-rechnung.pdf'

  createPdf((doc) => {
    doc.save(invoiceName)

    isLoadingDownload.value = false
  })
}

async function handleSendViaEmail(): Promise<void> {
  isLoadingSendViaEmail.value = true

  const invoiceName = `${sender.runningInvoiceNumber.toString().padStart(4, '0')}-rechnung-${new Date().getTime()}.pdf`
  const invoicePath = `${sender.userId}/${invoiceName}`

  createPdf(async (doc) => {
    const invoiceBlob: Blob = doc.output('blob')

    const invoiceFile: File = new File([invoiceBlob], invoiceName, {
      type: 'application/pdf',
    })

    const { error: uploadInvoiceError } = await supabase.storage.from('invoice').upload(invoicePath, invoiceFile)

    if (uploadInvoiceError) {
      console.error(uploadInvoiceError)
    }

    const { error: increaseRunningInvoiceNumberError } = await supabase.rpc('increase_running_invoice_number', {
      user_id: sender.id,
    })

    if (increaseRunningInvoiceNumberError) {
      console.error(increaseRunningInvoiceNumberError)
    } else {
      sender.runningInvoiceNumber++
    }

    isLoadingSendViaEmail.value = false
  })
}

function createPdf(callback: (jsPdf: jsPDF) => void): void {
  const doc = new jsPDF('p', 'pt', 'a4')

  const invoice = document.getElementById('invoiceDocument')

  if (!invoice) {
    console.error('Cannot create pdf, invoice element is null')
    return
  }

  doc.html(invoice, { callback })
}
</script>
