<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="action-bar">
        <search-box :key.sync="query" :active="searching" :placeholder="$t('overview.addForm.search_condi')" @cancel="getDevices(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getDevices(true)">
          <select v-model="condi" name="condi" class="selcss">
            <option v-for="type in searchCondi" :value="type.value" :selected="$index===0">{{ type.label }}</option>
          </select>
          <button slot="search-button" @click="getDevices(true)" class="btn btn-primary">{{ $t('common.search') }}</button>
        </search-box>
        <div class="action-group">
          <button @click="showAddModal = true" class="btn btn-success"><i class="fa fa-plus"></i>{{ $t("overview.add_device") }}</button>
          <label :class="{'disabled':importing}" class="btn btn-success btn-upload">
            <input type="file" v-el:mac-file="v-el:mac-file" name="macFile" @change.prevent="batchImport"/><i class="fa fa-reply-all"></i>{{ importing ? $t("common.handling") : $t("overview.import_devices") }}
          </label>
        </div>
      </div>
      <div class="status-bar">
        <div class="status">{{{ $t('common.total_results', {count:total}) }}}
        </div>
        <v-select :options="visibilityOptions" :value.sync="visibility" @select="getDevices"><span>{{ $t('common.display') }}：</span></v-select>
      </div>
      <table class="table table-stripe table-bordered">
        <thead>
          <tr>
            <th @click="sortBy('mac')" :class="{active: sortKey === 'mac'}">MAC<i :class="sortOrders['mac'] ==='asc' ? 'fa-caret-up' : 'fa-caret-down'" class="fa"></i></th>
            <th>{{ $t('device.id') }}</th>
            <th>{{ $t('device.is_active') }}</th>
            <th @click="sortBy('active_date')" :class="{active: sortKey === 'active_date'}">{{ $t('device.active_date') }}<i :class="sortOrders['active_date'] ==='asc' ? 'fa-caret-up' : 'fa-caret-down'" class="fa"></i></th>
            <th>{{ $t('device.is_online') }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="devices.length > 0 && !loadingData">
            <tr v-for="device in devices">
              <td><a v-link="'/products/' + $route.params.id + '/devices/' + device.id" class="hl-red">{{ device.mac }}</a></td>
              <td>{{ device.id }}</td>
              <td v-text="device.is_active ? $t('device_list.active') : $t('device_list.not_active')"></td>
              <td><span v-if="device.active_date">{{ device.active_date | formatDate }}</span></td>
              <td><span v-if="device.is_online" class="hl-green">{{ $t('device_list.online') }}</span><span v-else="v-else" class="hl-gray">{{ $t('device_list.offline') }}</span></td>
            </tr>
          </template>
          <tr v-if="loadingData">
            <td colspan="5" class="tac">
              <div class="tips-null"><i class="fa fa-refresh fa-spin"></i><span>{{ $t("common.data_loading") }}</span></div>
            </td>
          </tr>
          <tr v-if="devices.length === 0 && !loadingData">
            <td colspan="5" class="tac">
              <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
            </td>
          </tr>
        </tbody>
      </table>
      <pager v-if="!loadingData && total > pageCount" :total="total" :current.sync="currentPage" :page-count="pageCount" @page-update="getDevices"></pager>
    </div>
    <!-- 添加设备浮层-->
    <modal :show.sync="showAddModal">
      <h3 slot="header">{{ $t("overview.add_device") }}</h3>
      <div slot="body" class="form">
        <form v-form name="addValidation" @submit.prevent="onAddSubmit" hook="addFormHook">
          <div class="form-row">
            <label class="form-control">{{ $t("overview.addForm.mac") }}:</label>
            <div class="controls">
              <div v-placeholder="$t('overview.addForm.mac_placeholder')" class="input-text-wrap">
                <input v-model="addModel.mac" type="text" v-form-ctrl name="mac" required lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.mac.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.mac.$error.required">{{ $t('validation.required', {field: $t('overview.addForm.mac')})</span></div>
              <div v-if="addValidation.mac.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.mac.$error.required">{{ $t('validation.required', {field: $t('overview.addForm.mac')})</span></div>
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

  export default {
    name: 'DeviceList',

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
        visibility: 'all',
        visibilityOptions: locales[Vue.config.lang].visibilityOptions,
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
        searchCondi: [
          { label: 'MAC', value: 'mac' },
          { label: '设备ID', value: 'id' }
        ],
        condi: 'mac'
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
          condition.query[this.condi] = { $like: this.query }
        }

        switch (this.visibility) {
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
        }).catch((error) => {
          this.handleError(error)
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
          }).catch((error) => {
            this.handleError(error)
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
            window.alert(file.name + this.$t('upload.type_tips'))
            return false
          }
          reader.onerror = (evt) => {
            window.alert(this.$t('upload.read_err'))
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
                  window.alert(this.$t('upload.success_msg'))
                  this.getDevices()
                }
                this.importing = false
              }).catch((error) => {
                this.handleError(error)
                this.importing = false
              })
            }
          }
          reader.readAsText(file)
        } else {
          window.alert(this.$t('upload.compatiblity'))
        }
      }
    }
  }
</script>
<style lang="stylus">
.selcss
  height 30px
</style>
