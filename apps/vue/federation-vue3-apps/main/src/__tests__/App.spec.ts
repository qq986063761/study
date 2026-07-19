import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import App from '../App.vue'
import router from '../router'

describe('App', () => {
  it('mounts the main app shell', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router, ElementPlus],
      },
    })

    expect(wrapper.text()).toContain('主应用')
    expect(wrapper.text()).toContain('app1')
    expect(wrapper.text()).toContain('app2')
  })
})
