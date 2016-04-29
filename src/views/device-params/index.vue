<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>产品参数</h2>
        </div>
        <div class="panel-bd">
          <div class="action-bar">
            <v-select width="160px" :label="product.name" placeholder="请选择产品">
              <span slot="label">产品：</span>
              <select v-model="product" @change="onProductChange(product)">
                <option v-for="option in productOptions" :value="option">{{ option.name }}</option>
              </select>
            </v-select>
            <search-box :key.sync="query" :active="searching" :placeholder="$t('overview.addForm.search_condi')" @cancel="getDevices(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getDevices(true)">
              <v-select width="90px" :label="queryType.label">
                <select v-model="queryType">
                  <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                </select>
              </v-select>
              <button slot="search-button" @click="getDevices(true)" class="btn btn-primary">{{ $t('common.search') }}</button>
            </search-box>
          </div>
          <div class="status-bar">
            <div class="status">{{{ $t('common.total_results', {count:total}) }}}
            </div>
            <v-select width="90px" size="small" :label="visibility.label">
              <span slot="label">{{ $t('common.display') }}：</span>
              <select v-model="visibility" @change="getDevices">
                <option v-for="option in visibilityOptions" :value="option">{{ option.label }}</option>
              </select>
            </v-select>
            <button class="btn btn-success btn-sm tac" @click="reloadData">
              <i class="fa fa-refresh" :class="{'fa-spin': loadingData}"></i><span>刷新</span>
            </button>
          </div>
          <div class="data-table with-loading">
            <div class="icon-loading" v-show="loadingData">
              <i class="fa fa-refresh fa-spin"></i>
            </div>
            <table class="table table-stripe table-bordered">
              <thead>
                <tr>
                  <th @click="sortBy('mac')" :class="{active: sortKey === 'mac'}">MAC<i :class="sortOrders['mac'] ==='asc' ? 'fa-caret-up' : 'fa-caret-down'" class="fa"></i></th>
                  <th>{{ $t('device.id') }}</th>
                  <th>{{ '运行模式' }}</th>
                  <th>{{ '水箱温度' }}</th>
                  <th>{{ '环境温度' }}</th>
                  <th>{{ '运行时间' }}</th>
                  <th>{{ $t('device.is_active') }}</th>
                  <th @click="sortBy('active_date')" :class="{active: sortKey === 'active_date'}">{{ $t('device.active_date') }}<i :class="sortOrders['active_date'] ==='asc' ? 'fa-caret-up' : 'fa-caret-down'" class="fa"></i></th>
                  <th>{{ $t('device.is_online') }}</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="devices.length > 0">
                  <tr v-for="device in devices">
                    <td><a @click="linkto('/device-params/' + product.id + '/' + device.id + '/' + device.mac, device.is_online)" class="hl-red">{{ device.mac }}</a></td>
                    <td>{{ device.id }}</td>
                    <td>{{ device.runMode }}</td>
                    <td>{{ device.tankTemperature }}</td>
                    <td>{{ device.ambientTemperature }}</td>
                    <td>{{ device.runningTime }}</td>
                    <td v-text="device.is_active ? $t('device_list.active') : $t('device_list.not_active')"></td>
                    <td><span v-if="device.active_date">{{ device.active_date | formatDate }}</span></td>
                    <td><span v-if="device.is_online" class="hl-green">{{ $t('device_list.online') }}</span><span v-else class="hl-gray">{{ $t('device_list.offline') }}</span></td>
                  </tr>
                </template>
                <tr v-if="devices.length === 0 && !loadingData">
                  <td colspan="9" class="tac">
                    <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <pager v-if="total > pageCount" :total="total" :current.sync="currentPage" :page-count="pageCount" @page-update="getDevices"></pager>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from '../../api'
  import Select from '../../components/Select'
  import Pager from '../../components/Pager'
  import Modal from '../../components/Modal'
  import SearchBox from '../../components/SearchBox'
  import locales from '../../consts/locales/index'
  // import _ from 'lodash'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'DeviceList',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'v-select': Select,
      'modal': Modal,
      'search-box': SearchBox,
      'pager': Pager
    },

    data () {
      var sortOrders = {}
      var descProperties = ['active_date']
      var ascProperties = ['mac']

      descProperties.forEach((key) => {
        sortOrders[key] = 'desc'
      })

      ascProperties.forEach((key) => {
        sortOrders[key] = 'asc'
      })

      return {
        query: '',
        sortKey: '',
        sortOrders: sortOrders,
        searching: false,
        visibility: {
          label: '全部',
          value: 'all'
        },
        visibilityOptions: locales[Vue.config.lang].visibilityOptions,
        product: {},
        productOptions: [],
        devices: [],
        total: 0,
        currentPage: 1,
        pageCount: 10,
        showAddModal: false,
        addModel: {
          mac: ''
        },
        addValidation: {},
        originAddModel: {},
        // querying: false,
        adding: false,
        importing: false,
        loadingData: false,
        queryTypeOptions: [
          { label: 'MAC', value: 'mac' },
          { label: '设备ID', value: 'id' }
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
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount,
          order: this.sortOrders,
          query: {}
        }

        if (this.query.length > 0) {
          condition.query[this.queryType.value] = { $like: this.query }
        }

        switch (this.visibility.value) {
          case 'online':
            condition.query['is_online'] = { $in: [true] }
            break
          case 'active':
            condition.query['is_active'] = { $in: [true] }
            break
          case 'inactive':
            condition.query['is_active'] = { $in: [false] }
            break
          default:
        }

        return condition
      },
      deviceIds () {
        var result = []
        this.devices.map((item) => {
          result.push(item.id)
        })
        return result
      }
    },

    route: {
      data () {
        api.product.all().then((res) => {
          this.productOptions = res.data
          if (!window.localStorage.getItem('paramsCurrProduct')) {
            this.product = res.data[0]
            window.localStorage.setItem('paramsCurrProduct', res.data[0].id)
            this.getDevices()
          } else {
            api.product.getProduct(window.localStorage.getItem('paramsCurrProduct')).then((res) => {
              if (res.status === 200) {
                this.product = res.data
                this.getDevices()
              }
            }).catch((res) => {
              window.localStorage.removeItem('paramsCurrProduct')
              // this.handleError(res)
            })
          }
        }).catch((res) => {
          this.handleError(res)
        })
      }
    },

    methods: {
      /**
       * 刷新数据
       * @return {[type]} [description]
       */
      reloadData () {
        if (!this.loadingData) {
          this.getDevices()
        }
      },

      /**
       * 批量获取虚拟设备数据
       * @return {[type]} [description]
       */
      getDeviceDataPoint () {
        console.log(this.deviceIds)
        for (let i = 0; i < this.deviceIds.length; i++) {
          api.device.getDeviceDataPoint(this.product.id, this.deviceIds[i]).then((res) => {
            this.devices.map((item) => {
              if (item.id - 0 === res.data.device_id) {
                item.runMode = res.data[36] ? (res.data[36] - 0 === 0 ? '自动模式' : '节能模式') : '--'
                item.tankTemperature = (res.data[43] ? res.data[43] + '℃' : '') || '--'
                item.ambientTemperature = (res.data[34] ? res.data[34] + '℃' : '') || '--'
                item.runningTime = res.data[45] || '--'
              }
            })
          }).catch((res) => {
            // this.handleError(res)
            // this.loadingData = false
          })
        }
      },
      /**
       * 处理产品切换
       * @param  {Object} product 选择的产品
       */
      onProductChange (product) {
        this.product = product
        window.localStorage.setItem('paramsCurrProduct', product.id)
        this.getDevices()
      },

      // 获取设备列表
      getDevices (querying) {
        if (typeof querying !== 'undefined') {
          this.currentPage = 1
        }
        this.loadingData = true
        api.device.getList(this.product.id, this.queryCondition).then((res) => {
          let deviceArr = res.data.list
          deviceArr.map((item) => {
            item.runMode = '--'
            item.tankTemperature = '--'
            item.ambientTemperature = '--'
            item.runningTime = '--'
          })
          this.devices = deviceArr
          this.getDeviceDataPoint()
          this.total = res.data.count
          this.loadingData = false
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },

      // 搜索
      handleSearch () {
        if (this.query.length === 0) {
          this.getDevices()
        }
      },

      // 排序
      sortBy (key) {
        this.sortKey = key
        this.sortOrders[key] = this.sortOrders[key] === 'asc' ? 'desc' : 'asc'
        this.getDevices()
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
       * 跳转到其他页面
       * @param  {sting} path    路由
       * @param  {boolean} canLink 是否允许跳转
       * @return {[type]}         [description]
       */
      linkto (path, canLink) {
        if (canLink) {
          this.$route.router.go(path)
        } else {
          this.showNotice({
            type: 'error',
            content: '设备不在线'
          })
        }
      }
    }
  }
</script>

<style lang="stylus">
  .query-type
    height 30px
</style>
