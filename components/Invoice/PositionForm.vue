<template>
  <div class="flex flex-col w-full border-opacity-50">
    <select
      class="select select-bordered w-full max-w-xs"
      @change="handleInvoicePositionChange"
    >
      <option
        disabled
        selected
      >
        Position auswählen
      </option>

      <option
        v-for="invoicePosition in invoicePositions"
        :key="invoicePosition.id"
        :vlaue="invoicePosition.id"
      >
        {{ invoicePosition.description }} {{ invoicePosition.price }} €
      </option>
    </select>

    <div class="divider my-8">oder hinzufügen</div>

    <form
      class="grid gap-7"
      @submit.prevent="handleSubmit"
    >
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
        v-model="invoicePosition.quantity"
        type="number"
        placeholder="Menge"
      />

      <button
        class="btn btn-primary"
        type="submit"
      >
        Hinzufügen
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { InvoicePosition } from '@prisma/client'
import type { Database } from '~/server/data/models/database.types'
import { objectToCamel } from 'ts-case-convert'
import { useCurrentInvoice } from '~/composables/states'

const supabase = useSupabaseClient<Database>()
const sender = await useSender()
const invoicePositions = await useInvoicePositions()
const currentInvoice = await useCurrentInvoice()

const invoicePosition = reactive<InvoicePosition & { quantity: number }>({
  id: 0,
  description: '',
  price: 0,
  senderId: 0,
  quantity: 0,
})

function handleInvoicePositionChange(event: Event): void {
  const select = event.target as HTMLSelectElement
  const selectedInvoicePositionId = Number(select.value)

  const selectedInvoicePosition = invoicePositions.value.find(
    (currentInvoicePosition) => currentInvoicePosition.id === selectedInvoicePositionId
  )

  if (selectedInvoicePosition) {
    invoicePosition.id = selectedInvoicePosition.id
    invoicePosition.description = selectedInvoicePosition.description
    invoicePosition.price = selectedInvoicePosition.price
  }
}

async function handleSubmit(): Promise<void> {
  if (!invoicePosition.description || !invoicePosition.price || !invoicePosition.quantity || !sender.value) {
    console.error('Something went wrong')
    return
  }

  let insertInvoicePositionData: InvoicePosition & { quantity: number } = invoicePosition

  if (invoicePosition.id === 0) {
    const { data, error: insertInvoicePositionError } = await supabase
      .from('invoice_position')
      .insert({
        description: invoicePosition.description,
        price: invoicePosition.price,
        sender_id: sender.value.id,
      })
      .select()
      .single()

    if (insertInvoicePositionError) {
      console.error(insertInvoicePositionError)
      return
    }

    insertInvoicePositionData = objectToCamel({ ...data, quantity: invoicePosition.quantity })
  }

  currentInvoice.value.positions.push(insertInvoicePositionData)
  invoicePositions.value.push(insertInvoicePositionData)

  resetForm()
}

function resetForm(): void {
  invoicePosition.description = ''
  invoicePosition.price = 0
  invoicePosition.quantity = 0
}
</script>
