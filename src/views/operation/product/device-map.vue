<template>
  <div class="main device-map-page">
    <div class="main-title">
      <h2>{{ $t("ui.main_nav.operation.subs.device_map.label") }}</h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fr">
        <div class="filter-group-item">
          <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.overview.addForm.search_condi')" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @press-enter="handleSearch">
            <x-select width="106px" :label="queryType.label" size="small">
              <select v-model="queryType">
                <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
              </select>
            </x-select>
            <button slot="search-button" @click="handleSearch" class="btn"><i class="fa fa-search"></i></button>
          </search-box>
        </div>
      </div>
      <h3>地图</h3>
    </div>

    <!-- 设备地图 -->
    <div class="device-list-wrap with-loading">
      <div class="icon-loading" v-show="loadingDevices">
        <i class="fa fa-refresh fa-spin"></i>
      </div>
      <x-alert v-show="!devices.length && !loadingDevices" :cols="18">
        <p>{{ infoMsg }}</p>
      </x-alert>
      <div v-show="deviceList.length" class="device-list mb20">
        <div class="device-list-item" v-for="device in deviceList" :class="{'active':currIndex===$index || currHover===$index}" @click="handleDeviceItemClick($index)" @mouseover="pullUp($index)" @mouseout="pushDown($index)">
          <div class="list-item-cont">
            <div class="icon-num">{{ $index+1 }}</div>
            <div class="device-id">{{ device.mac }}</div>
            <div class="device-address">{{ device.address }}</div>
            <div class="status">
              <span v-if="device.is_online" class="hl-green">在线</span>
              <span v-else class="hl-gray">离线</span>
            </div>
          </div>
        </div>
        <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getGeographies" :simple="true"></pager>
      </div>
    </div>
    <div class="device-map with-loading">
      <div class="icon-loading" v-show="loadingData">
        <i class="fa fa-refresh fa-spin"></i>
      </div>
      <div id="device-map" style="height: 100%"></div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import { setCurrProductMixin } from './mixins'
import api from 'api'
import * as config from 'consts/config'
// import AMap from 'AMap'
import Select from 'components/Select'
import AreaSelect from 'components/AreaSelect'
import SearchBox from 'components/SearchBox'
import Alert from 'components/Alert'
import Pager from 'components/Pager'
import _ from 'lodash'
import { formatDate } from 'src/filters'

