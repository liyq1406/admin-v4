<template>
  <!-- Start: 数据端点-->
  <div class="panel">
    <div class="panel-bd">
      <div class="data-table">
        <div class="filter-bar">
          <div class="filter-group fr">
            <div class="filter-group-item">
              <button class="btn btn-ghost btn-sm" @click="getVDevice"><i class="fa fa-refresh" :class="{'fa-spin':refreshing}"></i></button>
            </div>
            <div class="filter-group-item">
              <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.overview.addForm.search_condi')" @search-activate="searching=!searching" @search-deactivate="searching=!searching"></search-box>
            </div>
          </div>
          <h3>{{ $t('operation.product.device.info.title') }}</h3>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>{{ $t('ui.datapoint.fields.index') }}</th>
              <th>{{ $t('ui.datapoint.fields.name') }}</th>
              <th>{{ $t('ui.datapoint.fields.mode') }}</th>
              <th>{{ $t('ui.datapoint.fields.description') }}</th>
              <th>{{ $t('ui.device.current_value') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="datapoint in filteredDatapoints">
              <td>{{ datapoint.index }}</td>
              <td>{{ datapoint.name }}</td>
              <td>{{dataPointType(datapoint.type)}}</td>
              <td>{{ datapoint.description }}</td>
              <td>{{ datapoint.value }}</td>
            </tr>
            <tr v-if="filteredDatapoints.length === 0">
              <td colspan="5" class="tac"><i v-if="$loadingRouteData" class="fa fa-refresh fa-spin"></i>
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
import api from 'api'
import { globalMixins } from 'src/mixins'
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
      searching: false,
      refreshing: false
    }
  },

  computed: {
    filteredDatapoints () {
      let result = []
      this.datapoints.forEach((item) => {
        let dp = _.cloneDeep(item)
        if (this.currVirtualDevice.hasOwnProperty(item.index)) {
          dp.value = this.currVirtualDevice[item.index]
        }
        result.push(dp)
      })
      if (this.query.length) {
        let reg = new RegExp(this.query, 'i')
        result = result.filter((item) => {
          return reg.test(item.name)
        })
      }
      return _.orderBy(result, ['index'], ['asc'])
    },
    // 数据端点类型
    dataPointTypes () {
      var result = [
        {
          value: 1,
          label: this.$t('operation.product.device.info.dp_types.type_bool')
        },
        {
          value: 2,
          label: this.$t('operation.product.device.info.dp_types.type_uint8')
        },
        {
          value: 3,
          label: this.$t('operation.product.device.info.dp_types.type_int16')
        },
        {
          value: 4,
          label: this.$t('operation.product.device.info.dp_types.type_int32')
        },
        {
          value: 5,
          label: this.$t('operation.product.device.info.dp_types.type_float')
        },
        {
          value: 6,
          label: this.$t('operation.product.device.info.dp_types.type_str')
        },
        {
          value: 7,
          label: this.$t('operation.product.device.info.dp_types.type_char_arr')
        },
        {
          value: 8,
          label: this.$t('operation.product.device.info.dp_types.type_uint16')
        },
        {
          value: 9,
          label: this.$t('operation.product.device.info.dp_types.type_uint32')
        }
      ]
      return result
    }
  },

  route: {
    data () {
      this.getDatapoints()
    }
  },

  methods: {
    /**
     * 获取设备端点列表
     */
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
      this.refreshing = true
      api.product.getVDevice(this.$route.params.product_id, this.$route.params.device_id).then((res) => {
        this.refreshing = false
        if (res.status === 200) {
          this.setCurrVirtualDevice(res.data)
        }
      }).catch((res) => {
        this.refreshing = false
        this.handleError(res)
      })
    },
    /**
     * 计算当前类型
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    dataPointType (type) {
      var result = ''
      this.dataPointTypes.forEach((item) => {
        if (item.value === type) {
          result = item.label
        }
      })
      return result
    }
  }
}
</script>
