<template>
  <div class="main">
    <x-table :headers="headers" :rows="rows" :page="page" :loading="loadingData" @theader-active-date="" @theader-is-online="" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage" @tbody-sn="onShowDeviceEditModal">
      <div class="filter-bar" slot="filter-bar">
        <div class="filter-group fr">
          <div class="filter-group-item">
            <search-box :key.sync="query" :active="searching" :placeholder="$t('common.placeholder.search')" @cancel="getDevices(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" :max="(queryType.value === 'id'?2100000000: false)" @search="handleSearch" @press-enter="getDevices(true)">
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
    </x-table>

    <modal :show.sync="showDeviceEditModal">
      <h3 slot="header">编辑设备</h3>
      <div slot="body" class="form">
        <form autocomplete="off" novalidate @submit.prevent="onDeviceEditModalSubmit">
          <div class="form-row row">
            <label class="form-control col-4">SN:</label>
            <div class="controls col-20">
              <div v-placeholder="$t('ui.product.placeholders.mode')" class="input-text-wrap">
                <input v-model="deviceEditModal.sn" type="text" name="deviceEditModal.sn" lazy class="input-text"/>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            <button @click.prevent.stop="showDeviceEditModal = false" class="btn btn-default">{{ $t("common.cancel") }}</button>
          </div>
        </form>
      </div>
    </modal>
    <!-- <batch-export-qr :show.sync="showExportQRCode"></batch-export-qr> -->
  </div>
</template>

<script>
import api from 'api'
import * as config from 'consts/config'
import formatDate from 'filters/format-date'
// import BatchExportQr from './batch-export-qr'

export default {
  name: 'deviceList',
  vuex: {
    actions: {
    }
  },

  components: {
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
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      page: {
        total: 20, // 数据总数
        currentPage: 1, // 当前页
        countPerPage: 10 // 每页数量
      },
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
      showDeviceEditModal: false,
      deviceEditModal: {
        sn: ''
      },
      headers: [{
        key: 'mac',
        title: 'MAC'
      }, {
        key: 'id',
        title: '设备ID',
        class: 'wp25'
      }, {
        key: 'is_active',
        title: '是否激活',
        tooltip: '设备已联网激活',
        class: 'wp10'
      }, {
        key: 'active_date',
        title: '激活时间',
        sortType: -1,
        class: 'wp20'
      }, {
        key: 'sn',
        title: 'SN'
      // }, {
      //   key: 'firmware',
      //   title: '固件版本号',
      //   class: 'tac'
      }, {
        key: 'is_online',
        title: '在线状态',
        sortType: -1,
        class: 'wp10'
      }]
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

    // 设备列表
    rows () {
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

      return condition
    }
  },
  ready () {
    this.getDevices()

  },
  methods: {
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
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../../assets/stylus/common'

</style>
