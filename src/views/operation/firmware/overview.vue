<template>
  <div class="main">
    <div class="main-title">
      <h3>固件信息概览</h3>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="row mt40 mb40">
          <div class="col-15 with-loading">
            <pie-chart :series="firmwareSeries" v-ref:firmware-chart></pie-chart>
            <div class="icon-loading" v-show="loadingData">
              <i class="fa fa-refresh fa-spin"></i>
            </div>
          </div>
          <div class="col-9">
            <div class="statistics-info">
              <div class="item no-border">
                <div class="cont">
                  <div class="num">{{ totalSummary.total }}</div>
                  <div class="label">{{ $t("ui.dashboard.statistic.total") }}</div>
                </div>
              </div>
              <div class="item no-border">
                <div class="cont">
                  <div class="num">{{ totalSummary.activated }}</div>
                  <div class="label">{{ $t("ui.dashboard.statistic.activated") }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import Vue from 'vue'
  // import locales from 'consts/locales/index'
  import api from 'api'
  import Modal from 'components/Modal'
  // import _ from 'lodash'
  import { globalMixins } from 'src/mixins'
  import PieChart from 'components/charts/Pie'

  export default {
    name: 'Applications',

    mixins: [globalMixins],

    components: {
      'modal': Modal,
      'pie-chart': PieChart
    },

    data () {
      return {
        // 设备统计
        totalSummary: {
          total: 0,
          activated: 0
        },
        loadingData: false
      }
    },
    computed: {
      // 告警图表数据
      firmwareSeries () {
        var result = [{
          name: '概览',
          type: 'pie',
          radius: '80%',
          center: ['50%', '50%'],
          data: [
            {value: 1, name: 'V1'}
          ]
        }]
        return result
      }
    },

    route: {
      data () {
        api.statistics.getSummary().then((res) => {
          if (res.status === 200) {
            this.totalSummary = res.data.total
          }
        }).catch((res) => {
          this.handleError(res)
        })
      }
    },

    ready () {
      // 监听窗口尺寸变化
      window.onresize = () => {
        this.$refs.firmwareChart.chart.resize()
      }
    },

    methods: {

    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../assets/stylus/common'

  .statistics-info
    margin-top 100px
</style>
