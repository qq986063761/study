<template>
  <div class="gantt">
    <!-- 添加日期头部 -->
    <div class="gantt-header">
      <div 
        v-for="day in totalDays" 
        :key="day" 
        class="gantt-header-day" 
        :style="{width: cellWidth + 'px'}">
        {{ day }}
      </div>
    </div>

    <!-- 修改为每个任务在不同的行 -->
    <div class="gantt-bar-row" v-for="task in tasks" :key="task.id">
      <div class="gantt-bar" 
           :style="getTaskStyle(task)"
           @mousedown="startDrag($event, task)"
           @click="handleTaskClick(task)">
        {{ task.name }}
      </div>
    </div>

    <!-- 添加当前时间线 -->
    <div class="current-timeline" :style="{ left: timelinePosition + 'px' }"></div>
  </div>
</template>

<script>
const startDate = new Date('2025-01-01'); // 设定甘特图的开始日期
const aDayTime = 24 * 60 * 60 * 1000

// 优化日期计算（提取为工具函数）
const calculateDayDifference = (start, end) => {
  return Math.ceil((end - start) / (24 * 60 * 60 * 1000));
}

export default {
  data() {
    return {
      cellWidth: 120,
      tasks: [
        { id: 1, name: '任务1', start: new Date('2025-01-05').getTime(), end: new Date('2025-01-10').getTime() },
        { id: 2, name: '任务2', start: new Date('2025-01-10').getTime(), end: new Date('2025-01-17').getTime() },
        { id: 3, name: '任务3', start: new Date('2025-01-15').getTime(), end: new Date('2025-01-21').getTime() }
      ],
      totalDays: Array.from({ length: 90 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        return date.toISOString().split('T')[0]; // 格式化为 YYYY-MM-DD
      }), // 生成与开始日期相关的日期
      // 添加时间刻度切换功能
      timeScale: 'day', // day/week/month
      // 添加任务拖拽功能相关数据
      isDragging: false,
      dragStartX: 0,
      currentTask: null,
      // 添加当前时间线
      currentDate: new Date().getTime()
    };
  },
  computed: {
    timelinePosition() {
      const daysPassed = calculateDayDifference(startDate, new Date());
      return daysPassed * this.cellWidth - (this.cellWidth / 2);
    }
  },
  methods: {
    getTaskStyle(task) {
      let startDay = Math.floor((task.start - startDate.getTime()) / aDayTime); // 计算任务开始的天数
      let durationDays = Math.ceil((task.end - task.start) / aDayTime); 

      return {
        left: `${startDay * this.cellWidth}px`, // 每天宽度为120px
        width: `${durationDays * this.cellWidth}px`, // 每天宽度为120px
        backgroundColor: 'skyblue',
        height: '30px',
        position: 'absolute',
        lineHeight: '30px',
        textAlign: 'center',
        borderRadius: '5px',
      };
    },
    // 拖拽处理函数
    startDrag(e, task) {
      this.isDragging = true;
      this.currentTask = task;
      this.dragStartX = e.clientX;

      document.body.addEventListener('mousemove', this.dragging);
      document.body.addEventListener('mouseup', this.endDrag);
    },
    // 拖拽中
    dragging(e) {
      if (this.isDragging) {
        const deltaX = e.clientX - this.dragStartX;

        // 计算时间的偏移量
        const timeOffset = deltaX * aDayTime / this.cellWidth;

        this.currentTask.start += timeOffset;
        this.currentTask.end += timeOffset;
        this.dragStartX = e.clientX;
      }
    },
    // 拖拽结束
    endDrag() {
      this.isDragging = false;
      this.currentTask = null;

      document.body.removeEventListener('mousemove', this.dragging);
      document.body.removeEventListener('mouseup', this.endDrag);
    },
    // 时间刻度切换
    setTimeScale(scale) {
      this.timeScale = scale;
      // 这里需要根据不同的时间尺度调整显示逻辑
    },
    // 添加任务点击处理
    handleTaskClick(task) {
      console.log('Task clicked:', task);
      // 可以触发模态框显示详细信息
    },
    calculateCellWidth() {
      const containerWidth = this.$el.offsetWidth;
      this.cellWidth = Math.max(80, containerWidth / this.totalDays.length);
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.calculateCellWidth();
  }
};
</script>

<style lang="scss">
.gantt {
  position: relative;
  height: 300px;
  border: 1px solid #ccc;
  width: 100%;
  overflow: auto;
}

.gantt-header {
  display: flex;
  margin-bottom: 10px;
}

.gantt-header-day {
  text-align: center;
  font-size: 14px;
  border-right: 1px solid #ccc;
  flex-shrink: 0;
  padding: 5px 0;
  border-bottom: 1px solid #ccc;
}

.gantt-bar-row {
  position: relative;
  height: 40px;
  margin-bottom: 5px;
}

.gantt-bar {
  // transition: all 0.2s ease;
  cursor: move;

  &:hover {
    filter: brightness(1.1); // 鼠标悬停时让任务条变亮10%
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
}

.current-timeline {
  position: absolute;
  top: 20px;
  width: 2px;
  background-color: #ff0000;
  height: 100%;
  z-index: 2;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -4px;
    width: 10px;
    height: 10px;
    background: #ff0000;
    border-radius: 50%;
  }
}

// 添加不同状态的颜色变量
$task-colors: (
  'development': #4CAF50,
  'design': #2196F3,
  'meeting': #9C27B0
);

@each $name, $color in $task-colors {
  .task-#{$name} {
    background-color: $color;
  }
}
</style>
