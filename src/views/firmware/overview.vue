<template>
  <div>
    <div class="panel">
      <div style="padding: 30px 40px">
        <div class="panel-bd">
          <div class="row">
            <div class="col-15 with-loading">
              <pie-chart :series="firmwareSeries" :option="firmwareOption" v-ref:firmware-chart></pie-chart>
              <div class="icon-loading" v-show="loadingData">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
            </div>
            <div class="col-9">
              <div class="statistics-info">
                <div class="item no-border">
                  <div class="cont">
                    <div class="num">1</div>
                    <div class="label">设备总量</div>
                  </div>
                </div>
                <div class="item no-border">
                  <div class="cont">
                    <div class="num">2</div>
                    <div class="label">激活量</div>
                  </div>
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
  // import locales from '../../consts/locales/index'
  // import api from '../../api'
  import Modal from '../../components/Modal'
  import store from '../../store/index'
  import { createPlugin, updatePlugin, removePlugin } from '../../store/actions/plugins'
  // import _ from 'lodash'
  import { globalMixins } from '../../mixins'
  import PieChart from '../../components/charts/Pie'

  export default {
    name: 'Applications',

    layout: 'admin',

    mixins: [globalMixins],

    store,

    vuex: {
      getters: {
        plugins: ({ plugins }) => plugins.all
      },
      actions: {
        createPlugin,
        updatePlugin,
        removePlugin
      }
    },

    components: {
      'modal': Modal,
      'pie-chart': PieChart
    },

    data () {
      return {
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
            {value: 1, name: '种类1'},
            {value: 4, name: '种类2'},
            {value: 2, name: '种类3'},
            {value: 7, name: '种类4'},
            {value: 5, name: '种类5'}
          ]
        }]

        // for (var i = 0; i < this.period; i++) {
        //   var index = _.findIndex(this.alertTrends, (item) => {
        //     return item.day === this.alertXAxisData[i]
        //   })
        //   result[0].data[i] = index >= 0 ? this.alertTrends[index].message : 0
        // }
        return result
      },
      firmwareOption () {
        var result = [{
          legend: {
            data: [

            ]
          }
        }]
        return result
      }
    },

    route: {
      data () {

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
  @import '../../assets/stylus/common'
  .statistics-info
    margin-top 80px
</style>
