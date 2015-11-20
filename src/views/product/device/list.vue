<template lang="jade">
.panel
  .panel-bd
    //- 操作栏
    .action-bar
      .search-box
        input.search-box-input(placeholder="请输入 mac 地址")
        button.fa.fa-search
      .action-group
        button.btn.btn-default
          i.fa.fa-plus
          | 添加设备
        button.btn.btn-default
          i.fa.fa-reply-all
          | 导入设备

    //- 状态栏
    .status-bar
      .status
        | 共有
        span 100
        | 条结果
      v-select(:options="filterOptions", :value="filterValue", @select="setFilterValue")
        span 显示：

    //- 设备列表
    table.table.table-stripe.table-bordered
      thead
        tr
          th mac
          th 是否激活
          th 激活时间
          th 最后一次登录
          th.tac 在线状态
      tbody
        - for(var i=1; i<=5; i++)
          tr
            td
              a.hl-red(href="#") ACCF2356BF53
            td 是
            td 2015-10-15 22:30:12
            td 2015-10-15 22:30:12
            td.tac
              span.hl-green 在线
          tr
            td
              a.hl-red(href="#") ACCF2356BF53
            td 是
            td 2015-10-15 22:30:12
            td 2015-10-15 22:30:12
            td.tac
              span.hl-gray 下线
    .pager.tar
      button.pager-btn.pager-prev
        i.fa.fa-chevron-left
      input.pager-input(type="text")
      button.pager-btn.pager-next
        i.fa.fa-chevron-right
</template>

<style lang="stylus">
  @import '../../../assets/stylus/common'

  .status-bar
    border 1px solid #E4E4E4
    background #F9F9F9
    padding 5px 20px
    margin-bottom 10px
    clearfix()

    .status
      float right
      font-size 12px
      line-height 25px

      span
        font-weight bold
        color red
</style>

<script>
  var Select = require('../../../components/select.vue')

  module.exports = {
    components: {
      'v-select': Select
    },

    data: function () {
      return {
        filterValue: '全部',
        filterOptions: ['全部', '在线', '激活', '未激活']
      }
    },

    methods: {
      setFilterValue: function (value) {
        this.filterValue = value;
      }
    }
  };
</script>