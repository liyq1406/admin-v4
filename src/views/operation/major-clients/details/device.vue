<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="filter-bar">
          <div class="filter-group fl">
            <div class="filter-group-item">
              <x-select :label="selectedProduct.name" width='110px' size="small">
                <span slot="label">{{ $t('common.display') }}</span>
                <select v-model="selectedProduct" @change="getDevices">
                  <option v-for="product in products" :value="product">{{product.name}}</option>
                </select>
              </x-select>
            </div>
          </div>
          <div class="filter-group fr">
            <div class="filter-group-item">
              <search-box :key.sync="query" :active="searching" @cancel="getDevices" :placeholder="$t('common.placeholder.search')" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getDevices">
                <button slot="search-button" @click="getDevices" class="btn"><i class="fa fa-search"></i></button>
                <!-- <label>{{ $t('ui.user.search_user') }}</label> -->
              </search-box>
            </div>
          </div>
        </div>
        <x-table
        :headers="headers"
        :rows="rows"
        :page="page"
        :loading="loadingData"
        @theader-is-active="sortBySomeKey"  @theader-active-date="sortBySomeKey"  @theader-is-online="sortBySomeKey" @page-count-update="pageCountUpdate" @current-page-change="currentPageChange"
        ></x-table>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
import formatDate from 'filters/format-date'
export default {
  name: 'device-list',
  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  components: {
  },

  data () {
    return {
      searching: false,
      query: '',
      total: 0,
      currentPage: 1,
      countPerPage: 10,
      loadingData: false,
      selectedProduct: {},
      devices: [ // 用户绑定设备列表
        // {
        //   'id': '设备ID',
        //   'mac': 'MAC地址',
        //   'name': '设备名称',
        //   'is_active': false,
        //   'active_date': '2014-10-09T08:15:40.843Z',
        //   'is_online': false,
        //   'last_login': '最近登录时间',
        //   'last_login_ip': '最近登录IP',
        //   'mcu_mod': 'MCU型号',
        //   'mcu_version': 'MCU版本号',
        //   'firmware_mod': '固件型号',
        //   'firmware': '固件版本号',
        //   'product_id': '产品ID',
        //   'region_id': '所在区域ID',
        //   'sn': '设备序列号',
        //   'create_time': '创建时间',
        //   'creator_id': '创建者ID',
        //   'creator_type': '创建者类型',
        //   'heavy_buyer': '大客户Id'
        // }
      ],
      headers: [
        // {
        //   key: 'name',
        //   title: '产品名称（型号）'
        // },
        {
          key: 'mac',
          title: 'MAC'
        },
        {
          key: 'sn',
          title: this.$t('operation.user.details.devices.sn')
          // tooltip: '提示内容'
        },
        {
          key: 'is_active',
          title: this.$t('operation.user.details.devices.is_active'),
          sortType: '-1'
        },
        {
          key: 'active_date',
          title: this.$t('operation.user.details.devices.active_date'),
          sortType: '-1'
        },
        {
          key: 'is_online',
          title: this.$t('operation.user.details.devices.is_online'),
          class: 'tac',
          sortType: '-1'
        }
      ],
      // 当前用于排序的字段 默认是激活时间
      sortKey: 'active_date'
    }
  },

  computed: {
    /**
     * 传入智能表格的分页对象
     * 国辉
     * @return {[type]} [description]
     */
    page () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },
    /**
     * 传入智能表格的数据对象
     * 国辉
     * @return {[type]} [description]
     */
    rows () {
      var result = []
      this.devices.map((device) => {
        var table = {
          // name: device.name,
          mac: device.mac,
          sn: device.sn,
          is_active: device.is_active ? this.$t('common.yes') : this.$t('common.no'),
          active_date: formatDate(device.active_date),
          is_online: device.is_online ? this.$t('common.online') : this.$t('common.offline'),
          prototype: device
        }
        result.push(table)
      })
      return result
    },
    queryCondition () {
      var condition = {
        filter: [
          'id',
          'mac',
          'name',
          'is_active',
          'active_date',
          'is_online',
          'last_login',
          'last_login_ip',
          'mcu_mod',
          'mcu_version',
          'firmware_mod',
          'firmware',
          'product_id',
          'region_id',
          'sn',
          'create_time',
          'creator_id',
          'creator_type',
          'heavy_buyer'
        ],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {},
        query: {
          'heavy_buyer': { $in: [this.$route.params.id] }
        }
      }

      if (this.query.length > 0) {
        condition.query['name'] = { $like: this.query }
        condition.query['mac'] = { $like: this.query }
        condition.query['sn'] = { $like: this.query }
      }

      this.headers.map((item) => {
        if (item.sortType && (item.key === this.sortKey)) {
          condition.order[item.key] = (item.sortType === 1 ? 'asc' : 'desc')
        }
      })

      return condition
    }
  },

  watch: {
    products () {
      this.init()
    }
  },

  route: {
    data () {
      this.init()
    }
  },

  methods: {
    /**
     * 当前页码改变
     * 国辉
     * @param  {[type]} number [description]
     * @return {[type]}        [description]
     */
    currentPageChange (number) {
      this.currentPage = number
      this.getDevices()
    },
    /**
     * 每页显示的数量改变
     * 国辉
     * @param  {[type]} count 每页显示数量
     * @return {[type]}       [description]
     */
    pageCountUpdate (count) {
      this.countPerPage = count
      this.getDevices()
    },
    /**
     * 获取用户订阅设备
     */
    getDevices () {
      this.loadingData = true
      api.product.getDevices(this.selectedProduct.id, this.queryCondition).then((res) => {
        this.loadingData = false
        if (res.status === 200) {
          this.devices = res.data.list
          this.total = res.data.count
        }
      }).catch((res) => {
        this.loadingData = false
        this.handleError(res)
      })
    },

    // 搜索
    handleSearch () {
      if (this.query.length === 0) {
        this.getDevices()
      }
    },

    // 切换搜索
    toggleSearching () {
      this.searching = !this.searching
    },

    // 取消搜索
    cancelSearching () {
      this.getDevices()
    },
    /**
     * 按某个属性排序
     * 国辉
     * @param  {[type]} table [description]
     * @return {[type]}       [description]
     */
    sortBySomeKey (header, index) {
      this.sortKey = header.key
      if (header.sortType === 1) {
        header.sortType = -1
      } else {
        header.sortType = 1
      }
      this.headers.$set(index, header)
      this.getDevices()
    },
    /**
     * 初始化产品 下拉列表
     * @return {[type]} [description]
     */
    init () {
      this.selectedProduct = this.products[0] || {}
      if (this.selectedProduct.id) {
        this.getDevices()
      }
    }
  }
}
</script>
