<template>
  <div class="main">
    <!-- 无产品时显示添加提示 -->
    <div class="panel" v-if="!productOptions.length && !loadingProducts">
      <div class="panel-bd">
        <v-alert :cols="7">
          <p>还没有产品哦，请<a v-link="{ path: '/product/create' }" class="hl-red">点击此处</a>添加</p>
        </v-alert>
      </div>
    </div>

    <!-- 设备地图 -->
    <div class="panel device-map-page" v-show="productOptions.length && !loadingProducts">
      <div class="panel-hd">
        <h2>{{ $t("ui.main_nav.operation.subs.device_map.label") }}</h2>
        <div class="leftbox">
          <v-select width="160px" :label="currProduct.name" size="small">
            <span slot="label">选择产品：</span>
            <select v-model="currProduct" @change="getGeographies">
              <option v-for="product in productOptions" :value="product">{{ product.name }}</option>
            </select>
          </v-select>
        </div>
      </div>
      <div class="panel-bd">
        <div class="device-list-wrap with-loading">
          <div class="icon-loading" v-show="loadingDevices">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div class="action-bar">
            <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.overview.addForm.search_condi')" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @press-enter="handleSearch">
              <v-select width="110px" :label="queryType.label" size="small">
                <select v-model="queryType">
                  <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                </select>
              </v-select>
              <button slot="search-button" @click="handleSearch" class="btn btn-primary"><i class="fa fa-search"></i></button>
            </search-box>
          </div>
          <v-alert v-show="!devices.length && !loadingDevices" :cols="18">
            <p>{{ infoMsg }}</p>
          </v-alert>
        </div>
      </div>
      <div v-show="devices.length" class="device-list mb20">
        <div class="device-list-item" v-for="device in devices" :class="{'active':currIndex===$index || currHover===$index}" @click="handleDeviceItemClick($index)" @mouseover="pullUp($index)" @mouseout="pushDown($index)">
          <div class="list-item-cont">
            <div class="icon-num">{{ $index+1 }}</div>
            <div class="device-id">设备ID: {{ device.id }}</div>
            <div class="status">
              <span v-if="device.is_online" class="hl-green">在线</span>
              <span v-else class="hl-gray">离线</span>
            </div>
          </div>
        </div>
        <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getGeographies" :simple="true"></pager>
      </div>
      <div class="device-map with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <div id="device-map" style="height: 100%"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import api from 'api'
  import * as config from 'consts/config'
  // import AMap from 'AMap'
  import Select from 'components/Select'
  import SearchBox from 'components/SearchBox'
  import Alert from 'components/Alert'
  import Pager from 'components/Pager'
  import _ from 'lodash'

  export default {
    name: 'Settings',

    mixins: [globalMixins],

    components: {
      'v-select': Select,
      'search-box': SearchBox,
      'v-alert': Alert,
      'pager': Pager
    },

    data () {
      return {
        ids: [],
        devices: [],
        currProduct: {},
        productOptions: [],
        query: '',
        searching: false,
        queryTypeOptions: [
          { label: '设备ID', value: 'id' },
          { label: '所在区域', value: 'area' }
        ],
        queryType: {
          label: '所在区域',
          value: 'area'
        },
        currentPage: 1,
        total: 0,
        countPerPage: config.COUNT_PER_PAGE,
        oldCurrIndex: 0,
        currIndex: 0,
        currHover: -1,
        map: {},
        points: [],
        markers: [],
        infoWindow: {},
        citySearch: {},
        placeSearch: {},
        mapHeight: 500,
        mapCenter: [],
        zoom: 10,
        loadingData: true,
        loadingProducts: true,
        loadingDevices: true,
        infoMsg: ''
      }
    },

    computed: {
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
      }
    },

    ready () {
      // 将回调绑定在全局供高德地图加载后调用
      window.init = this.initMap
      this.loadingProducts = true
      api.product.all().then((res) => {
        if (res.status === 200) {
          this.loadingProducts = false
          if (res.data.length) {
            this.productOptions = res.data
            this.currProduct = this.productOptions[0]
            if (typeof window.AMap === 'undefined') {
              var mapApi = document.createElement('script')
              mapApi.src = `http://webapi.amap.com/maps?v=1.3&key=${config.AMAP_KEY}&callback=init`
              document.getElementsByTagName('body')[0].appendChild(mapApi)
            } else {
              this.initMap()
            }
          }
          this.loadingProducts = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingProducts = false
      })
    },

    watch: {
      zoom () {
        if (this.queryType.value !== 'id' || !this.query) {
          this.currentPage = 1
          this.getGeographies()
        }
      },

      mapCenter () {
        if (this.queryType.value !== 'id' || !this.query) {
          this.getGeographies()
        }
      },

      currHover () {
        if (this.currHover >= 0) {
          this.markers[this.currHover].setzIndex(10000)
        }
      }
    },

    methods: {
      initMap () {
        // 地图初始化
        this.map = new AMap.Map('device-map', {
          resizeEnable: true,
          zoom: this.zoom
        })

        this.infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(0, -36)
        })

        // 工具条与比例尺
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.CitySearch', 'AMap.PlaceSearch'], () => {
          var toolBar = new AMap.ToolBar()
          var scale = new AMap.Scale()
          this.citySearch = new AMap.CitySearch()
          this.placeSearch = new AMap.PlaceSearch({
            pageSize: 10,
            pageIndex: 1,
            city: '全国' // 城市
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
          // AMap.event.addListener(this.citySearch, 'error', (res) => {
          //   this.showNotice({
          //     type: 'error',
          //     content: res.info
          //   })
          // })

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
          // AMap.event.addListener(this.placeSearch, 'error', (res) => {
          //   this.showNotice({
          //     type: 'error',
          //     content: res.info
          //   })
          // })

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

      getDevices () {
        this.loadingDevices = true
        return api.device.getList(this.currProduct.id, {
          filter: ['id', 'mac', 'is_online', 'last_login'],
          limit: this.countPerPage,
          // offset: (this.currentPage - 1) * this.countPerPage,
          query: {
            'id': {
              $in: this.ids
            }
          }
        })
      },

      /**
       * 获取某个设备的地理信息
       * @param  {Number} deviceId 设备ID
       */
      getGeography (deviceId) {
        this.loadingData = true
        api.device.getInfo(this.currProduct.id, deviceId).then((res) => {
          console.log(res.data)
        })
        api.device.getGeography(this.currProduct.id, deviceId).then((res) => {
          if (res.status === 200) {
            this.currIndex = 0
            this.oldCurrIndex = 0
            this.ids = [res.data.device_id]
            this.points = [res.data]
            this.mapCenter = [res.data.lon, res.data.lat]
            this.map.setCenter(this.mapCenter)

            this.getDevices().then((r) => {
              this.loadingData = false
              this.loadingDevices = false
              this.devices = r.data.list
              this.total = r.data.count
              this.setMarkers()
            })
          }
        }).catch((res) => {
          this.ids = []
          this.devices = []
          this.map.clearMap()
          this.loadingData = false
          this.infoMsg = '暂无该设备的定位数据'
          // this.showNotice({
          //   type: 'error',
          //   content: '暂无该设备的定位数据'
          // })
        })
      },

      /**
       * 获取区域设备地理信息
       */
      getGeographies () {
        this.loadingData = true
        api.device.getGeographies(this.currProduct.id, this.queryCondition).then((res) => {
          if (res.data.count) {
            this.ids = _.map(res.data.devices, 'device_id')
          } else {
            this.ids = []
            this.infoMsg = '当前区域未找到设备'
          }
          this.currIndex = 0
          this.oldCurrIndex = 0
          this.points = res.data.devices
          this.total = res.data.count
          this.map.setCenter(this.mapCenter)
          this.getDevices().then((r) => {
            this.loadingData = false
            this.loadingDevices = false
            this.devices = r.data.list
            this.setMarkers()
          })
        }).catch((res) => {
          // this.handleError(res)
          this.loadingData = false
        })
      },

      /**
       * 设置点标记
       */
      setMarkers () {
        var markers = []
        this.map.clearMap()

        // this.drawRegion()
        // 点
        this.points.forEach((point, index) => {
          point.index = index
          point.device = this.devices[index]
          var classes = ['map-marker']
          if (index === this.currIndex) {
            classes.push('map-marker-active')
          }
          var marker = new AMap.Marker({
            map: this.map,
            position: [point.lon, point.lat],
            icon: 'static/images/marker.png',
            content: `<span class="${classes.join(' ')}">${index + 1}</span>`,
            offset: {x: -15, y: -36}
          })
          marker.extData = point
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
       * 显示设备信息弹窗
       * @param  {Object} data 设备数据信息
       */
      showPopup (data) {
        var content = ['<div class="map-popup">']
        content.push('<div class="map-popup-header">')
        content.push(`<h3>${this.currProduct.name}信息</h3>`)
        content.push('</div>')
        content.push('<div class="map-popup-body">')
        content.push(`<div class="info-row"><span class="label">设备ID: </span>${data.device.id}</div>`)
        content.push(`<div class="info-row"><span class="label">设备MAC: </span>${data.device.mac}</div>`)
        content.push(`<div class="info-row"><span class="label">在线状态: </span>${data.device.is_online ? '<span class="hl-green">在线</span>' : '<span class="hl-gray">下线</span>'}</div>`)
        content.push(`<div class="info-row tar"><a class="hl-red" href="/#!/products/${this.currProduct.id}/devices/${data.device_id}">查看详情</a></div>`)
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
    absolute left 10px right 10px top 10px bottom 10px
    padding 0 20px
    margin 0

    .panel-hd
      .leftbox
        left 120px

    .device-list-wrap
      width 308px
      min-height 200px

      .search-box
        float left

        .search-box-input
          width 144px
          overflow hidden

          input
            width 144px

    .device-list
      absolute left 20px top 121px bottom
      width 308px
      overflow auto

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
      absolute left 348px top 69px right 20px bottom 20px

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

  .amap-info-content
    padding 0

    .map-popup
      .map-popup-header
        h3
          margin 0
          padding 8px 0 8px 15px
          border-bottom 1px solid default-border-color
          background #F3F3F3
          fon-size 16px

      .map-popup-body
        padding 15px

        .info-row
          line-height 26px
  .amap-logo
    right 0 !important
    left auto !important
    display none

  .amap-copyright
    right 70px !important
    left auto !important
    display none
</style>
