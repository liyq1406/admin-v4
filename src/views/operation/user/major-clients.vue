<template>
  <div class="main major-clients">
    <div class="main-title">
      <h2>{{ $t('operation.user.major.main_title') }}</h2>
    </div>

    <!-- Start: 产品信息统计 -->
    <div class="row statistic-group mb30">
      <div class="col-6" v-for="statistic in statisticArr">
        <statistic :total="statistic.value" :title="statistic.title" align="left"></statistic>
      </div>
    </div>
    <!-- End: 产品信息统计 -->

    <div class="panel mt10">
      <div class="panel-hd">
        <div class="actions">
          <a class="btn btn-primary" @click="onShowAddModal">
            <i class="fa fa-plus"></i>
            {{ $t('operation.user.major.new') }}
          </a>
        </div>
        <h2>{{ $t('operation.user.major.list_title') }}</h2>
      </div>
      <div class="panel-bd">
        <div class="data-table">
          <div class="filter-bar">
            <div class="filter-group fl">
              <div class="filter-group-item">
                <x-select :label="selectedFilterIndustry || $t('common.all')" width='110px' size="small">
                  <span slot="label">{{ $t('common.display') }}</span>
                  <select v-model="selectedFilterIndustry" @change="getMajorClient(true)">
                    <option :value="">{{ $t('common.all') }}</option>
                    <option v-for="industry in industrys" :value="industry">{{industry}}</option>
                  </select>
                </x-select>

                <template v-if="debug">
                  <span class="ml10">{{ $t('common.create_time') }}</span>
                  <x-select width="98px" size="small" :label="rangeOption.label">
                    <select v-model="rangeOption" @change="onRangeOptionChange">
                      <option v-for="option in timeRangeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </x-select>
                  <date-time-range-picker v-if="rangeOption.value === 'specified'" @timechange="onTimeChange" :start-offset="365" :show-time="false"></date-time-range-picker>
                </template>

              </div>
            </div>
            <div class="filter-group fr">
              <div class="filter-group-item">
                <button class="btn btn-ghost btn-sm" @click.stop="onExportBtnClick" :class="{'disabled': exporting}" :disabled="exporting"><i class="fa fa-share"></i></button>
              </div>
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" :placeholder="$t('operation.user.major.search_placeholder')" @cancel="getMajorClient(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getMajorClient(true)">
                  <button slot="search-button" @click="getMajorClient(true)" class="btn"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
          </div>
          <x-table :headers="headers" :tables="tables" :page="page" :loading="tableLoadingData" @theader-device-sum="sortBySomeKey" @theader-create-time="sortBySomeKey" @tbody-name="goDetails" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage">
          </x-table>
        </div>
      </div>
    </div>
    <modal :show.sync="showAddModal" @close="onAddCancel" width="561px">
      <h3 slot="header">{{ $t('operation.user.major.new') }}</h3>
      <div slot="body" class="form">
        <validator name="majorClientValidation">
          <form autocomplete="off" @submit.prevent="addMajorClient" novalidate>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t('operation.user.major.columns.name') }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('operation.user.major.placeholders.name')" class="input-text-wrap">
                  <input v-model="addModal.username" type="text" name="addModal.username" v-validate:username="{required: true, minlength: 6, maxlength: 32, format: 'account'}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$majorClientValidation.username.touched && $majorClientValidation.username.required">{{ $t('common.validation.required', {field: $t('operation.user.major.columns.name')}) }}</span>
                  <span v-if="$majorClientValidation.username.touched && $majorClientValidation.username.modified && $majorClientValidation.username.minlength">{{ $t('common.validation.minlength', [$t('operation.user.major.columns.name'), 6]) }}</span>
                  <span v-if="$majorClientValidation.username.touched && $majorClientValidation.username.modified && $majorClientValidation.username.maxlength">{{ $t('common.validation.maxlength', [$t('operation.user.major.columns.name'), 40]) }}</span>
                  <span v-if="$majorClientValidation.username.touched && $majorClientValidation.username.modified && $majorClientValidation.username.format">{{ $t('common.validation.account', {field: $t('operation.user.major.columns.name')}) }}</span>
                </div>
              </div>
            </div>
            <!-- 密码 -->
            <div class="form-row row">
              <label class="form-control col-6">{{ $t('operation.user.major.password') }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('auth.password')" class="input-text-wrap">
                  <input type="password" v-model="addModal.password" v-validate:password="{required: true, minlength: 8, maxlength: 16}" name="addModal.password" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$majorClientValidation.password.touched && $majorClientValidation.password.required">{{ $t('common.validation.required', {field: $t('auth.fields.password')}) }}</span>
                  <span v-if="$majorClientValidation.password.modified && $majorClientValidation.password.minlength">{{ $t('common.validation.minlength', [$t('auth.fields.password'), 8]) }}</span>
                  <span v-if="$majorClientValidation.password.modified && $majorClientValidation.password.maxlength">{{ $t('common.validation.maxlength', [$t('auth.fields.password'), 16]) }}</span>
                </div>
              </div>
            </div>
            <!-- 确认密码 -->
            <div class="form-row row">
              <label class="form-control col-6">{{ $t('operation.user.major.comfirm_password') }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('auth.fields.confirm_password')" class="input-text-wrap">
                  <input type="password" v-model="confirmPassword" v-validate:confirm-password="{required: true, equal: addModal.password}"  name="confirmPassword" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$majorClientValidation.confirmPassword.touched && $majorClientValidation.confirmPassword.required">{{ $t('common.validation.required', {field: $t('auth.fields.confirm_password')}) }}</span>
                  <span v-if="$majorClientValidation.confirmPassword.modified && $majorClientValidation.confirmPassword.equal">{{ $t('common.validation.equal', [$t('auth.fields.confirm_password'), $t('auth.fields.password')]) }}</span>
                </div>
              </div>
            </div>

            <div class="form-row row">
              <label class="form-control col-6">{{ $t('operation.user.major.columns.contacter') }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('operation.user.major.placeholders.contacter')" class="input-text-wrap">
                  <input v-model="addModal.contacter" type="text" name="addModal.contacter" v-validate:contacter="{required: false, minlength: 2, maxlength: 32}" class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$majorClientValidation.contacter.touched && $majorClientValidation.contacter.required">{{ $t('common.validation.required', {field: $t('operation.user.major.columns.contacter')}) }}</span>
                  <span v-if="$majorClientValidation.contacter.touched && $majorClientValidation.contacter.modified && $majorClientValidation.contacter.minlength">{{ $t('common.validation.minlength', [$t('operation.user.major.columns.contacter'), 2]) }}</span>
                  <span v-if="$majorClientValidation.contacter.touched && $majorClientValidation.contacter.modified && $majorClientValidation.contacter.maxlength">{{ $t('common.validation.maxlength', [$t('operation.user.major.columns.contacter'), 40]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t('operation.user.major.columns.industry') }}:</label>
              <div class="controls filter-group-item col-18">
                <x-select :label="addModal.industry">
                  <select v-model="addModal.industry">
                    <option v-for="industry in industrys" :value="industry">{{industry}}</option>
                  </select>
                </x-select>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t('operation.user.major.columns.locality') }}:</label>
              <div class="controls col-18">
                <div class="clearfix">
                  <div class="filter-group-item">
                    <area-select :province.sync="curProvince" :city.sync="curCity" :district.sync="curDistrict" select-size="small" @province-change="getWarrantyList(true)" @city-change="getWarrantyList(true)" @district-change="getWarrantyList(true)"></area-select>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t('operation.user.major.columns.location') }}:</label>
              <div class="controls col-18">
                <!-- 地址 -->
                <div v-placeholder="$t('operation.user.major.placeholders.location')" class="input-text-wrap">
                  <textarea v-model="addModal.location" type="text" name="addModal.location" v-validate:location="{required: true, minlength: 6, maxlength: 240}" class="input-text"></textarea>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$majorClientValidation.location.touched && $majorClientValidation.location.required">{{ $t('common.validation.required', {field: $t('operation.user.major.columns.location')}) }}</span>
                  <span v-if="$majorClientValidation.location.touched && $majorClientValidation.location.modified && $majorClientValidation.location.minlength">{{ $t('common.validation.minlength', [$t('operation.user.major.placeholders.location'), 6]) }}</span>
                  <span v-if="$majorClientValidation.location.touched && $majorClientValidation.location.modified && $majorClientValidation.location.maxlength">{{ $t('common.validation.maxlength', [$t('operation.user.major.placeholders.location'), 240]) }}</span>
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
</template>

