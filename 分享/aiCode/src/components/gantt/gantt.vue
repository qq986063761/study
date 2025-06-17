<template>
  <div class="gantt-container">
    <!-- 头部日期显示 -->
    <div class="gantt-header" ref="header">
      <div class="header-content">
        <div class="task-name">任务名称</div>
        <div class="date-cells">
          <div v-for="date in dateList" :key="date" class="date-cell">
            {{ formatDate(date) }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- 主体部分 -->
    <div class="gantt-body" ref="body" @scroll="handleScroll">
      <div class="body-content">
        <!-- 任务列表 -->
        <div class="task-list">
          <div v-for="task in tasks" :key="task.id" class="task-item">
            <div class="task-name">{{ task.name }}</div>
            <div class="task-bar-container">
              <div class="task-bar" 
                   :style="getTaskBarStyle(task)"
                   :title="task.name">
              </div>
            </div>
          </div>
        </div>
        
        <!-- 时间线 -->
        <div class="timeline" :style="{ left: todayLinePosition + 'px' }">
          <div class="timeline-label">今天</div>
          <div class="timeline-line"></div>
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
      startDate: new Date('2025/6/12'),
      endDate: new Date('2025/10/1'),
      cellWidth: 40, // 每个日期单元格的宽度
      tasks: [
        { id: 1, name: '任务1', start: '2025/6/15', end: '2025/7/1' },
        { id: 2, name: '任务2', start: '2025/7/1', end: '2025/8/15' },
        { id: 3, name: '任务3', start: '2025/8/1', end: '2025/9/1' },
      ],
      todayLinePosition: 0
    }
  },
  computed: {
    dateList() {
      const dates = []
      let currentDate = new Date(this.startDate)
      while (currentDate <= this.endDate) {
        dates.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }
      return dates
    }
  },
  mounted() {
    this.calculateTodayLinePosition()
    window.addEventListener('resize', this.calculateTodayLinePosition)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateTodayLinePosition)
  },
  methods: {
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`
    },
    handleScroll(e) {
      // 同步头部滚动
      this.$refs.header.scrollLeft = e.target.scrollLeft
    },
    getTaskBarStyle(task) {
      const startDate = new Date(task.start)
      const endDate = new Date(task.end)
      const startOffset = this.getDateOffset(startDate)
      const width = this.getDateOffset(endDate) - startOffset
      
      return {
        left: startOffset + 'px',
        width: width + 'px'
      }
    },
    getDateOffset(date) {
      const diffTime = date - this.startDate
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      return diffDays * this.cellWidth
    },
    calculateTodayLinePosition() {
      const today = new Date()
      if (today >= this.startDate && today <= this.endDate) {
        this.todayLinePosition = this.getDateOffset(today)
      }
    }
  }
}
</script>

<style scoped>
.gantt-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
}

.gantt-header {
  border-bottom: 1px solid #ddd;
  overflow: hidden;
}

.header-content {
  display: flex;
  min-width: max-content;
}

.task-name {
  width: 150px;
  padding: 8px;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  font-weight: bold;
}

.date-cells {
  display: flex;
}

.date-cell {
  width: 40px;
  padding: 8px 4px;
  text-align: center;
  border-right: 1px solid #ddd;
  font-size: 12px;
}

.gantt-body {
  flex: 1;
  overflow: auto;
  position: relative;
}

.body-content {
  position: relative;
  min-width: max-content;
}

.task-list {
  position: relative;
}

.task-item {
  display: flex;
  height: 40px;
  border-bottom: 1px solid #ddd;
}

.task-bar-container {
  position: relative;
  flex: 1;
}

.task-bar {
  position: absolute;
  height: 20px;
  top: 10px;
  background: #4CAF50;
  border-radius: 3px;
  cursor: pointer;
}

.timeline {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #ff0000;
  z-index: 1;
}

.timeline-label {
  position: absolute;
  top: 0;
  left: 4px;
  background: #ff0000;
  color: white;
  padding: 2px 4px;
  border-radius: 2px;
  font-size: 12px;
}

.timeline-line {
  position: absolute;
  top: 20px;
  bottom: 0;
  width: 2px;
  background: #ff0000;
}
</style>
