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

  let logoPath = data[0].logo_url

  if (logoPath) {
    const { data: signedLogoUrlData, error: signedLogoUrlError } = await supabase.storage
      .from('pictures')
      .createSignedUrl(logoPath, 60 * 60 * 24)

    if (signedLogoUrlError) {
      console.error(signedLogoUrlError)
      return sender
    }

    logoPath = signedLogoUrlData.signedUrl
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
    runningInvoiceNumber: fetchedSender.running_invoice_number,
    logoUrl: logoPath,
  }

  sender.value = mappedSender

  return sender
}
