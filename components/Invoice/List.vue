<template>
  <table>
    <thead>
      <tr>
        <th>Rechnung</th>
        <th>Datum</th>
        <th>Aktionen</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="invoice in invoices"
        :key="invoice.name"
      >
        <td>{{ formatInvoiceName(invoice.name) }}</td>
        <td>{{ formatDate(invoice.updatedAt) }}</td>

        <div class="flex items-center gap-2">
          <UICta
            outline
            secondary
            small
            @handle-click="handleDelete(invoice.name)"
          >
            anzeigen
          </UICta>

          <UICta
            outline
            error
            small
            @handle-click="handleDelete(invoice.name)"
          >
            <IconDelete />
          </UICta>
        </div>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { objectToCamel } from 'ts-case-convert'
import type { Database } from '~/supabase/database.types'

const supabase = useSupabaseClient<Database>()
const sender = (await useSender()).value!

const invoices = ref<{ name: string; updatedAt: Date }[]>([])

onMounted(async () => {
  await fetchInvoices()
})

async function fetchInvoices() {
  const userId = sender.userId
  const { data: invoicesData, error: invoicesError } = await supabase.storage.from('invoice').list(userId, {
    sortBy: {
      column: 'updated_at',
      order: 'desc',
    },
  })

  if (invoicesError) {
    console.error(invoicesError)
    return []
  }

  invoices.value = invoicesData.map(objectToCamel).map((invoice) => {
    return {
      name: invoice.name,
      updatedAt: new Date(invoice.updatedAt),
    }
  })
}

async function handleOpenInvoice(invoiceName: string): Promise<void> {
  const invoicePath = sender.userId + '/' + invoiceName

  const { data: signedLogoUrlData, error: signedLogoUrlError } = await supabase.storage
    .from('invoice')
    .createSignedUrl(invoicePath, 60 * 60 * 24)

  if (signedLogoUrlError) {
    console.error(signedLogoUrlError)
    return
  }

  const url = signedLogoUrlData.signedUrl

  navigateTo(url, {
    open: {
      target: '_blank',
    },
  })
}

async function handleDelete(invoiceName: string): Promise<void> {
  const invoicePath = sender.userId + '/' + invoiceName

  const { error } = await supabase.storage.from('invoice').remove([invoicePath])

  if (error) {
    console.error(error)
    return
  }

  invoices.value = invoices.value.filter((invoice) => invoice.name !== invoiceName)
}

function formatInvoiceName(name: string): string {
  return name.split('-')[0]
}
</script>
