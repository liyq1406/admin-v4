<template lang="jade">
  section.main-wrap
    .main
      .row
        .col-20
          // Start: 管理台
          .panel
            .panel-hd
              .date(v-text="new Date() | formatDate")
              h2 管理台
            .panel-bd
              .statistic
                .statistic-item.device-count
                  .fa.fa-link
                  .num {{totalSummary.total}}
                  .label 总设备量
                .statistic-item.active-count
                  .fa.fa-magic
                  .num {{totalSummary.activated}}
                  .label 激活数
                .statistic-item.online-count
                  .fa.fa-wifi
                  .num {{totalSummary.online}}
                  .label 当前在线
                .statistic-item.user-count
                  .fa.fa-users
                  .num {{userSummary.user}}
                  .label 用户数
          // Start: 管理台

      .row
        .col-12
          // Start: 快速指南
          .panel
            .panel-hd
              h2 快速指南
            .panel-bd
              .post-list
                ul
                  li
                    | [
                    a(href="#") 分类
                    != '] '
                    a(href="#") 标题
          // End: 快速指南

        .col-8
          // Start: 文档
          .panel
            .panel-hd
              h2 文档
            .panel-bd
              .doc-list
                .doc-list-item
                  a.fa.fa-apple(href="#", target="_blank")
                  .info
                    h3
                      a(href="#", target="_blank") iOS SDK
                    p 提供iOS开发文档说明
                .doc-list-item(href="#", target="_blank")
                  a.fa.fa-android(href="#", target="_blank")
                  .info
                    h3
                      a(href="#", target="_blank") Android SDK
                    p 提供Android开发文档说明
                .doc-list-item(href="#", target="_blank")
                  a.fa.fa-th-large(href="#", target="_blank")
                  .info
                    h3
                      a(href="#", target="_blank") APP 开发示例
                    p 云智易平台提供了丰富的接口
          // End: 文档

</template>

<style lang="stylus">
  @import '../assets/stylus/common'

  .statistic
    font-size 0
    margin 0 -25px
    padding 25px 0

    .statistic-item
      display inline-block
      width 25%
      padding 10px 0
      font-size 14px
      box-sizing border-box
      border-right 1px solid #E6E6E6
      text-align right

      .fa
        float left
        size 42px
        margin-left 25px
        border-radius 30px
        text-align center
        line-height 42px
        font-size 24px
        color #FFF

      .num
      .label
        margin-right 25px

      .num
        font-size 38px
        line-height 44px
        height 44px

      .label
        color #999

      &:last-child
        border-right none

    .device-count
      .num
        color #0092D6

      .fa
        background #0092D6

    .active-count
      .num
        color #27A9B0

      .fa
        background #27A9B0

    .online-count
      .num
        color #3A749A

      .fa
        background #3A749A

  .user-count
    .num
      color #FA6659

    .fa
      background #FA6659

  // 文章列表
  .post-list
    padding 5px 0

    ul
      reset-list()

    li
      position relative
      margin 18px 0
      padding-left 20px

      &:before
        absolute left 2px top
        content "\2022"

  // 文档
  .doc-list
    .doc-list-item
      display block
      margin 25px 0
      clearfix()

      .fa
        float left
        size 36px
        border 1px solid #E9E9E9
        text-align center
        line-height 36px
        font-size 24px
        transition color .3s

        &:hover
          text-decoration none

      .fa-apple
        color #B6B6B6

        &:hover
          color darken(@color, 20%)

      .fa-android
        color #74B939

        &:hover
          color darken(@color, 20%)

      .fa-th-large
        color #5899C2

        &:hover
          color darken(@color, 20%)

      .info
        margin-left 56px

      h3
        margin 0
        font-size 14px
        color #666

        a
          transition color .3s

      p
        margin 0
        font-size 12px
        color #999
</style>

<script>
  var api = require('../api');

  module.exports = {
    documentTitle: '概览',
    data: function () {
      return {
        totalSummary: {},
        userSummary: {}
      };
    },

    filters: {
      formatDate: function (date) {
        var d = date.toLocaleDateString('en-US').split('/');
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        return year + '年' + (month + 1) + '月' + day + '日 星期' + '日一二三四五六'.charAt(date.getDay());
      }
    },

    route: {
      data: function (transition) {
        var self = this;
        api.corp.refreshToken().then(function () {
          api.statistics.getSummary().then(function (data) {
            self.totalSummary = data.total;
            self.userSummary = data.user;
            transition.next();
          });
        });
      }
    },

    methods: {

    }
  };
</script>
