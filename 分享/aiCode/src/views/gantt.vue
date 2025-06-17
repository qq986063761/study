<template>
  <div class="gantt-demo">
    <h1>甘特图演示</h1>
    <!-- 这里引入甘特图组件 -->
    <GanttChart class="gantt-component" :tasks="tasks" />
  </div>
</template>

<script>
// 引入甘特图组件
import GanttChart from '@/components/gantt/gantt.vue';

export default {
  name: 'GanttDemo',
  components: {
    GanttChart,
  },
  data() {
    return {
      tasks: [
        {
          startTime: new Date(2025, 5, 17).getTime(),
          endTime: new Date(2025, 5, 19).getTime(),
          name: '任务1'
        },
        {
          startTime: new Date(2025, 5, 14).getTime(),
          endTime: new Date(2025, 5, 17).getTime(),
          name: '任务2'
        }
      ]
    }
  }
};
</script>

<style lang="scss">
.gantt-demo {
  padding: 20px;
  text-align: center;

  .gantt-component {
    height: 500px;
  }
}
</style>