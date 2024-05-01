import { serverSupabaseServiceRole } from '#supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '~/supabase/database.types'
import type { H3Event } from 'h3'
import { SenderAddress, Subscription } from '~/server/types'
import logger from '~/utils/logger'

export default class SubscriptionService {
  private supabase: SupabaseClient<Database>

  constructor(event: H3Event) {
    this.supabase = serverSupabaseServiceRole<Database>(event)
  }

  public async create(senderId: number, subscriptionType: Subscription['type']): Promise<void> {
    const { error } = await this.supabase.from('subscription').insert({
      sender_id: senderId,
      type: subscriptionType,
    })

    if (error) {
      logger.error(error.message, 'SubscriptionService - create')

      throw createError({
        statusCode: 500,
        statusMessage: 'Unable to create subscription',
        data: {
          senderId,
        },
      })
    }
  }

  public async updateLastPayment(senderId: number, lastPaymentDate: Date): Promise<void> {
    const { error } = await this.supabase
      .from('subscription')
      .update({
        last_payment: lastPaymentDate.toDateString(),
      })
      .eq('sender_id', senderId)

    if (error) {
      logger.error(error.message, 'SubscriptionService - updateLastPayment')

      throw createError({
        statusCode: 500,
        statusMessage: 'Unable to update last payment for subscription',
        data: {
          senderId,
        },
      })
    }
  }

  public async delete(senderId: number): Promise<void> {
    const { error } = await this.supabase.from('subscription').delete().eq('sender_id', senderId)

    if (error) {
      logger.error(error.message, 'SubscriptionService - delete')

      throw createError({
        statusCode: 500,
        statusMessage: 'Unable to delete subscription',
        data: {
          senderId,
        },
      })
    }
  }
}
