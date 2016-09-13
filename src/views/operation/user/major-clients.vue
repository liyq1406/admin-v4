<template>
  <div class="main major-clients">
    <div class="main-title">
      <h2>大客户管理</h2>
    </div>

    <!-- Start: 产品信息统计 -->
    <div class="row statistic-group mb30">
      <div class="col-6" v-for="statistic in statisticArr">
        <statistic :total="statistic.value" :title="statistic.title" align="left"></statistic>
      </div>
    </div>
    <!-- End: 产品信息统计 -->

    <!-- Start: 趋势曲线图 -->
    <!-- <div class="panel mt20">
      <div class="panel-hd">
        <div class="filter-bar">
          <div class="filter-group fl">
            <div class="filter-group-item">
              <radio-button-group :items="trendOption" :value.sync="chartCondition.type"><span slot="label" class="label">趋势</span></radio-button-group>
            </div>
          </div>
          <div class="filter-group fr">
            <div class="filter-group-item">
              <date-time-multiple-picker :periods="[7,30,90]" @timechange="onTimeChange" :default-period="defaultPeriod"></date-time-multiple-picker>
            </div>
          </div>
        </div>
        <time-line :data="trends"></time-line>
      </div>
    </div> -->
    <!-- End: 趋势曲线图 -->

    <div class="panel mt10">
      <div class="panel-hd">
        <div class="actions">
          <button class="btn btn-primary" @click="onShowAddModal">
            <i class="fa fa-plus"></i>
            新增大客户
          </button>
        </div>
        <h2>大客户列表</h2>
      </div>
      <div class="panel-bd">
        <div class="data-table">
          <div class="filter-bar">
            <div class="filter-group fl">
              <div class="filter-group-item">
                <x-select :label="selectedFilterIndustry || '全部'" width='110px' size="small">
                  <span slot="label">显示</span>
                  <select v-model="selectedFilterIndustry" @change="getMajorClient(true)">
                    <option :value="">全部</option>
                    <option v-for="industry in industrys" :value="industry">{{industry}}</option>
                  </select>
                </x-select>
              </div>
            </div>
            <div class="filter-group fr">
              <search-box :key.sync="query" :active="searching" :placeholder="'搜索客户名称'" @cancel="getMajorClient(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getMajorClient(true)">
                <button slot="search-button" @click="getMajorClient(true)" class="btn"><i class="fa fa-search"></i></button>
              </search-box>
            </div>
          </div>
          <x-table :headers="headers" :tables="tables" :page="page" :loading="tableLoadingData" @theader-device-sum="sortBySomeKey" @theader-create-time="sortBySomeKey" @tbody-name="goDetails" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage">
          </x-table>
        </div>
      </div>
    </div>
    <modal :show.sync="showAddModal" @close="onAddCancel" width="524px">
      <h3 slot="header">添加大客户</h3>
      <div slot="body" class="form">
        <validator name="majorClientValidation">
          <form @submit.prevent="addMajorClient" novalidate>
            <div class="form-row row">
              <label class="form-control col-6">客户名称:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入名称'" class="input-text-wrap">
                  <input v-model="addModal.name" type="text" name="addModal.name" v-validate:name="{required: true, minlength: 2, maxlength: 32}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$majorClientValidation.name.touched && $majorClientValidation.name.required">名称为必填</span>
                  <span v-if="$majorClientValidation.name.touched && $majorClientValidation.name.modified && $majorClientValidation.name.minlength">{{ $t('ui.validation.minlength', ['客户名称', 2]) }}</span>
                  <span v-if="$majorClientValidation.name.touched && $majorClientValidation.name.modified && $majorClientValidation.name.maxlength">{{ $t('ui.validation.maxlength', ['客户名称', 40]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">联系人:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入联系人'" class="input-text-wrap">
                  <input v-model="addModal.contacter" type="text" name="addModal.contacter" v-validate:contacter="{required: false, minlength: 2, maxlength: 32}" class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$majorClientValidation.contacter.touched && $majorClientValidation.contacter.required">联系人为必填</span>
                  <span v-if="$majorClientValidation.contacter.touched && $majorClientValidation.contacter.modified && $majorClientValidation.contacter.minlength">{{ $t('ui.validation.minlength', ['联系人', 2]) }}</span>
                  <span v-if="$majorClientValidation.contacter.touched && $majorClientValidation.contacter.modified && $majorClientValidation.contacter.maxlength">{{ $t('ui.validation.maxlength', ['联系人', 40]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">联系电话:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入联系电话'" class="input-text-wrap">
                  <input v-model="addModal.phone" type="number" name="addModal.phone" v-validate:phone="{required: true, format: 'phone'}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$majorClientValidation.phone.touched && $majorClientValidation.phone.required">联系电话为必填</span>
                  <span v-if="$majorClientValidation.contacter.touched && $majorClientValidation.phone.modified && $majorClientValidation.phone.format">{{ $t('ui.validation.format', {field: $t('ui.auth.fields.phone')}) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">邮箱:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入邮箱'" class="input-text-wrap">
                  <input v-model="addModal.email" type="email" name="addModal.email" v-validate:email="{required: true, format: 'email'}" required lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$majorClientValidation.email.touched && $majorClientValidation.email.required">邮箱为必填</span>
                  <span v-if="$majorClientValidation.contacter.touched && $majorClientValidation.email.modified && $majorClientValidation.email.format">{{ $t('ui.validation.format', {field: $t('ui.auth.fields.email')}) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">行业:</label>
              <div class="controls filter-group-item col-18">
                <x-select :label="addModal.industry">
                  <select v-model="addModal.industry">
                    <option v-for="industry in industrys" :value="industry">{{industry}}</option>
                  </select>
                </x-select>
                <!-- <div v-placeholder="'请输入行业'" class="input-text-wrap">
                  <input v-model="addModal.industry" type="text" name="addModal.industry" v-validate:industry="{required: true}" class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$majorClientValidation.industry.touched && $majorClientValidation.industry.required">行业为必填</span>
                </div> -->
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">所在地:</label>
              <div class="controls col-18">
                <div class="clearfix">
                  <!-- 国家 -->
                  <!-- <div class="fl mr5 w120">
                    <div v-placeholder="'国家'" class="input-text-wrap">
                      <input v-model="addModal.country" type="text" name="country" v-validate:country="{required: false}" class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$majorClientValidation.country.touched && $majorClientValidation.country.required">国家为必填</span>
                    </div>
                  </div> -->
                  <!-- 省份 -->
                  <!-- <div class="fl mr5 w120">
                    <div v-placeholder="'省份'" class="input-text-wrap">
                      <input v-model="addModal.province" type="text" name="province" v-validate:province="{required: true}" class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$majorClientValidation.province.touched && $majorClientValidation.province.required">省份为必填</span>
                    </div>
                  </div> -->
                  <!-- 城市 -->
                  <!-- <div class="fl w120">
                    <div v-placeholder="'城市'" class="input-text-wrap">
                      <input v-model="addModal.city" type="text" name="city" v-validate:city="{required: true}" class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$majorClientValidation.city.touched && $majorClientValidation.city.required">城市为必填</span>
                    </div>
                  </div> -->
                  <div class="filter-group-item">
                    <area-select :province.sync="curProvince" :city.sync="curCity" :district.sync="curDistrict" select-size="small" @province-change="getWarrantyList(true)" @city-change="getWarrantyList(true)" @district-change="getWarrantyList(true)"></area-select>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">详细地址:</label>
              <div class="controls col-18">
                <!-- 地址 -->
                <div v-placeholder="'请输入地址'" class="input-text-wrap">
                  <textarea v-model="addModal.location" type="text" name="addModal.location" v-validate:location="{required: true, minlength: 6, maxlength: 240}" class="input-text"></textarea>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$majorClientValidation.location.touched && $majorClientValidation.location.required">地址为必填</span>
                  <span v-if="$majorClientValidation.location.touched && $majorClientValidation.location.modified && $majorClientValidation.location.minlength">{{ $t('ui.validation.minlength', ['详细地址', 6]) }}</span>
                  <span v-if="$majorClientValidation.location.touched && $majorClientValidation.location.modified && $majorClientValidation.location.maxlength">{{ $t('ui.validation.maxlength', ['详细地址', 240]) }}</span>
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
import api from 'api'
import SearchBox from 'components/SearchBox'
import Select from 'components/Select'
import Table from 'components/Table'
import { globalMixins } from 'src/mixins'
import Statistic from 'components/Statistic2'
import RadioButtonGroup from 'components/RadioButtonGroup'
import DateTimeMultiplePicker from 'components/DateTimeMultiplePicker'
import TimeLine from 'components/g2-charts/TimeLine'
import Modal from 'components/Modal'
import { formatDate } from 'src/filters'
import AreaSelect from 'components/AreaSelect'
// import Mock from 'mockjs'
import _ from 'lodash'
import { createDayRange } from 'utils'

export default {
  name: 'MajorClients',

  mixins: [globalMixins],

  components: {
    'search-box': SearchBox,
    'x-select': Select,
    'x-table': Table,
    'area-select': AreaSelect,
    'modal': Modal,
    Statistic,
    RadioButtonGroup,
    DateTimeMultiplePicker,
    TimeLine
  },

  data () {
    return {
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
      trendOption: [
        {
          label: '新增客户',
          value: 1
        },
        {
          label: '新增设备',
          value: 2
        }
      ],

      chartCondition: {
        type: 1, // 1是新增客户 2是新增设备
        startDate: '', // 开始时间
        endDate: '' // 结束时间
      },
      industrys: [
        '互联网',
        '信息安全',
        '空气净化',
        '游戏运营',
        '快消品',
        '通信电子'
      ],
      addModal: {
        // 名称
        name: '',
        // 联系人
        contacter: '',
        // 联系电话
        phone: '',
        // 邮箱
        email: '',
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
          key: 'name',
          title: '客户名称'
        },
        {
          key: 'device_sum',
          title: '设备数',
          sortType: -1
        },
        {
          key: 'industry',
          title: '行业',
          class: 'tac'
        },
        {
          key: 'contacter',
          title: '联系人'
        },
        {
          key: 'phone',
          title: '联系电话'
        },
        {
          key: 'create_time',
          title: '创建时间',
          sortType: -1
        }
      ],
      // 当前用于排序的字段
      sortKey: ''
      // test: [
      //   {
      //     date: new Date('2016-08-06'),
      //     val: 5
      //   },
      //   {
      //     date: new Date('2016-08-05'),
      //     val: 6
      //   },
      //   {
      //     date: new Date('2016-08-04'),
      //     val: 3
      //   },
      //   {
      //     date: new Date('2016-08-03'),
      //     val: 3
      //   }
      // ]
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
          title: '大客户总数',
          value: this.allTotal
        },
        {
          title: '本月新增大客户',
          value: this.addMajorClientsCount
        },
        {
          title: '大客户设备数',
          value: this.devicesCount
        },
        {
          title: '本月新增大客户设备',
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
          name: '<a class="hl-red">' + item.name + '</a>',
          device_sum: item.device_sum,
          industry: item.industry,
          contacter: item.contacter,
          phone: item.phone,
          create_time: formatDate(item.create_time),
          prototype: item
        }
        result.push(majorClient)
      })
      return result
    },
    /**
     * 获取大客户列表的条件
     * @return {[type]} [description]
     */
    queryCondition () {
      var condition = {
        filter: [
          'id',
          'name',
          'email',
          'phone',
          'industry',
          'location',
          'contacter',
          'contact_way',
          'status',
          'create_time',
          'device_sum'
        ],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
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

      this.headers.map((item) => {
        if (item.sortType && (item.key === this.sortKey)) {
          condition.order[item.key] = (item.sortType === 1 ? 'asc' : 'desc')
        }
      })

      return condition
    }
  },

  route: {
    data () {
      // 获取大客户
      this.getMajorClient()
      // 获取统计信息
      this.getSummary()
      // 获取趋势用于渲染曲线图
      // this.getTrends()
    }
  },
  ready () {
  },
  methods: {
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
     * 图表时间范围改变
     * @param  {[type]} startDate [description]
     * @param  {[type]} endDate   [description]
     * @return {[type]}           [description]
     */
    onTimeChange (startDate, endDate) {
      var startYear = startDate.getFullYear()
      var startMonth = startDate.getMonth() + 1
      var startDay = startDate.getDate()
      var endYear = endDate.getFullYear()
      var endMonth = endDate.getMonth() + 1
      var endDay = endDate.getDate()
      this.chartCondition.startDate = `${startYear}-${startMonth}-${startDay}`
      this.chartCondition.endDate = `${endYear}-${endMonth}-${endDay}`
      this.getTrends()
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
        // 已进入获取全部总数放进概览
        this.allTotal = res.data.count
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
        params.province = this.curProvince.name
        params.city = this.curCity.name
        api.heavyBuyer.addHeavyBuyer(params).then((res) => {
          this.showNotice({
            type: 'success',
            content: '添加成功'
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
        name: '',
        // 联系人
        contacter: '',
        // 联系电话
        phone: '',
        // 邮箱
        email: '',
        // 行业
        industry: '互联网',
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
</style>
