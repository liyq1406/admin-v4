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
              <th>{{ $t('operation.user.details.issues.info') }}</th>
              <th class="w150">{{ $t('operation.user.details.issues.create_time') }}</th>
              <th class="w150">{{ $t('operation.user.details.issues.treated_time') }}</th>
              <th class="w60">{{ $t('operation.user.details.issues.type') }}</th>
              <th class="w60">{{ $t('operation.user.details.issues.status') }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="issues.length > 0">
              <tr v-for="issue in issues">
                <td><a v-link="{path: '/plugins/warranty/' + $route.params.app_id + '/work-orders/extended-warranties/' + issue._id}" class="hl-red">{{issue.content}}</a></td>
                <td>{{issue.create_time | formatDate }}</td>
                <td>{{issue.treated_time | formatDate }}</td>
                <td>{{issue.label}}</td>
                <td><span v-if="issue.status === 0">{{ $t('operation.user.details.issues.unhandled') }}</span><span v-else>{{ $t('operation.user.details.issues.handled') }}</span></td>
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
import api from 'api'
import * as config from 'consts/config'

export default {
  data () {
    return {
      key: '',
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      status: {
        label: this.$t('common.all'),
        value: 0
      },
      statusOptions: [
        {
          label: this.$t('common.all'),
          value: 0
        }, {
          label: this.$t('operation.user.details.not_timeout'),
          value: 1
        }, {
          label: this.$t('operation.user.details.timeout'),
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
          if (item.plugin === 'helpdesk') {
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
        if (item.plugin === 'helpdesk') {
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
      this.loadingData = true

      // 传对应appId
      // var appId = '2e07d2af20918e00'
      var pluginsToken = {}
      if (window.localStorage.pluginsToken) {
        pluginsToken = JSON.parse(window.localStorage.pluginsToken)
      }
      var params1 = {
        'app_id': appId
      }
      api.plugin.getAppToKen(params1).then((res) => {
        let par = {
          appTokenInvalidTime: +new Date() + (1000 * 60 * 60) * 1,
          token: res.data.access_token,
          app_id: res.data.app_id
        }
        // 重置appToken过期时间
        pluginsToken[appId] = par
        window.localStorage.pluginsToken = JSON.stringify(pluginsToken)
        // window.localStorage[appId + 'AppToken'] = JSON.stringify(params)
        var params = {
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          query: {
            user_id: {
              $in: [this.$route.params.id]
            }
          }
        }
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
          this.loadingData = false
          this.handleError(err)
        })
      }).catch((err) => {
        this.handleError(err)
      })
    },
    refreshToken (appId) {

    }
  }
}
</script>
