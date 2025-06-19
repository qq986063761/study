<template>
  <div class="gantt-demo">
    <div class="gantt-toolbar">
      <button v-for="v in views" :key="v" :class="{active: view === v}" @click="setView(v)">{{ viewLabels[v] }}</button>
    </div>
    <div class="gantt-scroll-wrap" ref="scrollWrap">
      <div class="gantt-header" :style="{ width: headerWidth + 'px' }">
        <div
          v-for="(cell, idx) in headerCells"
          :key="cell.key"
          class="gantt-header-cell"
          :style="{ left: idx * cellWidth + 'px', width: cellWidth + 'px' }"
        >
          <span class="gantt-header-cell-text" :title="cell.label">{{ cell.label }}</span>
        </div>
        <div
          v-if="todayLinePos !== null"
          class="gantt-today-line"
          :style="{ left: todayLinePos + 'px' }"
        ></div>
      </div>
      <div class="gantt-body" :style="{ width: headerWidth + 'px' }">
        <div
          v-for="(task, idx) in tasks"
          :key="task.id"
          class="gantt-task-row"
          :style="{ top: idx * rowHeight + 'px', height: rowHeight + 'px' }"
        >
          <div class="gantt-task-label">{{ task.name }}</div>
          <div
            class="gantt-task-bar"
            :style="getTaskBarStyle(task)"
            @mousedown="onTaskBarMouseDown($event, task, idx)"
          >
            <div class="gantt-task-handle left" @mousedown.stop="onHandleMouseDown($event, task, idx, 'left')"></div>
            <div class="gantt-task-bar-inner">{{ task.name }}</div>
            <div class="gantt-task-handle right" @mousedown.stop="onHandleMouseDown($event, task, idx, 'right')"></div>
          </div>
        </div>
        <div
          v-if="todayLinePos !== null"
          class="gantt-today-line body"
          :style="{ left: todayLinePos + 'px', height: tasks.length * rowHeight + 'px' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
// 日期工具函数
function formatDate(date, fmt = 'YYYY-MM-DD') {
  const d = new Date(date)
  const pad = n => n < 10 ? '0' + n : n
  return fmt
    .replace('YYYY', d.getFullYear())
    .replace('MM', pad(d.getMonth() + 1))
    .replace('DD', pad(d.getDate()))
}
function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}
function addMonths(date, n) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + n)
  return d
}
function addWeeks(date, n) {
  return addDays(date, n * 7)
}
function getWeekRange(date) {
  const d = new Date(date)
  const day = d.getDay() || 7
  const start = new Date(d)
  start.setDate(d.getDate() - day + 1)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return [start, end]
}
function daysBetween(a, b) {
  return Math.round((b - a) / 86400000)
}
function monthsBetween(a, b) {
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())
}
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

