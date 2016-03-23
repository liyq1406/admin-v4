<template lang="jade">
.abc
  .panel(v-if="newList")
    .panel-bd
      //- .alert-text.alert-text-success.mt20.mb20
      //-   p {{ $t("auth_management.intro") }}
      .action-bar
        .action-group
          button.btn.btn-success(@click="showAddModal = true")
            i.fa.fa-plus
            | 添加授权
          button.btn.btn-success.frr(@click="toggleList")
            i.fa
            | 切换查看V1版本
      table.table.table-stripe.table-bordered
        thead
          tr
            th Access Key ID
            th.tac Access Key Secret
            th {{ $t("common.name") }}
            th.tac 创建时间
            th.tac 操作

        tbody
          template(v-if="accessKeys.length > 0 && !loadingData")
            tr(v-for="accessKey in accessKeys | limitBy pageCount (currentPage-1)*pageCount")
              td {{accessKey.id}}
              td.tac
                button.btn.btn-link.btn-sm(@click="viewAccessKeys(accessKey)") {{ $t('common.details') }}
              td {{accessKey.name}}
              td {{accessKey.create_time}}
              td.tac
                button.btn.btn-primary.btn-sm(:class="{'btn-primary': accessKey.status, 'btn-success': !accessKey.status, 'disabled': toggling}", :disabled="toggling", @click="togglekeys(accessKey)")
                  i.fa(:class="{'fa-stop': accessKey.status, 'fa-play': !accessKey.status}")
                  | {{accessKey.status ? $t('task.stop') : $t('task.start')}}
          tr(v-if="loadingData")
            td.tac(colspan="5")
              .tips-null
                i.fa.fa-refresh.fa-spin
                span {{ $t("common.data_loading") }}
          tr(v-if="accessKeys.length === 0 && !loadingData")
            td.tac(colspan="5")
              .tips-null
                span {{ $t("common.no_records") }}
    // 添加应用浮层
    modal(:show.sync="showAddModal", @close="onAddCancel")
      h3(slot="header") 添加授权
      .form(slot="body")
        form(v-form, name="addValidation", @submit.prevent="addKeys", hook="addAppHook")
          .form-row
            label.form-control 授权名称:
            .controls
              .input-text-wrap(v-placeholder="$t('app.placeholders.name')")
                input.input-text(v-model="addModel.name", type="text", name="name", minlength="2", maxlength="32", required, lazy)
          .form-actions
            button.btn.btn-default(@click.prevent.stop="onAddCancel") {{ $t("common.cancel") }}
            button.btn.btn-primary(type="submit", :disabled="adding", :class="{'disabled':adding}", v-text="adding ? $t('common.handling') : $t('common.ok')")
      //- 用户列表
      //-
        table.table.table-stripe.table-bordered
          thead
            tr
              th {{ $t("common.name") }}
              th Access Key ID
              th.tac {{ $t("common.status") }}
          tbody
            template(v-if="empowers.length > 0 && !loadingData")
              tr(v-for="empower in empowers | limitBy pageCount (currentPage-1)*pageCount")
                td {{empower.name}}
                td {{empower.id}}
                td.tac
                  span.hl-green(v-if="empower.status===1") {{ $t("common.enable") }}
                  span.hl-gray(v-if="empower.status===2") {{ $t("common.disabled") }}
            tr(v-if="loadingData")
              td.tac(colspan="3")
                .tips-null
                  i.fa.fa-refresh.fa-spin
                  span {{ $t("common.data_loading") }}
            tr(v-if="empowers.length === 0 && !loadingData")
              td.tac(colspan="3")
                .tips-null
                  span {{ $t("common.no_records") }}

    pager(v-if="!loadingData && accessKeys.length > pageCount", :total="accessKeys.length", :current.sync="currentPage", :page-count="pageCount")

      //- 查看密钥浮层
    modal(:show.sync="showKeyModal")
      h3(slot="header") Access Key Secret
      .form(slot="body")
        .secret-key.tac.mrbthr(slot="body") {{key.secret}}
        //- .form-actions
        //-   button.btn.btn-default(@click="onViewCancel") {{ $t("common.cancel") }}
        //-   button.btn.btn-primary.fr(type="submit",:disabled="editing",@click="deleteKeyCode(key.id)") 删除
        .form-actions
          label.del-check
            input(type="checkbox", name="del", v-model="delChecked")
            | 删除授权
          button.btn.btn-primary(@click="onViewConfirm(key.id)",v-text="deleting ? $t('common.handling') : $t('common.ok')", :disabled="deleting", :class="{'disabled':deleting}")

  .panel(v-if="oldList")
    .panel-bd
      .action-bar
        .action-group
          button.btn.btn-success.frr(@click="toggleList")
            i.fa
            | 返回新版
    //- V1用户列表
    table.table.table-stripe.table-bordered
      thead
        tr
          th {{ $t("common.name") }}
          th Access Key ID
          th.tac {{ $t("common.status") }}
      tbody
        template(v-if="empowers.length > 0 && !loadingData")
          tr(v-for="empower in empowers | limitBy pageCount (currentPage-1)*pageCount")
            td {{empower.name}}
            td {{empower.id}}
            td.tac
              span.hl-green(v-if="empower.status-0===1") {{ $t("common.enable") }}
              span.hl-gray(v-if="empower.status-0===2") {{ $t("common.disabled") }}
        tr(v-if="loadingData")
          td.tac(colspan="3")
            .tips-null
              i.fa.fa-refresh.fa-spin
              span {{ $t("common.data_loading") }}
        tr(v-if="empowers.length === 0 && !loadingData")
          td.tac(colspan="3")
            .tips-null
              span {{ $t("common.no_records") }}
    pager(v-if="!loadingData && empowers.length > pageCount", :total="empowers.length", :current.sync="currentPage", :page-count="pageCount")
