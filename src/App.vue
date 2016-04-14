<template>
  <div :class="{'auth-page':layout==='auth'}" class="page-container">
    <template v-if="layout==='admin'">
      <!-- Start: 页头 -->
      <header class="header the-header" transition="header" transition-mode="out-in">
        <!-- Start: 顶部导航 -->
        <nav class="nav-header">
          <ul>
            <li><a href="http://www.xlink.cn/" target="_blank">{{ $t("nav_head.home") }}</a></li>
            <li><a href="http://www.xlink.cn/platform.html" target="_blank">{{ $t("nav_head.platform") }}</a></li>
            <li><a href="http://www.xlink.cn/solutions/smart-home.html" target="_blank">{{ $t("nav_head.solutions") }}</a></li>
            <li><a href="http://www.xlink.cn/developer.html" target="_blank">{{ $t("nav_head.developer") }}</a></li>
            <li><a href="http://www.xlink.cn/case.html" target="_blank">{{ $t("nav_head.cases") }}</a></li>
            <li><a href="http://support.xlink.cn/" target="_blank">{{ $t("nav_head.documents") }}</a></li>
          </ul>
        </nav>
        <!-- End: 顶部导航 -->

        <!-- Start: 用户导航 -->
        <div @mouseover="isShowUserNav = true" @mouseout="isShowUserNav = false" class="user-navigation">
          <span class="user-name">{{ currentMember.name }}</span>
          <i class="arrow-down"></i>
          <div @mouseover="isShowUserNav = true" @mouseout="isShowUserNav = false" v-show="isShowUserNav" class="sed-navigation">
            <ul>
              <li class="sed-navigation-li">
                <a v-link="{path: '/settings/account'}">{{ $t("user_menu.account") }}</a>
              </li>
              <li class="sed-navigation-li">
                <a href="#" @click.prevent="quit">{{ $t("user_menu.quit") }}</a>
              </li>
            </ul>
          </div>
        </div>
        <!-- End: 用户导航 -->
      </header>

      <!-- Start: 侧栏 -->
      <section class="sidebar" transition="sidebar" transition-mode="out-in">
        <a v-link="{ path: '/' }" class="logo"></a>
        <div class="nav-aside">
          <div class="nav-aside-wrap">
            <div class="nav-aside-item"><a v-link="{ path: '/dashboard' }"><i class="fa fa-home"></i>{{ $t("nav_aside.dashboard") }}</a></div>
            <div class="nav-aside-group">
              <h3>{{ $t("nav_aside.products") }}</h3>
              <div v-for="product in products" class="nav-aside-item"><a v-link="{ name: 'products', params: { id: product.id} }" title="{{ product.name }}"><i class="fa fa-link"></i>{{ product.name }}</a></div>
              <div class="nav-aside-actions"><a v-link="{ path: '/product/create' }"><i class="fa fa-plus"></i>{{ $t("nav_aside.add_product") }}</a></div>
            </div>
            <div class="nav-aside-item"><a v-link="{ path: '/apps' }"><i class="fa fa-th"></i>{{ $t("nav_aside.apps") }}</a></div>
            <div class="nav-aside-item"><a v-link="{ path: '/alerts' }"><i class="fa fa-bell"></i>{{ $t("nav_aside.alerts") }}</a></div>
            <div class="nav-aside-item"><a v-link="{ path: '/data' }"><i class="fa fa-database"></i>{{ $t("nav_aside.data") }}</a></div>
            <div class="nav-aside-item"><a v-link="{ path: '/users' }"><i class="fa fa-user"></i>{{ $t("nav_aside.users") }}</a></div>
            <div class="nav-aside-item"><a v-link="{ path: '/statistic' }"><i class="fa fa-bar-chart"></i>{{ $t("nav_aside.statistic") }}</a></div>
            <div class="nav-aside-item"><a v-link="{ path: '/settings' }"><i class="fa fa-cog"></i>{{ $t("nav_aside.settings") }}</a></div>
          </div>
        </div>
      </section>
      <!-- End: 侧栏 -->
    </template>

    <!-- Start: 路由视图 -->
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
    <!-- End: 路由视图 -->

    <!-- Start: 错误模态窗口 -->
    <modal :show="isShowError" :width="'360px'" @disapear="removeError" @dismiss="hideError">
      <template slot="body">
        <div class="error-msg">{{error.msg}}</div>
        <div class="modal-actions">
          <button class="btn btn-primary btn-lg" @click.prevent.stop="hideError">{{ $t("common.ok") }}</button>
        </div>
      </template>
    </modal>
    <!-- End: 错误模态窗口 -->

    <!-- Start: 通知信息 -->
    <toast :messages="notices"></toast>
    <!-- End: 通知信息 -->
  </div>
</template>

