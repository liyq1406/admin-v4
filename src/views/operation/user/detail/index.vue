<template>
  <div class="main">
    <div class="main-title">
      <h2>用户基本信息</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt15 no-split-line">
      <div class="panel-bd row">
        <div class="col-16">
          <info-card :info="userSummary" :pic="user.avatar"></info-card>
          <div class="account-type-box">
            <!-- <span>{{ user.status-0===1 ? '已启用' : '已停用' }}</span> -->
            <button :disabled="toggling" @click="toggleMember(user)" class="btn btn-ghost btn-sm"><i :class="{'fa-ban': (user.status - 0 === 1), 'fa-play': !(user.status - 0 === 1)}" class="fa"></i>{{ user.status-0===1 ? ' 停用帐号' : ' 启用帐号' }}</button>
          </div>
          <div v-stretch="182">
            <info-list :info="userInfo"></info-list>
          </div>
        </div>
        <div class="col-8 with-loading">
          <div class="position-map">
            <x-map :addr="user.city" :zoom="10"></x-map>
          </div>
          <div class="position-msg">
            <span> {{ user.city }} </span>
          </div>
        </div>
      </div>
    </div>
    <tab :nav="secondaryNav"></tab>
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
    <!-- <div class="panel">
      <div class="panel-hd panel-hd-full">
        <h2>账号状态</h2>
      </div>

    </div> -->
  </div>
</template>

<script>
  import api from 'api'
  import { globalMixins } from 'src/mixins'
  import Breadcrumb from 'components/Breadcrumb'
  import InfoCard from 'components/InfoCard'
  import InfoList from 'components/InfoList'
  import { formatDate } from 'src/filters'
  import Tab from 'components/Tab'
  import Map from 'components/Map'

  export default {
    name: 'UserDetails',

    mixins: [globalMixins],

    components: {
      Breadcrumb,
      InfoCard,
      InfoList,
      Tab,
      'x-map': Map
    },

    data () {
      return {
        userSession: {
          'online': 0, // 是否在线，1：在线，0：离线
          'online_time': '' // 上线时间
        },
        user: {
          'id': '',
          'corp_id': '',
          'phone': '',
          'email': '',
          'account': '',
          'nickname': '',
          'create_date': '',
          'status': -1, // 用户状态
          'source': -1, // 用户来源
          'region_id': '', // 所在区域ID
          'is_vaild': '', // 是否已认证
          'avatar': '', // 头像URL
          'country': '', // 国家
          'province': '', // 省份
          'city': '', // 城市
          'gender': -1, // 性别，-1:未知，1：男，2：女
          'age': 0, // 年龄
          'phone_valid': false,
          'email_valid': false
        }, // 用户信息
        breadcrumbNav: [{
          label: '全部',
          link: '/operation/users/list'
        }, {
          label: '用户信息'
        }],
        secondaryNav: []
      }
    },

    computed: {
      /**
       * 用户基本信息
       * @return {[type]} [description]
       */
      userSummary () {
        var result = {
          title: this.user.nickname,
          online: Boolean(this.userSession.online),
          time: formatDate(this.userSession.online_time)
        }
        return result
      },
      /**
       * 用户详情
       * @return {[type]} [description]
       */
      userInfo () {
        var result = {
          status: {
            label: '账号状态',
            value: this.computedVaild(this.user.status)
          },
          create_date: {
            label: '创建时间',
            value: formatDate(this.user.create_date) || '-'
          },
          email: {
            label: '邮箱',
            value: this.user.email || '-'
          },
          phone: {
            label: '手机',
            value: this.user.phone || '-'
          },
          age: {
            label: '年龄',
            value: this.user.age >= 0 ? this.user.age : '-'
          },
          gender: {
            label: '性别',
            value: this.computedGender(this.user.gender)
          },
          area: {
            label: '所在区域',
            value: this.user.province + this.user.city || '-'
          },
          address: {
            label: '详细地址',
            value: this.user.address || '-'
          },
          id: {
            label: 'ID',
            value: this.user.id
          }
        }
        return result
      }
    },
    route: {
      data () {
        // 定义路由
        this.route()
        // 获取用户信息
        this.getUserInfo()
        // 获取用户会话状态
        this.getOnlineType(this.$route.params.id)
      }
    },

    methods: {
      /**
       * 获取用户在线状态
       * @param  {[type]} userId [description]
       * @return {[type]}        [description]
       */
      getOnlineType (userId) {
        api.user.getUserSession(userId).then((res) => {
          this.userSession.online = res.data.online
        }).catch((res) => {
          this.handleError(res)
        })
      },
      /**
       * 定义子路由
       * @return {[type]} [description]
       */
      route () {
        var deviceDetailRoot = `/operation/users/details/${this.$route.params.id}`
        this.secondaryNav = [{
          label: '设备列表',
          link: { path: `${deviceDetailRoot}/devices` }
        }, {
          label: '维保信息',
          link: { path: `${deviceDetailRoot}/warranty` }
        }, {
          label: '反馈记录',
          link: { path: `${deviceDetailRoot}/issues` }
        }]
      },
      /**
       * 解析性别
       * 国辉
       * @param  {[type]} gender [description]
       * @return {[type]}        [description]
       */
      computedGender (gender) {
        var result = {
          '-1': '-',
          '1': '男',
          '2': '女'
        }
        return result[gender]
      },
      /**
       * 解析用户状态
       * 国辉
       * @param  {[type]} status [description]
       * @return {[type]}        [description]
       */
      computedVaild () {
        var result = '-'
        let status = this.user.status
        let is_vaild = this.user.is_vaild
        var str1 = is_vaild ? '已激活' : '未激活'
        var str2 = ''
        if (status === 1) {
          str2 = '已启用'
        } else if (status === 2) {
          str2 = '已停用'
        }
        result = str1 + ' ' + str2
        return result
      },
      getUserInfo () {
        api.user.profile(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            for (var key in res.data) {
              if (res.data.hasOwnProperty(key)) {
                this.user[key] = res.data[key]
              }
            }
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      deleteUser () {
        if (window.confirm('确定要停用当前用户吗？')) {
          api.user.banMember(this.user.id).then((res) => {
            if (res.status === 200) {
              console.log('已停用用户')
            }
          }).catch((res) => {
            this.handleError(res)
          })
        }
      },

      // 新版切换状态
      toggleMember (user) {
        if (!this.toggling) {
          this.toggling = true
          if (user.status - 0 === 1) {
            if (window.confirm('确认停用该用户吗?')) {
              api.user.toggleMember(user.id, user.status - 0 === 1 ? 2 : 1).then((res) => {
                // this.getTasks()
                if (res.status === 200) {
                  // user.status = user.status - 0 === 1 ? 2 : 1
                  this.getUserInfo()
                }
                this.toggling = false
              }).catch((res) => {
                this.handleError(res)
                this.toggling = false
              })
            } else {
              this.toggling = false
              return
            }
          } else {
            api.user.toggleMember(user.id, user.status - 0 === 1 ? 2 : 1).then((res) => {
              // this.getTasks()
              if (res.status === 200) {
                // user.status = user.status - 0 === 1 ? 2 : 1
                this.getUserInfo()
              }
              this.toggling = false
            }).catch((res) => {
              this.handleError(res)
              this.toggling = false
            })
          }
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .position-map
    width 100%
    height 300px
    padding 10px 10px 0
    box-sizing border-box
  .position-msg
    padding-left 10px
    padding-top 5px
  .account-type-box
    position absolute
    right 10px
    top 30px
    .fa-ban
      color #c0252e
    .fa-play
      color #090
    .btn-ghost
      border-radius 2px
</style>
