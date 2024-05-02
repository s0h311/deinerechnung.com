import { serverSupabaseUser } from '#supabase/server'
import logger from '~/utils/logger'
import UserService from '../../dataDomain/services/userService'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)

  if (!user) {
    logger.error('Unable to delete user, no user found', 'Account Delete API')
    throw createError({
      statusCode: 400,
      statusMessage: 'No user found',
    })
  }

  const userService = new UserService()
  await userService.delete(user.id)
})