export default {
  name: 'GanttDemo',
  data() {
    return {
      view: 'day',
      views: ['day', 'week', 'month'],
      viewLabels: { day: '日视图', week: '周视图', month: '月视图' },
      cellWidth: 100,
      cellMargin: 8,
      rowHeight: 40,
      startDate: new Date('2025-06-12'),
      endDate: new Date('2027-10-01'),
      tasks: [
        { id: 1, name: '任务A', start: new Date('2025-06-20'), end: new Date('2025-07-10') },
        { id: 2, name: '任务B', start: new Date('2025-08-01'), end: new Date('2025-09-15') },
        { id: 3, name: '任务C', start: new Date('2026-01-10'), end: new Date('2026-03-01') },
      ],
      dragInfo: null,
      headerCells: [],
      headerWidth: 0,
      todayLinePos: null,
    }
  },
  computed: {
    today() {
      return new Date()
    },
  },
  watch: {
    view: 'updateHeader',
  },
  mounted() {
    this.updateHeader()
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mouseup', this.onMouseUp)
    this.$nextTick(this.scrollToToday)
  },
  beforeDestroy() {
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mouseup', this.onMouseUp)
  },
  methods: {
    setView(v) {
      if (this.view !== v) {
        this.view = v
        this.$nextTick(this.scrollToToday)
      }
    },
    updateHeader() {
      const cells = []
      let cur = new Date(this.startDate)
      let idx = 0
      if (this.view === 'day') {
        while (cur <= this.endDate) {
          cells.push({
            key: 'd' + formatDate(cur),
            label: `${cur.getMonth() + 1}月${cur.getDate()}日`,
            date: new Date(cur),
          })
          cur = addDays(cur, 1)
          idx++
        }
      } else if (this.view === 'week') {
        while (cur <= this.endDate) {
          const [start, end] = getWeekRange(cur)
          cells.push({
            key: 'w' + formatDate(start),
            label: `${start.getMonth() + 1}/${start.getDate()}-${end.getMonth() + 1}/${end.getDate()}`,
            date: new Date(start),
            end: new Date(end),
          })
          cur = addDays(end, 1)
          idx++
        }
      } else if (this.view === 'month') {
        while (cur <= this.endDate) {
          cells.push({
            key: 'm' + cur.getFullYear() + '-' + (cur.getMonth() + 1),
            label: `${cur.getMonth() + 1}月`,
            date: new Date(cur),
          })
          cur = addMonths(cur, 1)
          idx++
        }
      }
      this.headerCells = cells
      this.headerWidth = cells.length * this.cellWidth
      this.updateTodayLine()
    },
    getTaskBarStyle(task) {
      // 计算任务条的 left/width
      let startIdx = 0, endIdx = 0
      if (this.view === 'day') {
        startIdx = daysBetween(this.startDate, task.start)
        endIdx = daysBetween(this.startDate, task.end)
      } else if (this.view === 'week') {
        const findIdx = d => {
          for (let i = 0; i < this.headerCells.length; i++) {
            const c = this.headerCells[i]
            if (d >= c.date && (!c.end || d <= c.end)) return i
          }
          return 0
        }
        startIdx = findIdx(task.start)
        endIdx = findIdx(task.end)
      } else if (this.view === 'month') {
        const findIdx = d => {
          for (let i = 0; i < this.headerCells.length; i++) {
            const c = this.headerCells[i]
            if (d.getFullYear() === c.date.getFullYear() && d.getMonth() === c.date.getMonth()) return i
          }
          return 0
        }
        startIdx = findIdx(task.start)
        endIdx = findIdx(task.end)
      }
      const left = startIdx * this.cellWidth + this.cellMargin
      const width = Math.max((endIdx - startIdx + 1) * this.cellWidth - this.cellMargin * 2, 32)
      return {
        left: left + 'px',
        width: width + 'px',
      }
    },
    onTaskBarMouseDown(e, task, idx) {
      if (e.button !== 0) return
      this.dragInfo = {
        type: 'move',
        taskIdx: idx,
        startX: e.clientX,
        origStart: new Date(task.start),
        origEnd: new Date(task.end),
      }
      document.body.style.userSelect = 'none'
    },
    onHandleMouseDown(e, task, idx, side) {
      if (e.button !== 0) return
      this.dragInfo = {
        type: 'resize',
        side,
        taskIdx: idx,
        startX: e.clientX,
        origStart: new Date(task.start),
        origEnd: new Date(task.end),
      }
      document.body.style.userSelect = 'none'
    },
    onMouseMove(e) {
      if (!this.dragInfo) return
      const { type, side, taskIdx, startX, origStart, origEnd } = this.dragInfo
      const dx = e.clientX - startX
      const cellDays = this.view === 'day' ? 1 : this.view === 'week' ? 7 : 30
      const pxPerDay = this.cellWidth / cellDays
      const deltaDays = Math.round(dx / pxPerDay)
      const tasks = [...this.tasks]
      const t = { ...tasks[taskIdx] }
      if (type === 'move') {
        let newStart = addDays(origStart, deltaDays * cellDays)
        let newEnd = addDays(origEnd, deltaDays * cellDays)
        // 限制范围
        if (newStart < this.startDate) {
          newEnd = addDays(newEnd, daysBetween(this.startDate, newStart))
          newStart = new Date(this.startDate)
        }
        if (newEnd > this.endDate) {
          newStart = addDays(newStart, daysBetween(newEnd, this.endDate))
          newEnd = new Date(this.endDate)
        }
        t.start = newStart
        t.end = newEnd
      } else if (type === 'resize') {
        if (side === 'left') {
          let newStart = addDays(origStart, deltaDays * cellDays)
          if (newStart > t.end) newStart = new Date(t.end)
          if (newStart < this.startDate) newStart = new Date(this.startDate)
          t.start = newStart
        } else if (side === 'right') {
          let newEnd = addDays(origEnd, deltaDays * cellDays)
          if (newEnd < t.start) newEnd = new Date(t.start)
          if (newEnd > this.endDate) newEnd = new Date(this.endDate)
          t.end = newEnd
        }
      }
      tasks[taskIdx] = t
      this.tasks = tasks
    },
    onMouseUp() {
      if (this.dragInfo) {
        this.dragInfo = null
        document.body.style.userSelect = ''
      }
    },
    updateTodayLine() {
      // 计算今日线在 header/body 的 left
      const today = new Date()
      if (today < this.startDate || today > this.endDate) {
        this.todayLinePos = null
        return
      }
      let idx = 0
      if (this.view === 'day') {
        idx = daysBetween(this.startDate, today)
        this.todayLinePos = idx * this.cellWidth + this.cellWidth / 2
      } else if (this.view === 'week') {
        for (let i = 0; i < this.headerCells.length; i++) {
          const c = this.headerCells[i]
          if (today >= c.date && today <= c.end) {
            this.todayLinePos = i * this.cellWidth + this.cellWidth / 2
            break
          }
        }
      } else if (this.view === 'month') {
        for (let i = 0; i < this.headerCells.length; i++) {
          const c = this.headerCells[i]
          if (today.getFullYear() === c.date.getFullYear() && today.getMonth() === c.date.getMonth()) {
            this.todayLinePos = i * this.cellWidth + this.cellWidth / 2
            break
          }
        }
      }
    },
    scrollToToday() {
      if (this.todayLinePos !== null && this.$refs.scrollWrap) {
        this.$refs.scrollWrap.scrollLeft = Math.max(this.todayLinePos - 200, 0)
      }
    },
  },
}
</script>

