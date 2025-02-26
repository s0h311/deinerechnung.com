import type { SupabaseClient } from '@supabase/supabase-js'
import type { User } from '@supabase/auth-js/'
import type { Database } from '~/supabase/database.types'
import MailClient from '../../infrastructure/mail/mailClient'
import type { Sender, SenderAddress } from '~/server/types'
import logger from '~/utils/logger'
import { objectToCamel } from 'ts-case-convert'
import useSupabaseAdmin from '../../infrastructure/supabase/useSupabaseAdmin'

export default class UserService {
  private supabase: SupabaseClient<Database>
  private mailClient: MailClient

  constructor() {
    this.supabase = useSupabaseAdmin()
    this.mailClient = new MailClient()
  }

  public async create({
    name,
    email,
    address,
  }: {
    name: string
    email: string
    address: SenderAddress
  }): Promise<Sender> {
    const randomPassword = this.generateRandomPassword()

    const user = await this.createUser(email, randomPassword)
    const sender = await this.createSender(user.id, name, address)
    await this.sendPasswordViaEmail(name, email, randomPassword)

    return sender
  }

  private async createUser(email: string, password: string): Promise<User> {
    const { data: userCreateData, error: userCreateError } = await this.supabase.auth.admin.createUser({
      email,
      password: password,
      email_confirm: true,
    })

    if (userCreateError) {
      throw logger.error(userCreateError.message, 'UserService - createUser', true)
    }

    return userCreateData.user
  }

  private async createSender(userId: string, name: string, address: SenderAddress): Promise<Sender> {
    const { data: senderCreateData, error: senderCreateError } = await this.supabase
      .from('sender')
      .insert({
        name,
        user_id: userId,
        address_line: address.addressLine,
        zip_code: address.zipCode,
        city: address.city,
        country: address.country,
      })
      .select()
      .single()

    if (senderCreateError) {
      throw logger.error(senderCreateError.message, 'UserService - createSender', true)
    }

    return objectToCamel(senderCreateData)
  }

  public async delete(userId: string): Promise<void> {
    const { data: fetchSenderData, error: fetchSenderError } = await this.supabase
      .from('sender')
      .select('id, name')
      .eq('user_id', userId)
      .single()

    if (fetchSenderError) {
      throw logger.error(fetchSenderError.message, 'UserService - delete', true)
    }

    const { error: deleteInvoicePositionsError } = await this.supabase
      .from('invoice_position')
      .delete()
      .eq('sender_id', fetchSenderData.id)

    if (deleteInvoicePositionsError) {
      throw logger.error(deleteInvoicePositionsError.message, 'UserService - delete', true)
    }

    const { error: deleteRecipientsError } = await this.supabase
      .from('recipient')
      .delete()
      .eq('sender_id', fetchSenderData.id)

    if (deleteRecipientsError) {
      throw logger.error(deleteRecipientsError.message, 'UserService - delete', true)
    }

    const { error: deleteSenderError } = await this.supabase.from('sender').delete().eq('id', fetchSenderData.id)

    if (deleteSenderError) {
      throw logger.error(deleteSenderError.message, 'UserService - delete', true)
    }

    const { data: deleteUserData, error: deleteUserError } = await this.supabase.auth.admin.deleteUser(userId)

    if (deleteUserError) {
      throw logger.error(deleteUserError.message, 'UserService - delete', true)
    }

    await this.mailClient.send({
      recipient: {
        name: fetchSenderData.name,
        email: deleteUserData.user.email!,
      },
      templateId: 2,
    })
  }

  public async getSenderFromEmail(email: string): Promise<number> {
    const { data, error } = await this.supabase.rpc('get_sender_id_from_user_email', { email })

    if (error) {
      throw logger.error('Unable to get sender id from user email', 'UserService - getSenderFromEmail', true)
    }

    return data
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
