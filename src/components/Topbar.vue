<template>
  <header class="header the-header" transition="header" transition-mode="out-in">
    <a v-link="{ path: '/' }" class="logo"></a>
    <!-- Start: 主导航 -->
    <nav class="nav-header">
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
        <ul>
          <li class="sec-nav-item">
            <a v-link="{path: '/operation/settings/account'}">{{ $t("ui.user_menu.account") }}</a>
          </li>
          <li class="sec-nav-item">
            <a href="#" @click.prevent="quit">{{ $t("ui.user_menu.quit") }}</a>
          </li>
        </ul>
      </div>
    </div>
    <!-- End: 用户导航 -->
  </header>
</template>

<script>
import store from 'store/index'
import { MAIN_NAV } from 'consts/config'

export default {
  name: 'Topbar',

  // 状态管理
  store,

  vuex: {
    getters: {
      currentMember: ({ system }) => system.currentMember
    }
  },

  data () {
    return {
      isShowUserNav: false,
      mainNav: MAIN_NAV
    }
  },

  methods: {
    /**
     * 退出登录
     * 移除保存在 window.localStorage中的 accessToken
     */
    quit () {
      window.localStorage.removeItem('accessToken')
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
  size 100% 61px
  background #F2F2F2
  border-bottom 1px solid #E5E5E5

// Logo
.logo
  float left
  size 240px 62px
  background #BC282B url("../assets/images/logo.png") no-repeat center

// 头部导航
.nav-header
  float left
  margin-left 20px

  ul
    reset-list()
    font-size 0

  li
    display inline-block
    line-height 61px
    margin-right 34px
    font-size 13px

    a
      color #838383
      display inline-block
      line-height 52px
      padding-top 4px
      border-bottom 4px solid transparent

      &:hover
        color #000
        text-decoration none

      &.v-link-active
        border-bottom-color red
        color red

// 用户导航
.user-nav
  absolute right top
  size auto 61px
  line-height 61px
  z-index 1
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
    absolute top 54px right
    size 70px 0
    text-align right
    background #FFF
    // overflow hidden
    opacity 0
    border 1px solid default-border-color
    padding 5px

    .sec-nav-item
      margin-right 0
      line-height 24px
      display block
      /*padding 0 20px*/
      min-width 50px
      border-bottom 1px solid #DDD
      font-size 12px
      text-align center

      & > a
        text-decoration none
        color gray
        display block

        &:hover
          color #000
          background #F3F3F3

      &:last-child
        border none

    &:before
      absolute right 30px top -11px
      content ""
      triangle #D3D3D3 10px up

    &:after
      absolute right 30px top -10px
      content ""
      triangle #FFF 10px up


  &:hover
    .sec-nav
      height auto
      opacity 1
</style>
