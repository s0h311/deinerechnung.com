import MailClient from './mail/mailClient'

export default defineEventHandler(async (event): Promise<void> => {
  const mailClient = new MailClient()

  await mailClient.send({
    recipient: {
      name: 'soleil',
      email: 'soheilnazari10@gmail.com',
    },
    templateId: 1,
    params: {
      PASSWORD: 'moin111',
    },
  })
})
