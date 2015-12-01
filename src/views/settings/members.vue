<template lang="jade">
  .panel
    .panel-hd
          search-box(:key="query", :active="searching", :placeholder="'用户名、邮箱、昵称'", @search="setQuery", @cancel="cancelSearching", @search-activate="toggleSearching", @search-deactivate="toggleSearching",)
            label 查找成员
          h2.title 成员列表
          button.btn.btn-success.btn-lg.mt10.mb10(@click.prevent="showModal = true") +添加成员
    .panel-bd
          //- 用户列表
          table.table.table-stripe.table-bordered
            thead
              tr
                th 姓名
                th 手机
                th 邮箱
                th 角色
                th 最后一次登录
                th.tac 状态
            tbody
              - for(var i=1; i<=10; i++)
                tr
                  td 路路
                  td 13800138000
                  td 8009995558@citicib.com.cn
                  td 普通成员
                  td 2015-6-3 15:38:53
                  td.tac
                    if i % 2 === 0
                      span.hl-gray 正常
                    else
                      span.hl-red 已停用
          .pager.tar
            button.pager-btn.pager-prev
              i.fa.fa-chevron-left
            input.pager-input(type="text")
            button.pager-btn.pager-next
              i.fa.fa-chevron-right

    modal(:show.sync="showModal")
      h3(slot="header") 编辑产品
      .form(slot="body")
        
</template>
<style lang="stylus">
  @import '../../assets/stylus/common'

  .panel
    .panel-hd
    	.title
    		display inline
    	.btn
    		margin-left 50px

</style>

<script>
  var SearchBox = require('../../components/search-box.vue');
  var Modal = require('../../components/modal.vue');

  module.exports = {
    components: {
      'search-box': SearchBox,
      'modal': Modal
    },

    data: function () {
      return {
        query: '',
        searching: false,
        users: [],
        showModal: false
      }
    },

    methods: {
      setQuery: function (query) {
        this.query = query;
      },

      toggleSearching: function () {
        this.searching = !this.searching;   
      },

      cancelSearching: function () {
        this.setQuery('');
      }
    }
  };

</script>