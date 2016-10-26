<template>
  <div class="panel device-users">
    <div class="panel-bd row">
      <x-table :headers="headers" :tables="tables" :page="page" :loading="loadingData"></x-table>
      <div class="actions clearfix mt10">
        <button class="btn btn-primary fr hidden">解除绑定</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
import { globalMixins } from 'src/mixins'
import Table from 'components/Table'
import formatDate from 'filters/format-date'
import _ from 'lodash'

export default {
  name: 'Users',

  mixins: [globalMixins],

  components: {
    'x-table': Table
  },

  data () {
    return {
      query: '',
      total: 0,
      currentPage: 1,
      countPerPage: 10,
      loadingData: false,
      users: [],
      // 设备绑定的用户列表
      deviceUsers: [],
      // 设备绑定的用户信息
      usersInfo: [
        // {
        //   'id': '1605923406',
        //   'nickname': '昵称',
        //   'email': '邮箱',
        //   'phone': '手机'
        // }
      ],
      // 设备绑定的用户在线情况
      usersOnline: [
        // {
        //   'user_id': '1999245132',
        //   'online': true,
        //   'last_login': '2015-10-09T08:15:40.843Z'
        // }
      ],
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
          key: 'lastLogin',
          title: '最后一次登录时间'
        },
        {
          key: 'online',
          title: '在线状态'
        }
      ]
    }
  },

  computed: {
    tables () {
      var result = []
      _.forEach(this.deviceUsers, (item) => {
        var user = {
          id: item.user_id,
          role: item.role,
          nickname: this.conputedNickname(item),
          email: this.conputedEmail(item.user_id),
          phone: this.conputedPhone(item.user_id),
          lastLogin: this.conputedLastLogin(item.user_id),
          online: this.conputedOnline(item.user_id),
          prototype: item
        }
        result.push(user)
      })
      result.sort((a, b) => {
        return a.role - b.role
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
    /**
     * 计算当前用户的昵称
     * @param  {[type]} user [description]
     * @return {[type]}      [description]
     */
    conputedNickname (user) {
      var result = '-'
      this.usersInfo.map((item) => {
        let nickname = item.nickname || '-'
        if (user.user_id - 0 === item.id - 0) {
          if (!user.role) {
            result = '<span><i class="fa fa-user"></i> ' + nickname + '</span>'
          } else {
            result = '<span>' + nickname + '</span>'
          }
        }
      })
      return result
    },
    /**
     * 计算邮箱
     * @param  {[type]} id [description]
     * @return {[type]}      [description]
     */
    conputedEmail (id) {
      var result = ''
      this.usersInfo.map((user) => {
        if (id - 0 === user.id - 0) {
          result = user.email || '-'
        }
      })
      return result
    },
    /**
     * 计算手机
     * @param  {[type]} id [description]
     * @return {[type]}      [description]
     */
    conputedPhone (id) {
      var result = ''
      this.usersInfo.map((user) => {
        if (id - 0 === user.id - 0) {
          result = user.phone || '-'
        }
      })
      return result
    },
    /**
     * 计算最后一次登录时间
     * @param  {[type]} id [description]
     * @return {[type]}      [description]
     */
    conputedLastLogin (id) {
      var result = ''
      this.usersOnline.map((user) => {
        if (id - 0 === user.user_id - 0) {
          if (user.last_online) {
            result = formatDate(user.last_online)
          } else {
            result = '-'
          }
        }
      })
      return result
    },
    /**
     * 计算在线状态
     * @param  {[type]} id [description]
     * @return {[type]}      [description]
     */
    conputedOnline (id) {
      var result = ''
      this.usersOnline.map((user) => {
        if (id - 0 === user.user_id - 0) {
          if (user.online) {
            result = '<span class="online-green">在线</span>'
          } else {
            result = '离线'
          }
        }
      })
      return result
    },
    /**
     * 跳转到详情页
     * @param  {[type]} table [description]
     * @return {[type]}       [description]
     */
    linkToDetails (table) {
      this.$route.router.go('/operation/user/' + table.prototype.id)
    },
    // 获取用户
    getUsers () {
      this.loadingData = true
      var { 'device_id': deviceId, 'product_id': productId } = this.$route.params
      api.product.getUsers(productId, deviceId).then((res) => {
        // 虚拟数据用于调试，请勿删除
        // 虚拟数据开始
        // res.data.list = [
        //   {
        //     'user_id': '1605923406',
        //     'role': 1, // 角色权限
        //     'from_id': '123', // 来源用户ID
        //     'create_date': '2015-10-09T08:15:40.843Z' // 订阅时间，例2015-10-09T08:15:40.843Z
        //   },
        //   {
        //     'user_id': '1999245132',
        //     'role': 0, // 角色权限
        //     'from_id': '123', // 来源用户ID
        //     'create_date': '2015-10-09T08:15:40.843Z' // 订阅时间，例2015-10-09T08:15:40.843Z
        //   }
        // ]
        // 虚拟数据结束

        // 根据获取回来的id去获取用户详情
        this.deviceUsers = res.data.list
        if (this.deviceUsers.length) {
          this.getUsersInfo()
          this.deviceUsers.map((item) => {
            this.getOnlineType(item)
          })
        } else {
          this.loadingData = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    /**
     * 获取用户详细信息
     * @return {[type]} [description]
     */
    getUsersInfo () {
      var idArr = []
      this.deviceUsers.map((item) => {
        idArr.push(item.user_id)
      })
      var params = {
        filter: ['id', 'nickname', 'email', 'phone'],
        query: {
          'id': {'$in': idArr}
        }
      }
      api.user.list(params).then((res) => {
        this.usersInfo = res.data.list
        this.loadingData = false
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 获取用户在线状态
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
    getOnlineType (user) {
      var userId = user.user_id
      api.user.getUserSession(userId).then((res) => {
        var obj = {
          user_id: res.data.user_id,
          online: Boolean(res.data.online),
          online_time: res.data.online_time,
          last_online: res.data.last_online
        }
        this.usersOnline.push(obj)
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus">

  .device-users
    span.online-green
      color #33CC00
</style>
