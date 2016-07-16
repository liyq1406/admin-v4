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
          <!-- <div class="filter-group">
            <v-select width="90px" size="small" :label="visibility.label">
              <span slot="label">{{ $t('common.display') }}：</span>
              <select v-model="visibility" @change="getDevices(true)">
                <option v-for="option in visibilityOptions" :value="option">{{ option.label }}</option>
              </select>
            </v-select>
          </div> -->
        </div>
        <table class="table table-stripe table-bordered">
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
        </table>
      </div>
      <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getUsers"></pager>
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

export default {
  name: 'Users',

  mixins: [globalMixins],

  components: {
    'v-select': Select,
    SearchBox,
    Dropdown
  },

  data () {
    return {
      users: []
    }
  },

  route: {
    data () {
      // this.getDatapointValues()
      // this.getDeviceInfo()
      // this.getDatapoints()
    }
  },

  computed: {
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

  methods: {
    // 获取用户
    getUsers () {
      this.loadingData = true
      api.user.list(this.queryCondition).then((res) => {
        if (res.status === 200) {
          this.users = res.data.list
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
