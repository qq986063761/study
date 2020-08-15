function initRadar(chart) {
  // 系列样式
  const seriesStyleConfig = {
    itemStyle: {
      color: '#3398DB'
    },
    lineStyle: {
      color: '#3398DB'
    },
    areaStyle: {
      color: {
        type: 'radial',
        x: 0.5,
        y: 0.5,
        r: 0.5,
        colorStops: [{
          offset: 0, color: '#fff'
        }, {
          offset: 1, color: '#3398DB'
        }]
      }
    }
  }

  chart.setOption({
    title: {
      text: '雷达图'
    },
    tooltip: {},
    legend: {
      data: ['雷达图']
    },
    // 雷达图背景区域
    radar: {
      // shape: 'circle',
      name: {
        textStyle: {
          color: 'black'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#3398DB'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#3398DB'
        }
      },
      splitArea: {
        show: true
      },
      indicator: [
        { name: '销售', max: 6500 },
        { name: '管理', max: 16000 },
        { name: '信息技术', max: 30000 },
        { name: '客服', max: 38000 },
        { name: '研发', max: 52000 },
        { name: '市场', max: 25000 }
      ]
    },
    series: [{
      name: '雷达图',
      type: 'radar',
      ...seriesStyleConfig,
      data: [
        {
          value: [4300, 10000, 28000, 35000, 50000, 19000],
          name: '雷达图'
        }
      ]
    }]
  })
}