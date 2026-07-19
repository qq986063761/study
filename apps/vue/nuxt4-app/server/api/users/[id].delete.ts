import { createError, defineEventHandler, getRouterParam } from 'h3'
import { deleteUser } from '../../utils/user-store'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: '缺少用户 ID'
    })
  }

  const result = await deleteUser(id)

  if (!result.data) {
    throw createError({
      statusCode: 404,
      statusMessage: '用户不存在'
    })
  }

  return {
    ok: true,
    storage: result.storage
  }
})
