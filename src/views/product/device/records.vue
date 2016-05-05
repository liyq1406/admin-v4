<template>
  <section class="main-wrap">
    <div class="main">
      <div class="breadcrumb"><a v-link="{path: '/products/' + this.$route.params.product_id + '/devices'}" class="fa fa-arrow-circle-left">返回设备管理列表</a></div>
      <div class="panel">
        <div class="panel-hd">
          <h2>设备上下线记录</h2>
        </div>
        <div class="panel-bd">
          <div class="action-bar">
            <search-box class="work-order-search-box" :key.sync="key" :placeholder="'请输入'+ queryType.label" @press-enter="getRecords(true)">
              <v-select width="100px" :label="queryType.label">
                <select v-model="queryType">
                  <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                </select>
              </v-select>
              <button slot="search-button" class="btn btn-primary" @click="getRecords(true)">搜索</button>
            </search-box>
          </div>

          <div class="status-bar">
            <v-select width="100px" :label="dateType.label" size="small">
              <select v-model="dateType" @change = "getRecords(true)">
                <option v-for="option in dateTypeOptions" :value="option">{{ option.label }}</option>
              </select>
            </v-select>
            <date-range-picker input-size="small" class="mr20" :from.sync="startDate" :to.sync="endDate" input-width="94px" @select-day="getRecords(true)">
            </date-range-picker>
          </div>

          <div class="data-table with-loading">
            <div class="icon-loading" v-show="loadingData">
              <i class="fa fa-refresh fa-spin"></i>
            </div>
            <table class="table table-stripe table-bordered">
              <thead>
                <tr>
                  <th>标识ID</th>
                  <th>设备ID</th>
                  <th>IP地址</th>
                  <th>创建时间</th>
                  <th>在线状态</th>
                  <th>引起状态变化的原因</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="records.length > 0">
                  <tr v-for="record in records">
                    <td>{{ record.id }}</td>
                    <td>{{ record.device_id }}</td>
                    <td>{{ record.ip }}</td>
                    <td>{{ record.create_time | uniformDate}}</td>
                    <td>
                      <span v-if = "record.status === 0" class="hl-red">离线</span>
                      <span v-else class="hl-green">在线</span>
                    </td>
                    <td>
                      <span v-if = "record.code === 0" class="hl-green">正常</span>
                      <span v-else class="hl-red">网络异常</span>
                    </td>
                  </tr>
                </template>

                <tr v-if="records.length === 0 && !loadingData">
                  <td colspan="6" class="tac">
                    <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Start: 分页信息 -->
          <div class="row">
            <div class="col-8 mb40">{{{ $t('common.total_results', {count:total}) }}}</div>
            <div class="col-16">
              <pager v-if="!loadingData && total > pageCount" :total="total" :current.sync="currentPage" :page-count="pageCount" @page-update="getRecords"></pager>
            </div>
          </div>
          <!-- End: 分页信息 -->
      </div>
      </div>
    </div>
  </section>
</template>

<script>
  import { globalMixins } from '../../../mixins'
  import Select from '../../../components/Select'
  import AreaSelect from '../../../components/AreaSelect'
  import SearchBox from '../../../components/SearchBox'
  import Pager from '../../../components/Pager'
  import DateRangePicker from '../../../components/DateRangePicker'
  import api from '../../../api'

  export default {
    name: 'OrderList',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'v-select': Select,
      'area-select': AreaSelect,
      'search-box': SearchBox,
      'pager': Pager,
      'date-range-picker': DateRangePicker
    },

    data () {
      return {
        name: '',
        key: '',
        curProvince: {},
        curCity: {},
        curDistrict: {},
        startDate: '',
        endDate: '',
        status: {
          label: '全部',
          value: 0
        },
        records: [],
        loadingData: false,
        currentPage: 1,
        pageCount: 10,
        total: 0,
        queryTypeOptions: [
          { label: '设备ID', value: 'device_id' },
          { label: '标识ID', value: 'id' },
          { label: 'IP地址', value: 'ip' }
        ],
        dateTypeOptions: [
          { label: '上线时间', value: 'online' },
          { label: '下线时间', value: 'offline' }
        ],
        queryType: {
          label: '设备ID',
          value: 'device_id'
        },
        dateType: {
          label: '上线时间',
          value: 'online'
        },
        branchs: []
      }
    },

    // route: {
    //   data () {
    //     this.getRecords()
    //   }
    // },
    ready () {
      this.getRecords()
    },

    computed: {
      queryCondition () {
        var condition = {
          filter: [],
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount,
          order: {},
          query: {
            product_id: this.$route.params.product_id
          }
        }
        // 取搜索条件
        if (this.key !== '') {
          if (this.queryType.value === 'branch') {
            var ids = []
            this.branchs.forEach((item) => {
              ids.push({'@data': item._id})
            })
            condition.query.branch_id = {'$in': ids}
          } else {
            condition.query[this.queryType.value] = this.key
            // condition.query[this.queryType.value] = {$regex: this.key, $options: 'i'}
          }
        }
        // 取时间条件
        if (this.startDate !== undefined && this.startDate !== '') {
          if (this.endDate === '') { // 只有开始时间
            if (this.dateType.value === 'online') {
              condition.query.create_time = {'$gte': new Date(this.startDate)}
              condition.query.status = 1
            } else {
              condition.query.create_time = {'$gte': new Date(this.startDate)}
              condition.query.status = 0
            }
          } else if (this.endDate !== '') { // 都不为空
            if (this.dateType.value === 'online') {
              condition.query.create_time = {'$gte': new Date(this.startDate), '$lte': new Date(this.endDate)}
              condition.query.status = 1
            } else {
              condition.query.create_time = {'$gte': new Date(this.startDate), '$lte': new Date(this.endDate)}
              condition.query.status = 0
            }
          }
        } else {
          if (this.startDate !== undefined && this.endDate !== '') { // 只有结束时间
            if (this.dateType.value === 'online') {
              condition.query.create_time = {'$lte': new Date(this.endDate)}
              condition.query.status = 1
            } else {
              condition.query.create_time = {'$lte': new Date(this.endDate)}
              condition.query.status = 0
            }
          }
        }

        return condition
      }
    },

    methods: {
      getRecords () {
        this.loadingData = true
        api.device.getRecords(this.queryCondition).then((res) => {
          this.total = res.data.count
          this.records = res.data.list
          this.loadingData = false
          console.log(res.data)
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      }
    }
  }
</script>
