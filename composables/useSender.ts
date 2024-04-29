import { objectToCamel } from 'ts-case-convert'
import type { Sender } from '~/server/types'
import type { Database } from '~/supabase/database.types'

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

  console.warn('FETCHING useSender')

  const { data: fetchedSender, error } = await supabase
    .from('sender')
    .select()
    .eq('user_id', user.value.id)
    .select()
    .single()

  if (error) {
    console.error(error)
    return sender
  }

  let logoPath = fetchedSender.logo_url

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

  sender.value = {
    ...objectToCamel(fetchedSender),
    logoUrl: logoPath,
  }

  if (
    (fetchedSender.footnotes === null || fetchedSender.footnotes.length === 0) &&
    fetchedSender.credit_institution &&
    fetchedSender.iban &&
    fetchedSender.bic
  ) {
    sender.value.footnotes = [
      `${fetchedSender.name}\n${fetchedSender.address_line}\n${fetchedSender.zip_code} ${fetchedSender.city}\n${user.value.email}
      `,
      `Kreditinstitut: ${fetchedSender.credit_institution}\nIBAN: ${prettifyIban(fetchedSender.iban)}\nBIC: ${
        fetchedSender.bic
      }`,
    ]
  }

  return sender
}
