function initPie(chart) {
  const COLOR = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];

  chart.setOption({
    // color: ['#999'], // 没数据的时候的颜色配置
    title: {
      text: '饼图'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      data: ['饼图']
    },
    series: [
      {
        name: '饼图',
        type: 'pie',
        radius: [100, 200],
        center: ['50%', '50%'],
        hoverOffset: 0,
        silent: false, // 如果没有数据可以将颜色全设置为灰色，然后配置这个选项为 true
        labelLine: {
          show: true
        },
        label: {
          normal: {
            show: true,
            // position: 'center',
            color: '#3398DB',
            fontSize: 18,
            // 格式化 label b|表示用 rich 中对应 key 的样式属性，| 之后的内容表示显示内容
            formatter: params => {
              return `{b|${params.data.name}}\n{hr${params.data.key}|}\n{c|${Number(params.data.value).toLocaleString()}}`
            },
            rich: {
              b: {
                lineHeight: 33
              },
              c: {
                lineHeight: 33,
              },
              hr0: {
                borderColor: COLOR[0],
                width: '100%',
                borderWidth: 1,
                height: 0
              },
              hr1: {
                borderColor: COLOR[1],
                width: '100%',
                borderWidth: 1,
                height: 0
              }
            }
          },
          // emphasis: {
          //   show: false
          // }
        },
        itemStyle: {
          borderColor: '#0B1026',
          borderWidth: 2
        },
        data: [
          { value: 80, name: '数据1', key: 0},
          { value: 100, name: '数据2', key: 1}
        ]
      }
    ]
  })
}