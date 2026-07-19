<template>
  <UApp>
    <div class="min-h-screen bg-[#f4f2ee] text-stone-950">
      <NuxtRouteAnnouncer />
      <div class="min-h-screen md:flex">
        <aside
          class="border-b border-stone-200 bg-white/90 px-4 py-4 shadow-sm md:sticky md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r md:px-5 md:py-6"
        >
          <div class="flex items-center justify-between gap-3 md:block">
            <NuxtLink to="/" class="block">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Nuxt 4
              </p>
              <h1 class="mt-1 text-xl font-bold text-stone-950">Fullstack Demo</h1>
            </NuxtLink>
            <div class="hidden rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 md:inline-block">
              MongoDB
            </div>
          </div>

          <nav class="mt-4 grid grid-cols-2 gap-2 md:mt-8 md:grid-cols-1">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition"
              :class="
                route.path === item.to
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950'
              "
            >
              <span class="text-base" aria-hidden="true">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </NuxtLink>
          </nav>

          <div class="mt-8 hidden border-t border-stone-200 pt-5 text-sm text-stone-500 md:block">
            <p>用户数据优先写入 MongoDB，连接失败时自动切到本地 JSON。</p>
          </div>
        </aside>

        <main class="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <NuxtPage />
        </main>
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
const route = useRoute()

const navItems = [
  { label: '首页', to: '/', icon: '⌂' },
  { label: '用户', to: '/users', icon: '◎' }
]
</script>
