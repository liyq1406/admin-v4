<template>
  <div class="row sex-box">
    <interval :data="data" :options="options"></interval>
  </div>
</template>
<script>
  import PercentTable from 'components/PercentTable'
  import Interval from 'components/g2-charts/Interval'
  import api from 'api'
  export default {
    name: 'sex',

    components: {
      Interval,
      PercentTable
    },
    data () {
      return {
        options: {
          horizontal: true,
          stack: true,
          props: {
            height: 300,
            plotCfg: {
              margin: [40, 20, 80, 60]
            }
          },
          defs: {
            'sex': {
              type: 'cat',
              alias: '性别'
            },
            'count': {
              alias: '数量',
              min: 0
            },
            'cat': {
              alias: '性别'
            }
          },
          position: 'cat*count',
          color: 'sex'
        },
        data: [
          // {
          //   sex: '女性',
          //   count: 1657,
          //   cat: '性别'
          // },
          // {
          //   sex: '男性',
          //   count: 1627,
          //   cat: '性别'
          // }
        ]
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
        api.statistics.getUserSex().then((res) => {
          let male = {
            sex: '男性',
            count: res.data.male_total,
            cat: '性别'
          }
          let female = {
            sex: '女性',
            count: res.data.female_total,
            cat: '性别'
          }
          this.data = [male, female]
        }).catch((res) => {
          this.handleError(res)
        })
      }
    }

  }

</script>
