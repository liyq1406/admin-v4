<template lang="jade">
  .panel
    .panel-hd
          search-box(:key="query", :active="searching", :placeholder="'用户名、邮箱、昵称'", @search="setQuery", @cancel="cancelSearching", @search-activate="toggleSearching", @search-deactivate="toggleSearching",)
            label 查找成员
          h2.title 成员列表
          button.btn.btn-success.btn-lg.mt10.mb10.bottom_add(@click.prevent="showModal = true") +添加成员
    .panel-bd
          //- 用户列表
          table.table.table-stripe.table-bordered
            thead
              tr
                th 姓名
                //th 手机
                //th 邮箱
                th 角色
                //th 最后一次登录
                th.tac 状态
            tbody
              tr(v-for="member in members")
                td {{member.name}}
                //td 13800138000
                //td 8009995558@citicib.com.cn
                td(v-if="member.role==1") 管理员
                td(v-else) 普通会员
                //td 2015-6-3 15:38:53
                td.tac(v-if="member.status==0")
                    span.hl-red 待激活
                td.tac(v-if="member.status==1")
                    span.hl-gray 正常
                td.tac(v-if="member.status==2")
                    span.hl-red 已停用
          .pager.tar
            button.pager-btn.pager-prev
              i.fa.fa-chevron-left
            input.pager-input(type="text")
            button.pager-btn.pager-next
              i.fa.fa-chevron-right

    modal(:show.sync="showModal")
      h3(slot="header") 添加成员
      .form(slot="body")
        form(v-form, name="validation")
          .form-row
            label.form-control 邮箱：
            .controls
              .input-text-wrap(v-placeholder="'请输入成员邮箱'")
                input.input-text(v-model="model.name", type="email", v-form-ctrl, name="name", maxlength="32", required)
              .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
                span(v-if="validation.name.$error.required") 请输入成员邮箱
              .form-tips.form-tips-error(v-if="validation.name.$dirty")
                span(v-if="validation.name.$error.required") 请输入成员邮箱
          .form-row
            label.form-control 角色：
            .controls
              .select
                select(v-model="model.link_type", v-form-ctrl, name="link_type")
                  option(value="1") 管理员
                  option(value="2", selected) 普通用户
          .form-actions
            button.btn.btn-default(@click.prevent.stop="showModal = false") 取消
            button.btn.btn-primary(type="submit") 添加
</template>
<style lang="stylus">
  @import '../../assets/stylus/common'

  .panel
    .panel-hd
      .title
        display inline
      .bottom_add
        margin-left 50px

</style>

<script>
  var SearchBox = require('../../components/search-box.vue');
  var Modal = require('../../components/modal.vue');
  var api = require('../../api');

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
        showModal: false,
        model: {},
        validation: {},
        members:[]
      }
    },

    route: {
      data: function () {
        var self = this;
        api.corp.getMembers().then(function (data) {
            if(__DEBUG__) {
              console.log(data);
            }
            self.members = data
        });

        return {};
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