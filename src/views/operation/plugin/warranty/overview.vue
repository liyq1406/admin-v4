<template>
  <div class="main">
    <div class="main-title">
      <h2>概览</h2>
    </div>
    <div class="panel">
      <div class="panel-bd">
        概览内容
      </div>
    </div>
    <div class="row statistic-group">
      <div class="col-6">
        <statistic :info="overviewSummary.respond" :title="overviewSummary.respond.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="overviewSummary.time" :title="overviewSummary.time.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="overviewSummary.year" :title="overviewSummary.year.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="overviewSummary.percent" :title="overviewSummary.percent.title" align="left"></statistic>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import Statistic from 'components/Statistic'

  export default {
    name: 'Overview',

    mixins: [globalMixins],

    components: {
      Statistic
    },

    data () {
      return {
        overviewSummary: {
          respond: {
            total: 23,
            change: 2,
            unit: '分',
            title: '维修平均响应时间'
          },
          time: {
            total: 2.5,
            change: -2,
            unit: 'h',
            title: '维修平均时长'
          },
          year: {
            total: 2,
            change: 0,
            unit: '年',
            title: '延保平均年限'
          },
          percent: {
            total: 34,
            change: 12,
            unit: '%',
            title: '延保率'
          }
        }
      }
    },

    methods: {}
  }
</script>
