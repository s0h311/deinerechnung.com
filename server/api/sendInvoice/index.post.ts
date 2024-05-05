import { z } from 'zod'
import MailClient, { type MailData } from '~/server/infrastructure/mail/mailClient'

export default defineEventHandler(async (event) => {
  const sendInvoiceMailData = await readValidatedBody(event, (body) => parseSendInvoiceMailData(body))

  const mailData: MailData = {
    recipient: sendInvoiceMailData.recipient,
    params: {
      SENDERNAME: sendInvoiceMailData.senderName,
    },
    attachments: [sendInvoiceMailData.invoice],
    templateId: 6,
  }

  const mailClient = new MailClient()
  await mailClient.send(mailData)
})

function parseSendInvoiceMailData(sendInvoiceMailData: unknown) {
  return z
    .object({
      senderName: z.string().min(1),
      recipient: z.object({
        name: z.string().min(1),
        email: z.string().email(),
      }),
      invoice: z.object({
        name: z.string().min(1),
        url: z.string().url(),
      }),
    })
    .parse(sendInvoiceMailData)
}
