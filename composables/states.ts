import type { Recipient } from '@prisma/client'

export const useEditingRecipient = () => useState<Recipient | null>('editingRecipient', () => null)
