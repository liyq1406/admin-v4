<template>
  <header class="header the-header" transition="header" transition-mode="out-in">
    <a v-link="{ path: '/dashboard' }" class="logo" :style="logo?'background-image: url('+logo+')': ''"></a>
    <!-- Start: 主导航 -->
    <nav class="nav-header">
      <!-- <pre>{{mainNav | json}}</pre> -->
      <ul>
        <li><a v-link="{path: '/dev'}"><span class="link-text">{{ $t('layout.main_nav.dev.label') }}</span></a></li>
        <li><a v-link="{path: '/operation'}"><span class="link-text">{{ $t('layout.main_nav.operation.label') }}</span></a></li>
      </ul>
    </nav>
    <!-- End: 主导航 -->

    <!-- Start: 用户导航 -->
    <div @mouseover="isShowUserNav = true" @mouseout="isShowUserNav = false" class="user-nav">
      <!-- DEMO环境成员默认为已认证 -->
      <span class="user-name" v-if="isDemo"><i class="badge badge-authorized">{{ $t('layout.levels.authorized') }}</i>{{ currentMember.name }}</span>
      <!-- 正式环境成员认证状态动态读取 -->
      <span class="user-name" v-else>{{ currentMember.name }}<i class="badge" :class="{'badge-authorized': corp.status===1, 'badge-vip': corp.status===2}" v-show="corp.status>=0">{{ levelLabel }}</i></span>
      <i class="arrow-down"></i>
      <div @mouseover="isShowUserNav = true" @mouseout="isShowUserNav = false" v-show="isShowUserNav" class="sec-nav">
        <div class="user-info">
          <div class="user">{{ currentMember.name }}</div>
          <div class="email">{{ currentMember.email }}</div>
        </div>
        <ul>
          <li class="sec-nav-item">
            <a v-link="{path: '/account/info'}"><i class="fa fa-user"></i>{{ $t("layout.account_menu.account") }}</a>
          </li>
          <li class="sec-nav-item" v-if="currentMember.role && currentMember.role===1">
            <a v-link="{path: '/account/members'}"><i class="fa fa-users"></i>{{ $t("layout.account_menu.members") }}</a>
          </li>
          <li class="sec-nav-item" v-if="currentMember.role && currentMember.role===1">
            <a v-link="{path: '/account/authorize'}"><i class="fa fa-expeditedssl"></i>{{ $t("layout.account_menu.authorize") }}</a>
          </li>
          <li class="sec-nav-item" v-if="currentMember.role && currentMember.role===1">
            <a v-link="{path: '/account/security'}"><i class="fa fa-shield"></i>{{ $t("layout.account_menu.security") }}</a>
          </li>
          <li class="sec-nav-item">
            <a v-link="{path: '/account/corp'}"><i class="fa fa-newspaper-o"></i>{{ $t("layout.account_menu.corp") }}</a>
          </li>
          <li class="sec-nav-item">
            <a href="#" @click.prevent="quit"><i class="fa fa-sign-out"></i>{{ $t("layout.account_menu.quit") }}</a>
          </li>
        </ul>
      </div>
    </div>
    <!-- End: 用户导航 -->

    <!-- Start: 次导航 -->
    <div class="extra-nav">
      <ul>
        <li class="link-demo">
          <a href="http://ap.xlink.cn/#!/auto-login" target="_blank" v-if="!isDemo">{{ $t('layout.view_demo') }}</a>
          <div class="authorize-tips" v-if="!isDemo" v-show="isShowTips">
            <div class="cont">
              <p>{{ $t('layout.demo_tips') }}</p>
              <p>{{{ $t('layout.service_tips') }}}<a class="hl-orange" @click.prevent="removeAlertForever">{{ $t('layout.display_no_more') }}</a></p>
            </div>
            <div class="demo-text">{{ $t('layout.view_demo') }}</div>
            <i class="fa fa-times-circle" @click="removeAlertMask"></i>
          </div>
        </li>
      </ul>
    </div>
    <!-- End: 主导航 -->
  </header>
</template>

<script>
import { IS_DEMO } from 'consts/config'
import { showAlertMask, removeAlertMask } from 'store/actions/system'
import { globalMixins } from 'src/mixins'

