import { defineEventHandler, getQuery } from 'h3'
import { listUsers } from '../../utils/user-store'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = typeof query.q === 'string' ? query.q : ''
  const result = await listUsers(search)

  return {
    users: result.data,
    storage: result.storage
  }
})
