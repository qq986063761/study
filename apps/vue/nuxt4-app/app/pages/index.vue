<template>
  <section class="mx-auto max-w-6xl">
    <div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm font-semibold text-emerald-700">Dashboard</p>
        <h2 class="mt-2 text-3xl font-bold tracking-tight text-stone-950">全栈项目演示</h2>
        <p class="mt-3 max-w-2xl text-base leading-7 text-stone-600">
          这里展示 Nuxt 前端路由、Tailwind CSS 样式、Nitro API、Mongoose 连接 MongoDB，以及连接失败后的本地 JSON 兜底存储。
        </p>
      </div>

      <NuxtLink
        to="/users"
        class="inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
      >
        打开用户管理
      </NuxtLink>
    </div>

    <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="item in highlights"
        :key="item.title"
        class="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
      >
        <div class="flex h-10 w-10 items-center justify-center rounded-md" :class="item.accent">
          <span class="text-lg" aria-hidden="true">{{ item.icon }}</span>
        </div>
        <h3 class="mt-4 text-base font-semibold text-stone-950">{{ item.title }}</h3>
        <p class="mt-2 text-sm leading-6 text-stone-600">{{ item.description }}</p>
      </div>
    </div>

    <div class="mt-8 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 class="text-lg font-semibold text-stone-950">后端接口</h3>
          <p class="mt-1 text-sm text-stone-600">用户模块使用 REST 风格接口完成列表、搜索、新增、编辑、删除。</p>
        </div>
        <div class="grid gap-2 text-sm font-medium text-stone-700 sm:grid-cols-2 lg:grid-cols-4">
          <span class="rounded-md bg-stone-100 px-3 py-2">GET /api/users</span>
          <span class="rounded-md bg-stone-100 px-3 py-2">POST /api/users</span>
          <span class="rounded-md bg-stone-100 px-3 py-2">PUT /api/users/:id</span>
          <span class="rounded-md bg-stone-100 px-3 py-2">DELETE /api/users/:id</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const highlights = [
  {
    title: '前端路由',
    description: '首页与用户页通过 Nuxt 文件路由切换，左侧菜单展示当前页面状态。',
    icon: '↔',
    accent: 'bg-emerald-100 text-emerald-800'
  },
  {
    title: 'Tailwind v4',
    description: '使用最新 Tailwind CSS 与 Vite 插件接入全局样式。',
    icon: '◆',
    accent: 'bg-sky-100 text-sky-800'
  },
  {
    title: 'Mongoose',
    description: '服务端优先连接本机 users 数据库中的 users 集合。',
    icon: '▣',
    accent: 'bg-amber-100 text-amber-800'
  },
  {
    title: 'JSON 兜底',
    description: 'MongoDB 不存在或连接失败时，服务端自动使用本地 JSON 文件模拟。',
    icon: '◌',
    accent: 'bg-rose-100 text-rose-800'
  }
]
</script>
