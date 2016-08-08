<template>
  <!-- Start: 数据端点-->
  <div class="panel">
    <div class="panel-bd">
      <div class="data-table">
        <div class="filter-bar">
          <div class="filter-group fr">
            <div class="filter-group-item">
              <button class="btn btn-ghost btn-sm" @click="getVDevice"><i class="fa fa-refresh"></i></button>
            </div>
            <div class="filter-group-item">
              <search-box :key.sync="query" :auto="true" :active="searching" :placeholder="$t('ui.overview.addForm.search_condi')" @cancel="cancelSearching" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch"></search-box>
              </search-box>
            </div>
          </div>
          <h3>设备状态数据</h3>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>{{ $t('ui.datapoint.fields.index') }}</th>
              <th>{{ $t('ui.datapoint.fields.name') }}</th>
              <th>{{ $t('ui.datapoint.fields.description') }}</th>
              <th>{{ $t('ui.device.current_value') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="datapoint in filteredDatapoints | orderBy 'index'">
              <td>{{ datapoint.index }}</td>
              <td>{{ datapoint.name }}</td>
              <td>{{ datapoint.description }}</td>
              <!-- <td>{{ dpVal(datapoint) }}</td> -->
              <td>{{ datapoint.value }}</td>
            </tr>
            <tr v-if="datapoints.length === 0">
              <td colspan="4" class="tac"><i v-if="$loadingRouteData" class="fa fa-refresh fa-spin"></i>
                <div v-else class="tips-null">{{ $t('ui.device.no_datapoint') }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- End: 数据端点-->
</template>

<script>
// import Vue from 'vue'
// import v-form from 'vue'
import api from 'api'
import { globalMixins } from 'src/mixins'
// import locales from 'consts/locales/index'
import SearchBox from 'components/SearchBox'
import store from 'store'
import { setCurrVirtualDevice } from 'store/actions/products'
import _ from 'lodash'

export default {
  name: 'DeviceDetails',

  mixins: [globalMixins],

  components: {
    SearchBox
  },

  store,

  vuex: {
    getters: {
      currVirtualDevice: ({ products }) => products.currVirtualDevice
    },
    actions: {
      setCurrVirtualDevice
    }
  },

  data () {
    return {
      datapoints: [],
      datapointValues: {},
      query: '',
      searching: false
    }
  },

  computed: {
    filteredDatapoints () {
      let result = []
      let reg = new RegExp(this.query, 'ig')

      const dpVal = (dp) => {
        let result = ''
        if (Object.keys(this.currVirtualDevice).length) {
          switch (dp.type) {
            case 1:
              result = this.currVirtualDevice[dp.index]
              break
            case 2:
            case 3:
            case 4:
              result = this.currVirtualDevice[dp.index]
              break
            default:
              result = this.currVirtualDevice[dp.index] || '--'
          }
        }
        return result
      }

      if (this.query.length) {
        this.currentPage = 1
      }

      result = this.datapoints.filter((item) => {
        return reg.test(item.name)
      })

      result.forEach((item) => {
        item.value = dpVal(item)
      })

      return _.orderBy(result, ['index'], ['asc'])
    }
  },

  route: {
    data () {
      // this.getDatapointValues()
      // this.getDeviceInfo()
      this.getDatapoints()
    }
  },

  methods: {
    // dpVal (dp) {
    //   let result = ''
    //   if (Object.keys(this.currVirtualDevice).length) {
    //     switch (dp.type) {
    //       case 1:
    //         result = this.currVirtualDevice[dp.index] ? 'true' : 'false'
    //         break
    //       case 2:
    //       case 3:
    //       case 4:
    //         result = this.currVirtualDevice[dp.index]
    //         break
    //       default:
    //         result = this.currVirtualDevice[dp.index] || '--'
    //     }
    //   }
    //   return result
    // },

    // 获取设备端点列表
    getDatapoints () {
      api.product.getDatapoints(this.$route.params.product_id).then((res) => {
        if (res.status === 200) {
          this.datapoints = res.data.map((item) => {
            item.value = null
            return item
          })
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 获取虚拟设备数据
     */
    getVDevice () {
      api.product.getVDevice(this.$route.params.product_id, this.$route.params.device_id).then((res) => {
        if (res.status === 200) {
          this.setCurrVirtualDevice(res.data)
          // this.deviceInfo.onlineLong.value = '100小时'
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    // 获取设备端点值
    // getDatapointValues () {
    //   this.refreshing = true
    //   api.device.getDatapointValues(this.$route.params.device_id, { act: 'logs' }).then((res) => {
    //     this.refreshing = false
    //     if (res.status === 202) {
    //       console.log('设备离线！')
    //     } else {
    //       var datapointsObj = {}
    //       res.data.datapoint.map(function (item) {
    //         datapointsObj[item.index] = item.value
    //       })
    //       this.datapointValues = datapointsObj
    //     }
    //   }).catch((res) => {
    //     this.refreshing = false
    //     this.showNotice({
    //       type: 'error',
    //       content: locales[Vue.config.lang].errors[res.data.error.code]
    //     })
    //   })
    // },

    // 搜索
    handleSearch () {
      if (this.query.length === 0) {
        this.getDatapoints()
        this.getDatapointValues()
      }
    },

    // 切换搜索
    toggleSearching () {
      this.searching = !this.searching
    },

    // 取消搜索
    cancelSearching () {
      this.getDatapoints()
      this.getDatapointValues()
    }
  }
}
</script>
