<template>
  <div class="sta-container">
    <div class="left-column">
      <!-- 左侧列 -->
      <div class="chart-card">
        <h3>各省平均温度 - 饼图</h3>
        <div ref="pieChart" class="chart-container"></div>
      </div>
      
      <div class="chart-card">
        <h3>各省平均温度 - 柱状图</h3>
        <div ref="barChart" class="chart-container"></div>
      </div>
      
      <div class="chart-card">
        <h3>各省平均温度 - 折线图</h3>
        <div ref="lineChart" class="chart-container"></div>
      </div>
    </div>
    
    <div class="right-column">
      <!-- 右侧列 -->
      <div class="chart-card">
        <h3>员工能力评估 - 雷达图</h3>
        <div ref="radarChart" class="chart-container"></div>
      </div>
      
      <div class="chart-card">
        <h3>公司月度利润走势 - K线图</h3>
        <div ref="klineChart" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'StaView',
  data() {
    return {
      charts: {},
      // 各省平均温度数据
      temperatureData: [
        { name: '北京', value: 12.3 },
        { name: '上海', value: 16.2 },
        { name: '广州', value: 22.1 },
        { name: '深圳', value: 23.5 },
        { name: '杭州', value: 17.8 },
        { name: '南京', value: 15.9 },
        { name: '武汉', value: 16.7 },
        { name: '成都', value: 16.2 },
        { name: '西安', value: 13.8 },
        { name: '重庆', value: 18.5 },
        { name: '天津', value: 12.8 },
        { name: '青岛', value: 13.2 },
        { name: '大连', value: 10.5 },
        { name: '厦门', value: 20.8 },
        { name: '苏州', value: 16.1 }
      ],
      // 员工能力数据
      employeeData: [
        { name: '张三', communication: 85, technical: 90, leadership: 75 },
        { name: '李四', communication: 70, technical: 95, leadership: 80 },
        { name: '王五', communication: 90, technical: 75, leadership: 85 },
        { name: '赵六', communication: 80, technical: 85, leadership: 90 },
        { name: '钱七', communication: 75, technical: 80, leadership: 70 }
      ],
      // 公司月度利润数据
      profitData: [
        ['2024-01', 120, 150, 100, 140],
        ['2024-02', 140, 180, 120, 160],
        ['2024-03', 160, 200, 140, 180],
        ['2024-04', 180, 220, 160, 200],
        ['2024-05', 200, 250, 180, 220],
        ['2024-06', 220, 280, 200, 240],
        ['2024-07', 240, 300, 220, 260],
        ['2024-08', 260, 320, 240, 280],
        ['2024-09', 280, 350, 260, 300],
        ['2024-10', 300, 380, 280, 320],
        ['2024-11', 320, 400, 300, 340],
        ['2024-12', 340, 420, 320, 360]
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initCharts()
    })
  },
  beforeDestroy() {
    // 销毁图表实例
    Object.values(this.charts).forEach(chart => {
      if (chart && chart.dispose) {
        chart.dispose()
      }
    })
  },
  methods: {
    initCharts() {
      this.initPieChart()
      this.initBarChart()
      this.initLineChart()
      this.initRadarChart()
      this.initKlineChart()
    },
    
    // 初始化饼图
    initPieChart() {
      const chartDom = this.$refs.pieChart
      const chart = echarts.init(chartDom)
      this.charts.pie = chart
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}°C ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          type: 'scroll'
        },
        series: [
          {
            name: '平均温度',
            type: 'pie',
            radius: '50%',
            data: this.temperatureData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      
      chart.setOption(option)
    },
    
    // 初始化柱状图
    initBarChart() {
      const chartDom = this.$refs.barChart
      const chart = echarts.init(chartDom)
      this.charts.bar = chart
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.temperatureData.map(item => item.name),
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          name: '温度 (°C)'
        },
        series: [
          {
            name: '平均温度',
            type: 'bar',
            data: this.temperatureData.map(item => item.value),
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ])
            }
          }
        ]
      }
      
      chart.setOption(option)
    },
    
    // 初始化折线图
    initLineChart() {
      const chartDom = this.$refs.lineChart
      const chart = echarts.init(chartDom)
      this.charts.line = chart
      
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.temperatureData.map(item => item.name),
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          name: '温度 (°C)'
        },
        series: [
          {
            name: '平均温度',
            type: 'line',
            data: this.temperatureData.map(item => item.value),
            smooth: true,
            lineStyle: {
              color: '#5470c6',
              width: 3
            },
            itemStyle: {
              color: '#5470c6'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(84, 112, 198, 0.3)' },
                { offset: 1, color: 'rgba(84, 112, 198, 0.1)' }
              ])
            }
          }
        ]
      }
      
      chart.setOption(option)
    },
    
    // 初始化雷达图
    initRadarChart() {
      const chartDom = this.$refs.radarChart
      const chart = echarts.init(chartDom)
      this.charts.radar = chart
      
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          data: this.employeeData.map(item => item.name)
        },
        radar: {
          indicator: [
            { name: '沟通能力', max: 100 },
            { name: '技术能力', max: 100 },
            { name: '领导力', max: 100 }
          ]
        },
        series: [
          {
            name: '员工能力评估',
            type: 'radar',
            data: this.employeeData.map(employee => ({
              name: employee.name,
              value: [employee.communication, employee.technical, employee.leadership]
            }))
          }
        ]
      }
      
      chart.setOption(option)
    },
    
    // 初始化K线图
    initKlineChart() {
      const chartDom = this.$refs.klineChart
      const chart = echarts.init(chartDom)
      this.charts.kline = chart
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['利润']
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%'
        },
        xAxis: {
          type: 'category',
          data: this.profitData.map(item => item[0]),
          scale: true,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          splitNumber: 20
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 50,
            end: 100
          },
          {
            show: true,
            type: 'slider',
            top: '90%',
            start: 50,
            end: 100
          }
        ],
        series: [
          {
            name: '利润',
            type: 'candlestick',
            data: this.profitData.map(item => item.slice(1)),
            itemStyle: {
              color: '#fd1050',
              color0: '#0cf49b',
              borderColor: '#fd1050',
              borderColor0: '#0cf49b'
            }
          }
        ]
      }
      
      chart.setOption(option)
    }
  }
}
</script>

<style scoped>
.sta-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.left-column,
.right-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.chart-card h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px solid #667eea;
}

.chart-container {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sta-container {
    flex-direction: column;
  }
  
  .chart-container {
    height: 300px;
  }
}
</style>
