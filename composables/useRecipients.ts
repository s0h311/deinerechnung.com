import type { Recipient } from '@prisma/client'
import { objectToCamel } from 'ts-case-convert'
import type { Database } from '~/server/data/models/database.types'

export async function useRecipients(): Promise<Ref<Recipient[]>> {
  const recipients = useState<Recipient[]>('recipients', () => [])

  if (recipients.value.length) {
    return recipients
  }

  const supabase = useSupabaseClient<Database>()
  const sender = await useSender()

  if (!sender || !sender.value) {
    console.error('Sender not found')
    return recipients
  }

  console.warn('FETCHING useRecipients')

  const { data: recipientData, error: recipientError } = await supabase
    .from('recipient')
    .select()
    .eq('sender_id', sender.value.id)

  if (recipientError) {
    console.error(recipientError)
    return recipients
  }

  const fetchedRecipients: Recipient[] = recipientData.map(objectToCamel)

  recipients.value = fetchedRecipients

  return recipients
}
