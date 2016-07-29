<template>
  <div>
    <v-interval :data="iconData" :options="iconOptions"></v-interval>
  </div>
</template>

<script>
import Interval from './Interval'
import Mock from 'mockjs'

export default {
  name: 'Interval',

  components: {
    'v-interval': Interval
  },

  props: {
    color: {
      type: String,
      default: 'gray'
    }
  },

  data () {
    return {
      COLORS: {
        'gray': '#383838',
        'green': '#4CBF5E',
        'blue': '#307FC1',
        'orange': '#F69052'
      },
      iconData: [],
      iconOptions: {}
    }
  },

  ready () {
    // 图表基本配置
    var statisticOptions = {
      props: {
        height: 40,
        plotCfg: {
          margin: [0, 0, 0, 0]
        }
      },
      defs: {
        'date': {
          type: 'cat',
          alias: '日期'
        },
        'count': {
          alias: '数量',
          min: 0
        }
      },
      axis: false,
      legend: false,
      tooltip: false,
      position: 'date*count'
    }

    this.iconData = this.genData(this.color)
    statisticOptions.color = this.COLORS[this.color]
    this.iconOptions = statisticOptions
  },

  methods: {
    genData (color) {
      var count1 = [139, 106, 157, 64, 124, 157, 64, 124, 58, 139, 106, 58, 74, 88, 157, 64, 124, 58, 74, 88]
      var count2 = [139, 106, 58, 74, 88, 157, 64, 124, 58, 74, 88, 139, 106, 157, 64, 124, 157, 64, 124, 58]
      var count3 = [58, 74, 88, 139, 106, 157, 64, 124, 157, 64, 124, 58, 139, 106, 58, 74, 88, 157, 64, 124]
      var count4 = [157, 64, 124, 58, 139, 106, 58, 74, 88, 157, 64, 124, 58, 74, 88, 139, 106, 157, 64, 124]

      var count = []
      switch (color) {
        case 'gray':
          count = count1
          break
        case 'green':
          count = count2
          break
        case 'blue':
          count = count3
          break
        case 'orange':
        default:
          count = count4
          break
      }

      return Mock.mock({
        'list|20': [{
          'date|+1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          'count|+1': count
        }]
      }).list
    }
  }
}
</script>
