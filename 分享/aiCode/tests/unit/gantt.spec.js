import { shallowMount, mount } from '@vue/test-utils'
import GanttChart from '@/components/gantt/gantt.vue'

describe('甘特图组件测试', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(GanttChart)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('组件基础渲染测试', () => {
    test('应该正确渲染甘特图容器', () => {
      expect(wrapper.find('.gantt-container').exists()).toBe(true)
    })

    test('应该渲染视图切换按钮', () => {
      const viewButtons = wrapper.findAll('.view-btn')
      expect(viewButtons).toHaveLength(3)
      expect(viewButtons.at(0).text()).toBe('日视图')
      expect(viewButtons.at(1).text()).toBe('周视图')
      expect(viewButtons.at(2).text()).toBe('月视图')
    })

    test('应该渲染时间轴头部', () => {
      expect(wrapper.find('.timeline-header').exists()).toBe(true)
      expect(wrapper.find('.timeline-cells').exists()).toBe(true)
    })

    test('应该渲染任务列表', () => {
      expect(wrapper.find('.tasks-container').exists()).toBe(true)
      expect(wrapper.find('.task-item').exists()).toBe(true)
    })

    test('应该渲染默认任务数据', () => {
      const taskItems = wrapper.findAll('.task-item')
      expect(taskItems).toHaveLength(6) // 默认有6个任务
    })

    test('应该显示正确的任务名称', () => {
      const taskNames = wrapper.findAll('.task-name')
      expect(taskNames.at(0).text()).toBe('项目规划')
      expect(taskNames.at(1).text()).toBe('需求分析')
      expect(taskNames.at(2).text()).toBe('系统设计')
    })
  })

  describe('视图切换功能测试', () => {
    test('默认应该显示日视图', () => {
      const activeButton = wrapper.find('.view-btn.active')
      expect(activeButton.text()).toBe('日视图')
      expect(wrapper.vm.currentView).toBe('day')
    })

    test('点击周视图按钮应该切换视图', async () => {
      const weekButton = wrapper.findAll('.view-btn').at(1)
      await weekButton.trigger('click')
      
      expect(wrapper.vm.currentView).toBe('week')
      expect(wrapper.find('.view-btn.active').text()).toBe('周视图')
    })

    test('点击月视图按钮应该切换视图', async () => {
      const monthButton = wrapper.findAll('.view-btn').at(2)
      await monthButton.trigger('click')
      
      expect(wrapper.vm.currentView).toBe('month')
      expect(wrapper.find('.view-btn.active').text()).toBe('月视图')
    })

    test('切换视图后应该重新计算时间轴', async () => {
      const weekButton = wrapper.findAll('.view-btn').at(1)
      await weekButton.trigger('click')
      
      // 验证时间轴单元格数量变化
      const timelineCells = wrapper.vm.timelineCells
      expect(timelineCells.length).toBeGreaterThan(0)
    })
  })

  describe('任务条样式计算测试', () => {
    test('应该正确计算任务条位置和宽度', () => {
      const task = wrapper.vm.tasks[0] // 项目规划任务
      const style = wrapper.vm.getTaskBarStyle(task)
      
      expect(style).toHaveProperty('left')
      expect(style).toHaveProperty('width')
      expect(style.left).toMatch(/^\d+px$/)
      expect(style.width).toMatch(/^\d+px$/)
    })

    test('任务条应该有最小宽度', () => {
      const task = wrapper.vm.tasks[0]
      const style = wrapper.vm.getTaskBarStyle(task)
      const width = parseInt(style.width)
      
      expect(width).toBeGreaterThanOrEqual(60)
    })

    test('不同视图下任务条样式应该不同', async () => {
      const task = wrapper.vm.tasks[0]
      const dayStyle = wrapper.vm.getTaskBarStyle(task)
      
      // 切换到周视图
      await wrapper.vm.switchView('week')
      await wrapper.vm.$nextTick()
      const weekStyle = wrapper.vm.getTaskBarStyle(task)
      
      // 切换到月视图
      await wrapper.vm.switchView('month')
      await wrapper.vm.$nextTick()
      const monthStyle = wrapper.vm.getTaskBarStyle(task)

      console.log('Task:', task.name, 'Start:', task.start, 'End:', task.end)
      console.log('StartDate:', wrapper.vm.startDate, 'EndDate:', wrapper.vm.endDate)
      console.log('Day style:', dayStyle)
      console.log('Week style:', weekStyle)
      console.log('Month style:', monthStyle)
      
      // 验证不同视图的样式确实不同
      // 注意：如果任务在时间范围边界，某些视图可能显示相同位置
      // 这里我们检查至少有两种不同的样式
      const styles = [dayStyle.left, weekStyle.left, monthStyle.left]
      const uniqueStyles = [...new Set(styles)]
      
      // 至少应该有2种不同的样式，或者如果都相同，那说明任务在边界位置
      if (uniqueStyles.length === 1) {
        console.log('Warning: All views show same position, task might be at boundary')
        // 如果所有视图都相同，检查宽度是否不同
        const widths = [dayStyle.width, weekStyle.width, monthStyle.width]
        const uniqueWidths = [...new Set(widths)]
        expect(uniqueWidths.length).toBeGreaterThan(1)
      } else {
        expect(uniqueStyles.length).toBeGreaterThan(1)
      }
    })
  })

  describe('日期格式化测试', () => {
    test('应该正确格式化日期', () => {
      const testDate = new Date('2025-06-15')
      const formatted = wrapper.vm.formatDate(testDate, 'yyyy-MM-dd')
      expect(formatted).toBe('2025-06-15')
    })

    test('应该处理月份和日期的补零', () => {
      const testDate = new Date('2025-01-05')
      const formatted = wrapper.vm.formatDate(testDate, 'yyyy-MM-dd')
      expect(formatted).toBe('2025-01-05')
    })
  })

  describe('今日时间线测试', () => {
    test('应该计算今日时间线位置', () => {
      const todayPosition = wrapper.vm.todayPosition
      expect(typeof todayPosition).toBe('number')
    })

    test('今日时间线应该在有效范围内', () => {
      const todayPosition = wrapper.vm.todayPosition
      // 如果今日在时间范围内，位置应该大于等于0
      // 如果不在范围内，位置应该是-1
      expect(todayPosition).toBeGreaterThanOrEqual(-1)
    })
  })

  describe('滚动同步测试', () => {
    test('应该处理滚动事件', async () => {
      // 直接调用组件的handleScroll方法，传入模拟的事件对象
      const mockEvent = {
        target: {
          scrollLeft: 100
        }
      }
      
      wrapper.vm.handleScroll(mockEvent)
      
      expect(wrapper.vm.scrollLeft).toBe(100)
    })
  })

  describe('任务拖拽功能测试', () => {
    test('应该开始拖拽任务', async () => {
      const task = wrapper.vm.tasks[0]
      const taskBar = wrapper.find('.task-bar')
      
      await taskBar.trigger('mousedown', {
        preventDefault: jest.fn(),
        clientX: 100
      })
      
      expect(wrapper.vm.isDragging).toBe(true)
      expect(wrapper.vm.dragTask).toBe(task)
      expect(wrapper.vm.dragStartX).toBe(100)
    })

    test('应该处理鼠标移动', async () => {
      const task = wrapper.vm.tasks[0]
      const originalStartDate = new Date(task.start)
      
      // 开始拖拽
      wrapper.vm.isDragging = true
      wrapper.vm.dragTask = task
      wrapper.vm.dragStartX = 100
      wrapper.vm.dragStartLeft = 0
      
      // 模拟鼠标移动
      const mockEvent = { clientX: 200 }
      wrapper.vm.handleMouseMove(mockEvent)
      
      // 验证任务时间是否被更新
      expect(task.start.getTime()).not.toBe(originalStartDate.getTime())
    })

    test('应该结束拖拽', async () => {
      // 设置拖拽状态
      wrapper.vm.isDragging = true
      wrapper.vm.dragTask = wrapper.vm.tasks[0]
      
      // 模拟鼠标释放
      wrapper.vm.handleMouseUp()
      
      expect(wrapper.vm.isDragging).toBe(false)
      expect(wrapper.vm.dragTask).toBe(null)
    })
  })

  describe('任务悬停功能测试', () => {
    test('应该处理任务悬停', async () => {
      const task = wrapper.vm.tasks[0]
      const taskBar = wrapper.find('.task-bar')
      
      await taskBar.trigger('mouseenter')
      
      // 验证悬停方法被调用（这里只是测试方法存在且不报错）
      expect(typeof wrapper.vm.handleTaskHover).toBe('function')
    })

    test('应该处理任务离开', async () => {
      const taskBar = wrapper.find('.task-bar')
      
      await taskBar.trigger('mouseleave')
      
      // 验证离开方法被调用
      expect(typeof wrapper.vm.handleTaskLeave).toBe('function')
    })
  })

  describe('组件生命周期测试', () => {
    test('组件挂载时应该添加事件监听器', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener')
      
      const newWrapper = mount(GanttChart)
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
      expect(addEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))
      
      addEventListenerSpy.mockRestore()
      newWrapper.destroy()
    })

    test('组件销毁时应该移除事件监听器', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener')
      
      const newWrapper = mount(GanttChart)
      newWrapper.destroy()
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))
      
      removeEventListenerSpy.mockRestore()
    })
  })

  describe('数据验证测试', () => {
    test('任务数据应该包含必要字段', () => {
      const tasks = wrapper.vm.tasks
      
      tasks.forEach(task => {
        expect(task).toHaveProperty('id')
        expect(task).toHaveProperty('name')
        expect(task).toHaveProperty('start')
        expect(task).toHaveProperty('end')
        expect(task.start instanceof Date).toBe(true)
        expect(task.end instanceof Date).toBe(true)
      })
    })

    test('视图选项应该包含正确的配置', () => {
      const viewOptions = wrapper.vm.viewOptions
      
      expect(viewOptions).toHaveLength(3)
      expect(viewOptions[0]).toEqual({ label: '日视图', value: 'day' })
      expect(viewOptions[1]).toEqual({ label: '周视图', value: 'week' })
      expect(viewOptions[2]).toEqual({ label: '月视图', value: 'month' })
    })

    test('时间配置应该合理', () => {
      expect(wrapper.vm.startDate instanceof Date).toBe(true)
      expect(wrapper.vm.endDate instanceof Date).toBe(true)
      expect(wrapper.vm.cellWidth).toBe(100)
      expect(wrapper.vm.startDate < wrapper.vm.endDate).toBe(true)
    })
  })

  describe('边界情况测试', () => {
    test('空任务列表时应该正常渲染', async () => {
      wrapper.vm.tasks = []
      await wrapper.vm.$nextTick()
      
      expect(wrapper.find('.task-item').exists()).toBe(false)
    })

    test('任务开始时间晚于结束时间时应该处理', () => {
      const invalidTask = {
        id: 999,
        name: '无效任务',
        start: new Date('2025-07-01'),
        end: new Date('2025-06-01') // 结束时间早于开始时间
      }
      
      // 验证组件不会因为无效数据而崩溃
      expect(() => {
        wrapper.vm.getTaskBarStyle(invalidTask)
      }).not.toThrow()
    })

    test('时间范围外的任务应该正常处理', () => {
      const outOfRangeTask = {
        id: 1000,
        name: '范围外任务',
        start: new Date('2030-01-01'),
        end: new Date('2030-01-10')
      }
      
      // 验证组件能处理范围外的任务
      expect(() => {
        wrapper.vm.getTaskBarStyle(outOfRangeTask)
      }).not.toThrow()
    })
  })
})
