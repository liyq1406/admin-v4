<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="action-bar">
        <search-box class="work-order-search-box" :key.sync="key" :placeholder="'请输入工单编号'">
          <button slot="search-button" class="btn btn-primary">搜索</button>
          <label></label>
        </search-box>
      </div>

      <div class="status-bar">
        <v-select :label="statusOptions[status.value].label" width="100px" class="work-orders-select" size="small">
          <span slot="label">工单状态</span>
          <select v-model="status">
            <option v-for="option in statusOptions" :value="option">{{option.label}}</option>
            <p> {{status}}</p>
          </select>
        </v-select>

        <area-select :province.sync="curProvince" :city.sync="curCity" :district.sync="curDistrict" label="所在地区" select-size="small"></area-select>
      </div>

      <table class="table table-stripe table-bordered">
        <thead>
          <tr>
            <th>工单编号</th>
            <th>客户姓名</th>
            <th>产品名称</th>
            <th>产品型号</th>
            <th>创建日期</th>
            <th>工单状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="workOrders.length > 0 && !loadingData">
            <tr v-for="order in workOrders">
              <td>{{order._id}}</td>
              <td>{{order.name}}</td>
              <td>{{order.product_name}}</td>
              <td>{{order.product_type}}</td>
              <td>{{order.extended_days}}</td>
              <td>{{order.status}}</td>
              <td><a v-link="{path: '/warranty/work-orders/extended-warranties/' + order._id}" class="hl-red">查看详情</a></td>
            </tr>
          </template>
          <tr v-if="loadingData">
            <td colspan="7" class="tac">
              <div class="tips-null"><i class="fa fa-refresh fa-spin"></i><span>{{ $t("common.data_loading") }}</span></div>
            </td>
          </tr>
          <tr v-if="workOrders.length === 0 && !loadingData">
            <td colspan="7" class="tac">
              <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Start: 分页信息 -->
      <div class="row">
        <div class="col-8">共有{{total}}条结果</div>
        <div class="col-16">
          <pager v-if="!loadingData && total > pageCount" :total="total" :current.sync="currentPage" :page-count="pageCount" @page-update="getWarrantyList"></pager>
        </div>
      </div>
      <!-- End: 分页信息 -->
  </div>
</template>

<script>
  // import api from '../../../../api'
  import { globalMixins } from '../../../../mixins'
  import Select from '../../../../components/Select'
  import AreaSelect from '../../../../components/AreaSelect'
  import SearchBox from '../../../../components/SearchBox'
  import Pager from '../../../../components/Pager'
  import api from '../../../../api'

  export default {
    name: 'OrderList',

    layout: 'admin',

    mixins: [globalMixins],

    data () {
      return {
        name: '',
        status: {
          label: '全部',
          value: 0
        },
        key: '',
        curProvince: {},
        curCity: {},
        curDistrict: {},
        workOrders: [],
        statusOptions: [{
          label: '全部',
          value: 0
        }, {
          label: '未过期',
          value: 1
        }, {
          label: '已过期',
          value: 2}],

        loadingData: false,
        currentPage: 1,
        pageCount: 10,
        total: 0
      }
    },

    methods: {
      getWarrantyList () {
        this.loadingData = true
        api.warranty.getWarrantyList(this.queryCondition).then((res) => {
          this.total = res.data.count
          this.workOrders = res.data.list
          this.loadingData = false
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      }
    },

    computed: {
      queryCondition () {
        var condition = {
          filter: [],
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount,
          order: {},
          query: {}
        }
        return condition
      }
    },

    components: {
      'v-select': Select,
      'area-select': AreaSelect,
      'search-box': SearchBox,
      'pager': Pager
    },

    route: {
      data () {
        this.getWarrantyList()
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../../assets/stylus/common'
</style>
