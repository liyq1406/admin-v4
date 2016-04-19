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
          </select>
        </v-select>

        <date-range-picker input-size="small" class="mr20" :from="startDate" :to="endDate">
          <span slot="label">创建时间</span>
        </date-range-picker>

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
          <template v-if="workOrders.length > 0">
            <tr v-for="order in workOrders | filterBy status in 'status'">
              <td>{{order.id}}</td>
              <td>{{order.clientName}}</td>
              <td>{{order.productName}}</td>
              <td>{{order.productModel}}</td>
              <td>{{order.createDate}}</td>
              <td>{{order.status}}</td>
              <td><a>查看详情</a></td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- Start: 分页信息 -->
      <div class="row">
        <div class="col-8">{{{ $t('common.total_results', {count:total}) }}}</div>
        <div class="col-16">
          <pager :total="51" :current.sync="0" :page-count="10"></pager>
        </div>
      </div>
      <!-- End: 分页信息 -->
  </div>
</template>

<script>
  import { globalMixins } from '../../../../mixins'
  import Select from '../../../../components/Select'
  import AreaSelect from '../../../../components/AreaSelect'
  import SearchBox from '../../../../components/SearchBox'
  import Pager from '../../../../components/Pager'
  import DateRangePicker from '../../../../components/DateRangePicker'

  export default {
    name: 'OrderList',

    layout: 'admin',

    mixins: [globalMixins],

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
        statusOptions: [{
          label: '全部',
          value: 0
        }, {
          label: '已接单',
          value: 1
        }, {
          label: '处理中',
          value: 2
        }, {
          label: '处理失败',
          value: 3
        }, {
          label: '完成',
          value: 4
        }],
        workOrders: [
        {id: 'gx12345678', clientName: '王大锤', productName: '电饭锅', productModel: 'ox1234', createDate: '2014-8-9', status: '未过期'},
        {id: 'gx12345678', clientName: '王大锤', productName: '电饭锅', productModel: 'ox1234', createDate: '2014-8-9', status: '未过期'},
        {id: 'gx12345678', clientName: '王大锤', productName: '电饭锅', productModel: 'ox1234', createDate: '2014-8-9', status: '已过期'},
        {id: 'gx12345678', clientName: '王大锤', productName: '电饭锅', productModel: 'ox1234', createDate: '2014-8-9', status: '已过期'},
        {id: 'gx12345678', clientName: '王大锤', productName: '电饭锅', productModel: 'ox1234', createDate: '2014-8-9', status: '已过期'}]
      }
    },

    methods: {
    },

    components: {
      'v-select': Select,
      'area-select': AreaSelect,
      'search-box': SearchBox,
      'pager': Pager,
      'date-range-picker': DateRangePicker
    }
  }
</script>

<style lang="stylus">
  @import '../../../../assets/stylus/common'
</style>
