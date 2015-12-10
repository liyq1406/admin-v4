<template lang="jade">
  .panel
    .panel-bd
      .alert.alert-success
        p 创建Accesskey,Access Key ID 为公钥,Access Key Secret 为私钥 用于数据接口访问的系统认证.相关文档http://www.xlink.cn/developer.html "用户身份集成接口"开发文档中第三方身份集成等接口。
      //- 用户列表
      table.table.table-stripe.table-bordered
        thead
          tr
            th 名称
            th Access Key ID
            th.tac 状态
        tbody
          tr(v-for="empower in empowers | limitBy pageCount (currentPage-1)*pageCount")
            td {{empower.name}}
            td {{empower.id}}
            td.tac
              span.hl-green(v-if="empower.status===1") 启用
              span.hl-gray(v-if="empower.status===2") 禁用
          tr(v-if="empowers.length === 0")
            td.tac(colspan="3")
              i.fa.fa-refresh.fa-spin(v-if="$loadingRouteData")
              .tips-null(v-else) 暂无授权信息

      pager(:total="empowers.length", :current.sync="currentPage", :page-count="pageCount")
</template>
<script>
  var Modal = require('../../components/modal.vue');
  var Pager = require('../../components/pager.vue');
  var api = require('../../api');

  module.exports = {
    components: {
      'modal': Modal,
      'pager': Pager
    },

    data: function () {
      return {
        empowers: [],
        currentPage: 1,
        pageCount: 10
      }
    },

    route: {
      data: function () {
        return {
          empowers: this.getEmpowers()
        }
      }
    },

    methods: {
      getEmpowers: function () {
        return api.corp.refreshToken().then(function () {
          return api.empower.getEmpowers();
        });
      }
    }
  };

</script>
