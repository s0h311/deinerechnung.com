import type { Recipient } from '@prisma/client'
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

  const { data: recipientData, error: recipientError } = await supabase
    .from('recipient')
    .select()
    .eq('sender_id', sender.value.id)

  if (recipientError) {
    console.error(recipientError)
    return recipients
  }

  const fetchedRecipients: Recipient[] = recipientData.map((value) => ({
    ...value,
    addressLine: value.address_line,
    senderId: value.sender_id,
    zipCode: value.zip_code,
  }))

  recipients.value = fetchedRecipients

  return recipients
}
