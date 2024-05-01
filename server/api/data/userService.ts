import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { User } from '@supabase/auth-js/'
import { Database } from '~/supabase/database.types'
import type { H3Event } from 'h3'
import MailClient from '../mail/mailClient'
import { SenderAddress } from '~/server/types'

export default class UserService {
  private supabase: SupabaseClient<Database>
  private mailClient: MailClient

  constructor(event: H3Event) {
    this.supabase = serverSupabaseServiceRole<Database>(event)
    this.mailClient = new MailClient()
  }

  public async create({ name, email, address }: { name: string; email: string; address: SenderAddress }) {
    const randomPassword = this.generateRandomPassword()

    const user = await this.createUser(email, randomPassword)
    await this.createSender(user.id, name, address)
    await this.sendPasswordViaEmail(name, email, randomPassword)
  }

  private async createUser(email: string, password: string): Promise<User> {
    const { data: userCreateData, error: userCreateError } = await this.supabase.auth.admin.createUser({
      email,
      password: password,
      email_confirm: true,
    })

    if (userCreateError) {
      throw new Error(userCreateError.message)
    }

    return userCreateData.user
  }

  private async createSender(userId: string, name: string, address: SenderAddress): Promise<void> {
    const { error: senderCreateError } = await this.supabase.from('sender').insert({
      name,
      user_id: userId,
      address_line: address.addressLine,
      zip_code: address.zipCode,
      city: address.city,
      country: address.country,
    })

    if (senderCreateError) {
      throw new Error(senderCreateError.message)
    }
  }

  public async delete(userId: string): Promise<void> {
    const { data: fetchSenderData, error: fetchSenderError } = await this.supabase
      .from('sender')
      .select('id, name')
      .eq('user_id', userId)
      .single()

    if (fetchSenderError) {
      throw new Error(fetchSenderError.message)
    }

    const { error: deleteInvoicePositionsError } = await this.supabase
      .from('invoice_position')
      .delete()
      .eq('sender_id', fetchSenderData.id)

    if (deleteInvoicePositionsError) {
      throw new Error(deleteInvoicePositionsError.message)
    }

    const { error: deleteRecipientsError } = await this.supabase
      .from('recipient')
      .delete()
      .eq('sender_id', fetchSenderData.id)

    if (deleteRecipientsError) {
      throw new Error(deleteRecipientsError.message)
    }

    const { error: deleteSenderError } = await this.supabase.from('sender').delete().eq('id', fetchSenderData.id)

    if (deleteSenderError) {
      throw new Error(deleteSenderError.message)
    }

    const { data: deleteUserData, error: deleteUserError } = await this.supabase.auth.admin.deleteUser(userId)

    if (deleteUserError) {
      throw new Error(deleteUserError.message)
    }

    await this.mailClient.send({
      recipient: {
        name: fetchSenderData.name,
        email: deleteUserData.user.email!,
      },
      templateId: 2,
    })
  }

  private async sendPasswordViaEmail(name: string, email: string, password: string): Promise<void> {
    await this.mailClient.send({
      recipient: {
        name,
        email,
      },
      params: {
        PASSWORD: password,
      },
      templateId: 1,
    })
  }

  private generateRandomPassword(): string {
    return Math.random().toString(36).slice(2)
  }
}
