<template lang="jade">
  .page-container(:class="{'auth-page':!access}")
    header.the-header(v-if="access")
      nav.nav-header
        ul
          li: a(href="#", target="#") 首页
          li: a(href="#", target="#") 开发文档
          li: a(href="#", target="#") 在线支持
    section.sidebar(v-if="access")
      a.logo(v-link="{ path: '/' }")
      .nav-aside
        .nav-aside-item
          a(v-link="{ path: '/dashboard' }")
            i.fa.fa-home
            | 概览
        .nav-aside-group
          h3 产品管理
          .nav-aside-item(v-for="product in products")
            a(v-link="{ name: 'products', params: { id: product.id} }")
              i.fa.fa-link
              | {{ product.name }}
          .nav-aside-actions
            a(v-link="{ path: '/product/create' }")
              i.fa.fa-plus
              | 添加产品
        .nav-aside-item
          a(v-link="{ path: '/data' }")
            i.fa.fa-database
            | 数据管理
        .nav-aside-item
          a(v-link="{ path: '/users' }")
            i.fa.fa-user
            | 用户管理
        .nav-aside-item
          a(v-link="{ path: '/statistic' }")
            i.fa.fa-bar-chart
            | 统计分析
        .nav-aside-item
          a(v-link="{ path: '/settings' }")
            i.fa.fa-cog
            | 系统设置
    router-view(class="view", transition="view", transition-mode="out-in")
</template>

<script>
  var api = require('./api');
  var productsStore = require('./stores/products');

  module.exports = {
    data: function () {
      return {
        access: false,
        products: []
      }
    },

    methods: {

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
    display block
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

  // 侧栏
  .sidebar
    absolute left top
    size 170px 100%
    background #202020

  // 侧栏导航
  .nav-aside
    margin-top 5px

  .nav-aside-item
    a
      display block
      color #999
      height 40px
      line-height 40px
      padding-right 4px
      padding-left 20px
      background #202020
      transition background .3s

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
