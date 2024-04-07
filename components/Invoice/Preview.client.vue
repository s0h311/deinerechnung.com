<template>
  <div class="flex gap-10 w-full">
    <button
      class="btn btn-neutral"
      @click="handleSave"
    >
      PDF Laden
    </button>

    <iframe
      :src="blobUri"
      class="border rounded-lg w-auto h-full aspect-[1/1.4]"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { jsPDF } from 'jspdf'

const sender = (await useSender()).value!
const currentRecipient = (await useCurrentRecipient()).value!

const blobUri = ref<string | undefined>(undefined)

const doc = new jsPDF()

const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297

const MARGIN = 10

const MAX_WIDTH = PAGE_WIDTH - MARGIN
const MAX_HEIGHT = PAGE_HEIGHT - MARGIN

resetFont()
addSenderLogo()
addSenderAddress()
addRecipientAddress()
addSenderContactInfo()
addInvoiceNumber()
addDate()
addPositions()

function addSenderLogo(): void {
  if (sender.logoUrl) {
    const logo = new Image()
    logo.src = sender.logoUrl
    doc.addImage(logo, 'jpg', MAX_WIDTH - 50, MARGIN, 50, 25)
  }
}

function addSenderAddress(): void {
  const senderFullAddress = `${sender.name} - ${sender.addressLine} - ${sender.zipCode} - ${sender.city}`

  doc.setFontSize(7.5)
  doc.text(senderFullAddress, MARGIN, 60)

  resetFont()
}

function addRecipientAddress(): void {
  const recipientAddress = [
    currentRecipient.name,
    currentRecipient.addressLine,
    currentRecipient.zipCode.toString() + ', ' + currentRecipient.city,
  ]

  doc.text(recipientAddress, MARGIN, 70)
}

function addSenderContactInfo(): void {
  /* const senderContactInfo = [
    sender.email,
    sender.phone,
    sender.website
  ]

  doc.text(senderContactInfo, MARGIN, 70) */
}

function addInvoiceNumber(): void {
  doc.setFontSize(12)
  bold()

  const runningInvoiceNumber = sender.runningInvoiceNumber.toString().padStart(4, '0')
  doc.text('RECHNUNG Nr. ' + runningInvoiceNumber, MARGIN, 100)

  resetFont()
}

function addDate(): void {
  const date = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const text = 'Datum: ' + date
  doc.text(text, MAX_WIDTH - text.length - 20, 100)
}

function addPositions(): void {
  const positions = [1, 2, 3]
  const rect = doc.rect(MARGIN, 130, PAGE_WIDTH - 2 * MARGIN, positions.length * 15)
}

function handleSave(): void {
  blobUri.value = doc.output('bloburi').toString()
  // window.open(doc.output('bloburi'), '_blank')
  // doc.save(sender.value!.runningInvoiceNumber + '.pdf')
}

function resetFont(): void {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
}

function bold(): void {
  doc.setFont('helvetica', 'bold')
}
</script>
