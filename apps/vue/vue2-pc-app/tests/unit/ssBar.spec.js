import { mount } from '@vue/test-utils'
import Component from '../../src/components/SsBar.vue'

describe(Component.name, () => {
  const wrapper = mount(Component)

  it('渲染根元素', () => {
    const className = 'suspend-scrollbar'
    expect(wrapper.html()).toMatch(className)
  })

  it('是否包含内容', () => {
    expect(wrapper.html()).toContain('class="scrollbar-inner"')
  })
})
