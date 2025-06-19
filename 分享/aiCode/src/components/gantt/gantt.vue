<template>
  <div class="gantt-container">
    <div class="gantt-toolbar">
      <button v-for="v in views" :key="v" :class="{active: view===v}" @click="changeView(v)">{{ viewLabels[v] }}</button>
    </div>
    <div class="gantt-scroll" ref="scrollArea">
      <div class="gantt-header" :style="{width: headerWidth+'px'}">
        <div
          v-for="(cell, idx) in headerCells"
          :key="cell.key"
          class="gantt-header-cell"
          :style="{left: (idx*cellWidth)+'px', width: cellWidth+'px'}"
        >
          <span class="gantt-header-cell-text">{{ cell.label }}</span>
        </div>
        <div
          class="gantt-today-line"
          v-if="todayPos!==null"
          :style="{left: todayPos+'px'}"
        ></div>
      </div>
      <div class="gantt-body" :style="{width: headerWidth+'px'}">
        <div
          v-for="(task, tIdx) in tasks"
          :key="task.id"
          class="gantt-task-row"
          :style="{top: (tIdx*rowHeight)+'px', height: rowHeight+'px'}"
        >
          <div class="gantt-task-label">{{ task.name }}</div>
          <div
            class="gantt-task-bar"
            :style="taskBarStyle(task)"
            @mousedown="onTaskBarMouseDown($event, task, tIdx)"
          >
            <div class="gantt-task-handle left" @mousedown.stop="onHandleMouseDown($event, task, 'left')"></div>
            <div class="gantt-task-bar-inner"></div>
            <div class="gantt-task-handle right" @mousedown.stop="onHandleMouseDown($event, task, 'right')"></div>
          </div>
        </div>
        <div
          class="gantt-today-line gantt-today-body"
          v-if="todayPos!==null"
          :style="{left: todayPos+'px', height: (tasks.length*rowHeight)+'px'}"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
// 日期工具函数
function pad(n) { return n<10 ? '0'+n : n; }
function formatDate(date, fmt) {
  const y = date.getFullYear();
  const m = date.getMonth()+1;
  const d = date.getDate();
  if(fmt==='M月D日') return `${m}月${d}日`;
  if(fmt==='M/D') return `${m}/${d}`;
  if(fmt==='M月') return `${m}月`;
  return `${y}-${pad(m)}-${pad(d)}`;
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate()+n);
  return d;
}
function addMonths(date, n) {
  const d = new Date(date);
  d.setMonth(d.getMonth()+n);
  return d;
}
function cloneDate(date) { return new Date(date.getTime()); }
function dateDiffInDays(a, b) {
  return Math.round((b-a)/(1000*60*60*24));
}
function dateDiffInMonths(a, b) {
  return (b.getFullYear()-a.getFullYear())*12 + (b.getMonth()-a.getMonth());
}
function getWeekRange(date) {
  const d = new Date(date);
  const day = d.getDay()||7;
  const start = new Date(d);
  start.setDate(d.getDate()-day+1);
  const end = new Date(start);
  end.setDate(start.getDate()+6);
  return [start, end];
}

