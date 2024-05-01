import { serverSupabaseUser } from '#supabase/server'
import UserService from '../data/userService'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw new Error('Cannot delete user, no user found')
  }

  const userService = new UserService(event)
  await userService.delete(user.id)
})
