<template>
  <div class="main device-map-page">
    <div class="main-title">
      <h2>{{ $t("layout.main_nav.operation.subs.products.subs.device_map") }}</h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fr">
        <div class="filter-group-item">
          <search-box
            :key="query"
            :active="searching"
            :placeholder="$t('ui.overview.addForm.search_condi')"
            @cancel="onSearchCancel"
            @search="handleSearch"
            @search-activate="toggleSearching"
            @search-deactivate="toggleSearching"
            @press-enter="doSearch">
            <x-select width="106px" :label="queryType.label" size="small">
              <select v-model="queryType">
                <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
              </select>
            </x-select>
            <button slot="search-button" @click="doSearch" class="btn"><i class="fa fa-search"></i></button>
          </search-box>
        </div>
      </div>
      <!-- <h3>{{ $t('operation.product.devicemap.map') }}</h3> -->
      <h3><button class="btn btn-ghost btn-sm" @click.prevent.stop="onDemoBtnClick"><i class="fa fa-expand"></i> {{ $t('operation.product.devicemap.demo') }} </button></h3>
    </div>

    <!-- 设备地图 -->
    <div class="device-list-wrap">
      <!-- <div class="icon-loading" v-show="loadingDevices">
        <i class="fa fa-refresh fa-spin"></i>
      </div> -->
      <alert v-show="!deviceList.length && !loadingData" :cols="18">
        <p>{{ infoMsg }}</p>
      </alert>
      <div v-show="deviceList.length && !loadingData" class="device-list mb20">
        <div class="device-list-item" v-for="(deviceIndex, device) in deviceList" :class="{'active':currIndex===deviceIndex}" @click="onDeviceClick(deviceIndex)" @mouseover="onDeviceHover(deviceIndex)" @mouseout="onDeviceOut(deviceIndex)">
          <div class="list-item-cont">
            <div class="icon-num">{{ deviceIndex+1 }}</div>
            <div class="device-id">{{ device.mac }}</div>
            <div class="device-address">{{ device.address }}</div>
            <div class="status">
              <span v-if="device.is_online" class="hl-green">{{ $t('operation.product.devicemap.online') }}</span>
              <span v-else class="hl-gray">{{ $t('operation.product.devicemap.offline') }}</span>
            </div>
          </div>
        </div>
        <pagination v-if="total > countPerPage" :total="total" :current="currentPage" :count-per-page="countPerPage" @page-update="onPageUpdate" :simple="true"></pagination>
      </div>
    </div>
    <div class="device-map">
      <div id="device-map" style="height: 100%"></div>
    </div>

    <!-- spiner -->
    <div class="device-loading" v-show="loadingData">
      <spinner :text="loadingText"></spinner>
    </div>

    <!-- 演示地图 -->
    <demo-map v-if="showDemoMap" :show="showDemoMap" @dismiss="onDemoMapDismiss"></demo-map>
  </div>
</template>

<script>
import { setCurrProductMixin } from '../mixins'
import api from 'api'
import * as config from 'consts/config'
import formatDate from 'filters/format-date'
import DemoMap from './components/DemoMap'
import Vue from 'vue'

let icon1, icon2, infoWindow

