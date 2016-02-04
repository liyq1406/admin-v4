<template lang="jade">
.page-container(:class="{'auth-page':!access}")
  header.the-header(v-if="access")
    nav.nav-header
      ul
        li: a(href="http://www.xlink.cn/", target="_blank") {{$t("nav_head.home")}}
        li: a(href="http://www.xlink.cn/platform.html", target="_blank") {{$t("nav_head.platform")}}
        li: a(href="http://www.xlink.cn/solutions/smart-home.html", target="_blank") {{$t("nav_head.solutions")}}
        li: a(href="http://www.xlink.cn/developer.html", target="_blank") {{$t("nav_head.developer")}}
        li: a(href="http://www.xlink.cn/case.html", target="_blank") {{$t("nav_head.cases")}}
        li: a(href="http://support.xlink.cn/", target="_blank") {{$t("nav_head.documents")}}
        //-li: a(href="http://support.xlink.cn/", target="_blank") 在线支持
      .user-navigation(@mouseover="showUserNav = true", @mouseout="showUserNav = false")
        span.user-name {{currUser.name}}
        i.arrow-down
        .sed-navigation(@mouseover="showUserNav = true", @mouseout="showUserNav = false", v-show="showUserNav")
          ul
            li.sed-navigation-li
              a(v-link="{path: '/settings/account'}") {{$t("user_menu.account")}}
            li.sed-navigation-li
              a(href="#", @click.prevent="quit") {{$t("user_menu.quit")}}
  section.sidebar(v-if="access")
    a.logo(v-link="{ path: '/' }")
    .nav-aside
      .nav-aside-wrap
        .nav-aside-item
          a(v-link="{ path: '/dashboard' }")
            i.fa.fa-home
            | {{$t("nav_aside.dashboard")}}
        .nav-aside-group
          h3 {{$t("nav_aside.products")}}
          .nav-aside-item(v-for="product in products")
            a(v-link="{ name: 'products', params: { id: product.id} }", title="{{ product.name }}")
              i.fa.fa-link
              | {{ product.name }}
          .nav-aside-actions
            a(v-link="{ path: '/product/create' }")
              i.fa.fa-plus
              | {{$t("nav_aside.add_product")}}
        .nav-aside-item
          a(v-link="{ path: '/apps' }")
            i.fa.fa-th
            | {{$t("nav_aside.apps")}}
        .nav-aside-item
          a(v-link="{ path: '/alerts' }")
            i.fa.fa-bell
            | {{$t("nav_aside.alerts")}}
        .nav-aside-item
          a(v-link="{ path: '/data' }")
            i.fa.fa-database
            | {{$t("nav_aside.data")}}
        .nav-aside-item
          a(v-link="{ path: '/users' }")
            i.fa.fa-user
            | {{$t("nav_aside.users")}}
        .nav-aside-item
          a(v-link="{ path: '/statistic' }")
            i.fa.fa-bar-chart
            | {{$t("nav_aside.statistic")}}
        .nav-aside-item
          a(v-link="{ path: '/settings' }")
            i.fa.fa-cog
            | {{$t("nav_aside.settings")}}
  router-view(class="view", transition="view", transition-mode="out-in", @edit-product-name="getProducts")
</template>

<script>
  import api from './api';

  module.exports = {
    data: function () {
      return {
        access: false,
        products: [],
        showUserNav: false,
        currUser: {}
      };
    },

    ready: function () {
      // 监听子组件的更新成员信息事件
      this.$on('update-member', function (member) {
        this.currUser = member;
      });
    },

    methods: {
      /**
       * 退出登录
       * 移除保存在 localStorage中的 accessToken
       */
      quit: function () {
        localStorage.removeItem('accessToken');
        this.$route.router.app.access = false;
        this.$route.router.go({path: '/login'});
      },

      /**
       * 获取产品
       */
      getProducts: function () {
        var self = this;
        api.corp.refreshToken().then(function () {
          api.product.getProducts().then(function (data) {
            self.products = data;
          });
        });
      }
    }
  };
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
        position relative
        top -3px

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
</style>
