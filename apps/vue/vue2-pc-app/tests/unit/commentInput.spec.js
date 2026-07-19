import { mount } from '@vue/test-utils'
import Component from '../../src/components/CommentInput.vue'
import Vue from 'vue'
import Element from 'element-ui'

Vue.use(Element)

describe(Component.name, () => {
  const warningMock = jest.fn()
  const wrapper = mount(Component, {
    mocks: {
      $message: {
        warning: warningMock,
      },
    },
  })

  it('是否存在提交按钮', async () => {
    const button = wrapper.findComponent('.btn-submit')
    // 测试按钮是否存在
    expect(button.exists()).toBe(true)
    
    // 测试点击后是否有提醒内容
    await button.trigger('click')
    expect(warningMock).toHaveBeenCalledWith('请输入内容')
  })
})

describe(Component.name + '提交按钮点击通过', () => {
  const warningMock = jest.fn()
  const wrapper = mount(Component, {
    mocks: {
      $message: {
        warning: warningMock
      }
    }
  })

  it('有内容后，再点提交是否成功', async () => {
    const button = wrapper.findComponent('.btn-submit')
    
    // 测试有内容后，再点击是否还有提醒
    const input = wrapper.findComponent({ ref: 'input' })
    input.element.innerHTML = '我输入了内容'
    await button.trigger('click')
    expect(warningMock).not.toHaveBeenCalled()
  })
})
