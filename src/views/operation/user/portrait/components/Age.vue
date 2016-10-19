<template>
  <div class="row sex-box">
    <div class="col-12">
      <chart :options="ageOptions" :loading="loadingData" height="280px"></chart>
    </div>
    <div class="col-11 col-offset-1 data-table-wrap" style="min-height: 250px">
      <percent-table :headers="headers" :tables="tables" @theader-percent="sort"></percent-table>
    </div>
  </div>
</template>
<script>
import PercentTable from 'components/PercentTable'
import Chart from 'components/Chart/index'
import api from 'api'
import _ from 'lodash'

export default {
  name: 'Age',

  components: {
    PercentTable,
    Chart
  },
  data () {
    return {
      loaded: 0,
      headers: [
        {
          key: 'age',
          title: '年龄'
        },
        {
          key: 'count',
          title: '数量'
        },
        {
          key: 'percent',
          title: '占比',
          sortType: -1
        }
      ],
      lt19: {
        age: '19岁以下',
        count: 0
      },
      lt29: {
        age: '20-29岁',
        count: 0
      },
      lt39: {
        age: '30-39岁',
        count: 0
      },
      lt49: {
        age: '40-49岁',
        count: 0
      },
      lt100: {
        age: '50岁以上',
        count: 0
      }
    }
  },

  computed: {
    tables () {
      var result = [this.lt19, this.lt29, this.lt39, this.lt49, this.lt100]
      let total = 0
      result.map((item) => {
        total += item.count - 0
      })
      result = result.map((item) => {
        item.percent = (item.count / total * 100) || 0
        item.percent = item.percent.toFixed(1) + '%'
        return item
      })
      result.sort((a, b) => {
        return (a.count - b.count) * this.headers[this.headers.length - 1].sortType
      })
      return result
    },
    // 图表数据
    data () {
      let result = _.map([this.lt19, this.lt29, this.lt39, this.lt49, this.lt100], 'count')
      let total = _.sum(result)

      result = _.map(result, (item) => {
        let res = 0
        if (total) {
          res = Math.round(item / total * 10000) / 100
        }
        return res
      })
      return result
    },

    loadingData () {
      return this.loaded < 5
    },

    // 年龄图表配置
    ageOptions () {
      return {
        tooltip: {
          trigger: 'axis',
          formatter: '{b} <br/>{a} : {c}%',
          // formatter (obj) {
          //   console.log(obj)
          //   return 'abc'
          // },
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          data: ['19岁以下', '20-29岁', '30-39岁', '40-49岁', '50岁以上']
        },
        yAxis: {
          axisLabel: {
            show: true,
            interval: 'auto',
            formatter: '{value}%'
          }
        },
        series: [{
          name: '占比',
          type: 'bar',
          barMaxWidth: 40,
          data: this.data
        }]
      }
    }
  },
  ready () {
    this.getData()
  },

  methods: {
    /**
     * 获取数据
     * @return {[type]} [description]
     */
    getData () {
      const CONDITIONS = [{
        name: 'lt19',
        min: 0,
        max: 19
      }, {
        name: 'lt29',
        min: 19,
        max: 29
      }, {
        name: 'lt39',
        min: 29,
        max: 39
      }, {
        name: 'lt49',
        min: 39,
        max: 49
      }, {
        name: 'lt100',
        min: 49,
        max: 100
      }]
      this.loaded = 0
      CONDITIONS.forEach((item) => {
        api.statistics.getUserAge(item.min, item.max).then((res) => {
          this[item.name] = {
            age: this[item.name].age,
            count: res.data.total
          }
          this.loaded++
        }).catch((res) => {
          this.handleError(res)
        })
      })
    },
    sort (header) {
      this.headers.forEach((item) => {
        if (item.key === 'percent') {
          item.sortType = header.sortType * -1
        }
      })
    }
  }
}
</script>
