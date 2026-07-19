import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import mongoose, { Schema } from 'mongoose'

export type UserStatus = 'active' | 'inactive'

export type UserInput = {
  name: string
  age: number
  email: string
  status: UserStatus
}

export type UserRecord = UserInput & {
  id: string
}

export type StorageInfo = {
  driver: 'mongodb' | 'json'
  error?: string
}

type StoreResult<T> = {
  data: T
  storage: StorageInfo
}

type MongoUserDocument = Record<string, unknown> & {
  _id: { toString: () => string }
}

const jsonDataFile = join(process.cwd(), '.data', 'users.json')
const mongoRetryAfterMs = 5000

let mongoConnectionPromise: Promise<typeof mongoose> | null = null
let lastMongoError: { message: string; at: number } | null = null

const userSchema = new Schema(
  {
    name: { type: String, trim: true, default: '' },
    age: { type: Number, min: 0, default: 0 },
    email: { type: String, trim: true, lowercase: true, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  {
    collection: 'users',
    strict: true,
    timestamps: false,
    versionKey: false
  }
)

const UserModel = mongoose.models.UsersCollectionDemo || mongoose.model('UsersCollectionDemo', userSchema)

export async function listUsers(search = ''): Promise<StoreResult<UserRecord[]>> {
  return runWithFallback(
    async () => {
      const query = buildMongoSearch(search)
      const docs = await UserModel.find(query).sort({ _id: -1 }).lean()
      return docs.map((doc) => normalizeMongoUser(doc as MongoUserDocument))
    },
    async () => {
      const users = await readJsonUsers()
      return filterJsonUsers(users, search)
    }
  )
}

export async function createUser(input: UserInput): Promise<StoreResult<UserRecord>> {
  return runWithFallback(
    async () => {
      const doc = await UserModel.create(input)
      return normalizeMongoUser(doc.toObject() as MongoUserDocument)
    },
    async () => {
      const users = await readJsonUsers()
      const user: UserRecord = {
        id: randomUUID(),
        ...input
      }

      users.unshift(user)
      await writeJsonUsers(users)
      return user
    }
  )
}

export async function updateUser(id: string, input: UserInput): Promise<StoreResult<UserRecord | null>> {
  return runWithFallback(
    async () => {
      const doc = await UserModel.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true
      }).lean()

      return doc ? normalizeMongoUser(doc as MongoUserDocument) : null
    },
    async () => {
      const users = await readJsonUsers()
      const index = users.findIndex((user) => user.id === id)

      if (index === -1) {
        return null
      }

      const updated: UserRecord = {
        ...users[index],
        ...input
      }

      users.splice(index, 1, updated)
      await writeJsonUsers(users)
      return updated
    }
  )
}

export async function deleteUser(id: string): Promise<StoreResult<boolean>> {
  return runWithFallback(
    async () => {
      const doc = await UserModel.findByIdAndDelete(id).lean()
      return Boolean(doc)
    },
    async () => {
      const users = await readJsonUsers()
      const nextUsers = users.filter((user) => user.id !== id)

      if (nextUsers.length === users.length) {
        return false
      }

      await writeJsonUsers(nextUsers)
      return true
    }
  )
}

async function runWithFallback<T>(
  mongoOperation: () => Promise<T>,
  jsonOperation: () => Promise<T>
): Promise<StoreResult<T>> {
  try {
    await connectMongo()
    const data = await mongoOperation()
    return {
      data,
      storage: { driver: 'mongodb' }
    }
  } catch (error) {
    const message = getErrorMessage(error)
    const data = await jsonOperation()

    return {
      data,
      storage: {
        driver: 'json',
        error: `MongoDB 连接失败，已切换到本地 JSON：${message}`
      }
    }
  }
}

async function connectMongo() {
  if (mongoose.connection.readyState === 1) {
    return
  }

  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    mongoConnectionPromise = null
  }

  if (lastMongoError && Date.now() - lastMongoError.at < mongoRetryAfterMs) {
    throw new Error(lastMongoError.message)
  }

  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoose
      .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/users', {
        serverSelectionTimeoutMS: 2500,
        connectTimeoutMS: 2500,
        socketTimeoutMS: 2500
      })
      .then((connection) => {
        lastMongoError = null
        return connection
      })
      .catch((error) => {
        mongoConnectionPromise = null
        lastMongoError = {
          message: getErrorMessage(error),
          at: Date.now()
        }
        throw error
      })
  }

  await mongoConnectionPromise
}

function buildMongoSearch(search: string) {
  const keyword = search.trim()

  if (!keyword) {
    return {}
  }

  const conditions: Record<string, unknown>[] = []
  const regex = { $regex: keyword, $options: 'i' }

  if (mongoose.Types.ObjectId.isValid(keyword)) {
    conditions.push({ _id: new mongoose.Types.ObjectId(keyword) })
  }

  const age = Number(keyword)
  if (Number.isInteger(age)) {
    conditions.push({ age })
  }

  conditions.push({ name: regex }, { email: regex }, { status: regex })

  return { $or: conditions }
}

async function readJsonUsers(): Promise<UserRecord[]> {
  try {
    const content = await readFile(jsonDataFile, 'utf8')
    const users = JSON.parse(content)
    return Array.isArray(users) ? users.map(normalizeJsonUser) : seedUsers()
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error
    }

    const users = seedUsers()
    await writeJsonUsers(users)
    return users
  }
}

async function writeJsonUsers(users: UserRecord[]) {
  await mkdir(join(process.cwd(), '.data'), { recursive: true })
  await writeFile(jsonDataFile, `${JSON.stringify(users, null, 2)}\n`, 'utf8')
}

function seedUsers(): UserRecord[] {
  return [
    {
      id: randomUUID(),
      name: '李四',
      age: 32,
      email: 'lisi@example.com',
      status: 'inactive'
    },
    {
      id: randomUUID(),
      name: '王五',
      age: 25,
      email: 'wangwu@example.com',
      status: 'active'
    },
    {
      id: randomUUID(),
      name: '赵六',
      age: 30,
      email: 'zhaoliu@example.com',
      status: 'active'
    }
  ]
}

function filterJsonUsers(users: UserRecord[], search: string) {
  const keyword = search.trim().toLowerCase()

  if (!keyword) {
    return users
  }

  return users.filter((user) =>
    [user.id, user.name, user.age, user.email, user.status]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword))
  )
}

function normalizeMongoUser(doc: MongoUserDocument): UserRecord {
  const name = toText(doc.name) || '未命名用户'

  return {
    id: doc._id.toString(),
    name,
    age: toNumber(doc.age),
    email: toText(doc.email),
    status: doc.status === 'inactive' ? 'inactive' : 'active'
  }
}

function normalizeJsonUser(user: Partial<UserRecord>): UserRecord {
  return {
    id: toText(user.id) || randomUUID(),
    name: toText(user.name) || '未命名用户',
    age: toNumber(user.age),
    email: toText(user.email),
    status: user.status === 'inactive' ? 'inactive' : 'active'
  }
}

function toText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function toNumber(value: unknown) {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : 0
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}
