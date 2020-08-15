function initChinaMap(chart) {
  chart.setOption({
    series: [{
      name: '中国',
      type: 'map',
      map: 'china',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      label: {
        show: true,
        color: '#1d58a5'
      },
      itemStyle: {
        borderColor: '#1d58a5',
        shadowColor: '#1d58a5',
        shadowBlur: 10,
        areaColor: 'rgba(0, 0, 0, 0)'
      },
      emphasis: {
        label: {
          color: '#1d58a5'
        },
        itemStyle: {
          areaColor: 'rgba(0, 0, 0, 0)'
        }
      },
      data: [
        {
          name: '湖南',
          value: 666,
          label: {
            color: '#1d58a5'
          },
          itemStyle: {
            areaColor: '#fff',
            shadowColor: '#fff',
            shadowBlur: 10
          },
          emphasis: {
            label: {
              color: '#1d58a5'
            },
            itemStyle: {
              areaColor: '#fff',
              shadowColor: '#fff',
              shadowBlur: 10
            }
          }
        }
      ]
    }]
  });
}