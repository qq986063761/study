<template>
  <section class="mx-auto max-w-7xl">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-semibold text-emerald-700">Users</p>
        <h2 class="mt-2 text-3xl font-bold tracking-tight text-stone-950">用户管理</h2>
        <p class="mt-3 max-w-2xl text-base leading-7 text-stone-600">
          使用 users 集合的 _id、name、age、email、status 字段，支持搜索、新增、编辑和删除。
        </p>
      </div>

      <div
        class="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium"
        :class="
          storage.driver === 'mongodb'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-amber-200 bg-amber-50 text-amber-800'
        "
      >
        <span class="h-2 w-2 rounded-full" :class="storage.driver === 'mongodb' ? 'bg-emerald-600' : 'bg-amber-500'" />
        {{ storage.driver === 'mongodb' ? 'MongoDB' : '本地 JSON' }}
      </div>
    </div>

    <UAlert
      v-if="storage.driver === 'json' && storage.error"
      color="warning"
      variant="soft"
      icon="i-lucide-triangle-alert"
      :description="storage.error"
      class="mt-5"
    />

    <div class="mt-6 rounded-lg border border-stone-200 bg-white shadow-sm">
      <div class="flex flex-col gap-3 border-b border-stone-200 p-5 lg:flex-row lg:items-center lg:justify-between">
        <form class="flex min-w-0 flex-1 flex-col gap-3 md:flex-row" @submit.prevent="fetchUsers">
          <UInput
            v-model="keyword"
            icon="i-lucide-search"
            size="lg"
            class="min-w-0 flex-1"
            placeholder="搜索 _id、姓名、年龄、邮箱或状态"
          />
          <div class="flex gap-2">
            <UButton type="submit" icon="i-lucide-search" size="lg" color="neutral">
              搜索
            </UButton>
            <UButton type="button" icon="i-lucide-rotate-ccw" size="lg" color="neutral" variant="outline" @click="clearSearch">
              清空
            </UButton>
          </div>
        </form>

        <UButton icon="i-lucide-plus" size="lg" color="primary" @click="openCreateModal">
          新增用户
        </UButton>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[760px] text-left text-sm">
          <thead class="bg-stone-100 text-xs font-semibold uppercase text-stone-500">
            <tr>
              <th class="px-5 py-3">_id</th>
              <th class="px-5 py-3">姓名</th>
              <th class="px-5 py-3">年龄</th>
              <th class="px-5 py-3">邮箱</th>
              <th class="px-5 py-3">状态</th>
              <th class="px-5 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-200">
            <tr v-if="loading">
              <td colspan="6" class="px-5 py-10 text-center text-stone-500">加载中...</td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="6" class="px-5 py-10 text-center text-stone-500">暂无用户数据</td>
            </tr>
            <template v-else>
              <tr v-for="user in users" :key="user.id" class="transition hover:bg-stone-50">
                <td class="max-w-[180px] truncate px-5 py-4 font-mono text-xs text-stone-500">{{ user.id }}</td>
                <td class="px-5 py-4 font-medium text-stone-950">{{ user.name || '-' }}</td>
                <td class="px-5 py-4 text-stone-600">{{ user.age }}</td>
                <td class="px-5 py-4 text-stone-600">{{ user.email || '-' }}</td>
                <td class="px-5 py-4">
                  <UBadge :color="user.status === 'active' ? 'success' : 'neutral'" variant="soft">
                    {{ user.status === 'active' ? '启用' : '停用' }}
                  </UBadge>
                </td>
                <td class="px-5 py-4">
                  <div class="flex justify-end gap-2">
                    <UButton
                      type="button"
                      icon="i-lucide-pencil"
                      color="neutral"
                      variant="outline"
                      size="sm"
                      @click="openEditModal(user)"
                    >
                      编辑
                    </UButton>
                    <UButton
                      type="button"
                      icon="i-lucide-trash-2"
                      color="error"
                      variant="soft"
                      size="sm"
                      @click="deleteUser(user)"
                    >
                      删除
                    </UButton>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between border-t border-stone-200 px-5 py-4 text-sm text-stone-500">
        <span>共 {{ users.length }} 条</span>
        <span v-if="message" class="text-stone-700">{{ message }}</span>
      </div>
    </div>

    <UModal
      v-model:open="formModalOpen"
      :title="editingId ? '编辑用户' : '新增用户'"
      :description="editingId ? '修改当前用户信息并保存。' : '填写用户信息后新增一条记录。'"
    >
      <template #body>
        <form id="user-form" class="space-y-4" @submit.prevent="submitUser">
          <UFormField label="姓名" required>
            <UInput v-model="form.name" size="lg" class="w-full" placeholder="例如：张三" required />
          </UFormField>

          <UFormField label="年龄" required>
            <UInputNumber v-model="form.age" :min="0" :max="150" size="lg" class="w-full" required />
          </UFormField>

          <UFormField label="邮箱" required>
            <UInput v-model="form.email" type="email" size="lg" class="w-full" placeholder="name@example.com" required />
          </UFormField>

          <UFormField label="状态" required>
            <USelect v-model="form.status" :items="statusItems" size="lg" class="w-full" />
          </UFormField>
        </form>
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton type="button" color="neutral" variant="outline" @click="closeFormModal">
            取消
          </UButton>
          <UButton type="submit" form="user-form" :loading="saving" :disabled="saving">
            {{ editingId ? '保存修改' : '新增用户' }}
          </UButton>
        </div>
      </template>
    </UModal>
  </section>
