<template>
  <table>
    <thead>
      <tr>
        <th>Nummer</th>
        <th>Beschreibung</th>
        <th>Preis</th>
        <th>Aktionen</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="(invoicePosition, index) in invoicePositions"
        :key="invoicePosition.id"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ invoicePosition.description }}</td>
        <td>{{ toEuro(invoicePosition.price) }}</td>

        <td>
          <UICta
            small
            outline
            error
            @handle-click="handleDelete(invoicePosition.id)"
          >
            <IconDelete />
          </UICta>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { InvoicePosition } from '~/server/types'
import type { Database } from '~/supabase/database.types'

definePageMeta({
  layout: 'dashboard-grid',
  middleware: ['auth'],
})

useSeoMeta({
  title: 'Positionen',
})

const supabase = useSupabaseClient<Database>()
const invoicePositions = await useInvoicePositions()

async function handleDelete(invoicePositionId: InvoicePosition['id']): Promise<void> {
  const { error } = await supabase.from('invoice_position').delete().eq('id', invoicePositionId)

  if (error) {
    console.error(error)
    return
  }

  invoicePositions.value = invoicePositions.value.filter((invoicePosition) => invoicePosition.id !== invoicePositionId)
}
</script>
