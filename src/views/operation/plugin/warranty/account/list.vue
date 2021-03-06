<template>
  <div class="main">
    <div class="main-title">
      <h2>{{ $t('operation.warranty.branch.main_title') }}</h2>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <button @click="showAddModal = true" class="btn btn-primary"><i class="fa fa-plus"></i>{{ $t('operation.warranty.branch.add') }}</button>
          </div>
        </div>
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div class="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box
                  :key="key"
                  :active="searching"
                  :placeholder="$t('common.placeholder.search')"
                  @search="handleSearch"
                  style="float:right">
                  <button slot="search-button" @click="getBranchList" class="btn"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
            <div class="filter-group">
              <div class="filter-group-item">
                <area-select
                  label="所在地区："
                  select-size="small"
                  :province="curProvince"
                  :city="curCity"
                  :district="curDistrict"
                  @province-change="onCurProvinceChange"
                  @city-change="onCurCityChange"
                  @district-change="onCurDistrictChange">
                </area-select>
              </div>

              <span class="">{{ $t('operation.warranty.branch.fields.create_time') }}: </span>
              <x-select width="98px" size="small" :label="rangeOption.label">
                <select v-model="rangeOption" @change="onRangeOptionChange">
                  <option v-for="option in timeRangeOptions" :value="option">{{ option.label }}</option>
                </select>
              </x-select>
              <date-time-range-picker v-if="rangeOption.value === 'specified'" @timechange="onTimeChange" :start-offset="365" :show-time="false"></date-time-range-picker>

            </div>
          </div>
          <table class="table table-stripe table-bordered wrongcodetable">
            <thead>
              <tr>
                <th>{{ $t('operation.warranty.branch.fields.order') }}</th>
                <th>{{ $t('operation.warranty.branch.fields.name') }}</th>
                <th>{{ $t('operation.warranty.branch.fields.director') }}</th>
                <th>{{ $t('operation.warranty.branch.fields.phone') }}</th>
                <th>{{ $t('operation.warranty.branch.fields.create_time') }}</th>
                <th>{{ $t('common.action') }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="accounts.length > 0">
                <tr v-for="(index, account) in accounts">
                  <td>{{ index + 1 }}</td>
                  <td>{{ account.name }}</td>
                  <td>{{ account.director }}</td>
                  <td>{{ account.phone }}</td>
                  <td>{{ account.create_time | formatDate}}</td>
                  <td>
                    <a v-link="{path: '/operation/plugins/warranty/' + $route.params.app_id + '/accounts/'+account._id}" class="hl-red">{{ $t('operation.warranty.branch.details') }}</a>
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
        <pagination v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getBranchList"></pagination>

        <!-- 添加增加网点浮层-->
        <modal :show.sync="showAddModal" width="600px">
          <h3 slot="header">{{ $t('operation.warranty.branch.add') }}</h3>
          <div slot="body" class="form">
            <validator name="addValidation">
              <form autocomplete="off" novalidate @submit.prevent="onAddSubmit">
                <div class="form-row row">
                  <label class="form-control col-6">{{ $t('operation.warranty.branch.fields.name') }}:</label>
                  <div class="controls col-18">
                    <div class="input-text-wrap">
                      <input v-model="addModel.name" type="text" name="addModel.name" v-validate:name="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$addValidation.name.touched && $addValidation.name.required">{{ $t('common.validation.required', {field: $t('operation.warranty.branch.fields.name')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-6">{{ $t('operation.warranty.branch.fields.director') }}:</label>
                  <div class="controls col-18">
                    <div class="input-text-wrap">
                      <input v-model="addModel.director" type="text" name="addModel.director" v-validate:director="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$addValidation.director.touched && $addValidation.director.required">{{ $t('common.validation.required', {field: $t('operation.warranty.branch.fields.director')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-6">{{ $t('operation.warranty.branch.fields.phone') }}:</label>
                  <div class="controls col-18">
                    <div class="input-text-wrap">
                      <input v-model="addModel.phone" type="text" v-validate:phone="{required: true, format: 'phone'}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$addValidation.phone.touched && $addValidation.phone.required">{{ $t('common.validation.required', {field: $t('operation.warranty.branch.fields.phone')}) }}</span>
                      <span v-if="$addValidation.phone.modified && $addValidation.phone.format">{{ $t('common.validation.format', {field: $t('auth.fields.phone')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-6">{{ $t('operation.warranty.branch.fields.email') }}:</label>
                  <div class="controls col-18">
                    <div class="input-text-wrap">
                      <input v-model="addModel.email" type="email" name="addModel.email" v-validate:email="{required: true, format: 'email'}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$addValidation.email.touched && $addValidation.email.required">{{ $t('common.validation.required', {field: $t('operation.warranty.branch.fields.email')}) }}</span>
                      <span v-if="$addValidation.email.modified && $addValidation.email.format">{{ $t('common.validation.format', {field: $t('auth.fields.email')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-6">{{ $t('operation.warranty.branch.fields.location') }}:</label>
                  <div class="controls col-18">
                    <area-select
                      :province="selectedProvince"
                      :city="selectedCity"
                      :district="selectedDistrict"
                      @province-change="onProvinceChange"
                      @city-change="onCityChange"
                      @district-change="onDistrictChange">
                    </area-select>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-6">{{ $t('operation.warranty.branch.fields.address') }}:</label>
                  <div class="controls col-18">
                    <div class="input-text-wrap">
                      <input v-model="addModel.address" type="text" name="addModel.address" v-validate:address="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$addValidation.address.touched && $addValidation.address.required">{{ $t('common.validation.required', {field: $t('operation.warranty.branch.fields.address')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-actions">
                  <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
                  <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
                </div>
              </form>
            </validator>
          </div>
        </modal>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import locales from 'consts/locales/index'
  import formatDate from 'filters/format-date'
  import { warrantyMixins } from '../mixins'
  import api from 'api'
  import * as config from 'consts/config'

  export default {
    name: 'WarrantyAccounts',

    mixins: [warrantyMixins],

    components: {
    },

    data () {
      return {
        token: JSON.parse(window.localStorage.pluginsToken)[this.$route.params.app_id].token,
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
        key: '',
        rangeOption: {
          label: this.$t('common.any'),
          value: 'any'
        },
        timeRangeOptions: locales[Vue.config.lang].data.TIME_RANGE_OPTIONS,
        startTime: new Date(new Date() - 365 * 1000 * 60 * 60 * 24),
        endTime: new Date()
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
          order: {'create_time': -1},
          query: {}
        }

        if (this.rangeOption.value === 'specified') {
          condition.query['create_time'] = {
            '$gte': formatDate(this.startTime, 'yyyy-MM-ddT00:00:00.000Z', true),
            '$lte': formatDate(this.endTime, 'yyyy-MM-ddT23:59:59.999Z', true)
          }
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
        // token 不存在，无权限访问
        if (!this.token) {
          this.showNoTokenError()
          return
        }

        if (typeof querying !== 'undefined') {
          this.currentPage = 1
        }
        this.loadingData = true
        api.warranty.getBranchList(this.$route.params.app_id, this.queryCondition).then((res) => {
          this.accounts = res.data.list
          this.total = res.data.count
          this.loadingData = false
        }).catch((err) => {
          this.handleError(err)
          this.loadingData = false
        })
      },

      /**
       * 处理筛选条件中省改变
       */
      onCurProvinceChange (val) {
        this.curProvince = val
        this.getBranchList()
      },

      /**
       * 处理筛选条件中市改变
       */
      onCurCityChange (val) {
        this.curCity = val
        this.getBranchList()
      },

      /**
       * 处理筛选条件中区改变
       */
      onCurDistrictChange (val) {
        this.curDistrict = val
        this.getBranchList()
      },

      /**
       * 处理添加表单中省改变
       */
      onProvinceChange (val) {
        this.selectedProvince = val
      },

      /**
       * 处理添加表单中市改变
       */
      onCityChange (val) {
        this.selectedCity = val
      },

      /**
       * 处理添加表单区改变
       */
      onDistrictChange (val) {
        this.selectedDistrict = val
      },

      handleSearch (val) {
        this.key = val
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
        // token 不存在，无权限访问
        if (!this.token) {
          this.showNoTokenError()
          return
        }

        if (this.$addValidation.invalid || this.adding) return
        this.adding = true
        this.addModel.province = this.selectedProvince.name
        this.addModel.city = this.selectedCity.name
        this.addModel.district = this.selectedDistrict.name
        this.addModel.create_time = new Date()
        api.warranty.AddBranch(this.$route.params.app_id, this.addModel).then((res) => {
          this.adding = false
          this.showAddModal = false
          this.getBranchList()
          this.resetAdd()
        }).catch((err) => {
          this.handleError(err)
          this.adding = false
        })
      },
      /**
       * 处理时间区段改变
       */
      onRangeOptionChange () {
        if (this.rangeOption.value === 'any') {
          this.getBranchList(true)
        }
      },

      /**
       * 时间范围改变
       * @param  {[type]} startDate [description]
       * @param  {[type]} endDate   [description]
       * @return {[type]}           [description]
       */
      onTimeChange (start, end) {
        this.startTime = start
        this.endTime = end
        this.getBranchList(true)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../../../assets/stylus/common'
</style>