</template>

<script setup lang="ts">
type UserStatus = 'active' | 'inactive'

type UserRecord = {
  id: string
  name: string
  age: number
  email: string
  status: UserStatus
}

type StorageInfo = {
  driver: 'mongodb' | 'json'
  error?: string
}

type UsersResponse = {
  users: UserRecord[]
  storage: StorageInfo
}

type UserResponse = {
  user: UserRecord
  storage: StorageInfo
}

const users = ref<UserRecord[]>([])
const keyword = ref('')
const loading = ref(false)
const saving = ref(false)
const message = ref('')
const editingId = ref<string | null>(null)
const formModalOpen = ref(false)
const storage = ref<StorageInfo>({ driver: 'mongodb' })

const form = reactive({
  name: '',
  age: 18,
  email: '',
  status: 'active' as UserStatus
})

const statusItems = [
  { label: '启用', value: 'active' },
  { label: '停用', value: 'inactive' }
]

onMounted(() => {
  fetchUsers()
})

async function fetchUsers() {
  loading.value = true
  message.value = ''

  try {
    const response = await $fetch<UsersResponse>('/api/users', {
      query: keyword.value.trim() ? { q: keyword.value.trim() } : undefined
    })
    users.value = response.users
    syncStorage(response.storage)
  } catch (error) {
    console.error('加载用户失败', error)
    message.value = '加载用户失败'
  } finally {
    loading.value = false
  }
}

async function submitUser() {
  saving.value = true
  message.value = ''

  const payload = {
    name: form.name.trim(),
    age: form.age,
    email: form.email.trim(),
    status: form.status
  }

  try {
    const successMessage = editingId.value ? '用户已更新' : '用户已新增'
    const response = editingId.value
      ? await $fetch<UserResponse>(`/api/users/${editingId.value}`, {
          method: 'PUT',
          body: payload
        })
      : await $fetch<UserResponse>('/api/users', {
          method: 'POST',
          body: payload
        })

    syncStorage(response.storage)
    closeFormModal()
    await fetchUsers()
    message.value = successMessage
  } catch (error) {
    console.error('保存用户失败', error)
    message.value = '保存用户失败'
  } finally {
    saving.value = false
  }
}

function openCreateModal() {
  resetForm()
  formModalOpen.value = true
}

function openEditModal(user: UserRecord) {
  editingId.value = user.id
  form.name = user.name
  form.age = user.age
  form.email = user.email
  form.status = user.status
  formModalOpen.value = true
}

async function deleteUser(user: UserRecord) {
  if (!window.confirm(`确认删除 ${user.name || user.email}？`)) {
    return
  }

  message.value = ''

  try {
    const response = await $fetch<{ ok: true; storage: StorageInfo }>(`/api/users/${user.id}`, {
      method: 'DELETE'
    })
    syncStorage(response.storage)
    if (editingId.value === user.id) {
      closeFormModal()
    }
    await fetchUsers()
    message.value = '用户已删除'
  } catch (error) {
    console.error('删除用户失败', error)
    message.value = '删除用户失败'
  }
}

function clearSearch() {
  keyword.value = ''
  fetchUsers()
}

function closeFormModal() {
  formModalOpen.value = false
  resetForm()
}

function resetForm() {
  editingId.value = null
  form.name = ''
  form.age = 18
  form.email = ''
  form.status = 'active'
}

function syncStorage(nextStorage: StorageInfo) {
  storage.value = nextStorage

  if (nextStorage.driver === 'json' && nextStorage.error) {
    console.error(nextStorage.error)
  }
}
</script>
