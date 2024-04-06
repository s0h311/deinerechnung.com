<template>
  <div class="flex flex-col gap-7">
    <textarea
      class="textarea textarea-bordered"
      placeholder="Beschreibung"
      v-model="invoicePosition.description"
    ></textarea>

    <input
      class="input input-bordered"
      v-model="invoicePosition.price"
      type="number"
      :min="0.0"
      :max="100_000.0"
      :step="0.01"
      placeholder="Einzelpreis"
    />

    <input
      class="input input-bordered"
      v-model="quantity"
      type="number"
      placeholder="Menge"
    />

    <input
      class="input input-bordered"
      v-model="invoicePosition.vatRate"
      type="number"
      placeholder="Umsatzsteuer"
    />

    <button
      class="btn btn-primary"
      @click="handleSubmit"
    >
      Hinzufügen
    </button>
  </div>
</template>

<script setup lang="ts">
import type { InvoicePosition } from '@prisma/client'
import type { Database } from '~/server/data/models/database.types'

const supabase = useSupabaseClient<Database>()
const sender = await useSender()
const invoicePositions = await useInvoicePositions()

const invoicePosition = reactive<Partial<InvoicePosition>>({
  description: '',
  price: undefined,
  vatRate: undefined,
})

const quantity = ref<number | null>(null)

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
