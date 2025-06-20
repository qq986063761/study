<template>
  <div class="gantt-container">
    <!-- 视图切换控制 -->
    <div class="view-controls">
      <button 
        v-for="view in viewTypes" 
        :key="view.type"
        :class="['view-btn', { active: currentView === view.type }]"
        @click="switchView(view.type)"
      >
        {{ view.label }}
      </button>
    </div>

    <!-- 甘特图主体 -->
    <div class="gantt-main">
      <!-- 时间轴头部 -->
      <div class="timeline-header" ref="timelineHeader">
        <div class="timeline-scroll" ref="timelineScroll">
          <div 
            v-for="(date, index) in timelineDates" 
            :key="index"
            class="timeline-cell"
            :style="{ width: cellWidth + 'px' }"
          >
            {{ formatTimelineDate(date) }}
          </div>
        </div>
      </div>

      <!-- 任务主体区域 -->
      <div class="gantt-body" ref="ganttBody">
        <div class="gantt-scroll" ref="ganttScroll">
          <!-- 任务列表 -->
          <div class="task-list">
            <div 
              v-for="task in tasks" 
              :key="task.id"
              class="task-item"
            >
              <!-- 任务名称 -->
              <div class="task-name">{{ task.name }}</div>
              
              <!-- 任务条区域 -->
              <div class="task-bar-container">
                <div 
                  class="task-bar"
                  :style="getTaskBarStyle(task)"
                  @mousedown="startDrag($event, task)"
                  @mouseenter="handleTaskHover"
                  @mouseleave="handleTaskLeave"
                >
                  <span class="task-label">{{ task.name }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 今日时间线 -->
          <div 
            class="today-line"
            :style="getTodayLineStyle()"
          ></div>
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
      // 视图类型配置
      viewTypes: [
        { type: 'day', label: '日视图' },
        { type: 'week', label: '周视图' },
        { type: 'month', label: '月视图' }
      ],
      currentView: 'day',
      
      // 时间轴配置
      startDate: new Date('2025-06-12'),
      endDate: new Date('2027-10-01'),
      cellWidth: 100,
      
      // 任务数据
      tasks: [
        {
          id: 1,
          name: '项目规划',
          start: new Date('2025-06-15'),
          end: new Date('2025-06-20')
        },
        {
          id: 2,
          name: '需求分析',
          start: new Date('2025-06-18'),
          end: new Date('2025-06-24')
        },
        {
          id: 3,
          name: '系统设计',
          start: new Date('2025-06-25'),
          end: new Date('2025-07-01')
        },
        {
          id: 4,
          name: '开发阶段',
          start: new Date('2025-07-02'),
          end: new Date('2025-07-08')
        },
        {
          id: 5,
          name: '测试阶段',
          start: new Date('2025-07-09'),
          end: new Date('2025-07-15')
        }
      ],
      
      // 拖拽相关状态
      isDragging: false,
      dragTask: null,
      dragStartX: 0,
      dragStartLeft: 0,
      originalStart: null,
      originalEnd: null
    }
  },
  
  computed: {
    // 计算时间轴日期数组
    timelineDates() {
      const dates = []
      const current = new Date(this.startDate)
      
      while (current <= this.endDate) {
        dates.push(new Date(current))
        
        // 根据当前视图类型增加日期
        switch (this.currentView) {
          case 'day':
            current.setDate(current.getDate() + 1)
            break
          case 'week':
            current.setDate(current.getDate() + 7)
            break
          case 'month':
            current.setMonth(current.getMonth() + 1)
            break
        }
      }
      
      return dates
    },
    
    // 计算时间轴总宽度
    timelineWidth() {
      return this.timelineDates.length * this.cellWidth
    }
  },
  
  mounted() {
    this.initScrollSync()
    this.initDragEvents()
  },
  
  methods: {
    // 切换视图类型
    switchView(viewType) {
      this.currentView = viewType
    },
    
    // 格式化时间轴日期显示
    formatTimelineDate(date) {
      switch (this.currentView) {
        case 'day':
          return this.formatDate(date, 'yyyy-MM-dd')
        case 'week':
          const weekEnd = new Date(date)
          weekEnd.setDate(weekEnd.getDate() + 6)
          return `${date.getMonth() + 1}/${date.getDate()}-${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`
        case 'month':
          return `${date.getMonth() + 1}月`
        default:
          return this.formatDate(date, 'yyyy-MM-dd')
      }
    },
    
    // 日期格式化工具函数
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
      const startOffset = this.getDateOffset(task.start)
      const duration = this.getTaskDuration(task)
      
      return {
        left: startOffset + 'px',
        width: duration + 'px'
      }
    },
    
    // 计算日期在时间轴上的偏移量
    getDateOffset(date) {
      const startTime = this.startDate.getTime()
      const currentTime = date.getTime()
      
      switch (this.currentView) {
        case 'day':
          const daysDiff = Math.floor((currentTime - startTime) / (1000 * 60 * 60 * 24))
          return daysDiff * this.cellWidth
        case 'week':
          const weeksDiff = Math.floor((currentTime - startTime) / (1000 * 60 * 60 * 24 * 7))
          return weeksDiff * this.cellWidth
        case 'month':
          const monthsDiff = (date.getFullYear() - this.startDate.getFullYear()) * 12 + 
                           (date.getMonth() - this.startDate.getMonth())
          return monthsDiff * this.cellWidth
        default:
          return 0
      }
    },
    
    // 计算任务持续时间宽度
    getTaskDuration(task) {
      const startOffset = this.getDateOffset(task.start)
      const endOffset = this.getDateOffset(task.end)
      return Math.max(endOffset - startOffset, this.cellWidth / 2) // 最小宽度为半个单元格
    },
    
    // 计算今日时间线位置
    getTodayLineStyle() {
      const today = new Date()
      const offset = this.getDateOffset(today)
      
      return {
        left: offset + 'px'
      }
    },
    
    // 初始化滚动同步
    initScrollSync() {
      const timelineHeader = this.$refs.timelineHeader
      const ganttBody = this.$refs.ganttBody
      
      if (timelineHeader && ganttBody) {
        // 同步水平滚动
        ganttBody.addEventListener('scroll', () => {
          timelineHeader.scrollLeft = ganttBody.scrollLeft
        })
        
        timelineHeader.addEventListener('scroll', () => {
          ganttBody.scrollLeft = timelineHeader.scrollLeft
        })
      }
    },
    
    // 初始化拖拽事件
    initDragEvents() {
      document.addEventListener('mousemove', this.handleDragMove)
      document.addEventListener('mouseup', this.handleDragEnd)
    },
    
    // 开始拖拽
    startDrag(event, task) {
      event.preventDefault()
      this.isDragging = true
      this.dragTask = task
      this.dragStartX = event.clientX
      this.dragStartLeft = this.getDateOffset(task.start)
      this.originalStart = new Date(task.start)
      this.originalEnd = new Date(task.end)
      
      // 添加拖拽样式
      event.target.style.cursor = 'grabbing'
    },
    
    // 处理拖拽移动
    handleDragMove(event) {
      if (!this.isDragging || !this.dragTask) return
      
      const deltaX = event.clientX - this.dragStartX
      const newLeft = this.dragStartLeft + deltaX
      
      // 计算新的开始时间
      const newStartDate = this.calculateDateFromOffset(newLeft)
      const taskDuration = this.dragTask.end.getTime() - this.dragTask.start.getTime()
      const newEndDate = new Date(newStartDate.getTime() + taskDuration)
      
      // 更新任务时间
      this.dragTask.start = newStartDate
      this.dragTask.end = newEndDate
    },
    
    // 处理拖拽结束
    handleDragEnd() {
      if (this.isDragging && this.dragTask) {
        this.isDragging = false
        this.dragTask = null
        
        // 移除拖拽样式
        document.body.style.cursor = ''
      }
    },
    
    // 根据偏移量计算日期
    calculateDateFromOffset(offset) {
      const newDate = new Date(this.startDate)
      
      switch (this.currentView) {
        case 'day':
          const days = Math.round(offset / this.cellWidth)
          newDate.setDate(newDate.getDate() + days)
          break
        case 'week':
          const weeks = Math.round(offset / this.cellWidth)
          newDate.setDate(newDate.getDate() + weeks * 7)
          break
        case 'month':
          const months = Math.round(offset / this.cellWidth)
          newDate.setMonth(newDate.getMonth() + months)
          break
      }
      
      return newDate
    },
    
    // 任务条悬停效果
    handleTaskHover(event) {
      event.target.style.transform = 'scale(1.05)'
    },
    
    // 任务条离开效果
    handleTaskLeave(event) {
      event.target.style.transform = 'scale(1)'
    }
  },
  
  beforeDestroy() {
    // 清理事件监听器
    document.removeEventListener('mousemove', this.handleDragMove)
    document.removeEventListener('mouseup', this.handleDragEnd)
  }
}
</script>

