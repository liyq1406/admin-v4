<template>
  <div class="main">
    <div class="main-title">
      <h2>设备管理</h2>
    </div>

    <!-- Start: 产品信息统计 -->
    <div class="row statistic-group mb30">
      <div class="col-6">
        <statistic :total="statistic.devices.sum.total" :change="statistic.devices.sum.change" title="设备总数" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="statistic.devices.activated.total" :change="statistic.devices.activated.change" title="激活设备数" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="statistic.devices.online.total" :change="statistic.devices.online.change" title="在线设备数" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="statistic.users.total" :change="statistic.users.change" title="用户总数" align="left"></statistic>
      </div>
    </div>
    <!-- End: 产品信息统计 -->

    <div class="panel">
      <div class="panel-hd">
        <!-- <div class="actions">
          <button @click="showAddModal = true" class="btn btn-success"><i class="fa fa-plus"></i>{{ $t("ui.overview.add_device") }}</button>
          <label :class="{'disabled':importing}" class="btn btn-ghost btn-upload">
            <input type="file" v-el:mac-file="v-el:mac-file" name="macFile" @change.prevent="batchImport"/><i class="fa fa-reply-all"></i>{{ importing ? $t("common.handling") : $t("ui.overview.import_devices") }}
          </label>
        </div> -->
        <h2>设备列表</h2>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fr">
              <!-- <div class="filter-group-item">
                <button class="btn btn-ghost btn-sm"><i class="fa fa-reorder"></i></button>
              </div> -->
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.overview.addForm.search_condi')" @cancel="getDevices(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getDevices(true)" :max="(queryType.value === 'id'?1620000000: false)">
                  <x-select width="90px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </x-select>
                  <button slot="search-button" @click="getDevices" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
            <div class="filter-group">
              <x-select width="90px" size="small" :label="visibility.label">
                <span slot="label">{{ $t('common.display') }}：</span>
                <select v-model="visibility" @change="getDevices">
                  <option v-for="option in visibilityOptions" :value="option">{{ option.label }}</option>
                </select>
              </x-select>
            </div>
          </div>
          <x-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" @theader-active-date="sortBy" @theader-is-online="sortBy" @tbody-mac="linkToDetails" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage"></x-table>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import api from 'api'
import * as config from 'consts/config'
import Select from 'components/Select'
import Pager from 'components/Pager'
import Modal from 'components/Modal'
import SearchBox from 'components/SearchBox'
import Table from 'components/Table'
import locales from 'consts/locales/index'
import _ from 'lodash'
import { formatDate } from 'src/filters'
import { globalMixins } from 'src/mixins'
import { productSummaryMixin, setCurrProductMixin } from '../mixins'
import Statistic from 'components/Statistic2'

export default {
  name: 'DeviceList',

  // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
  mixins: [globalMixins, productSummaryMixin, setCurrProductMixin],

  components: {
    'x-select': Select,
    'x-table': Table,
    'modal': Modal,
    'search-box': SearchBox,
    'pager': Pager,
    Statistic
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
      visibilityOptions: locales[Vue.config.lang].data.DEVICE_VISIBILITY_OPTIONS,
      devices: [],
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      // querying: false,
      loadingData: false,
      queryTypeOptions: [
        { label: 'MAC', value: 'mac' },
        { label: '设备ID', value: 'id' },
        { label: '设备名称', value: 'name' }
      ],
      queryType: {
        label: 'MAC',
        value: 'mac'
      },
      headers: [
        {
          key: 'mac',
          title: 'MAC'
        },
        {
          key: 'id',
          title: '设备ID'
        },
        {
          key: 'is_active',
          title: '是否激活',
          tooltip: '提示'
        },
        {
          key: 'active_date',
          title: '激活时间',
          sortType: -1
        },
        {
          key: 'is_online',
          title: '在线状态',
          sortType: -1
        }
      ],
      // 统计
      statistic: {
        // 用户总数
        users: {
          options: {},
          total: 0,
          change: 0,
          data: []
        },
        // 设备
        devices: {
          // 总数
          sum: {
            options: {},
            total: 0,
            change: 0,
            data: []
          },
          // 激活设备
          activated: {
            options: {},
            total: 0,
            change: 0,
            data: []
          },
          // 在线设备
          online: {
            options: {},
            total: 0,
            change: 0,
            data: []
          }
        }
      }
    }
  },

  computed: {
    // 分页信息
    page () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },

    // 列表数据
    tables () {
      var result = []
      this.devices.map((item) => {
        var device = {
          id: item.id,
          mac: '<a class="hl-red">' + item.mac + '</a>',
          is_active: item.is_active ? '是' : '否',
          active_date: formatDate(item.active_date),
          is_online: item.is_online ? '<span class="hl-green">在线</span>' : '<span class="hl-gray">下线</span>',
          prototype: item
        }
        result.push(device)
      })
      return result
    },

    // 筛选条件
    queryCondition () {
      var condition = {
        filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'last_login'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: this.sortOrders,
        query: {}
      }

      if (this.query.length > 0) {
        this.currentPage = 1
        condition.query[this.queryType.value] = this.queryType.value === 'id' ? { $in: [Number(this.query)] } : { $like: this.query }
      }

      switch (this.visibility.value) {
        case 'online':
          condition.query['is_online'] = { $in: [true] }
          break
        case 'offline':
          condition.query['is_online'] = { $in: [false] }
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
    }
  },

  route: {
    data () {
      this.query = ''
      this.originAddModel = _.clone(this.addModel)
      this.currentPage = 1
      this.getDevices()

      // getProductSummary 方法来自 productSummaryMixin
      this.getProductSummary()
    }
  },

  methods: {
    /**
     * 当前页码改变
     * @author shengzhi
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      this.getDevices()
    },

    /**
     * 每页显示的数量改变
     * @author shengzhi
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.getDevices()
    },

    /**
     * 跳转至设备详情
     * @param  {[type]} table [description]
     * @return {[type]}       [description]
     */
    linkToDetails (table) {
      this.$route.router.go(`${this.$route.path}/${table.prototype.id}`)
    },

    // 获取设备列表
    getDevices (reset) {
      if (this.queryType.value === 'id') {
        if (this.query - 0 > 1620000000) {
          this.showNotice({
            type: 'error',
            content: '设备ID不可超过1620000000'
          })
          return
        }
      }
      if (reset) {
        this.currentPage = 1
      }
      this.loadingData = true
      api.device.getList(this.$route.params.id, this.queryCondition).then((res) => {
        this.devices = res.data.list
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
        this.getDevices(true)
      }
    },

    // 排序
    sortBy (key) {
      if (typeof key === 'object') {
        key = key.key
      }
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
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'

.statistic-group
  border-top 1px solid default-border-color
</style>
