import type { InvoicePosition } from '@prisma/client'
import type { Database } from '~/server/data/models/database.types'

export async function useInvoicePositions(): Promise<Ref<InvoicePosition[]>> {
  const invoicePositions = useState<InvoicePosition[]>('invoicePositions', () => [])

  if (invoicePositions.value.length) {
    return invoicePositions
  }

  const supabase = useSupabaseClient<Database>()
  const sender = await useSender()

  if (!sender.value) {
    console.error('Sender not found')
    return invoicePositions
  }

  const { data: invoicePositionsData, error: invoicePositionsError } = await supabase
    .from('invoice_position')
    .select()
    .eq('sender_id', sender.value.id)

  if (invoicePositionsError) {
    console.error(invoicePositionsError)
    return invoicePositions
  }

  const fetchedInvoicePositions: InvoicePosition[] = invoicePositionsData.map((value) => ({
    id: value.id,
    description: value.description,
    price: value.price,
    vatRate: value.vat_rate,
    senderId: value.sender_id,
  }))

  invoicePositions.value = fetchedInvoicePositions

  return invoicePositions
}
