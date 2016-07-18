<template>
  <div class="main device-details">
    <div class="main-title">
      <h3>告警详情</h3>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt15 mb20 no-split-line">
      <div class="panel-bd row">
        <div class="col-16">
          <info-card>
            <div class="alert-record-summary">

              <div class="up">
                <h3>AQI过低</h3>
                <span class="text-label-warning">中等</span>
              </div>
              <div class="down row">
                <div class="col-12">
                  <span>2016-12-03</span>
                  <span class="ml15">16:12:03</span>
                </div>
                <div class="col-12">
                  <button>
                    <i class="fa fa-commenting"></i>
                    通知维保
                  </button>
                  <button>
                    <i class="fa fa-check"></i>
                    已处理
                  </button>
                </div>
              </div>
            </div>
          </info-card>
          <div v-stretch="230">
            <info-list :info="deviceInfo"></info-list>
          </div>
        </div>
        <div class="col-8 device-map with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div id="device-map" class="mt10 ml30" style="height: 220px"></div>
        </div>
      </div>
    </div>
    <tab :nav="secondaryNav"></tab>
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
  </div>
</template>

<script>
// import api from 'api'
// import * as config from 'consts/config'
import Tab from 'components/Tab'
import InfoCard from 'components/InfoCard'
import InfoList from 'components/InfoList'
import Breadcrumb from 'components/Breadcrumb'
import { globalMixins } from 'src/mixins'

export default {
  name: 'Device',

  mixins: [globalMixins],

  components: {
    Tab,
    Breadcrumb,
    InfoCard,
    InfoList
  },

  data () {
    return {
      alertSummary: {},
      deviceInfo: {
        device: {
          label: '告警设备',
          value: '电饭锅'
        },
        status: {
          label: '设备状态',
          value: '未处理'
        },
        duration: {
          label: '持续时长',
          value: '1.2h'
        },
        createTime: {
          label: '处理时间',
          value: '2016-09-17 09:16:09'
        },
        area: {
          label: '告警地区',
          value: '广东 顺德'
        },
        userId: {
          label: '用户账号',
          value: '1992019201'
        }
      },
      secondaryNav: [],
      breadcrumbNav: [{
        label: '全部',
        link: '/operation/alerts/record'
      }, {
        label: '告警信息'
      }]
    }
  },

  route: {
    data (transition) {
      var deviceDetailRoot = `/operation/alerts/detail/${this.$route.params.id}`

      return {
        secondaryNav: [{
          label: '告警历史',
          link: { path: `${deviceDetailRoot}/history` }
        }, {
          label: '维保记录',
          link: { path: `${deviceDetailRoot}/warranty` }
        }]
      }
    }
  },

  ready () {
    // 将回调绑定在全局供高德地图加载后调用
    window.init = this.initMap
  },

  methods: {
    /**
     * 地图初始化
     */
    initMap () {
      // 地图初始化
      this.map = new AMap.Map('device-map', {
        resizeEnable: true,
        zoom: 15
      })
      this.map.setCenter(this.mapCenter)

      this.marker = new AMap.Marker({
        map: this.map,
        position: this.mapCenter,
        icon: 'static/images/marker.png',
        offset: {x: -11, y: -28}
      })
    }
  }
}
</script>

<style lang='stylus'>
@import '../../../../assets/stylus/common'
.alert-record-summary
  .up
    h3
      height 30px
      font-weight normal
      font-size 20px
      margin 0
      display inline-block
      vertical-align middle
    span
      width 55px
      vertical-align middle
      margin-left 15px

  .down
    color gray-light
    font-size 12px
    button
      border 1px solid #BCBCBC
      outline none
      background-color #FAFAFA
      color #323232
      height 24px
      float right
      margin-right 20px
      i
        font-size 15px
</style>
