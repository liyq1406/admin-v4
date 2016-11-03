<template>
  <div class="main device-details">
    <div class="main-title">
      <h2>{{ $t('operation.alert.record.detail')}}</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt15 mb20 no-split-line">
      <div class="panel-bd row">
        <div class="col-16">
          <info-card :pic="(currentProduct.pics && currentProduct.pics.length) ? currentProduct.pics[0] : ''">
            <div class="alert-record-summary">

              <div class="up">
                <h3>{{ info.alert_name || $t('operation.alert.record.no') }}</h3>
                <span v-for="tag in info.tags | toTags" :class="{'text-label-danger':info.tags===$t('operation.alert.record.danger'), 'text-label-info':info.tags===$t('operation.alert.record.warning')}" class="text-label">{{ info.tags || $t('operation.alert.record.no')}} </span>
              </div>
              <div class="down row">
                <div class="col-12">
                  <span>{{ info.create_date | formatDate }}</span>
                  <!-- <span class="ml15">16:12:03</span> -->
                </div>
                <div class="col-12">
                  <button class="btn btn-ghost fr ml10 hidden"><i class="fa fa-commenting"></i>{{ $t('operation.alert.record.notice_warranty') }}</button>
                  <button class="btn btn-primary fr" v-if="info.is_read" @click="changeStyleUnread">{{ $t('operation.alert.record.restart_task') }}</button>
                  <button class="btn btn-ghost fr" v-else @click="changeStyle">{{ $t('operation.alert.record.sign_deal') }}</button>
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
          <div class="mt10 ml30">
            <map v-if="this.deviceLocation.length > 0" :location="deviceLocation" height="220px"></map>
            <div class="center" v-else>{{ $t('operation.alert.record.no_map') }}</div>
          </div>
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
import formatDate from 'filters/format-date'
import Map from 'components/Map'

export default {
  name: 'Device',

  mixins: [globalMixins],

  components: {
    Tab,
    Breadcrumb,
    InfoCard,
    InfoList,
    Map
  },

  data () {
    return {
      alerts: [],
      accounts: [],
      currentProduct: {},
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
      //     label: '用户帐号',
      //     value: '1992019201'
      //   }
      // },
      secondaryNav: [],
      breadcrumbNav: [{
        label: this.$t('common.all'),
        link: '/operation/alerts/record'
      }, {
        label: this.$t('operation.alert.record.alert_info')
      }],
      deviceLocation: []
    }
  },

  route: {
    data (transition) {
      var deviceDetailRoot = `/operation/alerts/detail/${this.$route.params.id}`

      return {
        secondaryNav: [{
          label: this.$t('operation.alert.record.history'),
          link: { path: `${deviceDetailRoot}/history` }
        }]
      }
    }
  },

  computed: {
    deviceInfo () {
      var info = {
        device: {
          label: this.$t('operation.alert.record.alert_device'),
          value: this.info.product_name || '-'
        },
        status: {
          label: this.$t('operation.alert.record.alert_status'),
          value: this.info.is_read ? this.$t('operation.alert.record.processed') : this.$t('operation.alert.record.no_processed')
        },
        duration: {
          label: this.$t('operation.alert.record.time_length'),
          value: this.info.lasting + 'h' || '-'
        },
        createTime: {
          label: this.$t('operation.alert.record.deal_time'),
          value: this.info.read_time ? formatDate(this.info.read_time) : '-'
        },
        area: {
          label: this.$t('operation.alert.record.alert_region'),
          value: this.info.location || '-'
        },
        userId: {
          label: this.$t('operation.alert.record.user_id'),
          value: this.accounts.join(',') || '-'
        }
      }
      return info
    }
  },
  // 监听属性变动
  watch: {
    info () {
      if (this.info.product_id !== '' & this.info.from !== '') {
        this.getProduct()
        this.getDeviceGeography()
      }
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
     * 获取产品
     */
    getProduct () {
      api.product.getProduct(this.info.product_id).then((res) => {
        if (res.status === 200) {
          this.currentProduct = res.data
        }
      })
    },

    /**
     * 获取设备的地理坐标
     * @author shengzhi
     */
    getDeviceGeography () {
      api.device.getGeography(this.info.product_id, this.info.from).then((res) => {
        if (res.status === 200) {
          this.deviceLocation = [res.data.lon, res.data.lat]
        }
      })
    },
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
            if (user.role === 0) {
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
        if (res.status === 200 && res.data.nickname) {
          this.accounts.push(res.data.nickname)
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
.center
  height 220px
  line-height 220px
  text-align center
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
</style>
