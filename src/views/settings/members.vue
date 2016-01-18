<template lang="jade">
.panel
  .panel-hd.with-actions
    search-box(:key.sync="query", :auto="true", :active="searching", :placeholder="'请输入姓名'", @cancel="cancelSearching", @search-activate="toggleSearching", @search-deactivate="toggleSearching",)
      label 查找成员
    h2 成员列表
    button.btn.btn-success.ml20.mt10(@click.prevent="showModal = true")
      i.fa.fa-plus
      | 添加成员
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
        template(v-if="filteredMembers.length > 0 && !loadingData")
          tr(v-for="member in filteredMembers | limitBy pageCount (currentPage-1)*pageCount")
            td
              span(v-if="member.name.length") {{member.name}}
              span.hl-gray(v-else) 未设置
            //td 13800138000
            //td 8009995558@citicib.com.cn
            td
              span(v-if="member.role==1") 管理员
              span(v-else) 普通会员
            //td 2015-6-3 15:38:53
            td.tac
              span.hl-red(v-if="member.status==0") 待激活
              span.hl-gray(v-if="member.status==1") 正常
              span.hl-red(v-if="member.status==2") 已停用
        tr(v-if="loadingData")
          td.tac(colspan="3")
            .tips-null
              i.fa.fa-refresh.fa-spin
              span 数据加载中...
        tr(v-if="filteredMembers.length === 0 && !loadingData")
          td.tac(colspan="3")
            .tips-null
              span 暂无相关记录
    pager(v-if="!loadingData", :total="filteredMembers.length", :current.sync="currentPage", :page-count="pageCount")

  modal(:show.sync="showModal")
    h3(slot="header") 添加成员
    .form(slot="body")
      form(v-form, name="validation", hook="FormHook")
        .form-row
          label.form-control 邮箱：
          .controls
            .input-text-wrap(v-placeholder="'请输入成员邮箱'")
              input.input-text(v-model="newuseremail.email", type="email", v-form-ctrl, name="email", maxlength="32", required, lazy)
            //.form-tips.form-tips-error(v-if="validation.$submitted && validation.email.$pristine")
              span(v-if="validation.email.$error.required") 请输入成员邮箱
            .form-tips.form-tips-error(v-if="validation.email.$dirty")
              span(v-if="validation.email.$error.required") 请输入成员邮箱
              span(v-if="validation.email.$error.email") 邮箱地址格式不正确
        .form-row
          label.form-control 角色：
          .controls
            .select
              select(v-model="newuseremail.role", v-form-ctrl, name="role")
                option(value="1") 管理员
                option(value="2", selected) 普通用户
        .form-actions
          button.btn.btn-default(@click.prevent.stop="showModal = false") 取消
          button.btn.btn-primary(type="submit",@click.prevent.stop="adduser") 添加
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
  var Pager = require('../../components/pager.vue');
  var Vue = require('vue');

  module.exports = {
    name: 'MemberSettings',

    components: {
      'search-box': SearchBox,
      'modal': Modal,
      'pager': Pager
    },

    data: function () {
      return {
        query: '',
        searching: false,
        users: [],
        showModal: false,
        model: {},
        validation: {},
        members: [],
        newuseremail: {},
        currentPage: 1,
        pageCount: 10,
        addForm: [],
        centervalue: {},
        loadingData: false
      };
    },

    route: {
      data: function () {
        this.getMembers();
      }
    },

    computed: {
      filteredMembers: function () {
        var filter = Vue.filter('filterBy');
        console.log(filter(this.members, this.query, 'name'));
        return filter(this.members, this.query, 'name');
      }
    },

    watch: {
      showModal: function () { // 是否有弹出的编辑框
        var self = this;
        for (var i = 0; i < self.addForm.length; i++) {
          self.addForm[i].setPristine();
          self.addForm[i].setValidity();
        }
        if (!self.showModal) { // 当编辑框关掉的时候
          setTimeout(function () {
            self.newuseremail.email = undefined;
          }, 100);
        };
      }
    },

    methods: {
      getMembers: function () {
        var self = this;

        this.loadingData = true;
        api.corp.refreshToken().then(function () {
          api.corp.getMembers().then(function (data) {
            self.members = data;
            self.loadingData = false;
          }).catch(function (error) {
            self.handleError(error);
            self.loadingData = false;
          });
        });
      },

      setQuery: function (query) {
        this.query = query;
      },

      toggleSearching: function () {
        this.searching = !this.searching;
      },

      cancelSearching: function () {
        this.setQuery('');
      },

      /**
       * 添加成员
       */
      adduser: function () {
        var self = this;
        this.newuseremail.content = '测试邮箱内容'; // 待改地方debug
        console.log(self.newuseremail);

        api.corp.refreshToken().then(function () {
          api.corp.memberInvite(self.newuseremail).then(function (data) {
            if (__DEBUG__) {
              console.log(data);
            }
            if (data - 0 === 200) {
              self.getMembers();
            };
            self.showModal = false;
          }).catch(function (error) {
            self.handleError(error);
          });
        });
      },
      // 表单钩子
      FormHook: function (form) {
        this.addForm.push(form);
      }

    }
  };

</script>
