<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="action-bar">
        <v-select width="140px" :label="issueType.label" size="small">
          <span slot="label">查看</span>
          <select v-model="issueType" @change="getFeedbackGroupList">
            <option v-for="opt in issueTypeOptions" :value="opt">{{ opt.label }}</option>
          </select>
        </v-select>
        <radio-group :items="periods" :value.sync="period" class="fr" @select="getFeedbackGroupList"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-group>
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
        loadingData: false,
        labelGroup: []
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
          data: []
        }]
        this.labelGroup.forEach((item) => {
          result[0].data.push({
            value: item.count,
            name: item.label
          })
        })
        return result
      },

      queryCondition () {
        var result = {
          query: {}
        }
        if (this.issueType.value === 1) {
          result.query.status = 0
        }

        var curTime = (new Date()).getTime()
        var searchTime = null
        if (this.period === 7) {
          searchTime = new Date(curTime - 1000 * 60 * 60 * 24 * 7)
        } else if (this.period === 30) {
          searchTime = new Date(curTime - 1000 * 60 * 60 * 24 * 30)
        } else if (this.period === 90) {
          searchTime = new Date(curTime - 1000 * 60 * 60 * 24 * 90)
        }
        result.query.create_time = {'$gte': {'@date': searchTime}}
        return result
      }
    },

    route: {
      data () {
        this.getFeedbackGroupList()
      }
    },

    ready () {
      // 监听窗口尺寸变化
      window.onresize = () => {
        this.$refs.issueChart.chart.resize()
      }
    },

    methods: {
      getFeedbackGroupList () {
        var self = this
        var argvs = arguments
        var fn = self.getFeedbackGroupList
        this.getAppToKen(this.$route.params.app_id, 'helpdesk').then((token) => {
          api.helpdesk.getFeedbackGroup(this.$route.params.app_id, token, this.queryCondition).then((res) => {
            if (res.status === 200 && res.data.labelGroup.length > 0) {
              this.labelGroup = res.data.labelGroup
              this.statistic.new = res.data.count
              this.statistic.waitingProcess = res.data.untreat_count
            } else {
              this.labelGroup = []
            }
          }).catch((err) => {
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'helpdesk'
            }
            self.handlePluginError(err, env)
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
