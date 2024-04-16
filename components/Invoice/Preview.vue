<template>
  <div
    id="invoiceDocument"
    class="h-full w-full aspect-[210/297] p-8 ring-2 ring-neutral rounded-lg text-[11px] leading-3 flex flex-col text-black font-[Helvetica]"
  >
    <img
      v-if="sender.logoUrl"
      :src="sender.logoUrl"
      class="max-h-[10%] ml-auto"
    />

    <div class="space-y-3 mb-10 mt-14">
      <p class="text-xxs">{{ senderFullAddress }}</p>
      <p v-html="recipientFullAddress"></p>
    </div>

    <div class="flex items-center justify-between mb-16">
      <p class="font-bold text-xs">{{ invoiceText }}</p>
      <p>{{ dateText }}</p>
    </div>

    <table class="table text-xs">
      <thead>
        <tr class="[&>*]:text-start [&>*]:py-1.5 [&>*]:px-2">
          <th>Pos</th>
          <th>Beschreibung</th>
          <th>Menge</th>
          <th>Einzelpreis</th>
          <th>Gesamtpreis</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(position, index) in invoice.positions"
          class="[&>*]:text-start [&>*]:py-1.5 [&>*]:px-2"
          :key="'position' + index"
        >
          <td>{{ index }}</td>
          <td>{{ position.description }}</td>
          <td>{{ position.quantity }}</td>
          <td>{{ formatPrice(position.price) }}</td>
          <td>{{ formatPrice(position.quantity * position.price) }}</td>
        </tr>
      </tbody>
    </table>

    <div class="grid grid-cols-3 mt-auto w-full text-xxs opacity-60">
      <div
        v-for="(column, index) in sender.footnotes"
        :class="index === 1 ? 'text-center' : index === 2 ? 'text-end' : ''"
        :key="'column' + index"
        v-html="ln2Br(column)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const sender = (await useSender()).value!
const invoice = await useCurrentInvoice()

watch(invoice.value.positions, (newValue, oldValue) => {
  console.log('newValue', newValue)
  console.log('oldValue', oldValue)
})

const senderFullAddress = computed(() => `${sender.name} - ${sender.addressLine} - ${sender.zipCode} - ${sender.city}`)
const recipientFullAddress = computed(() => {
  const recipient = invoice.value.recipient

  if (!recipient) return ''
  return `${recipient.name}<br />${recipient.addressLine}<br />${recipient.zipCode}, ${recipient.city}`
})

const invoiceText = computed(() => `RECHNUNG Nr. ${sender.runningInvoiceNumber.toString().padStart(4, '0')}`)
const dateText = computed(() => `Datum: ${formatDate(new Date())}`)

function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatPrice(price: number): string {
  return price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
}

function ln2Br(text: string): string {
  return text.replace(/\n/g, '<br />')
}
</script>
