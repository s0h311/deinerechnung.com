import { objectToCamel } from 'ts-case-convert'
import type { Sender } from '~/server/types'
import type { Database } from '~/supabase/database.types'
import logger from '~/utils/logger'

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

  logger.warn('FETCHING', 'useSender')

  const { data: fetchedSender, error } = await supabase
    .from('sender')
    .select()
    .eq('user_id', user.value.id)
    .select()
    .single()

  if (error) {
    logger.error(error.message, 'useSender')
    return sender
  }

  let logoPath = fetchedSender.logo_url

  if (logoPath) {
    const { data: signedLogoUrlData, error: signedLogoUrlError } = await supabase.storage
      .from('pictures')
      .createSignedUrl(logoPath, 60 * 60 * 24)

    if (signedLogoUrlError) {
      logger.error(signedLogoUrlError.message, 'useSender')
      return sender
    }

    logoPath = signedLogoUrlData.signedUrl
  }

  sender.value = {
    ...objectToCamel(fetchedSender),
    logoUrl: logoPath,
  }

  const isFootnotesEmpty = fetchedSender.footnotes === null || fetchedSender.footnotes.length === 0

  if (isFootnotesEmpty) {
    sender.value.footnotes = [
      `${fetchedSender.name}\n${fetchedSender.address_line}\n${fetchedSender.zip_code} ${fetchedSender.city}\n${user.value.email}`,
    ]
  }

  if (isFootnotesEmpty && fetchedSender.credit_institution && fetchedSender.iban && fetchedSender.bic) {
    sender.value.footnotes!.push(
      `Kreditinstitut: ${fetchedSender.credit_institution}\nIBAN: ${prettifyIban(fetchedSender.iban)}\nBIC: ${
        fetchedSender.bic
      }`
    )
  }

  return sender
}
