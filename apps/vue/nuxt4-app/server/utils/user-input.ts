import { createError } from 'h3'
import type { UserInput, UserStatus } from './user-store'

export function parseUserInput(body: Record<string, unknown>): UserInput {
  const name = toText(body.name)
  const age = Number(body.age)
  const email = toText(body.email).toLowerCase()
  const status = parseStatus(body.status)

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: '姓名不能为空'
    })
  }

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: '邮箱不能为空'
    })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: '邮箱格式不正确'
    })
  }

  if (!Number.isInteger(age) || age < 0 || age > 150) {
    throw createError({
      statusCode: 400,
      statusMessage: '年龄必须是 0 到 150 之间的整数'
    })
  }

  return {
    name,
    age,
    email,
    status
  }
}

function parseStatus(value: unknown): UserStatus {
  return value === 'inactive' ? 'inactive' : 'active'
}

function toText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}
