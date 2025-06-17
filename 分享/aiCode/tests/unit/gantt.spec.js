import { shallowMount } from '@vue/test-utils'
import Gantt from '@/components/gantt/gantt.vue'

// 甘特图组件单元测试

describe('Gantt.vue', () => {
  let wrapper

  beforeEach(() => {
    // 每个用例前挂载组件
    wrapper = shallowMount(Gantt)
  })

  it('能正确渲染甘特图容器', () => {
    expect(wrapper.find('.gantt-container').exists()).toBe(true)
  })

  it('渲染的任务数量应与数据一致', () => {
    const taskItems = wrapper.findAll('.task-item')
    expect(taskItems.length).toBe(wrapper.vm.tasks.length)
  })

  it('渲染的日期单元格数量应与 dateList 一致', () => {
    const dateCells = wrapper.findAll('.date-cell')
    expect(dateCells.length).toBe(wrapper.vm.dateList.length)
  })

  it('应显示时间线标签"今天"', () => {
    expect(wrapper.find('.timeline-label').text()).toBe('今天')
  })
}) 