<template>
  <div class="row sex-box">
    <div class="col-12">
      <interval :data="data" :options="options"></interval>
    </div>
    <div class="col-11 col-offset-1 data-table-wrap" style="min-height: 250px">
      <percent-table :headers="headers" :tables="tables" @theader-percent="sort"></percent-table>
    </div>
  </div>
</template>
<script>
  import PercentTable from 'components/PercentTable'
  import Interval from 'components/g2-charts/Interval'
  import api from 'api'

  export default {
    name: 'Age',

    components: {
      Interval,
      PercentTable
    },
    data () {
      return {
        options: {
          props: {
            height: 300,
            plotCfg: {
              margin: [40, 0, 50, 50]
            }
          },
          defs: {
            'age': {
              type: 'cat',
              alias: '年龄'
            },
            'count': {
              alias: '数量',
              min: 0
            }
          },
          position: window.G2.Stat.summary.percent('age*count')
        },
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
        var result = [this.lt19, this.lt29, this.lt39, this.lt49, this.lt100]
        return result
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
        const CONDITIONS = [
          {
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
        CONDITIONS.forEach((item) => {
          api.statistics.getUserAge(item.min, item.max).then((res) => {
            this[item.name] = {
              age: this[item.name].age,
              count: res.data.total
            }
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
