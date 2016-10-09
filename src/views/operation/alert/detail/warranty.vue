<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <div class="filter-bar">
          <div class="filter-group fr">
            <div class="filter-group-item">
              <search-box class="work-order-search-box" :key.sync="key" :placeholder="'请输入工单编号'" @press-enter="getWarrantyList(true)">
                <button slot="search-button" class="btn" @click="getWarrantyList(true)"><i class="fa fa-search"></i></button>
              </search-box>
            </div>
          </div>
          <div class="filter-group">
            <div class="filter-group-item">
              <x-select :label="statusOptions[status.value].label" width="100px" class="work-orders-select" size="small">
                <span slot="label">工单状态</span>
                <select v-model="status" @change="getWarrantyList(true)">
                  <option v-for="option in statusOptions" :value="option">{{option.label}}</option>
                  <p> {{status}}</p>
                </select>
              </x-select>
            </div>
            <div class="filter-group-item">
              <area-select :province.sync="curProvince" :city.sync="curCity" :district.sync="curDistrict" label="所在地区" select-size="small" @province-change="getWarrantyList(true)" @city-change="getWarrantyList(true)" @district-change="getWarrantyList(true)"></area-select>
            </div>
          </div>
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
              <tr v-for="order in workOrders">
                <td>{{order._id}}</td>
                <td>{{order.name}}</td>
                <td>{{order.product_name}}</td>
                <td>{{order.product_type}}</td>
                <td>{{order.extended_days | formatDate 'yyyy-MM-dd' true}}</td>
                <td>
                  <div v-if="order.status === 0">已过期</div>
                  <div v-else class='hl-green'>未过期</div>
                </td>
                <td><a v-link="{path: '/plugins/warranty/' + $route.params.app_id + '/work-orders/extended-warranties/' + order._id}" class="hl-red">查看详情</a></td>
              </tr>
            </template>
            <tr v-if="workOrders.length === 0 && !loadingData">
              <td colspan="7" class="tac">
                <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import SearchBox from 'components/SearchBox'
  import AreaSelect from 'components/AreaSelect'
  import Select from 'components/Select'

  export default {
    components: {
      'x-select': Select,
      'area-select': AreaSelect,
      'search-box': SearchBox
    },

    data () {
      return {
        key: '',
        status: {
          label: '全部',
          value: 0
        },
        statusOptions: [
          {
            label: '全部',
            value: 0
          }, {
            label: '未到期',
            value: 1
          }, {
            label: '已到期',
            value: 2}
        ],
        loadingData: false,
        workOrders: [
          {
            _id: '45a6dsa5sd46a',
            name: '王工',
            product_name: '空调',
            product_type: 'd41a231a45s6',
            extended_days: '2016-03-03',
            status: 0
          },
          {
            _id: 'sd4f654s5fs23',
            name: '张盛志',
            product_name: '空气净化器',
            product_type: 'a45s6d41a231',
            extended_days: '2016-03-03',
            status: 0
          }
        ]
      }
    },
    ready () {
      setTimeout(() => {
        this.loadingData = false
      }, 2000)
    },
    methods: {
      getWarrantyList () {
        console.log('搜索')
      }
    }
  }
</script>
