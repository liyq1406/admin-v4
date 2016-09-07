<template>
  <div class="panel no-split-line">
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>工单编号</th>
              <th>提交日期</th>
              <th>最后处理</th>
              <th>维保类型</th>
              <th>处理状态</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="workOrders.length > 0">
              <tr v-for="order in workOrders">
                <td><a v-link="{path: '/plugins/warranty/' + $route.params.app_id + '/work-orders/extended-warranties/' + order._id}" class="hl-red">{{order._id}}</a></td>
                <td>{{order.create_time}}</td>
                <td>{{order.handle_time}}</td>
                <td>{{typeText(order.type)}}</td>
                <td>{{statusText(order.status)}}</td>
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
  // import api from 'api'
  // import dateFormat from 'date-format'

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
          // {
          //   _id: '45a6dsa5sd46a',
          //   create_time: '2016-1-1 19:21:32',
          //   handle_time: '2016-1-1 19:21:32',
          //   type: 0,
          //   status: 0
          // },
          // {
          //   _id: '45a6dsa5sd46a',
          //   create_time: '2016-1-1 19:21:32',
          //   handle_time: '2016-1-1 19:21:32',
          //   type: 0,
          //   status: 0
          // }
        ]
      }
    },

    ready () {
      // this.getIssues()
    },

    methods: {
      typeText (index) {
        return (['延保工单', '维修工单'])[index]
      },

      statusText (index) {
        return (['待处理', '已维修', '已延保'])[index]
      }

    }
  }
</script>
