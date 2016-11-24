var pie = {
  title: {
    text: '',
    x: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    data: [], // _.map(this.chartData1, 'name'),
    left: 'left',
    orient: 'vertical'
  },
  series: [{
    name: '',
    type: 'pie',
    radius: '55%',
    center: ['50%', '60%'],
    data: [],
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
}

export default {
  pie
}