export default {
  name: 'DeviceMap',

  mixins: [globalMixins, setCurrProductMixin],

  components: {
    'x-select': Select,
    'search-box': SearchBox,
    'x-alert': Alert,
    'pager': Pager,
    AreaSelect
  },

  data () {
    return {
      ids: [],
      devices: [],
      vDevices: [],
      geographies: [],
      query: '',
      searching: false,
      queryTypeOptions: [
        { label: '设备ID', value: 'id' },
        { label: 'MAC', value: 'mac' },
        { label: '所在区域', value: 'area' }
      ],
      queryType: {
        label: '设备ID',
        value: 'id'
      },
      currentPage: 1,
      total: 0,
      countPerPage: config.COUNT_PER_PAGE,
      oldCurrIndex: 0,
      currIndex: 0,
      currHover: -1,
      map: null,
      points: [],
      markers: [],
      infoWindow: {},
      geocoder: {},
      citySearch: {},
      placeSearch: {},
      mapHeight: 500,
      mapCenter: [],
      zoom: 3,
      loadingData: true,
      loadingProducts: true,
      loadingDevices: true,
      infoMsg: ''
    }
  },

  computed: {
    // 查询条件
    queryCondition () {
      var condition = {
        offset: this.countPerPage * (this.currentPage - 1),
        limit: this.countPerPage,
        spherical: true,
        coord: this.mapCenter,
        max_dist: this.map.getResolution() * this.map.getSize().height / 2,
        query: {}
      }

      return condition
    },

    // 当前产品 ID
    currentProductId () {
      return this.$route.params.id
    },

    // 设备列表
    deviceList () {
      let result = []

      // 给设备列表添加虚拟设备信息
      result = this.devices.map((item) => {
        let vDevice = _.find(this.vDevices, (obj) => {
          return obj.device_id === item.id
        }) || {}

        item.last_login = vDevice.last_login || ''
        item.ip = vDevice.ip || ''
        item.online_count = vDevice.online_count || 0

        return item
      })

      // 给设备列表添加地理位置信息
      result = result.map((item) => {
        let geo = _.find(this.geographies, (obj) => {
          return obj.device_id === item.id
        }) || {}

        item.lat = geo.lat || null
        item.lon = geo.lon || null
        item.address = geo.address

        return item
      })

      return result
    }
  },

  ready () {
    window.init = this.initMap
    if (typeof window.AMap === 'undefined') {
      var mapApi = document.createElement('script')
      let protocol = process.env.NODE_ENV !== 'production' ? 'https:' : window.location.protocol

      mapApi.src = `${protocol}//webapi.amap.com/maps?v=1.3&key=${config.AMAP_KEY}&callback=init`
      document.getElementsByTagName('body')[0].appendChild(mapApi)
    } else {
      this.initMap()
    }
  },

  watch: {
    // 当前产品 ID
    currentProductId () {
      this.initMap()
    },

    // 缩放
    zoom () {
      if (this.queryType.value === 'area' || !this.query) {
        this.currentPage = 1
        this.getGeographies()
      }
    },

    // 地图中心坐标
    mapCenter () {
      if (this.queryType.value === 'area' || !this.query) {
        this.getGeographies()
      }
    },

    // 当前滑过的设备列表项
    currHover () {
      if (this.currHover >= 0) {
        this.markers[this.currHover].setzIndex(10000)
      }
    }
  },

  destroyed () {
    this.map = null
  },

  methods: {
    initMap () {
      // 地图初始化
      this.map = new AMap.Map('device-map', {
        resizeEnable: true,
        zoom: this.zoom
      })

      // 信息窗口
      this.infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(-10, -46)
      })

      // 工具条与比例尺
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.CitySearch', 'AMap.PlaceSearch', 'AMap.Geocoder'], () => {
        var toolBar = new AMap.ToolBar()
        var scale = new AMap.Scale()

        this.citySearch = new AMap.CitySearch()
        this.placeSearch = new AMap.PlaceSearch({
          pageSize: 10,
          pageIndex: 1,
          city: '全国' // 城市
        })
        this.geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: 'all'
        })

        this.map.addControl(toolBar)
        this.map.addControl(scale)

        this.citySearch.getLocalCity()
        AMap.event.addListener(this.citySearch, 'complete', (res) => {
          if (res && res.city && res.bounds) {
            var cityCenter = res.bounds.getCenter()
            this.mapCenter = [cityCenter.lng, cityCenter.lat]
          } else {
            this.showNotice({
              type: 'error',
              content: ' 无法定位当前城市'
            })
          }
        })

        AMap.event.addListener(this.placeSearch, 'complete', (res) => {
          if (res && res.poiList && res.poiList.pois.length > 0) {
            var poiArr = res.poiList.pois
            var lng = poiArr[0].location.getLng()
            var lat = poiArr[0].location.getLat()
            this.mapCenter = [lng, lat]
          } else {
            this.showNotice({
              type: 'error',
              content: '找不到指定城市或地区'
            })
          }
        })

        // 监听缩放事件
        AMap.event.addListener(this.map, 'zoomchange', (res) => {
          this.zoom = this.map.getZoom()
        })

        // 监听拖动事件
        AMap.event.addListener(this.map, 'dragend', (res) => {
          var center = this.map.getCenter()
          this.mapCenter = [center.lng, center.lat]
        })
      })
    },

    /**
     * 获取设备列表
     * @return {[type]} [description]
     */
    getDevices () {
      let condition = {
        filter: ['id', 'name', 'mac', 'is_online', 'last_login'],
        limit: this.countPerPage,
        query: {
          'id': {
            $in: this.ids
          }
        }
      }
      this.loadingDevices = true
      api.device.getList(this.$route.params.id, condition).then((res) => {
        this.devices = res.data.list
        this.total = res.data.count

        // 获取虚拟设备
        api.product.getVDevices(this.$route.params.id, this.ids).then((r) => {
          this.loadingData = false
          this.loadingDevices = false
          this.vDevices = r.data.list
          this.setMarkers()
        })
      })
    },

    /**
     * 获取某个设备的地理信息
     * @param  {Number} deviceId 设备ID
     */
    getGeography (deviceId) {
      this.loadingData = true
      // api.device.getInfo(this.$route.params.id, deviceId).then((res) => {
      //   console.log(res.data)
      // })
      api.device.getGeography(this.$route.params.id, deviceId).then((res) => {
        if (res.status === 200) {
          this.currIndex = 0
          this.oldCurrIndex = 0
          this.ids = [res.data.device_id]
          this.points = [res.data]
          this.mapCenter = [res.data.lon, res.data.lat]
          this.map.setCenter(this.mapCenter)
          this.getDevices()
        }
      }).catch((res) => {
        this.ids = []
        this.devices = []
        this.map.clearMap()
        this.loadingData = false
        this.handleError(res)
      })
    },

    /**
     * 获取区域设备地理信息
     */
    getGeographies () {
      this.loadingData = true
      api.device.getGeographies(this.$route.params.id, this.queryCondition).then((res) => {
        if (res.data.count) {
          this.ids = _.map(res.data.devices, 'device_id')
          console.log(res.data.devices)
          res.data.devices.forEach((item, index) => {
            this.geocoder.getAddress([item.lon, item.lat], (status, result) => {
              let address = ''
              if (status === 'complete' && result.info === 'OK') {
                console.log(result.regeocode)
                address = result.regeocode.formattedAddress
              }
              this.geographies.push({
                device_id: item.device_id,
                lon: item.lon,
                lat: item.lat,
                address: address
              })
            })
          })
        } else {
          this.ids = []
          this.infoMsg = '当前区域未找到设备'
        }
        this.currIndex = 0
        this.oldCurrIndex = 0
        this.points = res.data.devices
        this.total = res.data.count
        this.map.setCenter(this.mapCenter)
        this.getDevices()
      }).catch((res) => {
        this.loadingData = false
      })
    },

    /**
     * 设置点标记
     */
    setMarkers () {
      var markers = []
      this.map.clearMap()

      // 绘制搜索区域
      // this.drawRegion()
      // 点
      _.clone(this.deviceList).forEach((device, index) => {
        device.index = index
        // point.device = this.deviceList[index]
        var classes = ['map-marker']
        if (index === this.currIndex) {
          classes.push('map-marker-active')
        }
        var marker = new AMap.Marker({
          map: this.map,
          position: [device.lon, device.lat],
          icon: 'static/images/marker.png',
          content: `<span class="${classes.join(' ')}">${index + 1}</span>`,
          offset: {x: -15, y: -36}
        })
        marker.extData = device
        marker.on('click', this.onMarkerClick)
        marker.on('mouseover', this.onMarkerMouseOver)
        marker.on('mouseout', this.onMarkerMouseOut)
        if (index === this.currIndex) {
          marker.setzIndex(1000)
        }
        markers.push(marker)
      })
      this.markers = markers
    },

    /**
     * 处理侧栏设备点击
     * @param  {Number} index 设备索引
     */
    handleDeviceItemClick (index) {
      var currMarker = this.markers[index]
      this.currIndex = index
      currMarker.emit('click', {target: currMarker})
      // this.oldCurrIndex = index
    },

    /**
     * 将目标点标识提升至顶部
     * @param  {Number} index 目标标识索引
     */
    pullUp (index) {
      this.currHover = index
      var classes = ['map-marker']
      if (index === this.currIndex) {
        classes.push('map-marker-active')
      }
      classes.push('map-marker-hover')
      this.markers[index].setContent(`<span class="${classes.join(' ')}">${index + 1}</span>`)
      this.markers[index].setzIndex(10000)
    },

    /**
     * 取消目标点标识提升至顶部
     * @param  {Number} index 目标标识索引
     */
    pushDown (index) {
      this.currHover = -1
      var classes = ['map-marker']
      if (index === this.currIndex) {
        classes.push('map-marker-active')
      }
      this.markers[index].setContent(`<span class="${classes.join(' ')}">${index + 1}</span>`)
      this.markers[index].setzIndex(index === this.currIndex ? 1000 : 100)
    },

    /**
     * 绘制搜索区域
     * @return {[type]} [description]
     */
    drawRegion () {
      var circle = new AMap.Circle({
        center: new AMap.LngLat(this.mapCenter[0], this.mapCenter[1]), // 圆心位置
        radius: this.map.getResolution() * this.map.getSize().height / 2, // 半径
        strokeColor: '#F33', // 线颜色
        strokeOpacity: 0, // 线透明度
        strokeWeight: 0, // 线粗细度
        fillColor: '#ee2200', // 填充颜色
        fillOpacity: 0.2 // 填充透明度
      })
      circle.setMap(this.map)
    },

    /**
     * 处理点标记点击
     * @param  {Event} e 事件
     */
    onMarkerClick (e) {
      var markerData = e.target.extData
      var oldCurrMarker = this.markers[this.oldCurrIndex]
      var currMarker = this.markers[markerData.index]
      this.currIndex = markerData.index

      oldCurrMarker.setContent(`<span class="map-marker">${this.oldCurrIndex + 1}</span>`)
      oldCurrMarker.setzIndex(100)
      currMarker.setContent(`<span class="map-marker map-marker-active">${this.currIndex + 1}</span>`)
      currMarker.setzIndex(1000)

      this.showPopup(markerData)
      this.infoWindow.open(this.map, e.target.getPosition())
      this.oldCurrIndex = this.currIndex
    },

    /**
     * 将毫秒数格式化为合适显示的时间段
     */
    prettyDuration (n) {
      let hours = (n / 3600).toFixed(1)
      let minutes = Math.floor(n / 60)
      if (hours > 1) {
        return `${hours}小时`
      } else if (minutes > 1) {
        return `${minutes}分钟`
      } else {
        return `${n}秒`
      }
    },

    /**
     * 显示设备信息弹窗
     * @param  {Object} data 设备数据信息
     */
    showPopup (data) {
      var content = ['<div class="map-popup">']
      content.push('<div class="map-popup-header">')
      content.push(`<h3>${data.name || this.currentProduct.name}</h3>`)
      content.push('</div>')
      content.push('<div class="map-popup-body">')
      content.push(`<div class="info-row mt5 mb10">${data.is_online ? '<span class="on-line">在线</span>' : '<span class="off-line">下线</span>'} ${formatDate(data.last_login)}</div>`)
      // content.push(`<div class="info-row"><span class="label">设备ID: </span>${data.device.id}</div>`)
      content.push(`<div class="info-row"><span class="label">MAC: </span>${data.mac}</div>`)
      content.push(`<div class="info-row"><span class="label">地址: </span>${data.address}</div>`)
      content.push(`<div class="info-row"><span class="label">在线时长: </span>${this.prettyDuration(data.online_count)}</div>`)
      content.push(`<div class="info-row tar"><a href="/#!/operation/products/${this.$route.params.id}/devices/${data.id}">查看详情&gt;&gt;</a></div>`)
      content.push('</div>')
      content.push('</div>')
      this.infoWindow.setContent(content.join(''))
    },

    /**
     * 处理点标识鼠标悬停
     * @param  {Event} e 事件
     */
    onMarkerMouseOver (e) {
      this.currHover = e.target.extData.index
    },

    /**
     * 处理点标识鼠标划出
     * @param  {Event} e 事件
     */
    onMarkerMouseOut (e) {
      this.currHover = -1
    },

    // 搜索
    handleSearch () {
      if (this.query.length !== 0) {
        if (this.queryType.value === 'id') {
          this.getGeography(Number(this.query))
        } else {
          this.placeSearch.search(this.query)
        }
      } else {
        if (this.queryType.value === 'id' && !this.searching) {
          this.showNotice({
            type: 'error',
            content: '请输入设备ID'
          })
        } else {
          this.citySearch.getLocalCity()
        }
      }
    },

    // 切换搜索
    toggleSearching () {
      this.searching = !this.searching
    },

    // 取消搜索
    cancelSearching () {
      this.getGeography()
    }
  }
}
</script>