export default {
  name: 'DeviceMap',

  mixins: [setCurrProductMixin],

  components: {
    DemoMap
  },

  data () {
    return {
      map: null,
      markers: [],
      infoWindow: null,
      geocoder: null,
      zoomLevel: 4,
      bounds: null,
      currIndex: 0,
      hoverIndex: -1,
      mapCenter: [105.0293195608, 36.6847961226],
      query: '',
      searching: false,
      queryTypeOptions: [{
        label: this.$t('operation.product.devicemap.device_id'),
        value: 'id'
      }, {
        label: 'MAC',
        value: 'mac'
      }, {
        label: this.$t('operation.product.devicemap.region'),
        value: 'region'
      }],
      queryType: {
        label: this.$t('operation.product.devicemap.device_id'),
        value: 'id'
      },
      currentPage: 1,
      total: 0,
      countPerPage: config.COUNT_PER_PAGE,
      loadingGeographies: true,
      loadingDevices: true,
      loadingVDevices: true,
      devices: [],
      vDevices: [],
      geographies: [],
      infoMsg: '',
      loadingText: '',
      showDemoMap: false
    }
  },

  computed: {
    // 半径
    radius () {
      let result = 0

      if (this.bounds) {
        // 获取较短的距离作为半径
        let horizontal = this.bounds.horizontal
        let vertical = this.bounds.vertical
        result = horizontal > vertical ? vertical : horizontal
      }

      return result / 2
    },

    // 查询条件
    queryCondition () {
      // 获取东北角和西南角的经纬度坐标
      let NE = this.bounds.getNorthEast()
      let SW = this.bounds.getSouthWest()
      let lat1 = NE.lat()
      let lat2 = SW.lat()
      let lng1 = NE.lng()
      let lng2 = SW.lng()

      // 多边形搜索
      return {
        type: 'polygon',
        coord: [[[lng2, lat1], [lng1, lat1], [lng1, lat2], [lng2, lat2], [lng2, lat1]]],
        limit: this.countPerPage,
        query: {}
      }
    },

    // 设备列表
    deviceList () {
      let result = []

      if (!this.loadingData) {
        result = _(this.devices) // 链式调用开始
          .keyBy('id') // 将数组转换为以 id 为键的对象
          .merge(_.keyBy(this.vDevices, 'id')) // 合并虚拟设备信息
          .merge(_.keyBy(this.geographies, 'id')) // 合并经纬度信息
          .values() // 将对象转换回数组
          .value()
      }

      return result
    },

    // 当前产品 ID
    currentProductId () {
      return this.$route.params.id
    },

    // 是否正在加载数据
    loadingData () {
      return this.loadingDevices || this.loadingVDevices || this.loadingGeographies
    }
  },

  ready () {
    let func = 'init_' + (new Date().getTime())
    window[func] = this.initMap
    if (typeof google === 'undefined') {
      // this.loadingText = this.$t('operation.product.devicemap.targeting')
      this.loadingText = this.$t('operation.product.devicemap.init_map')
      var elem = document.createElement('script')
      elem.async = true
      elem.defer = 'defer'
      elem.src = `http://maps.google.cn/maps/api/js?libraries=geometry&sensor=false&key=${config.GOOGLE_MAP_KEY}&callback=${func}`
      document.getElementsByTagName('body')[0].appendChild(elem)
    } else {
      this.initMap()
    }
  },

  watch: {
    currentProductId () {
      // 监听当前产品 ID 的切换，对数据重新初始化
      this.currIndex = 0
      this.query = ''
      this.getGeographies(true)
    },

    deviceList () {
      if (!this.loadingData) {
        this.setMarkers()
      }
    }
  },

  destroyed () {
    this.map = null
  },

  methods: {
    initMap () {
      // 判断是否支持 GeoLocation
      // if (!window.navigator.geolocation) {
      //   console.log('No Geolocation Support')
      //   return
      // }

      // 地图初始化配置
      let options = {
        // center: new google.maps.LatLng(this.mapCenter[1], this.mapCenter[0]),
        zoom: this.zoomLevel,
        zoomControlOptions: {
          position: google.maps.ControlPosition.TOP_LEFT
        },
        center: new google.maps.LatLng(this.mapCenter[1], this.mapCenter[0]),
        streetViewControl: false,
        mapTypeControl: false
      }

      // 初始化
      this.map = new google.maps.Map(document.getElementById('device-map'), options)

      // 定位到当前城市
      // this.loadingText = this.$t('operation.product.devicemap.targeting')
      // navigator.geolocation.getCurrentPosition(position => {
      //   let lat = position.coords.latitude
      //   let lng = position.coords.longitude
      //   let geolocate = new google.maps.LatLng(lat, lng)
      //   this.mapCenter = [lng, lat]
      //   this.map.setCenter(geolocate)
      // })

      icon1 = {
        url: '/static/images/map/marker_normal.png',
        labelOrigin: new google.maps.Point(17, 17)
      }

      icon2 = {
        url: '/static/images/map/marker_active.png',
        labelOrigin: new google.maps.Point(17, 17)
      }

      infoWindow = new google.maps.InfoWindow({
        content: '123'
      })

      this.geocoder = new google.maps.Geocoder()

      google.maps.event.addListener(this.map, 'bounds_changed', () => {
        let bounds = this.map.getBounds()
        if (!this.bounds) {
          this.bounds = bounds
          this.getGeographies(true)
          return
        }
        this.bounds = bounds
      })

      google.maps.event.addListener(this.map, 'dragend', () => {
        let center = this.map.getCenter()
        this.mapCenter = [center.lng(), center.lat()]
        this.getGeographies(true)
      })

      google.maps.event.addListener(this.map, 'zoom_changed', () => {
        this.getGeographies(true)
      })
    },

    /**
     * 显示演示地图
     */
    onDemoBtnClick () {
      this.showDemoMap = true
    },

    /**
     * 处理演示地图消失
     */
    onDemoMapDismiss (val) {
      this.showDemoMap = val
    },

    /**
     * 获取设备列表
     */
    getDevices () {
      let idList = _.map(this.geographies, 'id')
      // this.ids = _.map(res.data.devices, 'device_id')
      let condition = {
        filter: ['id', 'name', 'mac', 'is_online', 'last_login'],
        limit: this.countPerPage,
        query: {
          'id': {
            $in: idList
          }
        }
      }

      // 获取设备列表
      this.loadingDevices = true
      this.loadingVDevices = true
      api.device.getList(this.$route.params.id, condition).then((res) => {
        this.loadingDevices = false
        this.devices = res.data.list
      })

      // 获取相应的虚拟设备列表
      api.product.getVDevices(this.$route.params.id, idList).then(this.setVDevices)
    },

    /**
     * 生成地址
     * @param {Object} geography 地址信息
     */
    genAddress (geography) {
      let address = []
      let properties = ['country', 'province', 'city', 'district']
      let lang = Vue.config.lang

      properties.forEach((prop) => {
        if (geography.hasOwnProperty(prop) && geography[prop]) {
          address.push(geography[prop])
        }
      })

      if (lang === 'en-us') {
        address = address.reverse().join(', ')
      } else {
        address = address.join(' ')
      }

      return address
    },

    /**
     * 获取区域设备地理信息
     */
    getGeographies (reset) {
      // if (this.query.length && this.queryType.value !== 'region') return

      if (reset) {
        this.currentPage = 1
      }
      // this.drawRegion()
      this.loadingText = this.$t('operation.product.devicemap.searching')
      this.loadingGeographies = true
      api.device.getGeographies(this.$route.params.id, this.queryCondition).then((res) => {
        this.loadingGeographies = false

        // 区域无设备时给出提示
        if (!res.data.count) {
          this.loadingVDevices = false
          this.loadingDevices = false
          this.total = 0
          this.geographies = []
          this.devices = []
          this.vDevices = []
          this.infoMsg = this.$t('operation.product.devicemap.no_device')
          return
        }

        this.total = res.data.count
        this.geographies = _.map(res.data.devices, (item) => {
          let address = this.genAddress(item)

          return {
            id: item.device_id,
            lon: item.lon,
            lat: item.lat,
            address: address
          }
        })
        this.getDevices()
      }).catch((res) => {
        this.loadingGeographies = false
      })
    },

    /**
     * 设置虚拟设备列表
     * @param {Object} res 服务器返回信息
     */
    setVDevices (res) {
      this.loadingVDevices = false
      this.vDevices = _.map(res.data.list, (item) => {
        return {
          id: item.device_id,
          v_last_login: item.last_login,
          online_count: item.online_count
        }
      })
    },

    /**
     * 绘制搜索区域
     */
    drawRegion () {
      let circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        center: new google.maps.LatLng(this.mapCenter[1], this.mapCenter[0]),
        radius: this.radius
      })
      circle.setMap(this.map)
    },

    /**
     * 设置地图标记
     */
    setMarkers () {
      if (this.loadingData) return

      this.clearMarkers()
      this.deviceList.forEach((item, index) => {
        let marker = new google.maps.Marker({
          map: this.map,
          position: {lat: item.lat, lng: item.lon},
          icon: icon1,
          label: {
            text: `${index + 1}`,
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold'
          },
          zIndex: index
        })

        // 监听标记的点击事件，与设备列表的点击处理一致
        marker.addListener('click', () => {
          this.onDeviceClick(index)
        })

        // 监听标记的鼠标滑过事件，与设备列表的鼠标滑过处理一致
        marker.addListener('mouseover', () => {
          this.onDeviceHover(index)
        })

        // 监听标记的鼠标滑出事件，与设备列表的鼠标滑出处理一致
        marker.addListener('mouseout', () => {
          this.onDeviceOut(index)
        })

        this.markers.push(marker)

        // 默认激活第一个标记，并设置其纵轴高度为列表长度(当前最高)
        this.activateMarker(this.markers[0], this.countPerPage)
      })
    },

    /**
     * 清除所有标记
     */
    clearMarkers () {
      for (let i = 0, len = this.markers.length; i < len; i++) {
        this.markers[i].setMap(null)
      }
      this.markers = []
    },

    /**
     * 激活标记
     */
    activateMarker (marker, index) {
      marker.setIcon(icon2)
      marker.setZIndex(index)
    },

    /**
     * 取消激活标记
     */
    deactivateMarker (marker, index) {
      marker.setIcon(icon1)
      marker.setZIndex(index)
    },

    /**
     * 取消激活标记
     */
    deactivateAllMarkers () {
      for (let i = 0, len = this.markers.length; i < len; i++) {
        this.deactivateMarker(this.markers[i], i)
      }
    },

    /**
     * 将毫秒数格式化为合适显示的时间段
     */
    prettyDuration (n) {
      let hours = (n / 3600).toFixed(1)
      let minutes = Math.floor(n / 60)
      if (hours > 1) {
        return `${hours}${this.$t('operation.product.alert.hour')}`
      } else if (minutes > 1) {
        return `${minutes}${this.$t('operation.product.alert.minutes')}`
      } else {
        return `${n}${this.$t('operation.product.alert.second')}`
      }
    },

    /**
     * 处理侧栏设备点击
     * @param  {Number} index 设备索引
     */
    onDeviceClick (index) {
      let currMarker = this.markers[index]
      let device = this.deviceList[index]
      let contentString = `
      <div class="info-window-content">
        <div class="info-window-content-header">
          <h3>${device.name || this.currentProduct.name}</h3>
        </div>
        <div class="info-window-content-body">
          <div class="info-row mt5 mb10">${device.is_online ? '<span class="on-line">在线</span>' : '<span class="off-line">下线</span>'} ${formatDate(device.last_login || device.v_last_login)}</div>
          <div class="info-row"><span class="label">MAC: </span>${device.mac}</div>
          <div class="info-row"><span class="label">地址: </span>${device.address}</div>
          <div class="info-row"><span class="label">在线时长: </span>${this.prettyDuration(device.online_count)}</div>
          <div class="info-row tar"><a href="/#!/operation/products/${this.$route.params.id}/devices/${device.id}" class="hl-red">查看详情&gt;&gt;</a></div>
        </div>
      </div>`

      // 激活当前设备，显示信息浮窗
      this.currIndex = index
      this.deactivateAllMarkers()
      this.activateMarker(currMarker, this.countPerPage)
      infoWindow.setContent(contentString)
      infoWindow.open(this.map, currMarker)
    },

    /**
     * 处理鼠标滑过设备列表
     * @param  {Number} index 目标标识索引
     */
    onDeviceHover (index) {
      if (index === this.currIndex) return

      this.activateMarker(this.markers[index], this.countPerPage + 1)
      this.hoverIndex = index
    },

    /**
     * 处理鼠标滑出设备列表
     * @param  {Number} index 目标标识索引
     */
    onDeviceOut (index) {
      if (this.hoverIndex >= 0 && this.hoverIndex !== this.currIndex) {
        this.deactivateMarker(this.markers[this.hoverIndex], this.hoverIndex)
      }
      this.hoverIndex = -1
    },

    /**
     * 处理页码更新
     */
    onPageUpdate (page) {
      this.currentPage = page
      this.currIndex = 0
      this.getGeographies()
    },

    /**
     * 切换搜索
     */
    toggleSearching () {
      this.searching = !this.searching
    },

    /**
     * 取消搜索
     */
    onSearchCancel () {
      this.getGeographies(true)
    },

    /**
     * 处理搜索
     */
    handleSearch (val) {
      this.query = val
      this.doSearch()
    },

    /**
     * 搜索
     */
    doSearch () {
      if (!this.query.length) {
        this.showError(this.$t('operation.product.devicemap.input_keyword'))
        return
      }

      switch (this.queryType.value) {
        case 'mac':
          this.searchByMac()
          break
        case 'region':
          this.searchByRegion()
          break
        default:
          this.searchById()
      }
    },

    /**
     * 搜索指定区域
     */
    searchByRegion () {
      this.geocoder.geocode({
        address: this.query
      }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          let center = results[0].geometry.location
          this.mapCenter = [center.lng(), center.lat()]
          this.map.setCenter(center)
          this.map.setZoom(10)
          this.getGeographies(true)
        } else {
          // 错误处理
          // console.log(results)
        }
      })
    },

    /**
     * 搜索指定deviceId
     */
    searchById () {
      let opt = {
        'id': {
          $in: [this.query]
        }
      }
      return this.searchBy(opt)
    },

    /**
     * 搜索指定MAC
     */
    searchByMac () {
      let opt = {
        'mac': {
          $like: this.query
        }
      }
      return this.searchBy(opt)
    },

    /**
     * 搜索指定MAC
     */
    searchBy (opt) {
      let condition = {
        filter: ['id', 'name', 'mac', 'is_online', 'last_login'],
        limit: this.countPerPage,
        query: opt
      }

      this.loadingText = this.$t('operation.product.devicemap.searching')
      this.loadingDevices = true
      api.device.getList(this.$route.params.id, condition).then((res) => {
        this.loadingDevices = false
        let list = res.data.list

        // 未搜索到设备
        if (!list.length) {
          this.infoMsg = this.$t('operation.product.devicemap.no_device_find')
          this.geographies = []
          this.devices = []
          this.vDevices = []
          return
        }

        this.devices = list
        this.total = res.data.count
        let deviceId = list[0].id

        // 获取相应的虚拟设备列表
        this.loadingVDevices = true
        api.product.getVDevices(this.$route.params.id, [deviceId]).then(this.setVDevices)

        // 获取相应的地理位置信息
        this.loadingGeographies = true
        api.device.getGeography(this.$route.params.id, deviceId).then((res) => {
          this.loadingGeographies = false
          let address = this.genAddress(res.data)
          this.geographies = [{
            id: res.data.device_id,
            lon: res.data.lon,
            lat: res.data.lat,
            address: address
          }]
          this.map.setCenter(new google.maps.LatLng(res.data.lat, res.data.lon))
        })
      })
    }
  }
}
</script>

