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
                <td>{{issue.create_time | formatDate }}</td>
                <td>{{issue.handle_time | formatDate }}</td>
                <td>{{issue.label}}</td>
                <td><span v-if="issue.status === 0">未处理</span><span v-else>已处理</span></td>
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
import api from 'api'
import * as config from 'consts/config'

export default {
  components: {
    'x-select': Select,
    'area-select': AreaSelect,
    'search-box': SearchBox
  },

  data () {
    return {
      key: '',
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
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
        // {
        //   _id: '123fafdfew',
        //   content: '鞋很漂亮，鞋底很软弹，有通气孔走路能觉得到风，够舒服够透气下次我还买',
        //   create_time: '2016-1-1 19:21:32',
        //   handle_time: '2016-1-1 19:21:32',
        //   type: 0,
        //   status: 0
        // },
        // {
        //   _id: '123fafdfew',
        //   content: '鞋很漂亮，鞋底很软弹，有通气孔走路能觉得到风，够舒服够透气下次我还买',
        //   create_time: '2016-1-1 19:21:32',
        //   handle_time: '2016-1-1 19:21:32',
        //   type: 0,
        //   status: 0
        // }
      ]
    }
  },

  vuex: {
    getters: {
      plugins: ({ plugins }) => plugins.all
    }
  },

  watch: {
    plugins () {
      if (this.plugins.length > 0) {
        var appId
        this.plugins.forEach((item) => {
          if (item.name === '用户反馈') {
            appId = item.id
          }
        })
        this.getIssues(appId)
      }
    }
  },

  ready () {
    // REVIEW 路由切换到消息列表，页面就退出到登录页 插件接口显示token失效 #guohao
    if (this.plugins.length > 0) {
      var appId
      this.plugins.forEach((item) => {
        if (item.name === '用户反馈') {
          appId = item.id
        }
      })
      this.getIssues(appId)
    }
  },

  methods: {
    // typeText (index) {
    //   return (['延保工单', '维修工单'])[index]
    // },
    //
    // statusText (index) {
    //   return (['待处理', '已维修', '已延保'])[index]
    // },
    // 获取问题列表
    getIssues (appId) {
      console.log(111)
      this.loadingData = true
      var params = {
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        query: {
          user_id: {
            $in: [this.$route.params.id]
          }
        }
      }
      // 传对应appId
      // var appId = '2e07d2af20918e00'
      api.helpdesk.getFeedbackList(appId, params).then((res) => {
        if (res.status === 200 && res.data.list.length > 0) {
          this.total = res.data.count
          this.issues = res.data.list
        } else {
          this.issues = []
          this.total = 0
        }
        this.loadingData = false
      }).catch((err) => {
        this.handleError(err)
        this.loadingData = false
      })
    }
  }
}
</script>
