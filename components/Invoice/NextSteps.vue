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

function showDialog(): void {
  const doc = new jsPDF()

  const invoice = document.getElementById('invoiceDocument')

  if (!invoice) {
    console.error('Cannot go to next steps, invoice element is null')
    return
  }

  doc.html(invoice)
  doc.save('invoice')
}
</script>
