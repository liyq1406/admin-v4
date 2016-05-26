<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="action-bar">
        <v-select width="140px" :label="issueType.label" size="small">
          <span slot="label">查看</span>
          <select v-model="issueType">
            <option v-for="opt in issueTypeOptions" :value="opt">{{ opt.label }}</option>
          </select>
        </v-select>
        <radio-group :items="periods" :value.sync="period" class="fr"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-group>
      </div>
      <div class="row mt40 mb40">
        <div class="col-15 with-loading">
          <pie-chart :series="issueSeries" v-ref:issue-chart></pie-chart>
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
        </div>
        <div class="col-9">
          <div class="statistics-info">
            <div class="item no-border">
              <div class="cont">
                <div class="num">{{ statistic.new }}</div>
                <div class="label">{{ $t("ui.helpdesk.statistic.new") }}</div>
              </div>
            </div>
            <div class="item no-border">
              <div class="cont">
                <div class="num">{{ statistic.waitingProcess }}</div>
                <div class="label">{{ $t("ui.helpdesk.statistic.waiting_process") }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import locales from '../../../consts/locales/index'
  import api from '../../../api'
  import Modal from '../../../components/Modal'
  import Select from '../../../components/Select'
  import RadioGroup from '../../../components/RadioGroup'
  // import _ from 'lodash'
  import { globalMixins } from '../../../mixins'
  import { pluginMixins } from '../mixins'

  import PieChart from '../../../components/charts/Pie'

  export default {
    name: 'Overview',

    layout: 'admin',

    mixins: [globalMixins, pluginMixins],

    components: {
      'modal': Modal,
      'pie-chart': PieChart,
      'v-select': Select,
      'radio-group': RadioGroup
    },

    data () {
      return {
        // 待选问题类型
        issueTypeOptions: locales[Vue.config.lang].data.ISSUE_TYPES,
        // 问题类型
        issueType: {
          label: '新增问题',
          value: 0
        },
        // 时间间隔
        period: 7,
        // 待选时间间隔
        periods: locales[Vue.config.lang].data.PERIODS,
        // 统计
        statistic: {
          new: 0,
          waitingProcess: 0
        },
        // 数据是否加载中
        loadingData: false
      }
    },
    computed: {
      // 问题图表数据
      issueSeries () {
        var result = [{
          name: '概览',
          type: 'pie',
          radius: '80%',
          center: ['50%', '50%'],
          data: [
            {value: 10, name: '产品咨询'},
            {value: 7, name: '投诉建议'},
            {value: 4, name: '产品故障'},
            {value: 2, name: '退换服务'},
            {value: 5, name: ' 使用帮助'}
          ]
        }]
        return result
      }
    },

    route: {
      data () {
        this.getFeedbackList()
      }
    },

    ready () {
      // 监听窗口尺寸变化
      window.onresize = () => {
        this.$refs.issueChart.chart.resize()
      }
    },

    methods: {
      getFeedbackList () {
        var self = this
        var argvs = arguments
        var fn = self.getOrderWorkList
        this.getAppToKen(this.$route.params.app_id, 'helpdesk').then((token) => {
          api.helpdesk.getFeedbackGroup(this.$route.params.app_id, token).then((res) => {
            this.total = res.data.count
            this.workOrders = res.data.list
            this.loadingData = false
          }).catch((err) => {
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'warranty'
            }
            self.handlePluginError(err, env)
            this.loadingData = false
          })
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../assets/stylus/common'
  .statistics-info
    margin-top 80px
</style>
