import { mount } from '@vue/test-utils'
import Button from '../src/components/button/button.vue'

// 定义大的分组类目
describe('button', () => {
  // 定义单个测试用例
  it('测试渲染是否正确', () => {
    const wrapper = mount(Button, {
      propsData: {
        text: '按钮'
      }
    })
    
    // 断言：测试用例的预期结果
    expect(wrapper.text()).toContain('按钮')
  })
  
  it('测试点击事件是否触发', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')

    // wrapper.emitted() 拿到所有触发的事件，click 是事件名
    expect(wrapper.emitted().click).toBeTruthy()
  })
})