export default {
  name: 'GanttDemo',
  data() {
    const start = new Date('2025-06-12');
    const end = new Date('2027-10-01');
    // 5条demo任务
    const tasks = [
      {id: 1, name: '任务A', start: new Date('2025-07-01'), end: new Date('2025-08-10')},
      {id: 2, name: '任务B', start: new Date('2025-09-15'), end: new Date('2025-12-01')},
      {id: 3, name: '任务C', start: new Date('2026-01-10'), end: new Date('2026-03-20')},
      {id: 4, name: '任务D', start: new Date('2026-05-01'), end: new Date('2026-08-15')},
      {id: 5, name: '任务E', start: new Date('2027-01-01'), end: new Date('2027-04-30')},
    ];
    return {
      start,
      end,
      view: 'day',
      views: ['day','week','month'],
      viewLabels: {day:'日视图', week:'周视图', month:'月视图'},
      cellWidth: 100,
      cellMargin: 8,
      rowHeight: 40,
      tasks,
      dragging: null, // {type, task, startX, origStart, origEnd}
    };
  },
  computed: {
    headerCells() {
      const cells = [];
      if(this.view==='day') {
        let d = cloneDate(this.start);
        while(d<=this.end) {
          cells.push({
            key: formatDate(d,'yyyy-MM-dd'),
            label: formatDate(d,'M月D日'),
            date: cloneDate(d),
          });
          d = addDays(d,1);
        }
      } else if(this.view==='week') {
        let d = cloneDate(this.start);
        while(d<=this.end) {
          const [ws,we] = getWeekRange(d);
          cells.push({
            key: formatDate(ws,'yyyy-MM-dd'),
            label: formatDate(ws,'M/D')+'-'+formatDate(we,'M/D'),
            date: cloneDate(ws),
            end: cloneDate(we),
          });
          d = addDays(we,1);
        }
      } else if(this.view==='month') {
        let d = new Date(this.start.getFullYear(), this.start.getMonth(), 1);
        while(d<=this.end) {
          cells.push({
            key: formatDate(d,'yyyy-MM'),
            label: formatDate(d,'M月'),
            date: cloneDate(d),
          });
          d = addMonths(d,1);
        }
      }
      return cells;
    },
    headerWidth() {
      return this.headerCells.length * this.cellWidth;
    },
    todayPos() {
      const today = new Date();
      if(today<this.start || today>this.end) return null;
      if(this.view==='day') {
        const idx = dateDiffInDays(this.start, today);
        return idx*this.cellWidth + this.cellWidth/2;
      } else if(this.view==='week') {
        let d = cloneDate(this.start), idx=0;
        while(d<=this.end) {
          const [ws,we] = getWeekRange(d);
          if(today>=ws && today<=we) return idx*this.cellWidth + this.cellWidth/2;
          d = addDays(we,1); idx++;
        }
      } else if(this.view==='month') {
        let d = new Date(this.start.getFullYear(), this.start.getMonth(), 1), idx=0;
        while(d<=this.end) {
          if(today.getFullYear()===d.getFullYear() && today.getMonth()===d.getMonth())
            return idx*this.cellWidth + this.cellWidth/2;
          d = addMonths(d,1); idx++;
        }
      }
      return null;
    },
  },
  methods: {
    changeView(v) {
      this.view = v;
      this.$nextTick(()=>{
        // 保证今日线可见
        if(this.todayPos!==null && this.$refs.scrollArea) {
          this.$refs.scrollArea.scrollLeft = Math.max(0, this.todayPos-300);
        }
      });
    },
    // 计算任务条样式
    taskBarStyle(task) {
      let startIdx=0, endIdx=0;
      if(this.view==='day') {
        startIdx = dateDiffInDays(this.start, task.start);
        endIdx = dateDiffInDays(this.start, task.end);
      } else if(this.view==='week') {
        let d = cloneDate(this.start), idx=0;
        while(d<=this.end) {
          const [ws,we] = getWeekRange(d);
          if(task.start<=we && task.end>=ws) {
            if(task.start>ws) startIdx = idx + dateDiffInDays(ws, task.start)/7;
            else startIdx = idx;
            if(task.end<we) endIdx = idx + dateDiffInDays(ws, task.end)/7;
            else endIdx = idx+1;
            break;
          }
          d = addDays(we,1); idx++;
        }
      } else if(this.view==='month') {
        let d = new Date(this.start.getFullYear(), this.start.getMonth(), 1), idx=0;
        while(d<=this.end) {
          const ms = d;
          const me = addMonths(d,1); me.setDate(0);
          if(task.start<=me && task.end>=ms) {
            if(task.start>ms) startIdx = idx + dateDiffInDays(ms, task.start)/dateDiffInDays(ms, me);
            else startIdx = idx;
            if(task.end<me) endIdx = idx + dateDiffInDays(ms, task.end)/dateDiffInDays(ms, me);
            else endIdx = idx+1;
            break;
          }
          d = addMonths(d,1); idx++;
        }
      }
      const left = startIdx*this.cellWidth;
      const width = Math.max((endIdx-startIdx+1e-6)*this.cellWidth, 24);
      return {
        left:left+'px',
        width:width+'px',
      };
    },
    // 拖拽逻辑
    onTaskBarMouseDown(e, task, tIdx) {
      if(e.button!==0) return;
      this.dragging = {
        type: 'move',
        task,
        startX: e.clientX,
        origStart: new Date(task.start),
        origEnd: new Date(task.end),
      };
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    },
    onHandleMouseDown(e, task, side) {
      if(e.button!==0) return;
      this.dragging = {
        type: side,
        task,
        startX: e.clientX,
        origStart: new Date(task.start),
        origEnd: new Date(task.end),
      };
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    },
    onMouseMove(e) {
      if(!this.dragging) return;
      const {type, task, startX, origStart, origEnd} = this.dragging;
      const dx = e.clientX - startX;
      let dayDelta = 0;
      if(this.view==='day') dayDelta = Math.round(dx/this.cellWidth);
      else if(this.view==='week') dayDelta = Math.round(dx/this.cellWidth)*7;
      else if(this.view==='month') {
        dayDelta = Math.round(dx/this.cellWidth)*30; // 近似
      }
      if(type==='move') {
        let newStart = addDays(origStart, dayDelta);
        let newEnd = addDays(origEnd, dayDelta);
        if(newStart<this.start) {
          newEnd = addDays(newEnd, dateDiffInDays(newStart, this.start));
          newStart = cloneDate(this.start);
        }
        if(newEnd>this.end) {
          newStart = addDays(newStart, dateDiffInDays(this.end, newEnd));
          newEnd = cloneDate(this.end);
        }
        if(newStart<=newEnd) {
          task.start = newStart;
          task.end = newEnd;
        }
      } else if(type==='left') {
        let newStart = addDays(origStart, dayDelta);
        if(newStart<this.start) newStart = cloneDate(this.start);
        if(newStart>task.end) newStart = cloneDate(task.end);
        task.start = newStart;
      } else if(type==='right') {
        let newEnd = addDays(origEnd, dayDelta);
        if(newEnd>this.end) newEnd = cloneDate(this.end);
        if(newEnd<task.start) newEnd = cloneDate(task.start);
        task.end = newEnd;
      }
      this.$forceUpdate();
    },
    onMouseUp() {
      this.dragging = null;
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    },
  },
  mounted() {
    if(this.todayPos!==null && this.$refs.scrollArea) {
      this.$refs.scrollArea.scrollLeft = Math.max(0, this.todayPos-300);
    }
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }
};
</script>