</template>
<script>
/**
 * 页面初始化：
 * 1. 请求授权列表
 *
 * 点击添加按钮：
 *
 * 点击查看：
 *
 * 点击启用/停用按钮：
 *
 */

import Modal from '../../components/modal.vue';
import Pager from '../../components/pager.vue';
import api from '../../api';
import _ from 'lodash';

export default {
  name: 'AuthSettings',

  components: {
    'modal': Modal,
    'pager': Pager
  },

  data () {
    return {
      empowers: [
        // {
        //   'name': '1',
        //   'id': '111',
        //   'status': '2'
        // }
      ],
      accessKeys: [
        // {
        //   'id': '1',
        //   'secret': '111',
        //   'name': '111',
        //   'create_time': '111',
        //   'status': 0
        // }
        // {
        //   'id': '2',
        //   'secret': '222',
        //   'name': '222',
        //   'create_time': '222',
        //   'status': 1
        // }
      ],
      showAddModal: false,
      addModel: {
        name: ''
      },
      originAddModel: {},
      addValidation: {},
      adding: false,
      currentPage: 1,
      pageCount: 10,
      loadingData: false,
      showKeyModal: false,
      key: {},
      delChecked: false,
      deleting: false,
      newList: true,
      oldList: false
    };
  },

  route: {
    data: function () {
      // this.getEmpowers();
      // this.getAccessKeys();
      this.getKeys();
    }
  },

  methods: {
    /**
     * 获取 v1 旧版的 AccessKey 列表
     */
    getAccessKeys () {
      var self = this;
      this.loadingData = true;
      api.corp.refreshToken().then(function () {
        api.empower.getAccessKeys().then(function (data) {
          self.empowers = data;
          self.loadingData = false;
        }).catch(function (error) {
          self.handleError(error);
          self.loadingData = false;
        });
      });
    },
    // 切换V1与V2
    toggleList: function () {
      var self = this;
      self.newList = !self.newList;
      self.oldList = !self.oldList;
      if (self.newList === true && self.oldList === false) {
        self.getKeys();
      } else {
        self.getAccessKeys();
      }
    },

    /**
     * 获取 新版的 AccessKey 列表
     */
    getKeys () {
      var self = this;

      this.loadingData = true;
      api.corp.refreshToken().then(function () {
        api.empower.getKeys().then(function (data) {
          if (__DEBUG__) {
            console.log(data);
          }
          self.accessKeys = data.list;
          self.loadingData = false;
        }).catch(function (error) {
          self.handleError(error);
          self.loadingData = false;
        });
      });
    },

    // 提交添加
    addKeys: function () {
      var self = this;
      if (this.addValidation.$valid && !this.adding) {
        var obj = {name: self.addModel.name};
        api.corp.refreshToken().then(function () {
          api.empower.addKeys(obj).then(function (data) {
            self.accessKeys.push(data);
            self.resetAdd();
            self.getKeys();
          }).catch(function (error) {
            self.handleError(error);
            self.adding = false;
          });
        });
      }
    },

    /**
     * 确定查看授权
     * @param  {String} id 目标授权id
     * @return {void}
     */
    onViewConfirm: function (id) {
      var self = this;
      if (this.delChecked) {
        self.deleting = true;
        api.corp.refreshToken().then(function () {
          api.empower.deleteKeys(id).then(function (data) {
            self.getKeys();
            self.onViewCancel();
          }).catch(function (error) {
            self.onViewCancel();
            self.handleError(error);
          });
        });
      }
      this.showKeyModal = false;
    },

    // 添加应用表单钩子
    addAppHook: function (form) {
      this.addForm = form;
    },
    // 关闭添加应用浮层并净化添加表单
    resetAdd: function () {
      var self = this;
      this.adding = false;
      this.showAddModal = false;
      this.addModel = _.clone(this.originAddModel);
      this.$nextTick(function () {
        self.addForm.setPristine();
      });
    },
    // 取消添加
    onAddCancel: function () {
      this.resetAdd();
    },
    // 切换状态
    togglekeys: function (accessKey) {
      var self = this;
      console.log(self);
      if (!this.toggling) {
        this.toggling = true;
        api.corp.refreshToken().then(function () {
          api.empower.toggleKeys(accessKey.id, !accessKey.status - 0)
          .then(function (data) {
            // self.getTasks();
            console.log(accessKey.status);
            if (data === 200) {
              accessKey.status = !accessKey.status - 0;
            }
            console.log(accessKey.status);
            self.toggling = false;
          }).catch(function (error) {
            self.handleError(error);
            self.toggling = false;
          });
        });
      }
    },

    /**
     * 查看密钥
     * @param  {String} accessKey AccessKey
     */
    viewAccessKeys (accessKey) {
      this.key = accessKey;
      this.showKeyModal = true;
      console.log(this.key);
    },

    /**
     * 取消查看授权
     * @return {void}
     */
    onViewCancel () {
      this.deleting = false;
      this.delChecked = false;
      this.showKeyModal = false;
    },
    // 获取V1列表
    getEmpowers () {
      var self = this;
      this.loadingData = true;
      api.corp.refreshToken().then(function () {
        api.empower.getEmpowers().then(function (data) {
          self.empowers = data;
          self.loadingData = false;
        }).catch(function (error) {
          self.handleError(error);
          self.loadingData = false;
        });
      });
    }

  }
};

</script>

<style lang="stylus" scoped>
.secret-key
  font-size 20px
.mrbthr
  margin-bottom 30px
.fr
  float left
.panel-bd .action-group .btn.frr
  float right!important
</style>
