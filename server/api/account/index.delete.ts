import { serverSupabaseUser } from '#supabase/server'
import logger from '~/utils/logger'
import UserService from '../../dataLayer/services/userService'

export default defineEventHandler(async (event): Promise<void> => {
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw logger.error('Unable to delete user, no user found', 'Account Delete API', true)
  }

  const userService = new UserService()
  await userService.delete(user.id)
})
