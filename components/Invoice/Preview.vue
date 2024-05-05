<template>
  <div
    id="invoiceDocument"
    class="h-full desktop:h-[calc(100%-45px)] aspect-[210/297] p-8 pb-4 ring-2 ring-neutral rounded-lg text-[10px] leading-3 flex flex-col text-black font-[Helvetica]"
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
      <p v-html="recipientFullAddress" />
    </div>

    <div class="flex items-center justify-between mb-5">
      <p class="font-bold text-xs">{{ invoiceText }}</p>
      <p>{{ dateText }}</p>
    </div>

    <div class="mb-10 flex max-w-[300px] items-center gap-2">
      <p>
        Bitte überweisen Sie den Betrag zeitnah an das Konto in der Fußzeile.
        {{ sender.iban ? 'Einfach den QR-Code in Ihrer Onlinebanking App scannen.' : '' }}
      </p>

      <InvoiceQRCode v-if="sender.iban" />
    </div>

    <table
      v-if="invoice.positions.length > 0"
      class="text-[10px] w-full"
    >
      <thead>
        <tr class="[&>*]:px-2 border-b">
          <th>Pos</th>
          <th>Beschreibung</th>
          <th>Menge</th>
          <th class="text-end">Einzelpreis</th>
          <th class="text-end">Gesamtpreis</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(position, index) in invoice.positions"
          :key="'position' + index"
          class="[&>*]:px-2 border-b pb-4"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ position.description }}</td>
          <td>{{ position.quantity }}</td>
          <td class="text-end">{{ toEuro(position.price) }}</td>
          <td class="text-end">{{ toEuro(position.quantity * position.price) }}</td>
        </tr>

        <tr class="[&>*]:pb-1 [&>*]:px-2 border-b-0">
          <td />
          <td />
          <td />
          <td class="text-end">Gesamtnetto:</td>
          <td class="text-end break-normal">
            {{ toEuro(netTotal) }}
          </td>
        </tr>

        <tr class="[&>*]:pt-0 [&>*]:px-2 border-b-0">
          <td />
          <td />
          <td />
          <td class="text-end">USt.:</td>
          <td class="text-end">
            {{ (invoice.vatRate ?? 0) + '%' }}
          </td>
        </tr>

        <tr class="[&>*]:pt-0 [&>*]:px-2">
          <td />
          <td />
          <td />
          <td class="text-end">Gesamtbrutto:</td>
          <td class="text-end break-normal">
            {{ toEuro(grossTotal) }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="grid grid-cols-3 mt-auto w-full text-xxs text-gray-300">
      <div
        v-for="(column, index) in sender.footnotes"
        :key="'column' + index"
        :class="index === 1 ? 'text-center' : index === 2 ? 'text-end' : ''"
        v-html="ln2Br(column)"
      />
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

const netTotal = computed(() => {
  if (invoice.value.positions.length === 0) {
    return 0
  }

  return invoice.value.positions.map((position) => position.quantity * position.price).reduce((a, b) => a + b)
})

const grossTotal = computed(() => {
  const vatPrecentage = (invoice.value.vatRate ?? 0) / 100
  return netTotal.value * (1 + vatPrecentage)
})
</script>
