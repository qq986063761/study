<template>
  <div class="statistics-container">
    <div class="left-column">
      <div class="chart-wrapper">
        <div ref="pieChart" class="chart"></div>
      </div>
    </div>
    <div class="right-column">
      <div class="chart-wrapper">
        <div ref="barChart" class="chart"></div>
      </div>
      <div class="chart-wrapper">
        <div ref="lineChart" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'StatisticsView',
  data() {
    return {
      temperatureData: [
        { province: '北京', temperature: 12.3 },
        { province: '上海', temperature: 16.5 },
        { province: '广东', temperature: 22.1 },
        { province: '四川', temperature: 15.8 },
        { province: '新疆', temperature: 8.2 },
        { province: '黑龙江', temperature: 3.5 },
        { province: '海南', temperature: 24.6 },
        { province: '西藏', temperature: 5.8 },
        { province: '云南', temperature: 17.2 },
        { province: '福建', temperature: 19.4 }
      ]
    }
  },
  mounted() {
    this.initCharts()
  },
  methods: {
    initCharts() {
      this.initPieChart()
      this.initBarChart()
      this.initLineChart()
    },
    initPieChart() {
      const chartDom = this.$refs.pieChart
      const myChart = echarts.init(chartDom)
      const option = {
        title: {
          text: '各省平均温度分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}°C'
        },
        series: [{
          type: 'pie',
          radius: '50%',
          data: this.temperatureData.map(item => ({
            name: item.province,
            value: item.temperature
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
      myChart.setOption(option)
    },
    initBarChart() {
      const chartDom = this.$refs.barChart
      const myChart = echarts.init(chartDom)
      const option = {
        title: {
          text: '各省平均温度柱状图',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: this.temperatureData.map(item => item.province),
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: {
          type: 'value',
          name: '温度(°C)'
        },
        series: [{
          data: this.temperatureData.map(item => item.temperature),
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }]
      }
      myChart.setOption(option)
    },
    initLineChart() {
      const chartDom = this.$refs.lineChart
      const myChart = echarts.init(chartDom)
      const option = {
        title: {
          text: '各省平均温度折线图',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.temperatureData.map(item => item.province),
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: {
          type: 'value',
          name: '温度(°C)'
        },
        series: [{
          data: this.temperatureData.map(item => item.temperature),
          type: 'line',
          smooth: true,
          markPoint: {
            data: [
              { type: 'max', name: '最高温度' },
              { type: 'min', name: '最低温度' }
            ]
          }
        }]
      }
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.statistics-container {
  display: flex;
  gap: $spacing-lg;
  padding: $spacing-lg;
  min-height: 100vh;
  background-color: $gray-50;

  .left-column {
    flex: 1;
    .chart-wrapper {
      background-color: $gray-100;
      border-radius: $radius-md;
      padding: $spacing-md;
      box-shadow: $shadow-md;
      height: 600px;
    }
  }

  .right-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;

    .chart-wrapper {
      background-color: $gray-100;
      border-radius: $radius-md;
      padding: $spacing-md;
      box-shadow: $shadow-md;
      height: 400px;
    }
  }

  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>
