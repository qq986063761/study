<template>
  <div class="gantt-demo">
    <h1>Vue2 交互式甘特图 Demo</h1>
    <div class="demo-container">
      <GanttChart />
    </div>
  </div>
</template>

<script>
import GanttChart from '@/components/gantt/gantt.vue'

export default {
  name: 'GanttDemo',
  components: {
    GanttChart
  }
}
</script>

<style scoped>
.gantt-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #374151;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
}

.demo-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>