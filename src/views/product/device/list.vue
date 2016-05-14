<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="action-bar">
        <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.overview.addForm.search_condi')" @cancel="getDevices(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getDevices(true)">
          <v-select width="100px" :label="queryType.label">
            <select v-model="queryType">
              <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
            </select>
          </v-select>
          <button slot="search-button" @click="getDevices(true)" class="btn btn-primary">{{ $t('common.search') }}</button>
        </search-box>
        <div class="action-group">
          <button @click="showAddModal = true" class="btn btn-success"><i class="fa fa-plus"></i>{{ $t("ui.overview.add_device") }}</button>
          <label :class="{'disabled':importing}" class="btn btn-success btn-upload">
            <input type="file" v-el:mac-file="v-el:mac-file" name="macFile" @change.prevent="batchImport"/><i class="fa fa-reply-all"></i>{{ importing ? $t("common.handling") : $t("ui.overview.import_devices") }}
          </label>
        </div>
      </div>
      <div class="status-bar">
        <div class="status">{{{ $t('common.total_results', {count:total}) }}}
        </div>
        <v-select width="90px" size="small" :label="visibility.label">
          <span slot="label">{{ $t('common.display') }}：</span>
          <select v-model="visibility" @change="getDevices(true)">
            <option v-for="option in visibilityOptions" :value="option">{{ option.label }}</option>
          </select>
        </v-select>
      </div>
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th @click="sortBy('mac')" :class="{active: sortKey === 'mac'}">MAC<i :class="sortOrders['mac'] ==='asc' ? 'fa-caret-up' : 'fa-caret-down'" class="fa"></i></th>
              <th>{{ $t('ui.device.id') }}</th>
              <th>{{ $t('ui.device.is_active') }}</th>
              <th @click="sortBy('active_date')" :class="{active: sortKey === 'active_date'}">{{ $t('ui.device.active_date') }}<i :class="sortOrders['active_date'] ==='asc' ? 'fa-caret-up' : 'fa-caret-down'" class="fa"></i></th>
              <th>{{ $t('ui.device.is_online') }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="devices.length > 0">
              <tr v-for="device in devices">
                <td><a v-link="'/products/' + $route.params.id + '/devices/' + device.id" class="hl-red">{{ device.mac }}</a></td>
                <td>{{ device.id }}</td>
                <td v-text="device.is_active ? $t('ui.device_list.active') : $t('ui.device_list.not_active')"></td>
                <td><span v-if="device.active_date">{{ device.active_date | formatDate }}</span></td>
                <td><span v-if="device.is_online" class="hl-green">{{ $t('ui.device_list.online') }}</span><span v-else class="hl-gray">{{ $t('ui.device_list.offline') }}</span></td>
              </tr>
            </template>
            <tr v-if="devices.length === 0 && !loadingData">
              <td colspan="5" class="tac">
                <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="action-group mb40">
        <button v-link="{path: '/products/' + this.$route.params.id + '/records'}" class="btn btn-ghost"><i class="fa fa-list"></i>查看上下线历史记录</button>
      </div>
      <pager v-if="total > pageCount" :total="total" :current.sync="currentPage" :page-count="pageCount" @page-update="getDevices"></pager>
    </div>
    <!-- 添加设备浮层-->
    <modal :show.sync="showAddModal">
      <h3 slot="header">{{ $t("ui.overview.add_device") }}</h3>
      <div slot="body" class="form">
        <form v-form name="addValidation" @submit.prevent="onAddSubmit" hook="addFormHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.overview.addForm.mac") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.overview.addForm.mac_placeholder')" class="input-text-wrap">
                <input v-model="addModel.mac" type="text" v-form-ctrl name="mac" required lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.mac.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.mac.$error.required">{{ $t('ui.validation.required', {field: $t('ui.overview.addForm.mac')})</span></div>
              <div v-if="addValidation.mac.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.mac.$error.required">{{ $t('ui.validation.required', {field: $t('ui.overview.addForm.mac')})</span></div>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from '../../../api'
  import Select from '../../../components/Select'
  import Pager from '../../../components/Pager'
  import Modal from '../../../components/Modal'
  import SearchBox from '../../../components/SearchBox'
  import locales from '../../../consts/locales/index'
  import _ from 'lodash'
  import { globalMixins } from '../../../mixins'

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
        visibilityOptions: locales[Vue.config.lang].data.DEVICE_VISIBILITY_OPTIONS,
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
          { label: '设备ID', value: 'id' },
          { label: '设备名称', value: 'name' }
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
        this.originAddModel = _.clone(this.addModel)
        this.getDevices()
      }
    },

    methods: {
      // 获取设备列表
      getDevices (querying) {
        if (typeof querying !== 'undefined') {
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

      // 添加表单钩子
      addFormHook (form) {
        this.addForm = form
      },

      // 关闭添加浮层并净化添加表单
      resetAdd () {
        this.adding = false
        this.showAddModal = false
        this.addModel = _.clone(this.originAddModel)
        this.$nextTick(() => {
          this.addForm.setPristine()
        })
      },

      // 取消添加
      onAddCancel () {
        this.resetAdd()
      },

      // 添加操作
      onAddSubmit () {
        if (this.addValidation.$valid && !this.adding) {
          this.adding = true
          api.device.add(this.$route.params.id, this.addModel).then((res) => {
            if (res.status === 200) {
              this.resetAdd()
              this.getDevices()
            }
          }).catch((res) => {
            this.handleError(res)
            this.adding = false
          })
        }
      },

      // 批量导入
      batchImport () {
        var file = this.$els.macFile.files[0]
        if (window.File && window.FileReader && window.FileList && window.Blob) {
          var reader = new window.FileReader()
          if (!/text\/\w+/.test(file.type)) {
            this.showNotice({
              type: 'error',
              content: file.name + this.$t('ui.upload.type_tips')
            })
            return false
          }
          reader.onerror = (evt) => {
            this.showNotice({
              type: 'error',
              content: this.$t('ui.upload.read_err')
            })
          }
          this.importing = true
          // 读取完成
          reader.onloadend = (evt) => {
            if (evt.target.readyState === window.FileReader.DONE) {
              var macArr = evt.target.result.replace(' ', '').replace(/\r\n/g, '\n').split('\n')
              var a = []
              macArr.forEach((element, index) => {
                if (element !== '') {
                  a.push(element)
                }
              })
              macArr = a
              api.device.batchImport(this.$route.params.id, macArr).then((res) => {
                if (res.status === 200) {
                  this.showNotice({
                    type: 'success',
                    content: this.$t('ui.upload.success_msg')
                  })
                  this.getDevices()
                }
                this.importing = false
              }).catch((res) => {
                this.handleError(res)
                this.importing = false
              })
            }
          }
          reader.readAsText(file)
        } else {
          this.showNotice({
            type: 'error',
            content: this.$t('ui.upload.compatiblity')
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
