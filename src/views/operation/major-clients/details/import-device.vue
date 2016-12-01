<template>
  <div class="main">
    <div class="main-title">
      <h2>大客户关联设备</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel">
      <div class="panel-hd"></div>
      <div class="panel-bd">
        <x-table :headers="headers" :rows="rows" :page="page" :loading="loadingData"  @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage" :selecting="true" @selected-change="selectChange">
          <div slot="filter-bar" class="filter-bar">
            <div class="filter-group fl">
              <div class="filter-group-item">
                <x-select width="100px" :label="selectDealer.label" size="small">
                  <label slot="label">选择客户</label>
                  <select v-model="selectDealer" @change="getProductDevices(true)">
                    <option v-for="option in majorClientsOptions" :value="option">{{ option.label }}</option>
                  </select>
                </x-select>
              </div>
              <div class="filter-group-item">
                <x-select width="100px" :label="selectProduct.label" size="small">
                  <label slot="label">产品</label>
                  <select v-model="selectProduct" @change="getProductDevices(true)">
                    <option v-for="option in productsOptions" :value="option">{{ option.label }}</option>
                  </select>
                </x-select>
              </div>
            </div>
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="key" :active="searching" :placeholder="$t('ui.overview.addForm.search_condi')" @cancel="getProductDevices(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getProductDevices(true)">
                  <x-select width="100px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </x-select>
                  <button slot="search-button" @click.prevent="getProductDevices(true)" class="btn"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
          </div>
          <div slot="left-foot" v-show="showBatchBtn" class="row mt10">
            <x-select width="100px" :label="selectMarkMajorClient.label" size="small">
              <label slot="label">标记为:</label>
              <select v-model="selectMarkMajorClient" @change="updateInfo">
                <option v-for="option in markMajorClientOptions" :value="option">{{ option.label }}</option>
              </select>
            </x-select>
          </div>
        </x-table>
      </div>
    </div>
  </div>
</template>

