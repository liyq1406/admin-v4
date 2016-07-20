<template>
  <div class="main">
    <div class="main-title">
      <h2>大客户管理</h2>
    </div>
    <div class="panel">
      <div class="panel-bd"></div>
    </div>
    <div class="row statistic-group">
      <div class="col-6">
        <statistic :info="majorSummary.monthIncrease" :title="majorSummary.monthIncrease.title" :has-target="true" align="left">
          <div>{{majorSummary.monthIncrease.target.title}}:{{majorSummary.monthIncrease.target.value}} <i class="change-reduse">({{majorSummary.monthIncrease.target.change}})</i></div>
        </statistic>
      </div>
      <div class="col-6">
        <statistic :info="majorSummary.number" :title="majorSummary.number.title" :has-target="true" align="left">
          <div>{{majorSummary.monthIncrease.target.title}}:{{majorSummary.monthIncrease.target.value}} <i class="change-reduse">({{majorSummary.monthIncrease.target.change}})</i></div>
        </statistic>
      </div>
      <div class="col-6">
        <statistic :info="majorSummary.completion" :title="majorSummary.completion.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="majorSummary.percent" :title="majorSummary.percent.title" align="left"></statistic>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import Statistic from 'components/Statistic'

export default {
  name: 'MajorClients',

  mixins: [globalMixins],

  components: {
    Statistic
  },

  data () {
    return {
      majorSummary: {
        monthIncrease: {
          total: 38,
          change: 21,
          title: '月新增数',
          target: {
            title: '年目标',
            value: 39292,
            change: -245
          }
        },
        number: {
          total: 318,
          title: '年大客户数'
        },
        completion: {
          total: 54,
          unit: '%',
          change: 23,
          title: '年大客户目标完成率'
        },
        percent: {
          total: 38,
          unit: '%',
          change: 24,
          title: '大客户占比'
        }
      }
    }
  }
}
</script>
