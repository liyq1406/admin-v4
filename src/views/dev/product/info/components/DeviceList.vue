<template>
  <div class="main">
    <div class="no-data with-loading" v-show="!headers.length">
      <div class="icon-loading">
        <i class="fa fa-refresh fa-spin"></i>
      </div>
    </div>
    <x-table v-show="headers.length" :headers="headers" :tables="tables" :page="page" :loading="loadingDevices" @theader-active-date="sortBySomeKey" @theader-is-online="sortBySomeKey" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage" @tbody-sn="onShowDeviceEditModal">
      <div class="filter-bar" slot="filter-bar">
        <div class="filter-group fr">
          <div class="filter-group-item">
            <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.overview.addForm.search_condi')" @cancel="getDevices(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" :max="(queryType.value === 'id'?2100000000: false)" @search="handleSearch" @press-enter="getDevices(true)">
              <x-select width="90px" :label="queryType.label" size="small">
                <select v-model="queryType">
                  <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                </select>
              </x-select>
              <button slot="search-button" @click="getDevices(true)" class="btn"><i class="fa fa-search"></i></button>
            </search-box>
          </div>
        </div>
        <div class="filter-group">
          <x-select width="90px" size="small" :label="visibility.label">
            <span slot="label">{{ $t('common.display') }}：</span>
            <select v-model="visibility" @change="getDevices(true)">
              <option v-for="option in locales.data.DEVICE_VISIBILITY_OPTIONS" :value="option">{{ option.label }}</option>
            </select>
          </x-select>
        </div>
      </div>
      <button v-link="{path: 'online-offline-records', append: true}" class="btn btn-ghost mt10" slot="left-foot"><i class="fa fa-list"></i>查看上下线历史记录</button>
    </x-table>

    <modal :show.sync="showDeviceEditModal">
      <h3 slot="header">编辑设备</h3>
      <div slot="body" class="form">
        <validator name="validation">
          <form autocomplete="off" novalidate @submit.prevent="onDeviceEditModalSubmit">
            <div class="form-row row">
              <label class="form-control col-4">SN:</label>
              <div class="controls col-20">
                <div v-placeholder="$t('ui.product.placeholders.mode')" class="input-text-wrap">
                  <input v-model="deviceEditModal.sn" type="text" name="deviceEditModal.sn" v-validate:sn="{format: 'sn', maxlength: 32}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.sn.modified && $validation.sn.format">序列号只能包含数字、英文字母和中划线，且不以中划线开头</span>
                  <span v-if="$validation.sn.touched && $validation.sn.modified && $validation.sn.maxlength">{{ $t('ui.validation.maxlength', ['序列号', 32]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
              <button @click.prevent.stop="showDeviceEditModal = false" class="btn btn-default">{{ $t("common.cancel") }}</button>
            </div>
          </form>
        </validator>
      </div>
    </modal>
    <!-- <batch-export-qr :show.sync="showExportQRCode"></batch-export-qr> -->
  </div>
</template>

<script>
// import Promise from 'Promise'
import api from 'api'
import { globalMixins } from 'src/mixins'
import * as config from 'consts/config'
import Table from 'components/Table'
import SearchBox from 'components/SearchBox'
import Modal from 'components/Modal'
import Select from 'components/Select'
import store from 'store'
// import _ from 'lodash'
import formatDate from 'filters/format-date'
// import BatchExportQr from './batch-export-qr'

export default {
  name: 'deviceList',

  mixins: [globalMixins],

  store,

  vuex: {
    actions: {
    }
  },

  components: {
    'x-table': Table,
    'x-select': Select,
    Modal,
    SearchBox
  },

  data () {
    return {
      query: '',
      sortKey: '',
      searching: false,
      visibility: {
        label: '全部',
        value: 'all'
      },
      devices: [],
      datapoints: [],
      loadingDataPoint: false,
      fieldData: [],
      loadingDataField: false,
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      loadingDevices: false,
      queryTypeOptions: [
        { label: 'MAC', value: 'mac' },
        { label: '设备ID', value: 'id' },
        { label: '设备名称', value: 'name' }
      ],
      queryType: {
        label: 'MAC',
        value: 'mac'
      },
      showDeviceEditModal: false,
      deviceEditModal: {
        sn: ''
      },
      // headers: [{
      //   key: 'mac',
      //   title: 'MAC'
      // }, {
      //   key: 'id',
      //   title: '设备ID',
      //   class: 'wp25'
      // }, {
      //   key: 'is_active',
      //   title: '是否激活',
      //   tooltip: '设备已联网激活',
      //   class: 'wp10'
      // }, {
      //   key: 'active_date',
      //   title: '激活时间',
      //   sortType: -1,
      //   class: 'wp20'
      // }, {
      //   key: 'sn',
      //   title: 'SN'
      // // }, {
      // //   key: 'firmware',
      // //   title: '固件版本号',
      // //   class: 'tac'
      // }, {
      //   key: 'is_online',
      //   title: '在线状态',
      //   sortType: -1,
      //   class: 'wp10'
      // }],
      vDevices: [
        {
          '0': '50',
          '1': '687931357',
          '2': '#9PgQimAhNA7gGkI17^w^&EVL&bV*aQ#!&lBM@7v',
          cm_id: '101',
          device_id: 1725036218,
          ip: '42.121.122.23',
          lastKeepAlive: '2016-06-16 15:23:31 CST',
          last_login: '2016-06-12T09:50:46.00Z',
          last_logout: '2016-06-08T17:30:30.00Z',
          last_update: '2016-06-16T15:25:31.00Z',
          online: true,
          online_count: 11669169
        }
      ]
    }
  },

  computed: {
    headers () {
      var result = []
      if (!this.fieldList) return result
      this.fieldList.forEach((item) => {
        if (item.hidden) return
        var header = {
          key: item.index || item.name,
          title: item.label || item.name
        }

        if (header.key === 'is_active') {
          header.tooltip = '设备已联网激活'
        }

        if (header.key === 'active_date' || header.key === 'is_online') {
          header.sortType = -1
        }

        result.push(header)
      })
      return result
    },

    // 分页信息
    page () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },

    // 设备列表
    tables () {
      var result = []
      this.devices.map((item) => {
        var device = {
          id: item.id,
          mac: item.mac,
          is_active: item.is_active ? '是' : '否',
          active_date: formatDate(item.active_date),
          sn: '<a class="hl-red">' + (item.sn || ' - ') + '</a>',
          firmware: item.firmware,
          is_online: item.is_online ? '<span class="hl-green">在线</span>' : '<span class="hl-gray">下线</span>',
          prototype: item
        }
        result.push(device)
      })
      return result
    },

    /**
     * 字段列表
     */
    fieldList () {
      var result = [
        {
          'name': 'mac',
          'label': 'MAC地址',
          'hidden': false,
          'sort': 1
        },
        {
          'name': 'id',
          'label': '设备ID',
          'hidden': false,
          'sort': 2
        },
        {
          'name': 'is_active',
          'label': '是否激活',
          'hidden': false,
          'sort': 3
        },
        {
          'name': 'is_online',
          'label': '激活时间',
          'hidden': false,
          'sort': 4
        },
        {
          'name': 'is_online',
          'label': '是否在线',
          'hidden': false,
          'sort': 5
        },
        {
          'name': 'sn',
          'label': 'SN',
          'hidden': true,
          'sort': 6
        },
        {
          'name': 'online_count',
          'label': '累计在线时间',
          'hidden': true,
          'sort': 7
        },
        {
          'name': 'firmware_version',
          'label': '固件版本号',
          'hidden': true,
          'sort': 8
        }
      ]
      if (!this.fieldData.base_fields || !this.fieldData.datapoints) return result
      result = this.fieldData.base_fields.concat(this.fieldData.datapoints)
      result = result.sort((a, b) => {
        return a.sort - b.sort
      })
      return result
    },

    /**
     * 计算属性
     * 设备id数组
     */
    deviceIds () {
      var result = []
      result = this.devices.map((item) => {
        return item.id
      })
      return result
    },

    // 筛选条件
    queryCondition () {
      let condition = {
        filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'sn', 'firmware', 'last_login'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {},
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

      this.headers.map((item) => {
        if (item.sortType) {
          condition.order[item.key] = (item.sortType === 1 ? 'asc' : 'desc')
        }
      })

      return condition
    }
  },
  ready () {
    this.getDevices()
    this.getField()
    this.getDataPoint()
  },
  methods: {
    /**
     * 获取字段
     */
    getField () {
      console.log('获取字段')
      this.loadingDataField = true
      api.product.getProductField(this.$route.params.id).then((res) => {
        this.fieldData = res.data || {}
        this.initHeaders()
        this.loadingDataField = false
      }).catch((res) => {
        this.loadingDataField = false
        this.handleError(res)
      })
    },

    /**
     * 获取数据端点
     */
    getDataPoint () {
      this.loadingDataPoint = true
      api.product.getDatapoints(this.$route.params.id).then((res) => {
        if (res.status === 200) {
          this.datapoints = res.data
          this.loadingDataPoint = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingDataPoint = false
      })
    },
    /**
     * 设置sn
     */
    setSn () {
      let productId = this.$route.params.id
      let deviceId = this.deviceEditModal.deviceId
      let params = {
        sn: this.deviceEditModal.sn
      }
      api.product.updateDeviceMsg(productId, deviceId, params).then((res) => {
        this.getDevices()
        this.showDeviceEditModal = false
      }).catch((res) => {
        this.handleError(res)
      })
    },
    /**
     * sn编辑浮层提交表单
     * @return {[type]} [description]
     */
    onDeviceEditModalSubmit () {
      if (this.deviceEditModal.sn.length) {
        this.setSn()
      } else {
        this.showNotice({
          type: 'error',
          content: '请输入设备sn'
        })
      }
    },
    /**
     * 显示sn编辑浮层
     * @param  {[type]} device [description]
     * @return {[type]}        [description]
     */
    onShowDeviceEditModal (device) {
      this.deviceEditModal.sn = device.prototype.sn
      this.deviceEditModal.deviceId = device.id
      this.showDeviceEditModal = true
    },

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
     * 获取设备列表
     * @author shengzhi
     */
    getDevices (reset) {
      if (this.queryType.value === 'id') {
        if (this.query - 0 > 2100000000) {
          this.showNotice({
            type: 'error',
            content: '设备ID不可超过2100000000'
          })
          return
        }
      }
      if (reset === true) {
        this.currentPage = 1
      }
      this.loadingDevices = true
      api.device.getList(this.$route.params.id, this.queryCondition).then((res) => {
        this.devices = res.data.list
        this.total = res.data.count
        this.loadingDevices = false
      }).catch((res) => {
        this.handleError(res)
        this.loadingDevices = false
      })
    },

    /**
     * 搜索
     * @author shengzhi
     */
    handleSearch () {
      if (this.query.length === 0) {
        this.getDevices(true)
      }
    },
    /**
     * 切换搜索
     * @author shengzhi
     */
    toggleSearching () {
      this.searching = !this.searching
    },

    /**
     * 取消搜索
     * @author shengzhi
     */
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
      if (header.sortType === 1) {
        header.sortType = -1
      } else {
        header.sortType = 1
      }
      this.headers.$set(index, header)
      this.getDevices()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../../assets/stylus/common'

  .no-data
    height 200px
</style>
