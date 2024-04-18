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
        :value="invoicePosition.id"
      >
        {{ invoicePosition.description }} {{ toEuro(invoicePosition.price) }}
      </option>
    </select>

    <div class="divider my-8">oder hinzufügen</div>

    <form
      class="grid gap-7"
      @submit.prevent="submit(handleSubmit)"
    >
      <textarea
        class="textarea textarea-bordered"
        placeholder="Beschreibung"
        v-model="fields.description"
      ></textarea>

      <p
        v-if="errors.description"
        class="text-red-400 -mt-6"
      >
        {{ errors.description }}
      </p>

      <input
        class="input input-bordered"
        v-model="fields.price"
        type="number"
        :min="0.0"
        :max="100_000.0"
        :step="0.01"
        placeholder="Einzelpreis"
      />

      <p
        v-if="errors.price"
        class="text-red-400 -mt-6"
      >
        {{ errors.price }}
      </p>

      <input
        class="input input-bordered"
        v-model="fields.quantity"
        type="number"
        placeholder="Menge"
      />

      <p
        v-if="errors.quantity"
        class="text-red-400 -mt-6"
      >
        {{ errors.quantity }}
      </p>

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
import type { Database } from '~/supabase/database.types'
import { objectToCamel } from 'ts-case-convert'
import type { InvoicePosition } from '~/server/types'
import { z } from 'zod'

const supabase = useSupabaseClient<Database>()
const sender = await useSender()
const invoicePositions = await useInvoicePositions()
const currentInvoice = await useCurrentInvoice()

const { fields, errors, reset, set, submit } = useForm({
  initialValue: {
    id: 0,
    description: '',
    price: null,
    senderId: 0,
    quantity: null,
  },
  resolver: z.object({
    id: z.number(),
    description: z.string().min(1),
    price: z.number().gt(0),
    senderId: z.number(),
    quantity: z.number().gt(0),
  }),
})

function handleInvoicePositionChange(event: Event): void {
  const select = event.target as HTMLSelectElement
  const selectedInvoicePositionId = Number(select.value)

  const selectedInvoicePosition = invoicePositions.value.find(
    (currentInvoicePosition) => currentInvoicePosition.id === selectedInvoicePositionId
  )

  if (selectedInvoicePosition) {
    set(selectedInvoicePosition)
  }
}

async function handleSubmit(fields: InvoicePosition & { quantity: number }): Promise<void> {
  if (!sender.value) {
    console.error('Could not create invoice position, sender is undefined or null')
    return
  }

  let insertInvoicePositionData = fields

  if (fields.id === 0) {
    const { data, error: insertInvoicePositionError } = await supabase
      .from('invoice_position')
      .insert({
        description: fields.description,
        price: toCents(fields.price),
        sender_id: sender.value.id,
      })
      .select()
      .single()

    if (insertInvoicePositionError) {
      console.error(insertInvoicePositionError)
      return
    }

    insertInvoicePositionData = objectToCamel({ ...data, quantity: fields.quantity })
    invoicePositions.value.push(insertInvoicePositionData)
  }

  currentInvoice.value.positions.push(insertInvoicePositionData)

  reset()
}
</script>
