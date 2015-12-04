<template lang="jade">
  .panel
    .panel-hd
      p 授权管理
    .panel-bd
          //- 用户列表
          table.table.table-stripe.table-bordered
            thead
              tr
                th 名称
                th Access Key ID
                th.tac 操作
            tbody(v-for="empower in empowers")
                tr
                  td {{empower.name}}
                  td {{empower.id}}
                  td.tac.hl-green(v-if="empower.status==1") 启用
                  td.tac.hl-gray(v-if="empower.status==2") 禁用
          .pager.tar
            button.pager-btn.pager-prev
              i.fa.fa-chevron-left
            input.pager-input(type="text")
            button.pager-btn.pager-next
              i.fa.fa-chevron-right
</template>
<script>
  var Modal = require('../../components/modal.vue');
  var api = require('../../api');

  module.exports = {
    components: {

      'modal': Modal,
      'api': api
    },

    data: function () {
      return {
        empowers:[]
      }
    },

    route: {
      data: function () {
        var self = this;
        api.corp.refreshToken().then(function () {
          /*api.empower.createEmpower({"name":"123312311223"}).then(function (data) {
            if(__DEBUG__) {
              console.log(data);

            }
          });*/
          api.empower.getEmpowers().then(function (data) {
            if(__DEBUG__) {
              console.log(data);
              self.empowers=data;
            }
          });

        })
        return {};
      }
    },

    methods: {

    }
  };

</script>