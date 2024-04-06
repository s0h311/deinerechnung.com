import type { Sender } from '@prisma/client'
import type { RefSymbol } from '@vue/reactivity'
import type { Database } from '~/server/data/models/database.types'

export async function useSender(): Promise<Ref<Sender | null>> {
  const sender = useState<Sender | null>('sender', () => null)

  if (sender.value) {
    return sender
  }

  const user = useSupabaseUser()

  if (!user.value) {
    return sender
  }

  const supabase = useSupabaseClient<Database>()

  const { data, error } = await supabase.from('sender').select().eq('user_id', user.value.id)

  if (error) {
    console.error(error)
    return sender
  }

  const fetchedSender = data[0]

  const mappedSender: Sender = {
    id: fetchedSender.id,
    userId: fetchedSender.user_id,
    name: fetchedSender.name,
    addressLine: fetchedSender.address_line,
    zipCode: fetchedSender.zip_code,
    city: fetchedSender.city,
    country: fetchedSender.country,
    footNote: fetchedSender.foot_note ?? [],
    logoUrl: fetchedSender.logo_url,
  }

  sender.value = mappedSender

  return sender
}
