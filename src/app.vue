<template lang="jade">
.page-container(:class="{'auth-page':!controlling}")
  header.the-header(v-if="controlling")
    nav.nav-header
      ul
        li: a(href="#", target="#") 首页
        li: a(href="#", target="#") 开发文档
        li: a(href="#", target="#") 在线支持
  section.sidebar(v-if="controlling")
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
module.exports = {
  data: function () {
    return {
      controlling: true,
      products: []
    }
  },

  route: {
    data: function () {
      if (controlling) {
        return {
          products: []
        }
      }
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

  .form
    .input-text
      border 1px solid #D9D9D9
      display block
      width 100%
      box-sizing border-box
      font-size 14px
      padding 6px 20px

    .form-row
      position relative
      margin-bottom 12px

    .form-hints
      margin-top 20px
      margin-bottom 10px

    .form-tips
      font-size 12px

      i
        margin-right 5px
        font-size 16px

    .form-tips-success
      color green

      i
        color #92C39E

    .form-tips-error
      color red

      i
        color #B76166

    .form-row-group
      margin-bottom 20px

      & + .form-hints
        margin-top 40px

  .form-auth
    width 550px
    margin 0 auto
    padding 100px 0

    .form-logo
      background #383838 url('assets/images/form_logo.png') no-repeat center top
      height 53px
      padding-bottom 30px

    .form-cont
      padding 40px 85px 0
      box-shadow 0 5px 15px rgba(0, 0, 0, .3)
      background #FFF

    .form-header
      border-bottom 1px solid #E0E0E0
      font-size 0
      padding 0 30px
      margin-bottom 25px

      span
      a
        display inline-block
        font-size 16px
        padding 10px 30px

      a
        & + span
          margin-left 70px

      span
        border-bottom 3px solid red
        padding-bottom 7px
        color red

        & + a
          margin-left 70px

      a:hover
        text-decoration none

      h2
        font-size 24px
        margin 0
        font-weight normal

      p
        font-size 12px
        color gray
        margin 0 0 10px

    .form-body
      padding 0 30px

    .form-actions
      text-align center

      .btn
        text-align center
        color #FFF
        height 46px
        line-height 46px
        font-size 14px
        margin 0 auto

    .form-footer
      font-size 12px
      text-align center
      padding 20px 0

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