<template>
  <div class="gantt-demo">
    <h1>甘特图演示</h1>
    <!-- 这里引入甘特图组件 -->
    <GanttChart />
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
};
</script>

<style scoped>
.gantt-demo {
  padding: 20px;
  text-align: center;
}
</style>