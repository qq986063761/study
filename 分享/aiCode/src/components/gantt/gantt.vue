<template>
  <div class="gantt-container">
    <!-- 视图切换控制 -->
    <div class="view-controls">
      <button 
        v-for="view in viewOptions" 
        :key="view.value"
        :class="['view-btn', { active: currentView === view.value }]"
        @click="switchView(view.value)"
      >
        {{ view.label }}
      </button>
    </div>

    <!-- 甘特图主体 -->
    <div class="gantt-main">
      <!-- 时间轴头部 -->
      <div class="timeline-header" ref="timelineHeader">
        <div class="timeline-cells">
          <div 
            v-for="(cell, index) in timelineCells" 
            :key="index"
            class="timeline-cell"
            :style="{ width: cellWidth + 'px' }"
          >
            {{ cell.label }}
          </div>
        </div>
      </div>

      <!-- 任务条主体区域 -->
      <div class="gantt-body" ref="ganttBody" @scroll="handleScroll">
        <!-- 今日时间线 -->
        <div 
          v-if="todayPosition > 0"
          class="today-line"
          :style="{ left: todayPosition + 'px' }"
        ></div>

        <!-- 任务列表 -->
        <div class="tasks-container">
          <div 
            v-for="task in tasks" 
            :key="task.id"
            class="task-item"
          >
            <!-- 任务名称 -->
            <div class="task-name">{{ task.name }}</div>
            
            <!-- 任务条区域 -->
            <div class="task-bars-container">
              <div 
                class="task-bar"
                :style="getTaskBarStyle(task)"
                @mousedown="startDrag($event, task)"
                @mouseenter="handleTaskHover(task)"
                @mouseleave="handleTaskLeave"
              >
                <span class="task-bar-label">{{ task.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GanttChart',
  data() {
    return {
      // 视图选项
      viewOptions: [
        { label: '日视图', value: 'day' },
        { label: '周视图', value: 'week' },
        { label: '月视图', value: 'month' }
      ],
      currentView: 'day',
      
      // 时间配置
      startDate: new Date('2025-06-12'),
      endDate: new Date('2027-10-01'),
      cellWidth: 100,
      
      // 拖拽状态
      isDragging: false,
      dragTask: null,
      dragStartX: 0,
      dragStartLeft: 0,
      
      // 滚动同步
      scrollLeft: 0,
      
      // 默认任务数据
      tasks: [
        {
          id: 1,
          name: '项目规划',
          start: new Date('2025-06-15'),
          end: new Date('2025-06-18')
        },
        {
          id: 2,
          name: '需求分析',
          start: new Date('2025-06-20'),
          end: new Date('2025-06-25')
        },
        {
          id: 3,
          name: '系统设计',
          start: new Date('2025-06-28'),
          end: new Date('2025-07-02')
        },
        {
          id: 4,
          name: '开发阶段',
          start: new Date('2025-07-05'),
          end: new Date('2025-07-12')
        },
        {
          id: 5,
          name: '测试阶段',
          start: new Date('2025-07-15'),
          end: new Date('2025-07-19')
        },
        {
          id: 6,
          name: '部署上线',
          start: new Date('2025-07-22'),
          end: new Date('2025-07-24')
        }
      ]
    }
  },
  
  computed: {
    // 计算时间轴单元格
    timelineCells() {
      const cells = []
      const currentDate = new Date(this.startDate)
      
      while (currentDate <= this.endDate) {
        let label = ''
        
        switch (this.currentView) {
          case 'day':
            label = this.formatDate(currentDate, 'yyyy-MM-dd')
            currentDate.setDate(currentDate.getDate() + 1)
            break
          case 'week':
            const weekEnd = new Date(currentDate)
            weekEnd.setDate(weekEnd.getDate() + 6)
            label = `${currentDate.getMonth() + 1}/${currentDate.getDate()}-${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`
            currentDate.setDate(currentDate.getDate() + 7)
            break
          case 'month':
            label = `${currentDate.getMonth() + 1}月`
            currentDate.setMonth(currentDate.getMonth() + 1)
            break
        }
        
        cells.push({ label })
      }
      
      return cells
    },
    
    // 计算今日时间线位置
    todayPosition() {
      const today = new Date()
      if (today < this.startDate || today > this.endDate) {
        return -1
      }
      
      const daysDiff = Math.floor((today - this.startDate) / (1000 * 60 * 60 * 24))
      
      switch (this.currentView) {
        case 'day':
          return daysDiff * this.cellWidth
        case 'week':
          return Math.floor(daysDiff / 7) * this.cellWidth
        case 'month':
          const monthsDiff = (today.getFullYear() - this.startDate.getFullYear()) * 12 + 
                           (today.getMonth() - this.startDate.getMonth())
          return monthsDiff * this.cellWidth
        default:
          return 0
      }
    }
  },
  
  mounted() {
    // 添加全局鼠标事件监听
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
    
    // 初始化今日时间线位置
    this.updateTodayPosition()
  },
  
  beforeDestroy() {
    // 移除全局事件监听
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
  },
  
  methods: {
    // 切换视图
    switchView(view) {
      this.currentView = view
    },
    
    // 格式化日期
    formatDate(date, format) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      
      return format
        .replace('yyyy', year)
        .replace('MM', month)
        .replace('dd', day)
    },
    
    // 计算任务条样式
    getTaskBarStyle(task) {
      const startDays = Math.floor((task.start - this.startDate) / (1000 * 60 * 60 * 24))
      const durationDays = Math.ceil((task.end - task.start) / (1000 * 60 * 60 * 24))
      
      let left = 0
      let width = 0
      
      switch (this.currentView) {
        case 'day':
          left = startDays * this.cellWidth
          width = durationDays * this.cellWidth
          break
        case 'week':
          left = Math.floor(startDays / 7) * this.cellWidth
          width = Math.ceil(durationDays / 7) * this.cellWidth
          break
        case 'month':
          const startMonths = (task.start.getFullYear() - this.startDate.getFullYear()) * 12 + 
                            (task.start.getMonth() - this.startDate.getMonth())
          const durationMonths = Math.ceil((task.end - task.start) / (1000 * 60 * 60 * 24 * 30))
          left = startMonths * this.cellWidth
          width = Math.max(durationMonths, 1) * this.cellWidth
          break
      }
      
      return {
        left: left + 'px',
        width: Math.max(width, 60) + 'px' // 最小宽度60px
      }
    },
    
    // 处理滚动同步
    handleScroll(event) {
      this.scrollLeft = event.target.scrollLeft
      if (this.$refs.timelineHeader) {
        this.$refs.timelineHeader.scrollLeft = this.scrollLeft
      }
    },
    
    // 开始拖拽
    startDrag(event, task) {
      event.preventDefault()
      this.isDragging = true
      this.dragTask = task
      this.dragStartX = event.clientX
      this.dragStartLeft = parseInt(this.getTaskBarStyle(task).left)
      
      // 添加拖拽样式
      event.target.style.cursor = 'grabbing'
    },
    
    // 处理鼠标移动
    handleMouseMove(event) {
      if (!this.isDragging || !this.dragTask) return
      
      const deltaX = event.clientX - this.dragStartX
      const newLeft = this.dragStartLeft + deltaX
      
      // 计算新的开始时间
      const daysOffset = Math.round(newLeft / this.cellWidth)
      const newStartDate = new Date(this.startDate)
      
      switch (this.currentView) {
        case 'day':
          newStartDate.setDate(newStartDate.getDate() + daysOffset)
          break
        case 'week':
          newStartDate.setDate(newStartDate.getDate() + daysOffset * 7)
          break
        case 'month':
          newStartDate.setMonth(newStartDate.getMonth() + daysOffset)
          break
      }
      
      // 计算持续时间
      const duration = this.dragTask.end - this.dragTask.start
      const newEndDate = new Date(newStartDate.getTime() + duration)
      
      // 更新任务时间
      this.dragTask.start = newStartDate
      this.dragTask.end = newEndDate
    },
    
    // 处理鼠标释放
    handleMouseUp() {
      if (this.isDragging) {
        this.isDragging = false
        this.dragTask = null
        this.dragStartX = 0
        this.dragStartLeft = 0
        
        // 移除拖拽样式
        document.body.style.cursor = ''
      }
    },
    
    // 处理任务条悬停
    handleTaskHover(task) {
      // 可以在这里添加悬停效果
    },
    
    // 处理任务条离开
    handleTaskLeave() {
      // 可以在这里移除悬停效果
    },
    
    // 更新今日时间线位置
    updateTodayPosition() {
      // 这个方法会在日期变化时被调用
      // 实际项目中可以设置定时器定期更新
    }
  }
}
</script>