<script>
  // import { pluginMixins } from '../mixins'
  import api from 'api'
  import formatDate from 'filters/format-date'

  export default {
    name: 'AddBroadcast',

    // mixins: [pluginMixins],

    components: {
    },

    vuex: {
      getters: {
        releasedProduct: ({ products }) => products.released
      }
    },

    data () {
      return {
        selectDevices: [],
        devices: [],
        users: [],
        showBatchBtn: false,
        selectProduct: {},
        selectDealer: {
          label: '全部',
          id: 0
        },
        selectMarkMajorClient: {
          label: '无',
          id: 0
        },
        majorClients: [],
        queryTypeOptions: [
          { label: 'MAC', value: 'mac' },
          { label: '设备ID', value: 'id' },
          { label: '序列号', value: 'sn' }
        ],
        queryType: {
          label: 'MAC',
          value: 'mac'
        },
        loadingData: false,
        total: 0,
        countPerPage: 10,
        currentPage: 1,
        key: '',
        breadcrumbNav: [{
          label: '全部',
          link: 'operation/major-clients'
        }, {
          label: '大客户信息',
          link: `operation/major-clients/${this.$route.params.id}/device`
        }, {
          label: '添加设备'
        }],
        headers: [{
          key: 'device--mac',
          title: 'MAC'
        }, {
          key: 'device--id',
          title: '设备ID'
        }, {
          key: 'device--active_date',
          title: '激活时间'
        }, {
          key: 'device--sn',
          title: '序列号'
        }, {
          key: 'heavy_buyer--name',
          title: '客户名称'
        }]
      }
    },

    computed: {
      productsOptions () {
        let res = []
        if (this.releasedProduct.length) {
          this.releasedProduct.forEach((item) => {
            res.push({
              label: item.name,
              id: item.id,
              mode: item.mode
            })
          })
          this.selectProduct = res[0]
        }
        return res
      },
      markMajorClientOptions () {
        let res = []
        if (this.majorClients.length) {
          this.majorClients.forEach((item) => {
            res.push({
              label: item.name,
              id: item.id,
              dealer_code: item.dealer_code,
              upper_dealer_code: item.upper_dealer_code
            })
          })
        }
        res.unshift({
          label: '无',
          id: 0
        })
        return res
      },
      majorClientsOptions () {
        let res = []
        if (this.majorClients.length) {
          this.majorClients.forEach((item) => {
            res.push({
              label: item.name,
              id: item.id
            })
          })
        }
        res.unshift({
          label: '全部',
          id: 0
        })
        return res
      },
      page () {
        var result = {
          total: this.total,
          currentPage: this.currentPage,
          countPerPage: this.countPerPage
        }
        return result
      },
      rows () {
        let res = []
        this.devices.forEach((item) => {
          res.push({
            'device--id': item.device.id,
            'device--mac': item.device.mac,
            'device--active_date': formatDate(item.device.active_date),
            'device--sn': item.device.sn || '-',
            'heavy_buyer--name': item.heavy_buyer.name || '-'
          })
        })
        return res
      },
      majorClientQueryCondition () {
        var condition = {
          filter: ['id', 'name', 'industry', 'location', 'contacter', 'contact_way', 'device_sum', 'status', 'country', 'province', 'city', 'create_time'],
          limit: 1000
        }
        return condition
      },
      queryCondition () {
        let condition = {
          filter: {
            device: ['id', 'mac', 'is_active', 'active_date', 'sn'],
            online: ['is_online'],
            heavy_buyer: ['id', 'name']
          },
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          order: {},
          query: {
            '$logical': 'AND',
            device: {},
            heavy_buyer: {}
          }
        }

        if (this.selectDealer.id) {
          condition.query.heavy_buyer.id = { $like: this.selectDealer.id }
        }

        if (this.key.length > 0) {
          this.currentPage = 1
          condition.query.device[this.queryType.value] = { $like: this.key }
        }
        return condition
      }
    },
    route: {
      data () {
        this.getMajorClients()
      }
    },
    ready () {
    },
    watch: {
      selectProduct () {
        this.getProductDevices()
      }
    },
    methods: {
      updateInfo () {
        if (!this.selectMarkMajorClient.id || !this.selectDevices.length) {
          return
        }
        // // 添加销售信息
        this.addClientInfo()
      },
      addClientInfo () {
        var devices = []
        this.selectDevices.forEach((item) => {
          var device = {
            mac: item['device--mac']
          }
          devices.push(device)
        })
        api.heavyBuyer.grantDevices(this.selectMarkMajorClient.id, this.selectProduct.id, devices).then((res) => {
          if (res.status === 200) {
            this.showNotice({
              type: 'success',
              content: '添加成功'
            })
            this.getProductDevices()
          }
          this.importing = false
        }).catch((res) => {
          this.handleError(res)
          this.importing = false
        })
      },

      selectChange (row) {
        if (row.length > 0) {
          this.showBatchBtn = true
        } else {
          this.showBatchBtn = false
        }
        this.selectDevices = row
      },
      // 获取大客户列表
      getMajorClients (reset) {
        if (reset === true) {
          this.currentPage = 1
        }
        this.loadingData = true

        api.heavyBuyer.getHeavyBuyer(this.majorClientQueryCondition).then((res) => {
          if (res.status === 200 && res.data.list && res.data.list.length) {
            this.majorClients = res.data.list
          } else {
            this.majorClients = []
          }
          this.loadingData = false
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },
      // 切换搜索
      toggleSearching () {
        this.searching = !this.searching
      },
      // 搜索
      handleSearch () {
        if (this.key.length === 0) {
          this.getProductDevices(true)
        }
      },
      onPageCountUpdate (count) {
        this.countPerPage = count
        this.getProductDevices()
      },
      onCurrPageChage (number) {
        this.currentPage = number
        this.getProductDevices()
      },

      /**
       * 获取设备列表
       */
      getProductDevices (reset) {
        if (!this.selectProduct.id) {
          return
        }
        if (reset === true) {
          this.currentPage = 1
        }
        this.loadingData = true
        api.device.getAggregateDevices(this.selectProduct.id, this.queryCondition).then((res) => {
          if (res.status === 200 && res.data.list && res.data.list.length) {
            this.devices = res.data.list
            this.total = res.data.count
            this.loadingData = false
          } else {
            this.devices = []
          }
          this.loadingData = false
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../../assets/stylus/common'

  .form
    max-width 640px

  .select-group
    .x-select
      display inline-block
</style>
