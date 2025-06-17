<template>
  <div class="gantt-container">
    <!-- 头部日期显示 -->
    <div class="gantt-header" ref="header">
      <div class="task-column">任务</div>
      <div class="date-columns" ref="dateColumns">
        <div v-for="date in dateList" 
             :key="date" 
             class="date-column"
             :class="{ 'today': isToday(date) }">
          {{ formatDate(date) }}
        </div>
      </div>
    </div>
    
    <!-- 主体部分 -->
    <div class="gantt-body" ref="body">
      <div class="task-list">
        <div v-for="task in tasks" 
             :key="task.id" 
             class="task-row">
          <div class="task-name">{{ task.name }}</div>
          <div class="task-bars">
            <div class="task-bar"
                 :style="getTaskBarStyle(task)"
                 :title="task.name">
            </div>
          </div>
        </div>
      </div>
      
      <!-- 今天时间线 -->
      <div class="today-line" 
           v-if="showTodayLine"
           :style="{ left: todayLinePosition + 'px' }">
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
      endDate: new Date('2026/1/1'),
      dateList: [],
      tasks: [
        {
          id: 1,
          name: '任务1',
          startDate: new Date('2025/7/1'),
          endDate: new Date('2025/8/15')
        },
        {
          id: 2,
          name: '任务2',
          startDate: new Date('2025/8/1'),
          endDate: new Date('2025/9/30')
        }
      ],
      columnWidth: 100, // 每列的宽度
      showTodayLine: true,
      todayLinePosition: 0
    }
  },
  created() {
    this.generateDateList()
  },
  mounted() {
    this.updateTodayLine()
    // 监听窗口大小变化
    window.addEventListener('resize', this.updateTodayLine)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateTodayLine)
  },
  methods: {
    generateDateList() {
      const dates = []
      let currentDate = new Date(this.startDate)
      
      while (currentDate <= this.endDate) {
        dates.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }
      
      this.dateList = dates
    },
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`
    },
    isToday(date) {
      const today = new Date()
      return date.toDateString() === today.toDateString()
    },
    getTaskBarStyle(task) {
      const startOffset = this.getDateOffset(task.startDate)
      const endOffset = this.getDateOffset(task.endDate)
      const width = endOffset - startOffset
      
      return {
        left: startOffset + 'px',
        width: width + 'px'
      }
    },
    getDateOffset(date) {
      const start = new Date(this.startDate)
      const diffTime = date.getTime() - start.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      return diffDays * this.columnWidth
    },
    updateTodayLine() {
      const today = new Date()
      if (today >= this.startDate && today <= this.endDate) {
        this.todayLinePosition = this.getDateOffset(today)
      } else {
        this.showTodayLine = false
      }
    }
  }
}
</script>

<style scoped>
.gantt-container {
  width: 100%;
  height: 100%;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.gantt-header {
  display: flex;
  border-bottom: 1px solid #ddd;
  background: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 2;
}

.task-column {
  width: 200px;
  padding: 10px;
  border-right: 1px solid #ddd;
  background: #f5f5f5;
  position: sticky;
  left: 0;
  z-index: 3;
}

.date-columns {
  display: flex;
  overflow-x: auto;
}

.date-column {
  min-width: 100px;
  padding: 10px;
  text-align: center;
  border-right: 1px solid #ddd;
}

.date-column.today {
  background: #e6f7ff;
}

.gantt-body {
  flex: 1;
  overflow: auto;
  position: relative;
}

.task-list {
  position: relative;
}

.task-row {
  display: flex;
  height: 40px;
  border-bottom: 1px solid #eee;
}

.task-name {
  width: 200px;
  padding: 10px;
  border-right: 1px solid #ddd;
  background: #fff;
  position: sticky;
  left: 0;
  z-index: 1;
}

.task-bars {
  position: relative;
  flex: 1;
  min-width: 0;
}

.task-bar {
  position: absolute;
  height: 20px;
  top: 10px;
  background: #1890ff;
  border-radius: 3px;
  cursor: pointer;
}

.today-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #ff4d4f;
  z-index: 2;
  pointer-events: none;
}
</style>
