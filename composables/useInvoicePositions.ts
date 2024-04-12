import { objectToCamel } from 'ts-case-convert'
import type { InvoicePosition } from '~/server/types'
import type { Database } from '~/supabase/database.types'

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

  console.warn('FETCHING useInvoicePositions')

  const { data: invoicePositionsData, error: invoicePositionsError } = await supabase
    .from('invoice_position')
    .select()
    .eq('sender_id', sender.value.id)

  if (invoicePositionsError) {
    console.error(invoicePositionsError)
    return invoicePositions
  }

  const fetchedInvoicePositions: InvoicePosition[] = invoicePositionsData.map(objectToCamel)

  invoicePositions.value = fetchedInvoicePositions

  return invoicePositions
}