<style scoped>
.gantt-container {
  font-family: Arial, sans-serif;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 6px;
  box-shadow: 0 2px 8px #0001;
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
  border-radius: 4px;
  cursor: pointer;
}
.gantt-toolbar button.active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}
.gantt-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  background: #fafbfc;
}
.gantt-header {
  position: relative;
  height: 40px;
  border-bottom: 1px solid #eee;
}
.gantt-header-cell {
  position: absolute;
  top: 0;
  height: 100%;
  box-sizing: border-box;
  padding: 0 8px;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #eee;
  overflow: hidden;
}
.gantt-header-cell-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-align: center;
}
.gantt-today-line {
  position: absolute;
  top: 0;
  width: 2px;
  background: red;
  height: 40px;
  z-index: 2;
  pointer-events: none;
}
.gantt-today-body {
  top: 40px;
  height: auto;
  width: 2px;
  background: red;
  position: absolute;
  z-index: 2;
}
.gantt-body {
  position: relative;
  min-height: 220px;
}
.gantt-task-row {
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
}
.gantt-task-label {
  width: 80px;
  text-align: right;
  padding-right: 12px;
  color: #888;
  font-size: 14px;
  flex-shrink: 0;
}
.gantt-task-bar {
  position: absolute;
  left: 100px;
  top: 8px;
  height: 24px;
  display: flex;
  align-items: center;
  cursor: grab;
  z-index: 1;
}
.gantt-task-bar-inner {
  flex: 1;
  height: 100%;
  background: #409eff;
  border-radius: 4px;
  min-width: 16px;
}
.gantt-task-handle {
  width: 10px;
  height: 24px;
  background: #a259e6;
  border-radius: 4px;
  cursor: ew-resize;
}
.gantt-task-handle.left {
  margin-right: 2px;
}
.gantt-task-handle.right {
  margin-left: 2px;
}
</style>
