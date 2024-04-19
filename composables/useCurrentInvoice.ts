import type { InvoicePosition, Recipient } from '~/server/types'

type InvoiceState = {
  recipient: Recipient | null
  positions: (InvoicePosition & { quantity: number })[]
  vatRate: number | null
}

export async function useCurrentInvoice(): Promise<Ref<InvoiceState>> {
  const currentInvoice = useState<InvoiceState>('currentInvoice', () => ({
    recipient: null,
    positions: [],
    vatRate: null,
  }))

  const recipients = await useRecipients()

  if (recipients.value.length === 1) {
    currentInvoice.value.recipient = recipients.value[0]
  }

  return currentInvoice
}

export const resetInvoice = () => clearNuxtState('currentInvoice')