<script>
  import store from './store/index'
  import { removeError, hideError, getCurrentMember } from './store/actions/system'
  import { getAllProducts } from './store/actions/products'
  import Vue from 'vue'
  // import api from './api'
  import Modal from './components/Modal'
  import Toast from './components/Toast'

  export default {
    name: 'App',

    components: {
      'modal': Modal,
      'toast': Toast
    },

    // 状态管理
    store,

    vuex: {
      getters: {
        layout: ({ system }) => system.layout,
        error: ({ system }) => system.error,
        isShowError: ({ system }) => system.isShowError,
        notices: ({ system }) => system.notices,
        currentMember: ({ system }) => system.currentMember,
        products: ({ products }) => products.all
      },
      actions: {
        hideError,
        removeError,
        getCurrentMember,
        getAllProducts
      }
    },

    data () {
      return {
        isShowUserNav: false,
        debug: process.env.NODE_ENV !== 'production'
      }
    },

    watch: {
      layout () {
        if (this.layout === 'admin') {
          this.getCurrentMember(window.localStorage.getItem('memberId'), this)
          this.getAllProducts(this)
        }
      }
    },

    ready () {
      document.title = Vue.config.lang === 'zh-cn' ? '云智易物联平台' : 'Xlink IOT Platform'
      // 监听子组件的更新成员信息事件
      this.$on('update-member', (member) => {
        this.currUser = member
      })
    },

    methods: {
      /**
       * 退出登录
       * 移除保存在 window.localStorage中的 accessToken
       */
      quit () {
        window.localStorage.removeItem('accessToken')
        this.$route.router.app.access = false
        this.$route.router.go({path: '/login'})
      }
    }
  }
</script>

<style lang="stylus">
  // 配置
  @import 'assets/stylus/base'

  // 加载 Font-awesome 图标字体包
  @import '../node_modules/font-awesome/css/font-awesome.css'

  .page-container
    size 100%

  .auth-page
    background #383838
    overflow-y auto

  // 头部
  .the-header
    absolute left top
    size 100% 61px
    background #F7F7F7
    border-bottom 1px solid #E0E0E0

  // Logo
  .logo
    absolute left top
    size 100% 62px
    background url("assets/images/logo.png") no-repeat

  // 头部导航
  .nav-header
    margin-left 193px

    ul
      reset-list()
      font-size 0

    li
      display inline-block
      line-height 61px
      margin-right 34px
      font-size 14px

    a
      color gray-dark

      &:hover
        color red

  // 用户导航
  .user-navigation
    absolute right top
    size auto 61px
    line-height 61px
    z-index 1
    text-align right
    padding 0 20px
    background #fff

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

    .sed-navigation
      absolute top 54px right
      size 100px 0
      text-align right
      background #FFF
      // overflow hidden
      opacity 0
      border 1px solid #ddd
      padding 0 10px

      .sed-navigation-li
        margin-right 0
        line-height 36px
        display block
        padding 0 20px
        min-width 50px
        border-bottom 1px solid #DDD

        &:last-child
          border none

      &:before
        absolute right 20px top -11px
        content ""
        triangle #D3D3D3 10px up

      &:after
        absolute right 20px top -10px
        content ""
        triangle #FFF 10px up


    &:hover
      .sed-navigation
        height auto
        opacity 1
  // 侧栏
  .sidebar
    absolute left top
    size 170px 100%
    background #202020

  // 侧栏导航
  .nav-aside
    padding-top 67px
    height 100%
    box-sizing border-box

  .nav-aside-wrap
    height 100%
    overflow-y auto

  .nav-aside-item
    a
      display block
      color #999
      height 40px
      line-height 40px
      padding-right 14px
      padding-left 20px
      background #202020
      transition background .3s
      overflow hidden
      white-space nowrap
      text-overflow "…"

      .fa
        font-size 16px
        width 20px
        margin-right 12px

      &:hover
        background #2D2D2D
        text-decoration none

    .v-link-active
      background #2D2D2D
      padding-right 0
      border-right 4px solid red
      color #FFF

      &:hover
        color #FFF

  .nav-aside-group
    margin-top 25px

    h3
      margin 0
      padding-left 20px
      font-size 14px
      line-height 32px
      color #525252

  .nav-aside-actions
    margin 5px 20px 45px

    a
      display block
      height 34px
      line-height 34px
      border 1px dashed #525252
      border-radius 2px
      text-align center
      color #525252

      .fa
        margin-right 10px

      &:hover
        color #FFF
        border-color #FFF
        text-decoration none

  // 主内容区
  .main-wrap
    absolute top 62px right bottom left 170px
    overflow auto

    .main
      padding 20px 10px 0

  // 视图淡入淡出
  .view
  .sidebar
  .header
    transition transform .3s ease-in-out, opacity .3s ease-in-out

  .view-enter
  .view-leave
    opacity 0
    transform translate3d(10px, 0, 0)

  // 侧栏淡入淡出
  .sidebar
    transition transform .2s ease-in-out, opacity .2s ease-in-out

  .sidebar-enter
  .sidebar-leave
    opacity 0
    transform translate3d(-10px, 0, 0)

  // 头部淡入淡出
  .header
    transition transform .2s ease-in-out .2s, opacity .2s ease-in-out .2s

  .header-enter
  .header-leave
    opacity 0
    transform translate3d(0, -10px, 0)
</style>
