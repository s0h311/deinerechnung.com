<template>
  <div>
    <button
      class="btn btn-neutral"
      @click="handleSave"
    >
      SAVE
    </button>
  </div>
</template>

<script setup lang="ts">
import { jsPDF } from 'jspdf'

const sender = await useSender()

const doc = new jsPDF()

doc.setFont('helvetica')
doc.setFontSize(11)

function handleSave(): void {
  doc.text('Hello world!', 10, 10)
  //doc.save(sender.value!.runningInvoiceNumber + '.pdf')
}
</script>
