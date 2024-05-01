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

    const { status, statusText, json } = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'post',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        contentType: 'application/json',
      },
      body,
    })

    if (status > 399) {
      console.error(statusText, json)
    }
  }

  private getApiKey(): string {
    if (process.env.BREVO_API_KEY === undefined) {
      throw new Error('brevo api key is missing')
    }

    return process.env.BREVO_API_KEY
  }
}
