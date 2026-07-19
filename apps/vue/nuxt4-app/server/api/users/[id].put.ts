import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { updateUser } from '../../utils/user-store'
import { parseUserInput } from '../../utils/user-input'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: '缺少用户 ID'
    })
  }

  const body = await readBody<Record<string, unknown>>(event)
  const input = parseUserInput(body || {})
  const result = await updateUser(id, input)

  if (!result.data) {
    throw createError({
      statusCode: 404,
      statusMessage: '用户不存在'
    })
  }

  return {
    user: result.data,
    storage: result.storage
  }
})
