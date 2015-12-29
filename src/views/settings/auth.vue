<template lang="jade">
  .panel
    .panel-bd
      .alert-text.alert-text-success
        p 创建Accesskey,Access Key ID 为公钥,Access Key Secret 为私钥 用于数据接口访问的系统认证.相关文档http://www.xlink.cn/developer.html "用户身份集成接口"开发文档中第三方身份集成等接口。
      //- 用户列表
      table.table.table-stripe.table-bordered
        thead
          tr
            th 名称
            th Access Key ID
            th.tac 状态
        tbody
          template(v-if="empowers.length > 0 && !loadingData")
            tr(v-for="empower in empowers | limitBy pageCount (currentPage-1)*pageCount")
              td {{empower.name}}
              td {{empower.id}}
              td.tac
                span.hl-green(v-if="empower.status===1") 启用
                span.hl-gray(v-if="empower.status===2") 禁用
          tr(v-if="loadingData")
            td.tac(colspan="3")
              .tips-null
                i.fa.fa-refresh.fa-spin
                span 数据加载中...
          tr(v-if="empowers.length === 0 && !loadingData")
            td.tac(colspan="3")
              .tips-null
                span 暂无相关记录

      pager(v-if="!loadingData", :total="empowers.length", :current.sync="currentPage", :page-count="pageCount")
</template>
<script>
  var Modal = require('../../components/modal.vue');
  var Pager = require('../../components/pager.vue');
  var api = require('../../api');

  module.exports = {
    name: 'AuthSettings',

    components: {
      'modal': Modal,
      'pager': Pager
    },

    data: function () {
      return {
        empowers: [],
        currentPage: 1,
        pageCount: 10,
        loadingData: false
      }
    },

    route: {
      data: function () {
        this.getEmpowers();
      }
    },

    methods: {
      getEmpowers: function () {
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
