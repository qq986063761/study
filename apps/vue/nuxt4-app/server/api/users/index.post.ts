import { defineEventHandler, readBody } from 'h3'
import { createUser } from '../../utils/user-store'
import { parseUserInput } from '../../utils/user-input'

export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event)
  const input = parseUserInput(body || {})
  const result = await createUser(input)

  return {
    user: result.data,
    storage: result.storage
  }
})
