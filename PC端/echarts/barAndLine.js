function initBarAndLine(chart) {
  // 轴线样式
  const axisLineStyleConfig = {
    boundaryGap: true, // 内部的两边留白区域配置
    axisLabel: {
      color: '#3398DB',
      fontSize: 18,
      rotate: 0,
      formatter: '{value}',
      interval: 0, // 间隔多少标签显示一个，0全显示
    },
    axisLine: {
      lineStyle: {
        color: '#3398DB'
      }
    },
    axisTick: {
      alignWithLabel: true, // 刻度对齐item
      lineStyle: {
        color: '#3398DB'
      }
    },
    splitLine: {
      show: true,
      interval: 0, // 分割线的显示间隔数
      lineStyle: {
        color: '#3398DB'
      }
    }
  }

  // 系列样式
  const seriesStyleConfig = {
    smooth: true, // 折线平滑
    itemStyle: {
      // 圆角
      barBorderRadius: [5, 5, 0, 0],
      color: '#3398DB'
    },
    lineStyle: {
      color: '#3398DB'
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0, color: '#3398DB'
        }, {
          offset: 1, color: '#fff'
        }]
      }
    }
  }

  chart.setOption({
    title: {
      text: '折线图'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['折线图', '柱状图']
    },
    // 图表网格区域配置
    grid: {
      left: 50,
      right: 50,
      bottom: 50,
      top: 50,
      containLabel: true
    },
    // 轴线区域配置
    xAxis: {
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      ...axisLineStyleConfig
    },
    yAxis: {
      type: 'value',
      ...axisLineStyleConfig
    },
    // 数据系列区域配置
    series: [
      {
        name: '折线图',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210],
        ...seriesStyleConfig
      },
      {
        name: '柱状图',
        type: 'bar',
        barWidth: 30,
        barMinHeight: 5,
        // stack: '总量', // 相同stack会叠加在一起
        label: {
          show: true,
          formatter(params) {
            return `${params.value / 5}%`
          }
        },
        data: [120, 200, 150, 80, 70, 110, 130],
        ...seriesStyleConfig
      }
    ]
  })
}