<script>
import Vue from 'vue'
import api from 'api'
import { globalMixins } from 'src/mixins'
import formatDate from 'filters/format-date'
import { createDayRange } from 'utils'
import locales from 'consts/locales/index'

export default {
  name: 'MajorClients',

  mixins: [globalMixins],

  components: {
  },

  data () {
    return {
      exporting: false,
      curProvince: {},
      curCity: {},
      curDistrict: {},
      adding: false,
      defaultPeriod: 30,
      query: '',
      searching: false,
      total: 0,
      allTotal: 0,
      currentPage: 1,
      countPerPage: 10,
      tableLoadingData: false,
      showAddModal: false,
      // 本月新增大客户
      addMajorClientsCount: 0,
      // 大客户设备数
      devicesCount: 0,
      // 本月新增大客户设备
      addDevicesCount: 0,
      // 已选的行业(过滤条件)
      selectedFilterIndustry: '',

      chartCondition: {
        type: 1, // 1是新增客户 2是新增设备
        startDate: '', // 开始时间
        endDate: '' // 结束时间
      },
      rangeOption: {
        label: this.$t('common.any'),
        value: 'any'
      },
      timeRangeOptions: locales[Vue.config.lang].data.TIME_RANGE_OPTIONS,
      industrys: [
        this.$t('operation.user.major.industrys.web'),
        this.$t('operation.user.major.industrys.security'),
        this.$t('operation.user.major.industrys.air'),
        this.$t('operation.user.major.industrys.game'),
        this.$t('operation.user.major.industrys.consumable'),
        this.$t('operation.user.major.industrys.communication')
      ],
      addModal: {
        // 名称
        username: '',

        password: '',

        // 联系人
        contacter: '',
        // 行业
        industry: '',
        // 国家
        country: '',
        // 省份
        province: '',
        // 城市
        city: '',
        // 地址
        location: ''
      },
      confirmPassword: '',
      trendsData: [
        // {
        //   day: '2016-08-06',
        //   add_heavy_buger: 6,
        //   add_device: 2
        // },
        // {
        //   day: '2016-08-05',
        //   add_heavy_buger: 6,
        //   add_device: 2
        // },
        // {
        //   day: '2016-08-04',
        //   add_heavy_buger: 4,
        //   add_device: 2
        // },
        // {
        //   day: '2016-08-03',
        //   add_heavy_buger: 3,
        //   add_device: 2
        // },
        // {
        //   day: '2016-08-02',
        //   add_heavy_buger: 2,
        //   add_device: 2
        // },
        // {
        //   day: '2016-08-01',
        //   add_heavy_buger: 1,
        //   add_device: 2
        // },
        // {
        //   day: '2016-07-31',
        //   add_heavy_buger: 31,
        //   add_device: 2
        // },
        // {
        //   day: '2016-07-30',
        //   add_heavy_buger: 30,
        //   add_device: 2
        // }
      ],
      majorClients: [ // 下面的假数据不要删掉！！！！！！注释掉就行
        // {
        //   'id': 111,
        //   'name': 'Google',
        //   'email': '邮箱地址',
        //   'phone': '手机',
        //   'industry': '互联网',
        //   'location': '美国洛杉矶',
        //   'contacter': 'jon',
        //   'contact_way': '158023234',
        //   'status': 0,
        //   'create_time': '2015-10-09T08:15:40.843Z'
        // },
        // {
        //   'id': 222,
        //   'name': 'Google',
        //   'email': '邮箱地址',
        //   'phone': '手机',
        //   'industry': '互联网',
        //   'location': '美国洛杉矶',
        //   'contacter': 'jon',
        //   'contact_way': '158023234',
        //   'status': 0,
        //   'create_time': '2015-10-09T08:15:40.843Z'
        // }
      ],
      headers: [
        {
          key: 'username',
          title: this.$t('operation.user.major.columns.name')
        },
        {
          key: 'device_sum',
          title: this.$t('operation.user.major.columns.device_count'),
          sortType: -1
        },
        {
          key: 'industry',
          title: this.$t('operation.user.major.columns.industry'),
          class: 'tac'
        },
        {
          key: 'contacter',
          title: this.$t('operation.user.major.columns.contacter')
        },
        // {
        //   key: 'phone',
        //   title: this.$t('operation.user.major.columns.phone')
        // },
        {
          key: 'create_time',
          title: this.$t('operation.user.major.columns.create_time'),
          sortType: -1
        }
      ],
      // 当前用于排序的字段
      sortKey: '',
      startTime: new Date() - 7 * 1000 * 60 * 60 * 24,
      endTime: new Date()
    }
  },
  computed: {
    /**
     * 趋势
     * @return {Array}
     */
    trends () {
      var result = []
      var isAddDevice = this.chartCondition.type === 2
      this.trendsData.map((item) => {
        var trend = {
          date: item.day,
          val: isAddDevice ? item.add_device : item.add_heavy_buger
        }
        result.push(trend)
      })
      result = result.length ? result : []
      return result
    },
    /**
     * 状态
     * @return {[type]} [description]
     */
    statisticArr () {
      var result = [
        {
          title: this.$t('operation.user.major.total'),
          value: this.allTotal
        },
        {
          title: this.$t('operation.user.major.add_count'),
          value: this.addMajorClientsCount
        },
        {
          title: this.$t('operation.user.major.device_count'),
          value: this.devicesCount
        },
        {
          title: this.$t('operation.user.major.add_device_count'),
          value: this.addDevicesCount
        }
      ]
      return result
    },
    /**
     * 分页对象
     * @return {[type]} [description]
     */
    page () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },
    /**
     * 表格内容对象
     * @return {[type]} [description]
     */
    tables () {
      var result = []
      this.majorClients.map((item) => {
        var majorClient = {
          username: '<a class="hl-red">' + (item.username || '-') + '</a>',
          device_sum: item.device_sum,
          industry: item.industry,
          contacter: item.contacter,
          // phone: item.phone,
          create_time: formatDate(item.create_time),
          prototype: item
        }
        result.push(majorClient)
      })
      return result
    },

    // 基本筛选条件
    baseCondition () {
      var condition = {
        filter: [
          'id',
          'username',
          'industry',
          'location',
          'contacter',
          'contact_way',
          'status',
          'create_time',
          'device_sum'
        ],
        order: {'create_time': 'desc'},
        query: {}
      }
      /**
       * 搜索框搜索
       * @param  {[type]} this.query [description]
       * @return {[type]}            [description]
       */
      if (this.query) {
        condition.query['name'] = { $like: this.query }
      }
      // 下拉框筛选
      if (this.selectedFilterIndustry) {
        condition.query['industry'] = { $in: [this.selectedFilterIndustry] }
      }

      if (this.rangeOption.value === 'specified') {
        condition.query['create_time'] = {
          '$gte': formatDate(this.startTime, 'yyyy-MM-ddT00:00:00.000Z', true),
          '$lte': formatDate(this.endTime, 'yyyy-MM-ddT23:59:59.999Z', true)
        }
      }

      this.headers.map((item) => {
        if (item.sortType && (item.key === this.sortKey)) {
          condition.order[item.key] = (item.sortType === 1 ? 'asc' : 'desc')
        }
      })

      return condition
    },

    // 列表查询条件
    queryCondition () {
      let condition = _.cloneDeep(this.baseCondition)

      condition.limit = this.countPerPage
      condition.offset = (this.currentPage - 1) * this.countPerPage

      return condition
    }
  },

  route: {
    data () {
      // 获取大客户
      this.getMajorClient()
      // 获取统计信息
      this.getSummary()
    }
  },
  ready () {
  },
  methods: {
    /**
     * 处理导出 CSV 按钮点击
     */
    onExportBtnClick () {
      if (this.exporting) {
        return
      }

      let postData = {
        name: '大客户列表',
        describe: '大客户列表',
        type: 4,
        params: this.baseCondition
      }

      this.exporting = true
      api.exportTask.createTask(postData).then((res) => {
        this.showNotice({
          type: 'success',
          content: this.$t('operation.settings.offline.export_success')
        })
        this.$route.router.go('/operation/settings/offline-data')
        // this.onExportCancel()
      }).catch((res) => {
        this.exporting = false
        this.handleError(res)
      })
    },
    /**
     * 处理时间区段改变
     */
    onRangeOptionChange () {
      if (this.rangeOption.value === 'any') {
        this.getMajorClient()
      }
    },

    getWarrantyList () {
      // console.log('搜索')
    },
    /**
     * 获取趋势
     * @return {[type]} [description]
     */
    getTrends () {
      var timeObj = createDayRange(0, 7)
      var startDate = this.chartCondition.startDate || timeObj.start
      var endDate = this.chartCondition.endDate || timeObj.end
      api.statistics.getHeavyBugerTrend(startDate, endDate).then((res) => {
        // res.data = [
        //   {
        //     day: '2016-08-06',
        //     add_heavy_buger: 6,
        //     add_device: 2
        //   },
        //   {
        //     day: '2016-08-05',
        //     add_heavy_buger: 6,
        //     add_device: 2
        //   },
        //   {
        //     day: '2016-08-04',
        //     add_heavy_buger: 4,
        //     add_device: 2
        //   },
        //   {
        //     day: '2016-08-03',
        //     add_heavy_buger: 3,
        //     add_device: 2
        //   },
        //   {
        //     day: '2016-08-02',
        //     add_heavy_buger: 2,
        //     add_device: 2
        //   },
        //   {
        //     day: '2016-08-01',
        //     add_heavy_buger: 1,
        //     add_device: 2
        //   }
        // ]
        this.trendsData = res.data
      }).catch((res) => {
        this.handleError(res)
      })
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
      this.getMajorClient()
    },

    /**
     * 获取统计信息
     * @return {[type]} [description]
     */
    getSummary () {
      /**
       * 获取大客户总数和设备总数
       * @return {[type]} [description]
       */
      api.statistics.getHeavyBugerSummary().then((res) => {
        this.devicesCount = res.data.device
        this.addMajorClientsCount = res.data.current_month_heavy_buger
        this.addDevicesCount = res.data.current_month_device
        this.allTotal = res.data.heavy_buger
      }).catch((res) => {
        this.handleError(res)
      })

      /**
       * 获取本月新增大客户数和新增设备数
       * @return {[type]} [description]
       */
      // var year = new Date().getFullYear()
      // var month = new Date().getMonth() + 1
      // var day = new Date().getDate()
      // var startDay = `${year}-${month}-01`
      // var endDay = `${year}-${month}-${day}`
      // api.statistics.getHeavyBugerTrend(startDay, endDay).then((res) => {
      //   var addMajorClientsCount = 0
      //   var addDevicesCount = 0
      //   res.data.map((item) => {
      //     addMajorClientsCount += item.add_heavy_buger
      //     addDevicesCount += item.add_device
      //   })
      //   this.addMajorClientsCount = addMajorClientsCount
      //   this.addDevicesCount = addDevicesCount
      // }).catch((res) => {
      //   this.handleError(res)
      // })
    },
    /**
     * 获取大客户列表
     * @return {[type]} [description]
     */
    getMajorClient (reset) {
      if (reset === true) {
        this.currentPage = 1
      }
      this.tableLoadingData = true
      api.heavyBuyer.getHeavyBuyer(this.queryCondition).then((res) => {
        this.tableLoadingData = false
        this.majorClients = res.data.list
        this.total = res.data.count
      }).catch((err) => {
        this.tableLoadingData = false
        this.handleError(err)
      })
    },
    /**
     * 当前页码改变
     * @author weijie
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      this.getMajorClient()
    },

    /**
     * 每页显示的数量改变
     * @author weijie
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.currentPage = 1
      this.getMajorClient()
    },
    /**
     * 添加大客户函数
     */
    addMajorClient () {
      this.adding = true
      if (this.$majorClientValidation.valid) {
        var params = _.clone(this.addModal)
        // if (this.curProvince && this.curCity) {
        //   this.showNotice({
        //     type: 'error',
        //     content: '请输入完整所在地信息'
        //   })
        //   this.adding = false
        //   return
        // }
        params.province = this.curProvince.name
        params.city = this.curCity.name
        api.heavyBuyer.addHeavyBuyer(params).then((res) => {
          this.showNotice({
            type: 'success',
            content: this.$t('action_success')
          })
          this.adding = false
          this.onAddCancel()
          this.getMajorClient()
          this.getSummary()
        }).catch((err) => {
          this.handleError(err)
          this.adding = false
        })
      } else {
        this.$validate(true)
        this.adding = false
      }
    },
    /**
     * 关闭添加大客户浮层
     * @return {[type]} [description]
     */
    onAddCancel () {
      this.adding = false
      this.showAddModal = false
      this.$resetValidation()
    },
    /**
     * 显示添加大客户的浮层
     * @return {[type]} [description]
     */
    onShowAddModal () {
      var addModal = {
        // 名称
        username: '',
        // 联系人
        contacter: '',

        password: '',
        // 联系电话
        // phone: '',
        // // 邮箱
        // email: '',
        // 行业
        industry: this.$t('operation.user.major.industrys.web'),
        // 国家
        country: '',
        // 省份
        province: '',
        // 城市
        city: '',
        // 地址
        location: ''
      }
      this.addModal = addModal
      this.curProvince = {}
      this.curCity = {}
      this.curDistrict = {}
      this.showAddModal = true
    },
    // 切换搜索
    toggleSearching () {
      this.searching = !this.searching
    },
    // 搜索
    handleSearch () {
      if (this.query.length === 0) {
        this.getMajorClient(true)
      }
    },
    /**
     * 进入详情页
     * @param  {[type]} table [description]
     * @return {[type]}       [description]
     */
    goDetails (table) {
      this.$route.router.go('/operation/users/major-clients/' + table.prototype.id)
    },
    /**
     * 按某个属性排序
     * 国辉
     * @param  {[type]} table [description]
     * @return {[type]}       [description]
     */
    sortBySomeKey (header, index) {
      this.sortKey = header.key
      if (header.sortType === 1) {
        header.sortType = -1
      } else {
        header.sortType = 1
      }
      this.headers.$set(index, header)
      this.getMajorClient()
    }
  }
}
</script>
<style lang='stylus'>
  @import '../../../assets/stylus/common'

  .major-clients
    .statistic-group
      border-top 1px solid #d9d9d9
    .panel
      border-bottom 0
    .mr5
      margin-right 5px
    /*针对ie 的hock*/
    .modal-body
      padding-bottom 0 !important
      .form
        margin-bottom 20px !important
</style>