<style scoped>
.gantt-demo {
  font-family: Arial, sans-serif;
  background: #fff;
  border: 1px solid #eee;
  padding: 16px;
}
.gantt-toolbar {
  margin-bottom: 12px;
}
.gantt-toolbar button {
  margin-right: 8px;
  padding: 4px 16px;
  border: 1px solid #bbb;
  background: #f8f8f8;
  cursor: pointer;
  border-radius: 4px;
}
.gantt-toolbar button.active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}
.gantt-scroll-wrap {
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  border: 1px solid #eee;
  background: #fafbfc;
  height: 220px;
}
.gantt-header {
  position: relative;
  height: 40px;
  border-bottom: 1px solid #ddd;
  background: #f5f7fa;
}
.gantt-header-cell {
  position: absolute;
  top: 0;
  height: 100%;
  box-sizing: border-box;
  border-right: 1px solid #e0e0e0;
  padding: 0 8px;
  display: flex;
  align-items: center;
  width: 100px;
  overflow: hidden;
}
.gantt-header-cell-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
.gantt-today-line {
  position: absolute;
  top: 0;
  width: 2px;
  height: 40px;
  background: red;
  z-index: 2;
}
.gantt-today-line.body {
  top: 0;
  height: 100%;
}
.gantt-body {
  position: relative;
  min-height: 160px;
  background: #fff;
}
.gantt-task-row {
  position: relative;
  height: 40px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
}
.gantt-task-label {
  width: 80px;
  text-align: right;
  padding-right: 8px;
  color: #888;
  font-size: 14px;
  flex-shrink: 0;
}
.gantt-task-bar {
  position: absolute;
  left: 88px;
  top: 8px;
  height: 24px;
  display: flex;
  align-items: center;
  cursor: grab;
  z-index: 1;
}
.gantt-task-bar-inner {
  flex: 1;
  background: #409eff;
  color: #fff;
  text-align: center;
  border-radius: 4px;
  height: 100%;
  line-height: 24px;
  font-size: 13px;
  user-select: none;
}
.gantt-task-handle {
  width: 10px;
  height: 24px;
  background: #a259e6;
  border-radius: 4px;
  cursor: ew-resize;
  flex-shrink: 0;
}
.gantt-task-handle.left {
  margin-right: 2px;
}
.gantt-task-handle.right {
  margin-left: 2px;
}
</style>
