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
          <a class="btn btn-primary" @click="addClient">
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
                  <x-select width="98px" size="small" :label="rangeOption.label">
                    <span slot="label" class="ml10">{{ $t('common.create_time') }}</span>
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
  </div>
</template>

<script>
import Vue from 'vue'
import api from 'api'
import formatDate from 'filters/format-date'
import locales from 'consts/locales/index'

export default {
  name: 'MajorClients',
  components: {
  },

  data () {
    return {
      exporting: false,
      query: '',
      searching: false,
      total: 0,
      allTotal: 0,
      currentPage: 1,
      countPerPage: 10,
      tableLoadingData: false,
      // 本月新增大客户
      addMajorClientsCount: 0,
      // 大客户设备数
      devicesCount: 0,
      // 本月新增大客户设备
      addDevicesCount: 0,
      // 已选的行业(过滤条件)
      selectedFilterIndustry: '',
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
      majorClients: [],
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
     * 显示添加大客户的浮层
     * @return {[type]} [description]
     */
    addClient () {
      this.$route.router.go('/operation/major-client/add')
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
      this.$route.router.go('/operation/major-clients/' + table.prototype.id)
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
