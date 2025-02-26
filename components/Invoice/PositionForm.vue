<template>
  <div class="flex flex-col w-full border-opacity-50 gap-2">
    <span class="flex items-center gap-1">
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

      <UICta
        outline
        error
        small
        @handle-click="reset"
      >
        <IconDelete />
      </UICta>
    </span>

    <div class="divider my-6">oder hinzufügen</div>

    <form
      class="grid gap-7"
      @submit.prevent="submit(handleSubmit)"
    >
      <textarea
        v-model="fields.description"
        class="textarea textarea-bordered"
        placeholder="Beschreibung"
      />

      <p
        v-if="errors.description"
        class="text-red-400 -mt-6"
      >
        {{ errors.description }}
      </p>

      <div class="grid grid-cols-2 gap-3">
        <input
          v-model="fields.priceEuro"
          class="input input-bordered"
          type="number"
          :min="0"
          :max="100_000"
          :step="1"
          placeholder="Euro"
        />

        <input
          v-model="fields.priceCent"
          class="input input-bordered"
          type="number"
          :min="0"
          :max="99"
          :step="1"
          placeholder="Cent"
        />
      </div>

      <p
        v-if="errors.priceEuro || errors.priceCent"
        class="text-red-400 -mt-6"
      >
        {{ errors.priceEuro }} <br />
        {{ errors.priceCent }}
      </p>

      <input
        v-model="fields.quantity"
        class="input input-bordered"
        type="number"
        placeholder="Menge"
      />

      <p
        v-if="errors.quantity"
        class="text-red-400 -mt-6"
      >
        {{ errors.quantity }}
      </p>

      <UICta
        primary
        type="submit"
      >
        Hinzufügen
      </UICta>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/supabase/database.types'
import { objectToCamel } from 'ts-case-convert'
import type { InvoicePosition } from '~/server/types'
import { z } from 'zod'
import logger from '~/utils/logger'

const supabase = useSupabaseClient<Database>()
const sender = await useSender()
const invoicePositions = await useInvoicePositions()
const currentInvoice = await useCurrentInvoice()

const { fields, errors, reset, set, submit } = useForm({
  initialValue: {
    id: 0,
    description: '',
    priceEuro: null,
    priceCent: null,
    senderId: 0,
    quantity: null,
  },
  resolver: z.object({
    id: z.number(),
    description: z.string().min(1),
    priceEuro: z.number().gt(0),
    priceCent: z.number().gte(0).max(99),
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
    const centValue = selectedInvoicePosition.price / 100
    const priceEuro = ~~centValue
    const priceCent = Number(centValue.toFixed(2).toString().split('.').pop() ?? 0)

    set({
      ...selectedInvoicePosition,
      priceEuro,
      priceCent,
    })
  }
}

async function handleSubmit(
  fields: Omit<InvoicePosition, 'price'> & {
    quantity: number
    priceEuro: number
    priceCent: number
  }
): Promise<void> {
  if (!sender.value) {
    logger.error('Unable to create invoice position, sender is undefined or null', 'InvoicePositionForm - handleSubmit')
    return
  }

  let insertInvoicePositionData: InvoicePosition & { quantity: number } = {
    ...fields,
    price: toCents(fields.priceEuro, fields.priceCent),
  }

  if (fields.id === 0) {
    const { data, error: insertInvoicePositionError } = await supabase
      .from('invoice_position')
      .insert({
        description: fields.description,
        price: toCents(fields.priceEuro, fields.priceCent),
        sender_id: sender.value.id,
      })
      .select()
      .single()

    if (insertInvoicePositionError) {
      logger.error(insertInvoicePositionError.message, 'InvoicePositionForm - handleSubmit')
      return
    }

    insertInvoicePositionData = objectToCamel({ ...data, quantity: fields.quantity })
    invoicePositions.value.push(insertInvoicePositionData)
  }

  currentInvoice.value.positions.push(insertInvoicePositionData)

  reset()
}
</script>
