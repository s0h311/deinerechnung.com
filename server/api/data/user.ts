import { serverSupabaseServiceRole } from '#supabase/server'
import type { H3Event } from 'h3'
import Stripe from 'stripe'
import { Database } from '~/supabase/database.types'
import MailClient from '../mail/mailClient'

export async function createUser(
  event: H3Event,
  {
    name,
    email,
    address,
  }: {
    name: string
    email: string
    address: Stripe.Address
  }
): Promise<void> {
  const supabase = serverSupabaseServiceRole<Database>(event)

  const randomPassword = generateRandomPassword()

  const { data: userCreateData, error: userCreateError } = await supabase.auth.admin.createUser({
    email,
    password: randomPassword,
    email_confirm: true,
  })

  if (userCreateError) {
    console.error(userCreateError)
    return
  }

  const { data: senderCreateData, error: senderCreateError } = await supabase.from('sender').insert({
    name,
    user_id: userCreateData.user.id,
    address_line: address.line1,
    zip_code: address.postal_code,
    city: address.city,
    country: address.country,
  })

  if (senderCreateError) {
    console.error(senderCreateError)
  }

  const mailClient = new MailClient()
  await mailClient.send({
    recipient: {
      name,
      email,
    },
    params: {
      PASSWORD: randomPassword,
    },
    templateId: 1,
  })
}

function generateRandomPassword(): string {
  return Math.random().toString(36).slice(2)
}
