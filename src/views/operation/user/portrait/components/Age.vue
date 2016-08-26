<template>
  <div class="row sex-box">
    <div class="col-12">
      <interval :data="data" :options="options"></interval>
    </div>
    <div class="col-11 col-offset-1 data-table-wrap" style="min-height: 250px">
      <percent-table @theader-percent="sort"></percent-table>
    </div>
  </div>
</template>
<script>
  import PercentTable from 'components/PercentTable'
  import Interval from 'components/g2-charts/Interval'

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
        data: []
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
        console.log('获取数据')
        const AGE_TYPES = ['19岁以下', '20-29岁', '30-39岁', '40-49岁', '50岁以上']
        this.data = AGE_TYPES.map((item, index) => {
          var data = {
            age: item,
            count: 100 * (index + 1)
          }
          return data
        })
      },
      sort () {
        console.log('排序')
      }
    }

  }

</script>
