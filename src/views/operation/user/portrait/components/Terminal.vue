<template>
  <div class="row sex-box">
    <interval :data="data" :options="options"></interval>
    <!-- <div class="col-11 col-offset-1 data-table-wrap" style="min-height: 250px">
      <percent-table @theader-percent="sort"></percent-table>
    </div> -->
  </div>
</template>
<script>
  import PercentTable from 'components/PercentTable'
  import Interval from 'components/g2-charts/Interval'

  export default {
    name: 'terminal',

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
            'terminal': {
              type: 'cat',
              alias: '终端'
            },
            'count': {
              alias: '数量',
              min: 0
            },
            'a': {
              alias: '系统'
            }
          },
          position: 'a*count',
          color: 'terminal'
        },
        data: [
          {
            terminal: 'iPhone',
            count: 1657,
            a: '系统'
          },
          {
            terminal: 'Android',
            count: 1627,
            a: '系统'
          }
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
        console.log('获取数据')
      },
      sort () {
        console.log('排序')
      }
    }

  }

</script>