<style scoped>
.gantt-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

/* 视图切换控制 */
.view-controls {
  padding: 16px;
  border-bottom: 1px solid #e1e5e9;
  background: #f8f9fa;
}

.view-btn {
  padding: 8px 16px;
  margin-right: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.view-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

/* 甘特图主体 */
.gantt-main {
  display: flex;
  flex-direction: column;
  height: 500px;
}

/* 时间轴头部 */
.timeline-header {
  border-bottom: 1px solid #e1e5e9;
  background: #f8f9fa;
  overflow: hidden;
}

.timeline-scroll {
  display: flex;
  min-width: 100%;
}

.timeline-cell {
  flex-shrink: 0;
  padding: 12px 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  border-right: 1px solid #e1e5e9;
  background: #f8f9fa;
}

/* 任务主体区域 */
.gantt-body {
  flex: 1;
  overflow: auto;
  position: relative;
}

.gantt-scroll {
  position: relative;
  min-height: 100%;
}

/* 任务列表 */
.task-list {
  position: relative;
}

.task-item {
  display: flex;
  height: 60px;
  border-bottom: 1px solid #f3f4f6;
  position: relative;
}

.task-item:hover {
  background: rgba(59, 130, 246, 0.05);
}

/* 任务名称 */
.task-name {
  width: 200px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  background: #fff;
  border-right: 1px solid #e1e5e9;
  flex-shrink: 0;
}

/* 任务条容器 */
.task-bar-container {
  flex: 1;
  position: relative;
  background: #fff;
}

/* 任务条 */
.task-bar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 32px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 6px;
  cursor: grab;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  padding: 0 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.task-bar:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.task-bar:active {
  cursor: grabbing;
}

/* 任务标签 */
.task-label {
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 今日时间线 */
.today-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #ef4444;
  z-index: 10;
  pointer-events: none;
}

.today-line::before {
  content: '';
  position: absolute;
  top: 0;
  left: -3px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
}

/* 滚动条样式 */
.gantt-body::-webkit-scrollbar,
.timeline-header::-webkit-scrollbar {
  display: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .task-name {
    width: 150px;
    font-size: 12px;
  }
  
  .cell-width {
    width: 80px;
  }
}
</style>
