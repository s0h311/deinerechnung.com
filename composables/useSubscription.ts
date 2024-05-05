import { objectToCamel } from 'ts-case-convert'
import type { Subscription } from '~/server/types'
import type { Database } from '~/supabase/database.types'
import logger from '~/utils/logger'

export async function useSubscription(): Promise<Ref<Subscription | null>> {
  const subscription = useState<Subscription | null>('subscription', () => null)

  if (subscription.value) {
    return subscription
  }

  const supabase = useSupabaseClient<Database>()
  const sender = await useSender()

  if (!sender.value) {
    return subscription
  }

  logger.warn('FETCHING', 'useSubscription')

  const { data: fetchedSubscription, error } = await supabase
    .from('subscription')
    .select()
    .eq('sender_id', sender.value.id)
    .single()

  if (error) {
    logger.error(error.message, 'useSubscription')
    return subscription
  }

  subscription.value = objectToCamel(fetchedSubscription)

  return subscription
}