export default {
  name: 'Topbar',

  mixins: [globalMixins],

  vuex: {
    getters: {
      loading: ({ system }) => system.loading,
      isShowMask: ({ system }) => system.isShowMask,
      releasedProducts: ({ products }) => products.released,
      corp: ({ system }) => system.corp,
      currentMember: ({ system }) => system.currentMember
    },
    actions: {
      showAlertMask,
      removeAlertMask
    }
  },

  data () {
    return {
      isDemo: IS_DEMO,
      isShowUserNav: false
    }
  },

  computed: {
    logo () {
      var result = this.corp.logo
      return result
    },

    // 企业等级信息
    levelLabel () {
      return ({
        '0': this.$t('layout.levels.not_authorized'),
        '1': this.$t('layout.levels.authorized'),
        '2': 'VIP'
      })[this.corp.status || 0]
    },

    // 遮罩出现的原因
    reason () {
      let result = ''
      if (this.corp.status === 0) {
        result = this.$t('layout.messages.no_permission')
      }
      return result
    },

    // 路径是否在运营平台
    isPathInOperation () {
      let reg = /^\/operation.*/i
      return reg.test(this.$route.path)
    },

    // 是否不再显示警告遮罩
    isHideMaskForever () {
      return window.localStorage.getItem(`${this.corp.id}hideAlertMask`)
    },

    // 是否显示遮罩提示
    isShowTips () {
      return !this.isHideMaskForever && !this.loading && this.isPathInOperation && this.isShowMask && this.reason
    }
  },

  attached () {
    this.init()
  },

  watch: {
    reason () {
      this.init()
    },

    isPathInOperation () {
      this.init()
    }
  },

  methods: {
    /**
     * 初始化
     */
    init () {
      if (this.isPathInOperation) {
        if (!this.loading && this.reason) {
          this.showAlertMask()
        } else {
          this.removeAlertMask()
        }
      }
    },

    /**
     * 进入运营平台
     */
    enterOperation () {
      if (this.corp.status === 0) {
        window.open('http://ap.xlink.cn/#!/auto-login')
      } else {
        this.$route.router.go('/operation/overview')
      }
    },

    /**
     * 不再显示警告
     */
    removeAlertForever () {
      window.localStorage.setItem(`${this.corp.id}hideAlertMask`, true)
      this.removeAlertMask()
    },

    /**
     * 退出登录
     * 移除保存在 window.localStorage中的 accessToken
     */
    quit () {
      let temp = window.localStorage.getItem(`${this.corp.id}hideAlertMask`)
      if (temp) {
        window.localStorage.setItem(`${this.corp.id}hideAlertMask`, temp)
      }
      // window.localStorage.clear()
      window.localStorage.removeItem('memberId')
      window.localStorage.removeItem('corpId')
      window.localStorage.removeItem('accessToken')
      window.localStorage.removeItem('refreshToken')
      window.localStorage.removeItem('expireIn')
      window.localStorage.removeItem('expireAt')
      this.showNotice({
        type: 'info',
        content: this.$t('layout.messages.quit')
      })
      this.$route.router.go({path: '/login'})
    }
  }
}
</script>

<style lang="stylus">
@import '../../../assets/stylus/common'

// 头部
.the-header
  absolute left top
  size 100% 54px
  background #FAFAFA
  border-bottom 1px solid #E5E5E5

// Logo
.logo
  float left
  size 200px 55px
  background url("../../../assets/images/logo.png") no-repeat center

// 头部导航
.nav-header
  float left
  margin-left 20px

  ul
    reset-list()
    font-size 0

  li
    display inline-block
    line-height 54px
    margin-right 34px
    font-size 13px

    a
      color #838383
      display inline-block
      line-height 46px
      padding-top 4px
      border-bottom 4px solid transparent

      &:hover
        color #000
        text-decoration none

      &.v-link-active
        border-bottom-color red
        color red

.sec-nav
  width 200px
  text-align left
  background #FFF

  .user-info
    line-height 1.5
    padding 10px 20px

    .user
      font-size 20px

    .email
      font-size 12px

  .sec-nav-item
    margin-right 0
    line-height 24px
    display block
    min-width 50px
    border-bottom 1px solid light-border-color
    font-size 14px

    .fa
      width 24px
      text-align center
      font-size 18px
      margin-right 10px

    & > a
      text-decoration none
      color gray
      display block
      padding 10px 20px

      &:hover
        color #000
        background #F3F3F3
// 次导航
.extra-nav
  position relative
  float right
  height 55px
  line-height 54px
  z-index 1010

  li
    line-height 54px

  .link-demo
    position relative

    .authorize-tips
      absolute right -65px top 68px
      padding 84px 0 0 0
      color #FFF
      width 280px
      line-height 24px
      font-size 14px
      background url('../../../assets/images/indicator.png') no-repeat 100px top

      .demo-text
        absolute right 46px top -66px
        size 100px 50px
        border-radius 100px / 50px
        background-color #FFF
        color gray-dark
        font-size 13px
        line-height 50px
        text-align center

      p
        margin 0

        .link-contact
          color #FFF
          text-decoration underline

        .hl-orange
          margin-left 15px

      .fa
        absolute right -40px top
        color #FFF
        font-size 24px
        cursor pointer

        &:hover
          opacity 1

// 用户导航
.user-nav
  float right
  height 55px
  line-height 54px
  text-align right
  padding 0 20px
  z-index 990
  position relative

  &:after
    absolute left 12px top 50%
    margin-top -9px
    size 1px 18px
    background-color #E5E5E5
    overflow hidden
    content ''

  .user-name
    padding 0 5px
    cursor default
    color #858585
    font-size 14px
    display inline-block
    white-space nowrap

    .badge
      display inline-block
      line-height 17px
      height 17px
      color #FFF
      background-color #CECECE
      padding 0 5px
      border-radius 2px
      font-size 11px
      margin-left 5px

    .badge-authorized
      background-color #56AF2B

    .badge-vip
      background-color #FFBA00

  .arrow-down
    triangle #777 8px down
    absolute right 10px top 28px

  .sec-nav
    absolute top 54px right 5px
    height 0
    opacity 0
    border 1px solid default-border-color
    z-index 1000

    .sec-nav-item
      border-bottom none
      border-top 1px solid light-border-color

    &:before
      absolute right 30px top -19px
      content ""
      triangle #D3D3D3 18px up

    &:after
      absolute right 30px top -18px
      content ""
      triangle #FFF 18px up

  &:hover
    .sec-nav
      height auto
      opacity 1
</style>
