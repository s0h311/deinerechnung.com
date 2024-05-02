import logger from '~/utils/logger'

type MailContent = {
  recipient: {
    name: string
    email: string
  }
  params?: Record<string, string>
  templateId: number
}

export default class MailClient {
  public async send({ recipient, params, templateId }: MailContent): Promise<void> {
    if (!this.shouldSendEmail()) {
      return
    }

    const apiKey = this.getApiKey()

    const body: Record<string, any> = {
      to: [
        {
          name: recipient.name,
          email: recipient.email,
        },
      ],
      templateId,
    }

    if (params) {
      body['params'] = params
    }

    const { status, statusText } = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'post',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        contentType: 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (status > 399) {
      logger.error(statusText, 'MailClient - send')

      throw createError({
        statusCode: 500,
        statusMessage: 'Unable to send email',
      })
    }
  }

  private getApiKey(): string {
    if (process.env.BREVO_API_KEY === undefined) {
      logger.error('brevo api key is missing', 'MailClient - getApiKey')

      throw createError({
        statusCode: 500,
        statusMessage: 'Unable to send email',
      })
    }

    return process.env.BREVO_API_KEY
  }

  private shouldSendEmail(): boolean {
    if (process.env.SEND_EMAILS === 'false') {
      logger.warn('Skipping email', 'MailClient - shouldSendEmail')
      return false
    }

    return true
  }
}