<style lang="stylus">
@import '../../../assets/stylus/common'

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
      background url("../../../assets/images/marker.png") no-repeat 0 -254px

    .status
      absolute right 8px top 12px
      font-size 12px

    &:hover
    &.active
      background #F3F3F3

      .icon-num
        background-position 0 -284px

  .device-map
    absolute left 10px top 110px right 328px bottom 10px

.device-map
  .map-marker
    absolute left top
    display inline-block
    size 33px 43px
    z-index 3
    color #FFF
    line-height 32px
    font-size 16px
    font-weight bold
    font-family tahoma
    text-align center
    background url("../../../assets/images/marker.png") no-repeat

    &:hover
    &.map-marker-active
    &.map-marker-hover
      background-position 0 -45px

    &:hover
    &.map-marker-hover
      z-index 10000

.amap-info
  a
    color #FFF

.amap-info-content
  padding 0
  background rgba(0, 0, 0, .75)
  box-shadow none
  color #FFF

  &:hover
    box-shadow none

  .map-popup
    .map-popup-header
      h3
        margin 0
        padding 15px 0 10px 15px
        font-size 14px

    .map-popup-body
      padding 0 15px 15px
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

.amap-info-sharp
  display none !important

.amap-logo
  right 0 !important
  left auto !important
  display none

.amap-copyright
  right 70px !important
  left auto !important
  display none
</style>
