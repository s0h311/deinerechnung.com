<template>
  <div
    id="invoiceDocument"
    class="h-[calc(100%-40px)] aspect-[210/297] p-8 ring-2 ring-neutral rounded-lg text-[11px] leading-3 flex flex-col text-black font-[Helvetica]"
  >
    <div class="min-h-[10%] max-h-[10%]">
      <img
        v-if="sender.logoUrl"
        :src="sender.logoUrl"
        class="max-w-[30%] ml-auto"
      />
    </div>

    <div class="space-y-3 mb-16 mt-10">
      <p class="text-xxs">{{ senderFullAddress }}</p>
      <p v-html="recipientFullAddress"></p>
    </div>

    <div class="flex items-center justify-between mb-16">
      <p class="font-bold text-xs">{{ invoiceText }}</p>
      <p>{{ dateText }}</p>
    </div>

    <table
      v-if="invoice.positions.length > 0"
      class="text-xs"
    >
      <thead>
        <tr class="[&>*]:py-1.5 [&>*]:px-2 border-b">
          <th class="text-start">Pos</th>
          <th class="text-start">Beschreibung</th>
          <th class="text-start">Menge</th>
          <th class="text-end">Einzelpreis</th>
          <th class="text-end">Gesamtpreis</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(position, index) in invoice.positions"
          class="[&>*]:py-1.5 [&>*]:px-2 border-b pb-4"
          :key="'position' + index"
        >
          <td class="text-start">{{ index + 1 }}</td>
          <td class="text-start">{{ position.description }}</td>
          <td class="text-start">{{ position.quantity }}</td>
          <td class="text-end">{{ toEuro(position.price) }}</td>
          <td class="text-end">{{ toEuro(position.quantity * position.price) }}</td>
        </tr>

        <tr class="[&>*]:pt-1.5 [&>*]:pb-1 [&>*]:px-2 border-b-0">
          <td></td>
          <td></td>
          <td></td>
          <td class="text-end">USt.:</td>
          <td class="text-end">
            {{ (invoice.vatRate ?? 0) + '%' }}
          </td>
        </tr>

        <tr class="[&>*]:pt-0 [&>*]:px-2">
          <td></td>
          <td></td>
          <td></td>
          <td class="text-end">Gesamtbrutto:</td>
          <td class="text-end break-normal">
            {{ total }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="grid grid-cols-3 mt-auto w-full text-xxs text-gray-300">
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
import { formatDate } from '~/utils/date'
import { toEuro } from '~/utils/monetary'
import { ln2Br } from '~/utils/string'

const sender = (await useSender()).value!
const invoice = await useCurrentInvoice()

const senderFullAddress = computed(() => `${sender.name} - ${sender.addressLine} - ${sender.zipCode} - ${sender.city}`)
const recipientFullAddress = computed(() => {
  const recipient = invoice.value.recipient

  if (!recipient) return ''
  return `${recipient.name}<br />${recipient.addressLine}<br />${recipient.zipCode}, ${recipient.city}`
})

const invoiceText = computed(() => `RECHNUNG Nr. ${sender.runningInvoiceNumber.toString().padStart(4, '0')}`)
const dateText = computed(() => `Datum: ${formatDate(new Date())}`)
const total = computed(() => {
  if (invoice.value.positions.length === 0) {
    return toEuro(0)
  }

  const total = invoice.value.positions.map((position) => position.quantity * position.price).reduce((a, b) => a + b)
  return toEuro(total)
})
</script>
