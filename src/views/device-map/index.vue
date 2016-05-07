<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>{{ $t("nav_aside.device_map") }}</h2>
        </div>
        <div class="panel-bd">
          <div class="action-bar">
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
          </div>
          <div class="device-map with-loading">
            <div class="icon-loading" v-show="loadingData">
              <i class="fa fa-refresh fa-spin"></i>
            </div>
            <div id="device-map" :style="'height: ' + mapHeight + 'px'" class="mb40"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import { globalMixins } from '../../mixins'
  import api from '../../api'
  import Select from '../../components/Select'
  import SearchBox from '../../components/SearchBox'

  export default {
    name: 'Settings',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'v-select': Select,
      'search-box': SearchBox
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
        map: {},
        currCoord: [116.39, 39.9],
        loadingData: false,
        placeSearch: {},
        mapHeight: 500,
        scale: 10000
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
      api.product.all().then((res) => {
        if (res.status === 200) {
          this.productOptions = res.data
          if (this.productOptions.length) {
            this.currProduct = this.productOptions[0]
          }
        }
      }).catch((res) => {
        this.handleError(res)
      })

      // 地图初始化
      this.map = new AMap.Map('device-map')

      // this.map.setCenter(this.currCoord)

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

        console.log(scale)
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
          // this.map.setCenter(new AMap.LngLat(lngX, latY));
          this.currCoord = [lng, lat]
          this.getGeographies()
        })
      })
    },

    watch: {
      currCoord () {
        this.map.setZoom(10)
        this.map.setCenter(this.currCoord)
      }
    },

    methods: {
      /**
       * 获取某个设备的地理信息
       * 1725036601
       */
      getGeography (deviceId) {
        this.loadingData = true
        api.device.getGeography(this.currProduct.id, deviceId).then((res) => {
          if (res.status === 200) {
            var pos = [res.data.lon, res.data.lat]
            // this.map.setCenter(pos)
            this.currCoord = pos
            this.map.clearMap()
            this._setMarker(pos)
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
            this.map.clearMap()
            res.data.devices.forEach((item) => {
              this._setMarker([item.lon, item.lat])
            })
          }
          this.map.setCenter(this.currCoord)
          this.loadingData = false
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },

      /**
       * 设置标识
       */
      _setMarker (pos) {
        var marker = new AMap.Marker({
          position: pos
        })
        marker.setMap(this.map)
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
  .amap-logo
    right 0 !important
    left auto !important
    display none

  .amap-copyright
    right 70px !important
    left auto !important
    display none
</style>
