<template>
  <div class="panel">
    <div class="panel-bd row">
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <div class="filter-bar">
          <div class="filter-group fr">
            <dropdown :dropdown-width="150">
              <p>aaa</p>
            </dropdown>
          </div>
          <div class="filter-group">
            <div class="filter-group-item">
              <v-select :label="'全部'" width="100px" class="work-orders-select" size="small">
                <span slot="label">显示</span>
                <select v-model="status" @change="">
                  <option :value="0">0</option>
                  <option :value="1">1</option>
                  <p> {{'status'}}</p>
                </select>
              </v-select>
            </div>
          </div>
        </div>
        <c-table :headers="headers" :tables="tables" :page="page" @tbody-nickname="linkToDetails" @page-update=""></c-table>
        <!-- <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>{{ $t('ui.user.fields.nick_name') }}</th>
              <th>{{ $t('ui.user.fields.account') }}</th>
              <th>电话</th>
              <th>用户ID</th>
              <th>设备权限</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="users.length > 0">
              <tr v-for="user in users">
                <td><a v-link="{path: '/operation/user/'+user.id}" class="hl-red">{{ user.nickname }}</a></td>
                <td>{{ user.account }}</td>
                <td>{{ user.phone }}</td>
                <td>{{ user.id }}</td>
                <td>管理员</td>
              </tr>
            </template>
            <tr v-if="total === 0 && !loadingData">
              <td colspan="6" class="tac">
                <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table> -->
      </div>
    </div>
  </div>
</template>

<script>
// import v-form from 'vue'
import api from 'api'
import { globalMixins } from 'src/mixins'
import Select from 'components/Select'
import SearchBox from 'components/SearchBox'
import Dropdown from 'components/Dropdown'
import Table from 'components/Table'

export default {
  name: 'Users',

  mixins: [globalMixins],

  components: {
    'c-table': Table,
    'v-select': Select,
    SearchBox,
    Dropdown
  },

  data () {
    return {
      query: '',
      total: 0,
      currentPage: 1,
      countPerPage: 10,
      users: [],
      headers: [
        {
          key: 'nickname',
          title: '昵称'
        },
        {
          key: 'email',
          title: '邮箱'
        },
        {
          key: 'phone',
          title: '电话'
        },
        {
          key: 'id',
          title: '用户ID'
        },
        {
          key: 'valid',
          title: '设备限权'
        }
      ]
    }
  },

  computed: {
    tables () {
      var result = []
      this.users.map((item) => {
        var user = {
          id: item.id,
          nickname: '<a class="hl-red"><i class="fa fa-user"></i> ' + item.nickname + '</a>',
          email: item.email,
          phone: item.phone,
          valid: item.valid,
          prototype: item
        }
        result.push(user)
      })
      return result
    },
    page () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },
    queryCondition () {
      var condition = {
        filter: ['id', 'account', 'nickname', 'create_date', 'source', 'status', 'phone_valid', 'email_valid'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {'create_date': 'desc'},
        query: {}
      }

      if (this.query.length > 0) {
        condition.query['account'] = { $like: this.query }
      }

      return condition
    }
  },

  route: {
    data () {
      // this.getDatapointValues()
      // this.getDeviceInfo()
      // this.getDatapoints()
      this.getUsers()
    }
  },

  methods: {
    linkToDetails (table) {
      this.$route.router.go('/operation/user/' + table.prototype.id)
    },
    // 获取用户
    getUsers () {
      this.loadingData = true
      if (this.debug) {
        this.users = [
          {
            id: 123,
            nickname: '昵称1',
            email: '123@132.com',
            phone: '13800138000',
            valid: -1
          },
          {
            id: 123,
            nickname: '昵称2',
            email: '123@132.com',
            phone: '13800138000',
            valid: -1
          }
        ]
      }
      api.user.list(this.queryCondition).then((res) => {
        if (res.status === 200) {
          // this.users = res.data.list
          this.total = res.data.count
          this.loadingData = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    }
  }
}
</script>

<style lang="stylus">
  @import '../../../../assets/stylus/common'

  ul.device-details
    margin 20px 0

    li
      list-style none
      line-height 32px

      .label
        display inline-block
        width 103px

      .info
        display inline-block

  .output-log
    display block
    height 360px
    overflow auto
    font-size 12px

    .log
      margin 10px 0

    .time
      margin-right 10px
      color #999

    .user
      color orange

    .msg
      color #333

    .msg-error
      color red

    .msg-success
      color green
  .device-details
    .editModal1
      .content-box
        padding-bottom 30px
        .content-value
          padding-bottom 10px
          .deviceParams
            height 30px
            font-size 14px
    .editModal2
    .editModal3
      .content-box
        .content-value
          padding-bottom 10px
          .paramsValue
            height 32px
            width 100%
            line-height 32px
            background none
            border 1px solid default-border-color
            box-sizing border-box
            font-size 14px
            padding 0 15px
</style>
