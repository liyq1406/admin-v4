<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <div class="filter-bar">
          <div class="filter-group fr">
            <search-box class="work-order-search-box" :key.sync="key" :placeholder="'请输入工单编号'" @press-enter="getWarrantyList(true)">
              <button slot="search-button" class="btn btn-primary" @click="getWarrantyList(true)"><i class="fa fa-search"></i></button>
            </search-box>
          </div>
          <div class="filter-group">
            <div class="filter-group-item">
              <v-select :label="statusOptions[status.value].label" width="100px" class="work-orders-select" size="small">
                <span slot="label">工单状态</span>
                <select v-model="status" @change="getWarrantyList(true)">
                  <option v-for="option in statusOptions" :value="option">{{option.label}}</option>
                  <p> {{status}}</p>
                </select>
              </v-select>
            </div>
            <!-- <div class="filter-group-item">
              <area-select :province.sync="curProvince" :city.sync="curCity" :district.sync="curDistrict" label="所在地区" select-size="small" @province-change="getWarrantyList(true)" @city-change="getWarrantyList(true)" @district-change="getWarrantyList(true)"></area-select>
            </div> -->
          </div>
        </div>
        <c-table :headers="headers" :tables="tables"></c-table>
      </div>
    </div>
  </div>
</template>

<script>
  import SearchBox from 'components/SearchBox'
  import AreaSelect from 'components/AreaSelect'
  import Select from 'components/Select'
  import Table from 'components/Table'
  import { formatDate } from 'src/filters'

  export default {
    components: {
      'v-select': Select,
      'c-table': Table,
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
          // {
          //   id: '45a6dsa5sd46a',
          //   name: '王工',
          //   product_name: '空调',
          //   product_type: 'd41a231a45s6',
          //   extended_days: '2016-03-03',
          //   status: 0
          // },
          // {
          //   id: 'sd4f654s5fs23',
          //   name: '张盛志',
          //   product_name: '空气净化器',
          //   product_type: 'a45s6d41a231',
          //   extended_days: '2016-03-03',
          //   status: 0
          // }
        ],
        headers: [
          {
            key: 'id',
            title: '工单编号'
          },
          {
            key: 'extended_days',
            title: '提交日期'
          },
          {
            key: 'last_update',
            title: '最后处理'
          },
          {
            key: 'type',
            title: '维保类型'
          },
          {
            key: 'state',
            title: '处理状态',
            class: 'tac'
          }
        ]
      }
    },

    computed: {
      tables () {
        var result = []
        this.workOrders.map((item) => {
          var device = {
            id: '<a class="hl-red">' + item.id + '</a>',
            extended_days: formatDate(item.extended_days),
            last_update: formatDate(item.last_update),
            type: item.is_online,
            state: item.is_online,
            prototype: item
          }
          result.push(device)
        })
        return result
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
