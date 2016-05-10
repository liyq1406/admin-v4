<template>
  <div class="panel device-map-page">
    <div class="panel-hd">
      <h2>{{ $t("nav_aside.device_map") }}</h2>
      <div class="leftbox">
        <v-select width="160px" :label="currProduct.name" size="small">
          <span slot="label">选择产品：</span>
          <select v-model="currProduct">
            <option v-for="product in productOptions" :value="product">{{ product.name }}</option>
          </select>
        </v-select>
      </div>
    </div>
    <div class="panel-bd">
      <div class="device-list-wrap">
        <div class="action-bar">
          <search-box :key.sync="query" :active="searching" :placeholder="$t('overview.addForm.search_condi')" @cancel="" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="">
            <v-select width="100px" :label="queryType.label">
              <select v-model="queryType">
                <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
              </select>
            </v-select>
            <button slot="search-button" @click="" class="btn btn-primary">{{ $t('common.search') }}</button>
          </search-box>
        </div>
        <div class="device-list mb20">
          <div class="device-list-item" v-for="n in 8" :class="{'active':currIndex===n}" @click="currIndex=n">
            <div class="list-item-cont">
              <div class="icon-num">{{ n+1 }}</div>
              <div class="device-id">设备ID: 123115092</div>
              <div class="status hl-green">在线</div>
            </div>
          </div>
        </div>
        <pager v-if="true" :total="total" :current.sync="currentPage" :page-count="pageCount"></pager>
      </div>
      <!-- Start: 地图 -->
      <!-- <div class="action-bar">
        <v-select width="160px" :label="currProduct.name" class="mr10">
          <span slot="label">选择产品：</span>
          <select v-model="currProduct">
            <option v-for="product in productOptions" :value="product">{{ product.name }}</option>
          </select>
        </v-select>
        <search-box :key.sync="query" :active="searching" :placeholder="$t('overview.addForm.search_condi')" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @press-enter="handleSearch" class="fn">
          <v-select width="100px" :label="queryType.label">
            <select v-model="queryType">
              <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
            </select>
          </v-select>
          <button slot="search-button" @click="handleSearch" class="btn btn-primary">{{ $t('common.search') }}</button>
        </search-box>
      </div> -->

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
  import { globalMixins } from '../../mixins'
  import api from '../../api'
  import Select from '../../components/Select'
  import SearchBox from '../../components/SearchBox'
  import Alert from '../../components/Alert'
  import Pager from '../../components/Pager'

  export default {
    name: 'Settings',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'v-select': Select,
      'search-box': SearchBox,
      'v-alert': Alert,
      'pager': Pager
    },

    data () {
      return {
        currProduct: {},
        productOptions: [],
        query: '',
        searching: false,
        queryTypeOptions: [
          { label: '设备ID', value: 'id' },
          { label: '所在城市', value: 'city' }
        ],
        queryType: {
          label: '设备ID',
          value: 'id'
        },
        currentPage: 1,
        total: 100,
        pageSize: 10,
        currIndex: 0,
        map: {},
        markers: [],
        cluster: null,
        infoWindow: {},
        currCoord: [10, 10],
        loadingData: false,
        placeSearch: {},
        mapHeight: 500,
        scale: 10000,
        loadingProducts: false
      }
    },

    computed: {
      queryCondition () {
        var condition = {
          spherical: true,
          coord: this.currCoord,
          max_dist: this.scale * this.mapHeight / 79,
          query: {}
        }

        return condition
      }
    },

    ready () {
      this.loadingProducts = true
      api.product.all().then((res) => {
        if (res.status === 200) {
          if (res.data.length) {
            this.productOptions = res.data
            this.currProduct = this.productOptions[0]
            this._initMap()
          }
          this.loadingProducts = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingProducts = false
      })
    },

    watch: {
      currCoord () {
        this.map.setZoom(10)
        this.map.setCenter(this.currCoord)
      }
    },

    methods: {
      _initMap () {
        // 地图初始化
        this.map = new AMap.Map('device-map', {
          resizeEnable: true,
          zoom: 10
        })

        this.infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(0, -30)
        })

        // 工具条与比例尺
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.CitySearch', 'AMap.PlaceSearch'], () => {
          var toolBar = new AMap.ToolBar()
          var scale = new AMap.Scale()
          var citySearch = new AMap.CitySearch()
          this.placeSearch = new AMap.PlaceSearch({
            pageSize: 10,
            pageIndex: 1,
            city: '全国' // 城市
          })

          this.map.addControl(toolBar)
          this.map.addControl(scale)

          citySearch.getLocalCity()
          AMap.event.addListener(citySearch, 'complete', (res) => {
            if (res && res.city && res.bounds) {
              var cityCenter = res.bounds.getCenter()
              this.currCoord = [cityCenter.lng, cityCenter.lat]
              this.getGeographies()
            }
          })
          AMap.event.addListener(citySearch, 'error', (res) => {
            this.showNotice({
              type: 'error',
              content: res.info
            })
          })

          AMap.event.addListener(this.placeSearch, 'complete', (res) => {
            var poiArr = res.poiList.pois
            var lng = poiArr[0].location.getLng()
            var lat = poiArr[0].location.getLat()
            this.currCoord = [lng, lat]
            this.getGeographies()
          })
        })
      },

      /**
       * 获取某个设备的地理信息
       * @param  {Number} deviceId 设备ID
       */
      getGeography (deviceId) {
        this.loadingData = true
        api.device.getGeography(this.currProduct.id, deviceId).then((res) => {
          if (res.status === 200) {
            this.currCoord = [res.data.lon, res.data.lat]
            this.map.clearMap()
            this._setMarker(res.data)
            this.loadingData = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },

      /**
       * 获取区域设备地理信息
       */
      getGeographies () {
        this.loadingData = true
        api.device.getGeographies(this.currProduct.id, this.queryCondition).then((res) => {
          if (res.data.count) {
            // this.map.clearMap()
            // res.data.devices.forEach((item) => {
            //   this._setMarker(item)
            // })
            this._setMarkers(res.data.devices)
          }
          this.map.setCenter(this.currCoord)
          this.loadingData = false
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },

      _addCluster (flag) {
        if (this.cluster) {
          this.cluster.setMap(null)
        }

        if (flag === 1) {
          var sts = [{
            url: 'js_1.png',
            size: new AMap.Size(32, 32),
            offset: new AMap.Pixel(-16, -30)
          }, {
            url: 'js_2.png',
            size: new AMap.Size(32, 32),
            offset: new AMap.Pixel(-16, -30)
          }, {
            url: 'js_3.png',
            size: new AMap.Size(48, 48),
            offset: new AMap.Pixel(-24, -45),
            textColor: '#CC0066'
          }]
          this.map.plugin(['AMap.MarkerClusterer'], () => {
            this.cluster = new AMap.MarkerClusterer(this.map, this.markers, {styles: sts})
          })
        } else {
          this.map.plugin(['AMap.MarkerClusterer'], () => {
            this.cluster = new AMap.MarkerClusterer(this.map, this.markers)
          })
        }
      },

      /**
       * 设置单个点标记
       * @param  {Object} point 设备点
       */
      _setMarker (point) {
        var marker = new AMap.Marker({
          position: [point.lon, point.lat],
          map: this.map
        })
        marker.extData = point
        marker.on('click', this._onMarkerClick)
      },

      _setMarkers (points) {
        this.map.clearMap()
        // 测试数据
        // var mapBounds = this.map.getBounds()
        // var sw = mapBounds.getSouthWest()
        // var ne = mapBounds.getNorthEast()
        // var lngSpan = Math.abs(sw.lng - ne.lng)
        // var latSpan = Math.abs(ne.lat - sw.lat)
        // // 随机向地图添加500个标注点
        // for (var i = 0; i < 500; i++) {
        //   var markerPosition = new AMap.LngLat(sw.lng + lngSpan * (Math.random() * 1), ne.lat - latSpan * (Math.random() * 1))
        //   var marker = new AMap.Marker({
        //     map: this.map,
        //     position: markerPosition, // 基点位置
        //     icon: 'static/images/marker.png', // marker图标，直接传递地址url
        //     offset: {x: -8, y: -34} // 相对于基点的位置
        //   })
        //   marker.extData = {
        //     lon: markerPosition.lng,
        //     lat: markerPosition.lat,
        //     device_id: 1999241056
        //   }
        //   marker.on('click', this._onMarkerClick)
        //   this.markers.push(marker)
        // }

        points.forEach((point, index) => {
          var marker = new AMap.Marker({
            map: this.map,
            position: [point.lon, point.lat],
            icon: 'static/images/marker.png',
            offset: {x: -8, y: -34}
          })
          marker.extData = point
          marker.on('click', this._onMarkerClick)
          this.markers.push(marker)
        })

        setTimeout(() => {
          this._addCluster(0)
        }, 1000)
      },

      /**
       * 处理点标记点击
       * @param  {Event} e 事件
       */
      _onMarkerClick (e) {
        api.device.getInfo(this.currProduct.id, Number(e.target.extData.device_id)).then((res) => {
          var content = []
          content.push(`<strong>${this.currProduct.name}</strong>`)
          content.push(`设备ID: ${res.data.id}`)
          content.push(`设备MAC: ${res.data.mac}`)
          content.push(`在线状态: ${res.data.is_online ? '<span class="hl-green">在线</span>' : '<span class="hl-gray">下线</span>'}`)
          this.infoWindow.setContent(content.join('<br/>'))
          this.map.setCenter([e.target.extData.lon, e.target.extData.lat])
          this.infoWindow.open(this.map, e.target.getPosition())
        }).catch((res) => {
          this.showNotice({
            type: 'error',
            content: '设备不存在'
          })
        })
      },

      // 搜索
      handleSearch () {
        if (this.query.length !== 0) {
          if (this.queryType.value === 'id') {
            this.getGeography(this.query)
          } else {
            this.placeSearch.search(this.query)
          }
        } else {
          this.showNotice({
            type: 'error',
            content: `请输入${this.queryType.label}`
          })
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
  @import '../../assets/stylus/common'

  .device-map-page
    absolute left 190px right 20px top 80px bottom 20px
    padding 0 20px
    margin 0

    .panel-hd
      .leftbox
        left 120px

    .device-list-wrap
      width 308px

      .search-box
        float left

        .search-box-input
          width 144px
          overflow hidden

          input
            width 144px

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
        background url("../../assets/images/marker.png") no-repeat 0 -254px

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

  .amap-logo
    right 0 !important
    left auto !important
    display none

  .amap-copyright
    right 70px !important
    left auto !important
    display none
</style>
