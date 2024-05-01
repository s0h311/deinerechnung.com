import { objectToCamel } from 'ts-case-convert'
import type { InvoicePosition } from '~/server/types'
import type { Database } from '~/supabase/database.types'
import logger from '~/utils/logger'

export async function useInvoicePositions(): Promise<Ref<InvoicePosition[]>> {
  const invoicePositions = useState<InvoicePosition[]>('invoicePositions', () => [])

  if (invoicePositions.value.length) {
    return invoicePositions
  }

  const supabase = useSupabaseClient<Database>()
  const sender = await useSender()

  if (!sender.value) {
    logger.error('Unable to find sender', 'useInvoicePositions')
    return invoicePositions
  }

  logger.warn('FETCHING', 'useInvoicePositions')

  const { data: invoicePositionsData, error: invoicePositionsError } = await supabase
    .from('invoice_position')
    .select()
    .eq('sender_id', sender.value.id)

  if (invoicePositionsError) {
    logger.error(invoicePositionsError.message, 'useInvoicePositions')
    return invoicePositions
  }

  const fetchedInvoicePositions: InvoicePosition[] = invoicePositionsData.map(objectToCamel)

  invoicePositions.value = fetchedInvoicePositions

  return invoicePositions
}
