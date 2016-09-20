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
      <span class="user-name">{{ currentMember.name }}</span>
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
  </header>
</template>

<script>
import store from 'store/index'
import { globalMixins } from 'src/mixins'
import { MAIN_NAV } from 'consts/config'

export default {
  name: 'Topbar',

  mixins: [globalMixins],

  // 状态管理
  store,

  vuex: {
    getters: {
      corp: ({ system }) => system.corp,
      currentMember: ({ system }) => system.currentMember
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
    }
  },

  methods: {
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

// 用户导航
.user-nav
  absolute right top
  size auto 55px
  line-height 54px
  z-index 10000
  text-align right
  padding 0 20px

  .user-name
    padding 0 5px
    cursor default
    color #858585
    font-size 14px
    display inline-block
    white-space nowrap

  .arrow-down
    triangle #777 8px down
    absolute right 10px top 28px

  .sec-nav
    absolute top 54px right 5px
    height 0
    opacity 0
    border 1px solid default-border-color

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
