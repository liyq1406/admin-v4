<template>
  <div class="panel">
    设备列表
  </div>
</template>

<script>
import api from 'api'
import { globalMixins } from 'src/mixins'
import SearchBox from 'components/SearchBox'
import { setCurrVirtualDevice } from 'store/actions/products'

export default {
  name: 'DeviceDetails',

  mixins: [globalMixins],

  components: {
    SearchBox
  },

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
