import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import App from '../App.vue'
import router from '../router'

describe('App', () => {
  it('mounts the app1 standalone shell', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router, ElementPlus],
      },
    })

    expect(wrapper.text()).toContain('app1 独立运行模式')
    expect(wrapper.text()).toContain('app1 首页')
  })
})
