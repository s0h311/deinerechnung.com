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
    const apiKey = this.getApiKey()

    const body = JSON.stringify({
      to: [
        {
          name: recipient.name,
          email: recipient.email,
        },
      ],
      templateId,
      params: { ...params },
    })

    const { status, json } = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'post',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        contentType: 'application/json',
      },
      body,
    })

    const errorBody = await json()

    if (status > 399) {
      logger.error(errorBody, 'MailClient - send')

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
}