<style lang="stylus">
@import '../../../../assets/stylus/common'

.device-map-page
  absolute left right top bottom
  margin 0

  .panel-hd
    .leftbox
      left 120px

  .device-list-wrap
    absolute right 10px top 110px bottom 10px
    width 308px
    overflow auto
    /*min-height 200px*/

    .action-bar
      border 1px solid #DDD
      padding 10px
      background-color #F8F8F8

    .search-box
      float left

      .search-box-input
        width 144px
        overflow hidden

        input
          width 144px

  .device-list
    /*absolute left top 10px bottom*/
    width 100%

    .pager
      margin-bottom 0
      margin-top 20px

  .device-list-item
    border-bottom 1px dotted default-border-color
    cursor pointer

    .device-id
      line-height 28px
      margin 0

    .list-item-cont
      position relative
      padding 8px 0 8px 40px

    .icon-num
      absolute top 8px left 8px
      line-height 24px
      size 24px 28px
      display inline-block
      text-align center
      color #FFF
      font-family tahoma
      font-size 12px
      font-weight bold
      background url("../../../../assets/images/marker.png") no-repeat 0 0

    .status
      absolute right 8px top 12px
      font-size 12px

    &:hover
    &.active
      background #F3F3F3

      .icon-num
        background-position 0 -30px

  .device-map
    absolute left 10px top 110px right 328px bottom 10px

.info-window-content
  min-width 260px
  max-width 360px
  .info-window-content-header
    h3
      margin 0
      padding 15px 0 10px 15px
      font-size 16px

  .info-window-content-body
    padding-left 10px
    font-size 12px

    .info-row
      line-height 20px

    .on-line
    .off-line
      position relative
      padding-left 12px

      &:before
        absolute left top 3px
        content ''
        size 8px
        border-radius 10px
        background-color #C3C3C3

    .off-line
      &:before
        background-color #C3C3C3

    .on-line
      color green
      &:before
        background-color green

.device-loading
  absolute top 110px right bottom left
</style>
