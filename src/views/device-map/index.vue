<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>{{ $t("nav_aside.device_map") }}</h2>
        </div>
        <div class="panel-bd">
          <div class="action-bar">
            <search-box :key.sync="query" :active="searching" :placeholder="$t('overview.addForm.search_condi')" @cancel="getLocations" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getLocations">
              <v-select width="100px" :label="queryType.label">
                <select v-model="queryType">
                  <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                </select>
              </v-select>
              <button slot="search-button" @click="getLocations" class="btn btn-primary">{{ $t('common.search') }}</button>
            </search-box>
            <v-select width="160px" :label="currProduct.name" class="mr20">
              <select v-model="currProduct">
                <option v-for="product in productOptions" :value="product">{{ product.name }}</option>
              </select>
            </v-select>
          </div>
          <div id="device-map" style="height: 500px;" class="mb40"></div>
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
          { label: 'MAC', value: 'mac' },
          { label: '设备ID', value: 'id' },
          { label: '设备名称', value: 'name' }
        ],
        queryType: {
          label: 'MAC',
          value: 'mac'
        }
      }
    },

    computed: {
      queryCondition () {
        var condition = {
          filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'last_login'],
          // limit: this.pageCount,
          // offset: (this.currentPage - 1) * this.pageCount,
          // order: this.sortOrders,
          query: {}
        }

        if (this.query.length > 0) {
          condition.query[this.queryType.value] = this.queryType.value === 'id' ? { $in: Number(this.query) } : { $like: this.query }
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
      var map = new AMap.Map('device-map')
      map.setZoom(10)
      map.setCenter([116.39, 39.9])
      var marker = new AMap.Marker({
        position: [116.480983, 39.989628]
      })
      marker.setMap(map)

      // 工具条与比例尺
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {
        var toolBar = new AMap.ToolBar()
        var scale = new AMap.Scale()
        map.addControl(toolBar)
        map.addControl(scale)
      })
    },

    methods: {
      getLocations () {

      },

      // 搜索
      handleSearch () {
        if (this.query.length === 0) {
          this.getLocations()
        }
      },

      // 切换搜索
      toggleSearching () {
        this.searching = !this.searching
      },

      // 取消搜索
      cancelSearching () {
        this.getLocations()
      }
    }
  }
</script>
