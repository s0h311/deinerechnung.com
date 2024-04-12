import type { InvoicePosition, Recipient } from '@prisma/client'

export const useEditingRecipient = () => useState<Recipient | null>('editingRecipient', () => null)

type InvoiceState = {
  recipient: Recipient | null
  positions: (InvoicePosition & { quantity: number })[]
  vatRate: number
}

export async function useCurrentInvoice(): Promise<Ref<InvoiceState>> {
  const currentInvoice = useState<InvoiceState>('currentInvoice', () => ({
    recipient: null,
    positions: [],
    vatRate: 0,
  }))

  const recipients = await useRecipients()

  if (recipients.value.length === 1) {
    currentInvoice.value.recipient = recipients.value[0]
  }

  return currentInvoice
}

export const resetInvoice = () => clearNuxtState('currentInvoice')
