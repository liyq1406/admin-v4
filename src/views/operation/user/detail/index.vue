<template>
  <div class="main">
    <div class="main-title">
      <h2>{{ $t('operation.user.details.main_title') }}</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt15 no-split-line">
      <div class="panel-bd row">
        <div class="col-16">
          <info-card :info="userSummary" :pic="user.avatar">
            <h3>{{ user.nickname }} <a href="#" @click.prevent="editUser" class="fa fa-edit"></a></h3>
            <div class="desc">
              <span :class="{'on-line':userSummary.online, 'off-line':!userSummary.online}" v-text="userSummary.online ? $t('common.online') : $t('common.offline')"></span><span>{{ userSummary.time }}</span>
            </div>
          </info-card>
          <div class="account-type-box">
            <!-- <span>{{ user.status-0===1 ? '已启用' : '已停用' }}</span> -->
            <button :disabled="toggling" @click="toggleMember(user)" class="btn btn-ghost btn-sm"><i :class="{'fa-ban': (user.status - 0 === 1), 'fa-play': !(user.status - 0 === 1)}" class="fa"></i>{{ user.status-0===1 ? $t('operation.user.details.disable_account') : $t('operation.user.details.enable_account') }}</button>
          </div>
          <div v-stretch="182">
            <info-list :info="userInfo"></info-list>
          </div>
        </div>
        <div class="col-8 with-loading">
          <div class="ml30">
            <div class="position-map">
              <x-map :addr="userLocation" :zoom="10"></x-map>
            </div>
            <div class="position-msg">
              <span>{{ userLocation }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <tab :nav="secondaryNav"></tab>
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
    <!-- <div class="panel">
      <div class="panel-hd panel-hd-full">
        <h2>帐号状态</h2>
      </div>

    </div> -->
  </div>
</template>

<script>
  import api from 'api'
  import formatDate from 'filters/format-date'
  import locationParser from 'utils/location-parser'

  export default {
    name: 'UserDetails',
    components: {
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
          label: this.$t('common.all'),
          link: '/operation/users/list'
        }, {
          label: this.$t('operation.user.details.curr')
        }],
        secondaryNav: [],
        userLocation: ''
      }
    },

    computed: {
      // /**
      //  * 用户地址
      //  */
      // userLocation () {
      //   console.log(locationParser)
      //   console.log(this.lang)
      //   // if (this.user) return
      //   let { country, province, city } = this.user
      //   locationParser.parse(country, province, city, '', this.lang).then(data => {
      //
      //   })
      //   // parseLocation().then(data => {
      //   //   console.log(data)
      //   // })
      // },

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
            label: this.$t('operation.user.details.status'),
            value: this.user.is_vaild ? this.$t('operation.user.details.activated') : this.$t('operation.user.details.not_activated')
          },
          create_date: {
            label: this.$t('operation.user.details.create_date'),
            value: formatDate(this.user.create_date) || '-'
          },
          email: {
            label: this.$t('common.email'),
            value: this.user.email || '-'
          },
          phone: {
            label: this.$t('common.phone'),
            value: this.user.phone || '-'
          },
          age: {
            label: this.$t('common.age'),
            value: this.user.age >= 0 ? this.user.age : '-'
          },
          gender: {
            label: this.$t('common.gender'),
            value: this.computedGender(this.user.gender)
          },
          area: {
            label: this.$t('operation.user.details.area'),
            value: this.userLocation || '-'
          },
          address: {
            label: this.$t('operation.user.details.address'),
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
       * 编辑用户
       */
      editUser () {
        this.$route.router.go({path: `/operation/users/${this.$route.params.id}/edit`})
      },

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
          label: this.$t('operation.user.details.nav.devices'),
          link: { path: `${deviceDetailRoot}/devices` }
        }, {
          label: this.$t('operation.user.details.nav.warranty'),
          link: { path: `${deviceDetailRoot}/warranty` }
        }, {
          label: this.$t('operation.user.details.nav.issues'),
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
          '1': this.$t('operation.user.details.male'),
          '2': this.$t('operation.user.details.female')
        }
        return result[gender]
      },

      getUserInfo () {
        api.user.profile(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            for (var key in res.data) {
              if (res.data.hasOwnProperty(key)) {
                this.user[key] = res.data[key]
              }
            }
            let { country, province, city } = this.user
            locationParser.parse(country || '', province || '', city || '', '', this.lang).then(data => {
              let loc = _.compact([data.country, data.state, data.city])
              if (this.lang === 'en-us') {
                loc = loc.reverse().join(', ')
              } else {
                loc = loc.join(' ')
              }
              this.userLocation = loc
            })
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      deleteUser () {
        if (window.confirm(this.$t('operation.user.details.confirm_info'))) {
          api.user.banMember(this.user.id).then((res) => {
            if (res.status === 200) {
              // console.log('已停用用户')
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
            if (window.confirm(this.$t('operation.user.details.confirm_info'))) {
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
    height 240px
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
