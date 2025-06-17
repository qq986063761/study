import { shallowMount } from '@vue/test-utils'
import Counter from '@/components/Counter.vue'

describe('Counter.vue', () => {
  let wrapper

  beforeEach(() => {
    // 在每个测试用例之前创建组件实例
    wrapper = shallowMount(Counter)
  })

  // 测试组件是否正确渲染
  it('renders correctly', () => {
    expect(wrapper.find('.counter').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('span').exists()).toBe(true)
  })

  // 测试初始值是否为0
  it('initial count is 0', () => {
    expect(wrapper.find('span').text()).toBe('0')
  })

  // 测试增加按钮
  it('increments count when + button is clicked', async () => {
    const incrementButton = wrapper.findAll('button').at(1)
    await incrementButton.trigger('click')
    expect(wrapper.find('span').text()).toBe('1')
  })

  // 测试减少按钮
  it('decrements count when - button is clicked', async () => {
    const decrementButton = wrapper.findAll('button').at(0)
    await decrementButton.trigger('click')
    expect(wrapper.find('span').text()).toBe('-1')
  })
}) 