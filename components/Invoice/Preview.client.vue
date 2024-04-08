<template>
  <iframe
    :src="blobUri"
    class="border rounded-lg w-auto h-full aspect-[1/1.4]"
  ></iframe>
</template>

<script setup lang="ts">
import { jsPDF } from 'jspdf'

const sender = (await useSender()).value!
const currentRecipient = await useCurrentRecipient()
const currentInvoicePositions = useCurrentInvoicePositions()

const blobUri = ref<string | undefined>(undefined)

const doc = new jsPDF()

const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297

const MARGIN = 10

const MAX_WIDTH = PAGE_WIDTH - MARGIN
const MAX_HEIGHT = PAGE_HEIGHT - MARGIN

onMounted(() => {
  init()
})

watch(
  currentInvoicePositions,
  () => {
    doc.deletePage(1)
    doc.addPage()
    init()
    updatePositions()
    update()
  },
  { deep: true }
)

watch(currentRecipient, () => {
  doc.deletePage(1)
  doc.addPage()
  init()

  if (currentRecipient.value) {
    addRecipientAddress()
  }

  updatePositions()
  update()
})

function init(): void {
  resetFont()
  addSenderLogo()
  addSenderAddress()
  addSenderContactInfo()
  addInvoiceNumber()
  addDate()
  update()

  if (currentRecipient.value) {
    addRecipientAddress()
    update()
  }
}

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
    currentRecipient.value!.name,
    currentRecipient.value!.addressLine,
    currentRecipient.value!.zipCode.toString() + ', ' + currentRecipient.value!.city,
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

function updatePositions(): void {
  const RECT_HEIGHT = currentInvoicePositions.value.length * 7 + 5 // h = 7 for each position and 5 for overall margin on y-axis
  const rect = doc.rect(MARGIN, 130, PAGE_WIDTH - 2 * MARGIN, RECT_HEIGHT)

  const RECT_MARGIN = MARGIN + 5

  bold()
  rect.text('Pos', MARGIN + 1, 127)
  rect.line(RECT_MARGIN + 7, 130, RECT_MARGIN + 7, 130 + RECT_HEIGHT)

  // Next line is on x = RECT_MARGIN + 7
  rect.text('Beschreibung', RECT_MARGIN + 7 + 1, 127)
  rect.line(RECT_MARGIN + 120, 130, RECT_MARGIN + 120, 130 + RECT_HEIGHT)

  // Next line is on x = RECT_MARGIN + 120
  rect.text('Menge', RECT_MARGIN + 120 + 1, 127)
  rect.line(RECT_MARGIN + 135, 130, RECT_MARGIN + 135, 130 + RECT_HEIGHT)

  // Next line is on x = RECT_MARGIN + 135
  rect.text('Einzelpreis', RECT_MARGIN + 135 + 1, 127)
  rect.line(RECT_MARGIN + 160, 130, RECT_MARGIN + 160, 130 + RECT_HEIGHT)

  // Next line is on x = RECT_MARGIN + 160
  rect.text('Gesamtpreis', RECT_MARGIN + 160 + 1, 127)
  resetFont()

  let currentLineY = 130

  currentInvoicePositions.value.forEach((position, index) => {
    currentLineY += 7

    rect.text((index + 1).toString(), RECT_MARGIN, currentLineY)
    rect.text(position.description, RECT_MARGIN + 7 + 2, currentLineY)
    rect.text(position.quantity.toString(), RECT_MARGIN + 120 + 2, currentLineY)
    rect.text(formatPrice(position.price), RECT_MARGIN + 135 + 2, currentLineY)
    rect.text(formatPrice(position.price * position.quantity), RECT_MARGIN + 160 + 2, currentLineY)
  })
}

function addFootnotes(): void {}

function update(): void {
  blobUri.value = doc.output('bloburi').toString()
}

function resetFont(): void {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
}

function bold(): void {
  doc.setFont('helvetica', 'bold')
}

function formatPrice(price: number): string {
  return price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
}
</script>
