<template>
  <div class="flex gap-10 w-full h-full">
    <div class="flex flex-col gap-7 pr-10 border-r h-full">
      <select class="select select-bordered w-full max-w-xs">
        <option
          disabled
          selected
        >
          Kunde auswählen
        </option>

        <option
          v-for="recipient in recipients"
          :key="recipient.id"
        >
          {{ recipient.name }}
        </option>
      </select>

      <div class="divider"></div>

      <div class="flex flex-col w-full border-opacity-50">
        <select class="select select-bordered w-full max-w-xs">
          <option
            disabled
            selected
          >
            Position wählen
          </option>

          <option
            v-for="invoicePosition in invoicePositions"
            :key="invoicePosition.id"
          >
            {{ invoicePosition.description }}
          </option>
        </select>

        <div class="divider my-8">oder hinzufügen</div>

        <div class="flex flex-col gap-7">
          <textarea
            class="textarea textarea-bordered"
            placeholder="Beschreibung"
            v-model="invoicePosition.description"
          ></textarea>

          <input
            type="number"
            placeholder="Einzelpreis"
            class="input input-bordered"
            v-model="invoicePosition.price"
          />

          <input
            type="number"
            placeholder="Menge"
            class="input input-bordered"
            v-model="quantity"
          />

          <input
            type="number"
            placeholder="Umsatzsteuer"
            class="input input-bordered"
            v-model="invoicePosition.vatRate"
          />

          <button
            class="btn btn-neutral"
            @click="handleSubmit"
          >
            Hinzufügen
          </button>
        </div>
      </div>
    </div>

    <InvoicePreview />
  </div>
</template>

<script setup lang="ts">
import type { InvoicePosition } from '@prisma/client'
import type { Database } from '~/server/data/models/database.types'

definePageMeta({
  layout: 'dashboard-grid',
  middleware: ['auth'],
})

const invoicePosition = reactive<Partial<InvoicePosition>>({
  description: '',
  price: undefined,
  vatRate: undefined,
})

const quantity = ref<number | null>(null)

const recipients = await useRecipients()
const supabase = useSupabaseClient<Database>()
const sender = await useSender()
const invoicePositions = await useInvoicePositions()

async function handleSubmit(): Promise<void> {
  if (
    !invoicePosition.description ||
    !invoicePosition.price ||
    !invoicePosition.vatRate ||
    !quantity.value ||
    !sender.value
  ) {
    return
  }

  const { data: insertInvoicePositionData, error: insertInvoicePositionError } = await supabase
    .from('invoice_position')
    .insert({
      description: invoicePosition.description,
      price: invoicePosition.price,
      vat_rate: invoicePosition.vatRate,
      sender_id: sender.value.id,
    })
    .select()
    .single()

  if (insertInvoicePositionError) {
    console.error(insertInvoicePositionError)
    return
  }

  invoicePositions.value.push(mapInvoicePosition(insertInvoicePositionData))
}

function mapInvoicePosition(dbInvoicePosition: any): InvoicePosition {
  return {
    id: dbInvoicePosition.id,
    description: dbInvoicePosition.description,
    price: dbInvoicePosition.price,
    vatRate: dbInvoicePosition.vat_rate,
    senderId: dbInvoicePosition.sender_id,
  }
}
</script>