<style scoped>
.gantt-container {
  font-family: Arial, sans-serif;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.view-controls {
  padding: 10px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.view-btn {
  padding: 6px 12px;
  margin-right: 8px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.view-btn:hover {
  background-color: #e9e9e9;
}

.view-btn.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.gantt-main {
  display: flex;
  flex-direction: column;
  height: 500px;
}

.timeline-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  overflow: hidden;
}

.timeline-cells {
  display: flex;
  min-width: max-content;
}

.timeline-cell {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #ddd;
  font-size: 12px;
  font-weight: 500;
  color: #666;
  background-color: #f8f9fa;
  flex-shrink: 0;
}

.gantt-body {
  flex: 1;
  overflow: auto;
  position: relative;
}

.today-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #ff4444;
  z-index: 10;
  pointer-events: none;
}

.tasks-container {
  min-width: max-content;
}

.task-item {
  display: flex;
  height: 50px;
  border-bottom: 1px solid #eee;
}

.task-name {
  width: 200px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border-right: 1px solid #ddd;
  font-size: 14px;
  font-weight: 500;
  flex-shrink: 0;
}

.task-bars-container {
  flex: 1;
  position: relative;
  min-width: max-content;
}

.task-bar {
  position: absolute;
  top: 10px;
  height: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  cursor: grab;
  display: flex;
  align-items: center;
  padding: 0 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  min-width: 60px;
}

.task-bar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

.task-bar:active {
  cursor: grabbing;
}

.task-bar-label {
  color: white;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-align: center;
}

/* 滚动条样式 */
.gantt-body::-webkit-scrollbar {
  height: 8px;
}

.gantt-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.gantt-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.gantt-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
