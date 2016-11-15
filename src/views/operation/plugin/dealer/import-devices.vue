<template>
  <div class="main">
    <div class="main-title">
      <h2>经销商管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel">
      <div class="panel-hd"></div>
      <div class="panel-bd">
        <x-table :headers="headers" :tables="tables" :page="page" :loading="loadingData"  @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage" :selecting="true" @selected-change="selectChange">
          <div slot="filter-bar" class="filter-bar">
            <div class="filter-group fl">
              <div class="filter-group-item">
                <x-select width="100px" :label="selectDealer.label" size="small">
                  <label slot="label">经销商</label>
                  <select v-model="selectDealer" @change="getProductDevices(true)">
                    <option v-for="option in dealersOptions" :value="option">{{ option.label }}</option>
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
            <x-select width="100px" :label="selectMarkDealer.label" size="small">
              <label slot="label">标记为:</label>
              <select v-model="selectMarkDealer" @change="updateInfo">
                <option v-for="option in markDealersOptions" :value="option">{{ option.label }}</option>
              </select>
            </x-select>
          </div>
        </x-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import { pluginMixins } from '../mixins'
  import api from 'api'
  import SearchBox from 'components/SearchBox'
  import formatDate from 'filters/format-date'

  export default {
    name: 'AddBroadcast',

    mixins: [globalMixins, pluginMixins],

    components: {
      SearchBox
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
        selectMarkDealer: {
          label: '无',
          id: 0
        },
        dealers: [],
        queryTypeOptions: [
          { label: 'MAC', value: 'mac' },
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
          link: `/operation/plugins/dealer/${this.$route.params.app_id}/list`
        }, {
          label: '经销商详情',
          link: `/operation/plugins/dealer/${this.$route.params.app_id}/list/${this.$route.params.dealer_id}`
        }, {
          label: '添加设备'
        }],
        headers: [{
          key: 'mac',
          title: 'MAC'
        }, {
          key: 'active_date',
          title: '激活时间'
        }, {
          key: 'model',
          title: '产品型号'
        }, {
          key: 'sn',
          title: '序列号'
        }, {
          key: 'user',
          title: '客户名称'
        }, {
          key: 'phone',
          title: '手机号'
        }, {
          key: 'dealer',
          title: '所属经销商'
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
              id: item.id
            })
          })
          this.selectProduct = res[0]
        }
        return res
      },
      markDealersOptions () {
        let res = []
        if (this.dealers.length) {
          this.dealers.forEach((item) => {
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
      dealersOptions () {
        let res = []
        if (this.dealers.length) {
          this.dealers.forEach((item) => {
            res.push({
              label: item.name,
              id: item.id,
              dealer_code: item.dealer_code
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
      tables () {
        let res = []
        this.devices.forEach((item) => {
          let userInfo = _.find(this.users, (user) => {
            return user.device_id === item.id
          })
          let dealerInfo = null
          if (item.dealer_scope) {
            let curDealer = item.dealer_scope.split(',').slice(-1)[0]
            dealerInfo = _.find(this.dealers, (dealer) => {
              return dealer.dealer_code === curDealer
            })
          }
          res.push({
            id: item.id,
            mac: item.mac,
            active_date: formatDate(item.active_date),
            sn: item.sn || '--',
            model: '--',
            user: userInfo ? userInfo.nickname || '--' : '--',
            phone: userInfo ? userInfo.phone || '--' : '--',
            dealer: dealerInfo ? dealerInfo.name || '--' : '--',
            origin: item,
            userInfo: userInfo
          })
        })
        return res
      },
      dealerQueryCondition () {
        var condition = {
          filter: ['id', 'name', 'email', 'phone', 'address', 'status', 'dealer_code', 'upper_dealer_code', 'region', 'contacter', 'sale_goal', 'saled_amount', 'create_time'],
          limit: 1000
        }
        return condition
      },
      queryCondition () {
        let condition = {
          filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'sn', 'firmware', 'last_login', 'dealer_scope'],
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          order: {},
          query: {}
        }

        if (this.selectDealer.id) {
          condition.query.dealer_scope = { $like: this.selectDealer.dealer_code }
        }

        if (this.key.length > 0) {
          this.currentPage = 1
          condition.query[this.queryType.value] = { $like: this.key }
        }
        return condition
      }
    },
    ready () {
      this.getDealer()
    },
    watch: {
      selectProduct () {
        this.getProductDevices()
      }
    },
    methods: {
      updateInfo () {
        if (!this.selectMarkDealer.id || !this.selectDevices.length) {
          return
        }
        // 添加设备dealer_scope
        this.updateProductDevices()
        // 添加销售信息
        this.addClientInfo()
      },
      updateProductDevices () {
        let params = {
          dealer_scope: ''
        }
        params.dealer_scope = params.dealer_scope + this.selectMarkDealer.dealer_code
        if (this.selectMarkDealer.upper_dealer_code) {
          params.dealer_scope = this.selectMarkDealer.upper_dealer_code + ',' + params.dealer_scope
        }
        let length = this.selectDevices.length
        let count = 0
        this.selectDevices.forEach((item) => {
          api.product.updateDeviceMsg(this.selectProduct.id, item.id, params).then((res) => {
            count++
            if (res.status === 200) {
              // 更新成功
            }
            if (count === length) {
              // 批量更新完毕
              this.getProductDevices()
              this.selectMarkDealer = {
                label: '无',
                id: 0
              }
            }
          }).catch((res) => {
            count++
            this.handleError(res)
          })
        })
      },
      addClientInfo () {
        // 添加销售记录
        this.selectDevices.forEach((item) => {
          let params = {
            name: item.userInfo ? item.userInfo.name : '',
            phone: item.userInfo ? item.userInfo.phone : '',
            sn: item.origin.sn,
            // sale_time: item.origin.active_date,
            client_type: 'common_buyer',
            // product_mod: '',
            mac: item.origin.mac,
            product_id: this.selectProduct.id,
            device_id: item.origin.id
          }
          api.dealer.addClientInfo(this.selectMarkDealer.id, params).then((res) => {
            if (res.status === 200) {
              // 更新成功
            }
          }).catch((res) => {
            this.handleError(res)
          })
        })
      },
      selectChange (table) {
        if (table.length > 0) {
          this.showBatchBtn = true
        } else {
          this.showBatchBtn = false
        }
        this.selectDevices = table
      },
      // 获取经销商列表
      getDealer (reset) {
        if (reset === true) {
          this.currentPage = 1
        }
        this.loadingData = true
        api.dealer.list(this.dealerQueryCondition).then((res) => {
          if (res.status === 200 && res.data.list && res.data.list.length) {
            this.dealers = res.data.list
          } else {
            this.dealers = []
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
      getProductDevices (reset) {
        if (!this.selectProduct.id) {
          return
        }
        if (reset === true) {
          this.currentPage = 1
        }
        this.loadingData = true
        api.device.getList(this.selectProduct.id, this.queryCondition).then((res) => {
          if (res.status === 200 && res.data.list && res.data.list.length) {
            this.devices = res.data.list
            this.total = res.data.count
            this.loadingData = false
            this.users = []
            res.data.list.forEach((item) => {
              // 获取每个设备的用户信息
              this.getUsers(item)
            })
          } else {
            this.devices = []
          }
          this.loadingData = false
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },
      // 获取用户
      getUsers (device) {
        this.loadingData = true
        api.product.getUsers(this.selectProduct.id, device.id).then((res) => {
          // 根据获取回来的id去获取用户详情
          if (res.status && res.data.list && res.data.list.length) {
            res.data.list.forEach((item) => {
              if (item.role === 0) {
                this.getUsersInfo(item.user_id, device.id)
              }
            })
          }
          this.loadingData = false
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },
      getUsersInfo (userId, deviceId) {
        var params = {
          filter: ['id', 'nickname', 'email', 'phone'],
          query: {
            'id': {'$in': [userId]}
          }
        }
        api.user.list(params).then((res) => {
          if (res.status && res.data.list && res.data.list.length) {
            let info = res.data.list[0]
            info.device_id = deviceId
            this.users.push(info)
          }
          this.loadingData = false
        }).catch((res) => {
          this.loadingData = false
          this.handleError(res)
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
