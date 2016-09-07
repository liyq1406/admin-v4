<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>反馈信息</th>
              <th class="w150">提交日期</th>
              <th class="w150">最后处理</th>
              <th class="w60">问题类型</th>
              <th class="w60">处理状态</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="issues.length > 0">
              <tr v-for="issue in issues">
                <td><a v-link="{path: '/plugins/warranty/' + $route.params.app_id + '/work-orders/extended-warranties/' + issue._id}" class="hl-red">{{issue.content}}</a></td>
                <td>{{issue.create_time}}</td>
                <td>{{issue.handle_time}}</td>
                <td>{{typeText(issue.type)}}</td>
                <td>{{statusText(issue.status)}}</td>
              </tr>
            </template>
            <tr v-if="issues.length === 0 && !loadingData">
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
        issues: [
          {
            _id: '123fafdfew',
            content: '鞋很漂亮，鞋底很软弹，有通气孔走路能觉得到风，够舒服够透气下次我还买',
            create_time: '2016-1-1 19:21:32',
            handle_time: '2016-1-1 19:21:32',
            type: 0,
            status: 0
          },
          {
            _id: '123fafdfew',
            content: '鞋很漂亮，鞋底很软弹，有通气孔走路能觉得到风，够舒服够透气下次我还买',
            create_time: '2016-1-1 19:21:32',
            handle_time: '2016-1-1 19:21:32',
            type: 0,
            status: 0
          }
        ]
      }
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
