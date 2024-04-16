import type { Recipient } from '~/server/types'

export const useEditingRecipient = () => useState<Recipient | null>('editingRecipient', () => null)
