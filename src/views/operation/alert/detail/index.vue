<template>
  <div class="main device-details">
    <div class="main-title">
      <h2>告警详情</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt15 mb20 no-split-line">
      <div class="panel-bd row">
        <div class="col-16">
          <info-card>
            <div class="alert-record-summary">

              <div class="up">
                <h3>{{ info.alert_name || '暂无'}}</h3>
                <span v-for="tag in info.tags | toTags" :class="{'text-label-danger':info.tags==='严重', 'text-label-info':info.tags==='轻微'}" class="text-label">{{ info.tags || '暂无'}} </span>
              </div>
              <div class="down row">
                <div class="col-12">
                  <span>{{ info.create_date | formatDate }}</span>
                  <!-- <span class="ml15">16:12:03</span> -->
                </div>
                <div class="col-12">
                  <button>
                    <i class="fa fa-commenting"></i>
                    通知维保
                  </button>
                  <button v-if="info.is_read" @click="changeStyleUnread"  style="background-color:red;color:#fff">
                    <!-- <i class="fa fa-check"></i> -->
                    重开任务
                  </button>
                  <button v-else @click="changeStyle">
                    <!-- <i class="fa fa-check"></i> -->
                    标记为已处理
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
import api from 'api'
// import * as config from 'consts/config'
import Tab from 'components/Tab'
import InfoCard from 'components/InfoCard'
import InfoList from 'components/InfoList'
import Breadcrumb from 'components/Breadcrumb'
import { globalMixins } from 'src/mixins'
import { formatDate } from 'src/filters'
// import dateFormat from 'date-format'

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
      alerts: [],
      account: '',
      info: {
        id: '',
        type: '',
        product_name: '',
        product_id: '',
        alert_name: '',
        alert_value: '',
        notify_type: '',
        from: '',
        to: '',
        content: '',
        create_date: '',
        is_read: false,
        tags: '',
        location: '',
        read_time: ''
      },
      alertSummary: {},
      // deviceInfo: {
      //   device: {
      //     label: '告警设备',
      //     value: this.info.product_name
      //   },
      //   status: {
      //     label: '设备状态',
      //     value: '未处理'
      //   },
      //   duration: {
      //     label: '持续时长',
      //     value: '1.2h'
      //   },
      //   createTime: {
      //     label: '处理时间',
      //     value: '2016-09-17 09:16:09'
      //   },
      //   area: {
      //     label: '告警地区',
      //     value: '广东 顺德'
      //   },
      //   userId: {
      //     label: '用户账号',
      //     value: '1992019201'
      //   }
      // },
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

  computed: {
    deviceInfo () {
      var info = {
        device: {
          label: '告警设备',
          value: this.info.product_name || 'N/A'
        },
        status: {
          label: '设备状态',
          value: this.info.is_read ? '已处理' : '未处理'
        },
        duration: {
          label: '持续时长',
          value: this.info.lasting + 'h' || 'N/A'
        },
        createTime: {
          label: '处理时间',
          value: this.info.read_time ? formatDate(this.info.read_time) : 'N/A'
        },
        area: {
          label: '告警地区',
          value: this.info.location || 'N/A'
        },
        userId: {
          label: '用户账号',
          value: this.account || 'N/A'
        }
      }
      return info
    }
  },

  filters: {
    toTags (value) {
      return value.length ? value.split(',') : []
    }
  },

  ready () {
    // 将回调绑定在全局供高德地图加载后调用
    window.init = this.initMap
    this.getInfo()
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
    },
    // 修改告警状态为已读@author weijie
    changeStyle () {
      var params = [this.$route.params.id]
      api.alert.setAlertRead(params).then((res) => {
        if (res.status === 200) {
          this.getInfo()
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    // 修改告警状态为未读@author weijie
    changeStyleUnread () {
      var params = [this.$route.params.id]
      api.alert.setAlertUnread(params).then((res) => {
        if (res.status === 200) {
          this.getInfo()
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    // 获取告警详情@author weijie
    getInfo () {
      var params = {
        offset: 0,
        limit: 30,
        query: {
          // _id: this.$route.params.id
          id: {
            $in: [this.$route.params.id]
          }
        }
      }
      api.alert.getAlerts(params).then((res) => {
        if (res.status === 200) {
          // console.log(res.data.list)
          // this.alerts = res.data.list
          this.info = res.data.list[0]
          if (this.info.is_read) {
            let beginTime = new Date(formatDate(this.info.create_date))
            let endTime = new Date(formatDate(this.info.read_time))
            let lasting = (endTime.getTime() - beginTime.getTime()) / 3600000
            // console.log(lasting.toFixed(1))
            this.info.lasting = lasting.toFixed(1)
          } else {
            // 计算未读告警持续时间
            let beginTime = new Date(formatDate(this.info.create_date))
            let endTime = new Date()
            let lasting = (endTime.getTime() - beginTime.getTime()) / 3600000
            // console.log(lasting.toFixed(1))
            this.info.lasting = lasting.toFixed(1)
          }
          // 获取当前设备订阅信息
          this.getSubInfo(this.info)
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    // 获取当前设备订阅信息@author weijie
    getSubInfo (item) {
      api.user.getSubInfo(item.product_id, item.from).then((res) => {
        if (res.status === 200) {
          res.data.list.forEach((user) => {
            if (user.role === '1') {
              this.profie(user)
            }
            return
          })
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    // 获取当前管理员详细信息@author weijie
    profie (item) {
      api.user.profile(item.user_id).then((res) => {
        if (res.status === 200) {
          this.account = res.data.account
        }
      }).catch((res) => {
        this.handleError(res)
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
