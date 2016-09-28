<template>
  <header class="header the-header" transition="header" transition-mode="out-in">
    <a v-link="{ path: '/dashboard' }" class="logo" :style="logo?'background-image: url('+logo+')': ''"></a>
    <!-- Start: 主导航 -->
    <nav class="nav-header">
      <!-- <pre>{{mainNav | json}}</pre> -->
      <ul>
        <li v-for="link in mainNav"><a v-link="{path: link.url}"><span class="link-text">{{ $t('ui.main_nav.' + link.alias + '.label') }}</span></a></li>
      </ul>
    </nav>
    <!-- End: 主导航 -->

    <!-- Start: 用户导航 -->
    <div @mouseover="isShowUserNav = true" @mouseout="isShowUserNav = false" class="user-nav">
      <span class="user-name"><i class="badge" :class="{'badge-authorized': corp.status===1, 'badge-vip': corp.status===2}" v-show="corp.status>=0">{{ levelLabel }}</i>{{ currentMember.name }}</span>
      <i class="arrow-down"></i>
      <div @mouseover="isShowUserNav = true" @mouseout="isShowUserNav = false" v-show="isShowUserNav" class="sec-nav">
        <div class="user-info">
          <div class="user">{{ currentMember.name }}</div>
          <div class="email">{{ currentMember.email }}</div>
        </div>
        <ul>
          <li class="sec-nav-item">
            <a v-link="{path: '/account/info'}"><i class="fa fa-user"></i>{{ $t("ui.user_menu.account") }}</a>
          </li>
          <li class="sec-nav-item" v-if="currentMember.role && currentMember.role===1">
            <a v-link="{path: '/account/members'}"><i class="fa fa-users"></i>成员管理</a>
          </li>
          <li class="sec-nav-item" v-if="currentMember.role && currentMember.role===1">
            <a v-link="{path: '/account/authorize'}"><i class="fa fa-expeditedssl"></i>授权管理</a>
          </li>
          <li class="sec-nav-item" v-if="currentMember.role && currentMember.role===1">
            <a v-link="{path: '/account/security'}"><i class="fa fa-shield"></i>安全审计</a>
          </li>
          <li class="sec-nav-item">
            <a v-link="{path: '/account/corp'}"><i class="fa fa-newspaper-o"></i>企业信息</a>
          </li>
          <li class="sec-nav-item">
            <a href="#" @click.prevent="quit"><i class="fa fa-sign-out"></i>{{ $t("ui.user_menu.quit") }}</a>
          </li>
        </ul>
      </div>
    </div>
    <!-- End: 用户导航 -->

    <!-- Start: 次导航 -->
    <div class="extra-nav">
      <ul>
        <li class="link-demo">
          <a href="http://ap.xlink.cn/" class="hl-red" target="_blank">查看demo</a>
          <div class="authorize-tips" v-show="!isHideMaskForever && this.isPathInOperation && isShowMask">
            <div class="cont">
              <p>{{ reason }}，点击demo体验运营平台！</p>
              <p>或者联系商务咨询400-042-4009</p>
            </div>
            <div class="actions">
              <a class="hl-orange" @click.prevent="removeAlertForever">不再显示</a>
            </div>
            <i class="fa fa-times-circle" @click="removeAlertMask"></i>
          </div>
        </li>
      </ul>
    </div>
    <!-- End: 主导航 -->
  </header>
</template>

<script>
import store from 'store/index'
import { globalMixins } from 'src/mixins'
import { MAIN_NAV } from 'consts/config'
import { showAlertMask, removeAlertMask } from 'store/actions/system'

export default {
  name: 'Topbar',

  mixins: [globalMixins],

  // 状态管理
  store,

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
      isShowUserNav: false,
      mainNav: MAIN_NAV
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
        '0': '未认证',
        '1': '已认证',
        '2': 'VIP'
      })[this.corp.status || 0]
    },

    // 遮罩出现的原因
    reason () {
      let result = ''
      if (this.releasedProducts.length === 0) {
        result = '暂未发布产品'
      }
      if (this.corp.status === 0) {
        result = '暂无使用权限'
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
      return window.localStorage.getItem('hideAlertMask')
    }
  },

  attached () {
    this.init()
  },

  watch: {
    isPathInOperation () {
      this.init()
    }
  },

  methods: {
    /**
     * 初始化
     */
    init () {
      if (!this.loading && this.reason) {
        this.showAlertMask()
      } else {
        this.removeAlertMask()
      }
    },

    /**
     * 不再显示警告
     */
    removeAlertForever () {
      window.localStorage.setItem('hideAlertMask', true)
      this.removeAlertMask()
    },

    /**
     * 退出登录
     * 移除保存在 window.localStorage中的 accessToken
     */
    quit () {
      window.localStorage.clear()
      this.showNotice({
        type: 'info',
        content: '您已退出登录'
      })
      this.$route.router.go({path: '/login'})
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/stylus/common'

// 头部
.the-header
  absolute left top
  size 100% 54px
  background #FAFAFA
  border-bottom 1px solid #E5E5E5
  z-index 1000

// Logo
.logo
  float left
  size 200px 55px
  background url("../assets/images/logo.png") no-repeat center

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
  float right
  height 55px
  line-height 54px
  z-index 10000

  li
    line-height 54px

  .link-demo
    position relative

    .authorize-tips
      absolute right 25px top 68px
      padding 104px 30px 0 0
      color #FFF
      width 320px
      line-height 26px
      font-size 16px
      background url('../assets/images/indicator.png') no-repeat right top
      text-align center

      p
        margin 0

      .fa
        absolute right -120px top
        color #FFF
        font-size 24px
        cursor pointer
        opacity .6

        &:hover
          opacity 1

// 用户导航
.user-nav
  float right
  height 55px
  line-height 54px
  text-align right
  padding 0 20px
  z-index 10000

  .user-name
    padding 0 5px
    cursor default
    color #858585
    font-size 14px
    display inline-block
    white-space nowrap

    .badge
      display inline-block
      line-height 20px
      height 20px
      color #FFF
      background-color #CCC
      padding 0 10px
      font-size 12px
      margin-right 5px

    .badge-authorized
      background-color #5CD35E

    .badge-vip
      background-color #FFBF4D

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
