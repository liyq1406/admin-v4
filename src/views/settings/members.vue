<template lang="jade">
.panel
  .panel-hd.with-actions
    search-box(:key.sync="query", :auto="true", :active="searching", :placeholder="$t('member.search_palceholder')", @cancel="cancelSearching", @search-activate="toggleSearching", @search-deactivate="toggleSearching",)
      label {{ $t('member.search_label') }}
    h2 {{ $t('member.member_list') }}
    button.btn.btn-success.ml20.mt10(@click.prevent="showModal = true")
      i.fa.fa-plus
      | {{ $t('member.add_member') }}
  .panel-bd
    //- 用户列表
    table.table.table-stripe.table-bordered
      thead
        tr
          th {{ $t('member.fields.name') }}
          th {{ $t('member.fields.phone') }}
          th {{ $t('member.fields.email') }}
          th {{ $t('member.fields.role') }}
          //th 最后一次登录
          th.tac {{ $t('common.status') }}
          th.tac {{ $t('common.action') }}
      tbody
        template(v-if="filteredMembers.length > 0 && !loadingData")
          tr(v-for="member in filteredMembers | limitBy pageCount (currentPage-1)*pageCount")
            td
              span(v-if="member.name.length") {{member.name}}
              span.hl-gray(v-else) {{ $t('common.not_set') }}
            td
              span(v-if="member.phone.length") {{member.phone}}
              span.hl-gray(v-else) {{ $t('common.not_set') }}
            td
              span(v-if="member.email.length") {{member.email}}
              span.hl-gray(v-else) {{ $t('common.not_set') }}
            td
              span {{ memberTypes[member.role-1] }}
            //td 2015-6-3 15:38:53
            td.tac
              span(:class="{'hl-gray': member.status===0, 'hl-green': member.status===1, 'hl-red': member.status===2}") {{ statusTypes[member.status] }}
            td.tac
              button.btn.btn-link.btn-sm(@click="deleteMember(member)") {{ $t('common.del') }}
        tr(v-if="loadingData")
          td.tac(colspan="6")
            .tips-null
              i.fa.fa-refresh.fa-spin
              span {{ $t("common.data_loading") }}
        tr(v-if="filteredMembers.length === 0 && !loadingData")
          td.tac(colspan="6")
            .tips-null
              span {{ $t("common.no_records") }}
    pager(v-if="!loadingData", :total="filteredMembers.length", :current.sync="currentPage", :page-count="pageCount")

  modal(:show.sync="showModal")
    h3(slot="header") {{ $t('member.add_member') }}
    .form(slot="body")
      form(v-form, name="validation", hook="FormHook")
        .form-row
          label.form-control {{ $t("member.fields.email") }}:
          .controls
            .input-text-wrap(v-placeholder="$t('member.placeholders.email')")
              input.input-text(v-model="newuseremail.email", type="email", v-form-ctrl, name="email", maxlength="32", required, lazy)
            .form-tips.form-tips-error(v-if="validation.email.$dirty")
              span(v-if="validation.email.$error.required") {{ $t('validation.required', {field: $t('member.fields.email')}) }}
              span(v-if="validation.email.$error.email") {{ $t('validation.format', {field: $t('member.fields.email')}) }}
        .form-row
          label.form-control {{ $t("member.fields.role") }}:
          .controls
            .select
              select(v-model="newuseremail.role", v-form-ctrl, name="role")
                option(v-for="type in memberTypes", :value="$index + 1", :selected="$index===1") {{type}}
        .form-actions
          button.btn.btn-default(@click.prevent.stop="showModal = false") {{ $t('common.cancel') }}
          button.btn.btn-primary(type="submit",@click.prevent.stop="adduser") {{ $t('common.add') }}
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
  import Vue from 'vue';
  import SearchBox from '../../components/search-box.vue';
  import Modal from '../../components/modal.vue';
  import api from '../../api';
  import Pager from '../../components/pager.vue';
  import locales from '../../consts/locales';

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
        loadingData: false,
        memberTypes: locales[Vue.config.lang].member.types,
        statusTypes: locales[Vue.config.lang].member.status_types
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

        api.corp.refreshToken().then(function () {
          api.corp.memberInvite(self.newuseremail).then(function (status) {
            if (__DEBUG__) {
              console.log(status);
            }
            if (status === 200) {
              self.getMembers();
            };
            self.showModal = false;
          }).catch(function (error) {
            self.handleError(error);
          });
        });
      },

      /**
       * 删除企业成员
       * @param  {Object} member 待删除成员
       */
      deleteMember: function (member) {
        var self = this;
        if (confirm(this.$t('member.del_msg'))) {
          api.corp.refreshToken().then(function () {
            api.corp.delMember(member.id).then(function () {
              self.members.$remove(member);
            }).catch(function (error) {
              self.handleError(error);
            });
          });
        }
      },

      // 表单钩子
      FormHook: function (form) {
        this.addForm.push(form);
      }

    }
  };

</script>
