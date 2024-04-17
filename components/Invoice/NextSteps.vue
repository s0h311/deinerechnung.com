<template>
  <button
    class="btn btn-secondary w-full"
    @click="showDialog"
  >
    Fortfahren
  </button>
</template>

<script setup lang="ts">
import { jsPDF } from 'jspdf'

const sender = (await useSender()).value!

function showDialog(): void {
  const doc = new jsPDF('p', 'pt', 'a4')

  const invoice = document.getElementById('invoiceDocument')

  if (!invoice) {
    console.error('Cannot go to next steps, invoice element is null')
    return
  }
  doc.html(invoice, {
    callback: (doc) => {
      doc.save(`${sender.runningInvoiceNumber}-rechnung.pdf`)
    },
  })
}
</script>
