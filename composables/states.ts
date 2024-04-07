import type { InvoicePosition, Recipient } from '@prisma/client'

export const useEditingRecipient = () => useState<Recipient | null>('editingRecipient', () => null)

export async function useCurrentRecipient(): Promise<Ref<Recipient | null>> {
  const currentRecipient = useState<Recipient | null>('currentRecipient', () => null)

  const recipients = await useRecipients()

  if (recipients.value.length === 1) {
    currentRecipient.value = recipients.value[0]
  }

  return currentRecipient
}

export const useCurrentInvoidePositions = () =>
  useState<(InvoicePosition & { quantity: number })[]>('currentInvoicePositions', () => [])
