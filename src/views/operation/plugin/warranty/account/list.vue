<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="action-bar">
        <search-box :key.sync="key" :active="searching" :placeholder="$t('ui.account_manage.search_condi')" style="float:right">
          <button slot="search-button" @click="getBranchList" class="btn btn-primary"><i class="fa fa-search"></i></button>
        </search-box>
        <div class="action-group">
          <button @click="showAddModal = true" class="btn btn-success"><i class="fa fa-plus"></i>添加网点</button>
        </div>
      </div>
      <div class="status-bar">
        <div class="status">{{{ $t('common.total_results', {count:total}) }}}</div>
        <area-select :province.sync="curProvince" :city.sync="curCity" :district.sync="curDistrict" @province-change="getBranchList" @city-change="getBranchList" @district-change="getBranchList" label="所在地区：" select-size="small"></area-select>
      </div>

      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <table class="table table-stripe table-bordered wrongcodetable">
          <thead>
            <tr>
              <th>序号</th>
              <th>网点名称</th>
              <th>负责人</th>
              <th>联系方式</th>
              <th>创建日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="accounts.length > 0">
              <tr v-for="account in accounts">
                <td>{{ $index + 1 }}</td>
                <td>{{ account.name }}</td>
                <td>{{ account.director }}</td>
                <td>{{ account.phone }}</td>
                <td>{{ account.create_time | uniformDate}}</td>
                <td>
                  <a v-link="{path: '/plugins/warranty/' + $route.params.app_id + '/accounts/'+account._id}" class="hl-red">查看详情</a>
                </td>
              </tr>
            </template>
            <tr v-if="accounts.length === 0 && !loadingData">
              <td colspan="6" class="tac">
                <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getBranchList"></pager>

      <!-- 添加增加网点浮层-->
      <modal :show.sync="showAddModal" width="600px">
        <h3 slot="header">添加网点</h3>
        <div slot="body" class="form">
          <validator name="addValidation">
            <form novalidate @submit.prevent="onAddSubmit">
              <div class="form-row row">
                <label class="form-control col-6">网点:</label>
                <div class="controls col-18">
                  <div class="input-text-wrap">
                    <input v-model="addModel.name" type="text" name="addModel.name" v-validate:name="{required: true}" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$addValidation.name.touched && $addValidation.name.required">{{ $t('ui.validation.required', {field: $t('ui.warranty.fields.name')}) }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">负责人:</label>
                <div class="controls col-18">
                  <div class="input-text-wrap">
                    <input v-model="addModel.director" type="text" name="addModel.director" v-validate:director="{required: true}" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$addValidation.director.touched && $addValidation.director.required">{{ $t('ui.validation.required', {field: $t('ui.warranty.fields.director')}) }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">联系号码:</label>
                <div class="controls col-18">
                  <div class="input-text-wrap">
                    <input v-model="addModel.phone" type="text" v-validate:phone="{required: true, format: 'phone'}" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$addValidation.phone.touched && $addValidation.phone.required">{{ $t('ui.validation.required', {field: $t('ui.warranty.fields.phone')}) }}</span>
                    <span v-if="$addValidation.phone.modified && $addValidation.phone.format">{{ $t('ui.validation.format', {field: $t('ui.auth.fields.phone')}) }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">邮箱地址:</label>
                <div class="controls col-18">
                  <div class="input-text-wrap">
                    <input v-model="addModel.email" type="email" name="addModel.email" v-validate:email="{required: true, format: 'email'}" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$addValidation.email.touched && $addValidation.email.required">{{ $t('ui.validation.required', {field: $t('ui.warranty.fields.email')}) }}</span>
                    <span v-if="$addValidation.email.modified && $addValidation.email.format">{{ $t('ui.validation.format', {field: $t('ui.auth.fields.email')}) }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">所在地区:</label>
                <div class="controls col-18">
                  <area-select :province.sync="selectedProvince" :city.sync="selectedCity" :district.sync="selectedDistrict"></area-select>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">详细地址:</label>
                <div class="controls col-18">
                  <div class="input-text-wrap">
                    <input v-model="addModel.address" type="text" name="addModel.address" v-validate:address="{required: true}" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$addValidation.address.touched && $addValidation.address.required">{{ $t('ui.validation.required', {field: $t('ui.warranty.fields.address')}) }}</span>
                  </div>
                </div>
              </div>
              <div class="form-actions">
                <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
                <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
              </div>
            </form>
          </validator>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import { pluginMixins } from '../../mixins'
  import SearchBox from 'components/SearchBox'
  import Pager from 'components/Pager'
  import Select from 'components/Select'
  import Modal from 'components/Modal'
  import AreaSelect from 'components/AreaSelect'
  import api from 'api'
  import * as config from 'consts/config'
  import _ from 'lodash'

  export default {
    // name: 'AccountList',

    layout: 'admin',

    mixins: [globalMixins, pluginMixins],

    components: {
      'v-select': Select,
      'area-select': AreaSelect,
      'modal': Modal,
      'search-box': SearchBox,
      'pager': Pager
    },

    data () {
      return {
        loadingAccount: false,
        currentPage: 1,
        countPerPage: config.COUNT_PER_PAGE,
        accounts: [
          // {
          //   num: 1,
          //   name: '网点名称',
          //   people: '小明',
          //   phone: '123123',
          //   date: '2016-4-18'
          // }
        ],
        showAddModal: false,
        addValidation: {},
        originAddModel: {},
        adding: false,
        curProvince: {},
        curCity: {},
        curDistrict: {},
        selectedProvince: {},
        selectedCity: {},
        selectedDistrict: {},
        addModel: {
          name: '',
          charge: '',
          tel: '',
          email: '',
          province: '',
          city: '',
          district: '',
          address: ''
        },
        search: {},
        total: 0,
        loadingData: false,
        key: ''
      }
    },

    ready () {
      this.getBranchList()
    },

    computed: {
      queryCondition () {
        var condition = {
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          order: {},
          query: {}
        }

        if (this.curProvince.name !== this.$t('common.any')) {
          condition.query.province = this.curProvince.name
        }
        if (this.curCity.name !== this.$t('common.any')) {
          condition.query.city = this.curCity.name
        }
        if (this.curDistrict.name !== this.$t('common.any')) {
          condition.query.district = this.curDistrict.name
        }
        if (this.key !== '') {
          condition.query.name = {$regex: this.key, $options: 'i'}
        }

        return condition
      }
    },

    route: {
      data () {
        this.originAddModel = _.clone(this.addModel)
        this.getBranchList()
      }
    },

    methods: {
      // 获取网点列表
      getBranchList () {
        // if (typeof querying !== 'undefined') {
        //   this.currentPage = 1
        // }
        var self = this
        var argvs = arguments
        var fn = self.getBranchList
        this.loadingData = true
        this.getAppToKen(this.$route.params.app_id, 'warranty').then((token) => {
          api.warranty.getBranchList(this.$route.params.app_id, token, this.queryCondition).then((res) => {
            this.accounts = res.data.list
            this.total = res.data.count
            this.loadingData = false
          }).catch((err) => {
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'warranty'
            }
            self.handlePluginError(err, env)
            this.loadingData = false
          })
        })
      },

      // 关闭添加浮层并净化添加表单
      resetAdd () {
        this.adding = false
        this.showAddModal = false
        this.selectedProvince = {}
        this.selectedCity = {}
        this.selectedDistrict = {}
        this.addModel = _.clone(this.originAddModel)
        this.$nextTick(() => {
          this.$resetValidation()
        })
      },
      // 取消添加
      onAddCancel () {
        this.resetAdd()
      },
      // 添加操作
      onAddSubmit () {
        var self = this
        var argvs = arguments
        var fn = self.onAddSubmit
        if (this.$addValidation.invalid || this.adding) return
        this.adding = true
        this.addModel.province = this.selectedProvince.name
        this.addModel.city = this.selectedCity.name
        this.addModel.district = this.selectedDistrict.name
        this.addModel.create_time = new Date()
        this.getAppToKen(this.$route.params.app_id, 'warranty').then((token) => {
          api.warranty.AddBranch(this.$route.params.app_id, token, this.addModel).then((res) => {
            this.adding = false
            this.showAddModal = false
            this.getBranchList()
            this.resetAdd()
          }).catch((err) => {
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'warranty'
            }
            self.handlePluginError(err, env)
            this.adding = false
          })
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../../../assets/stylus/common'
</style>
