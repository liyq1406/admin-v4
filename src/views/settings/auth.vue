<template lang="jade">
.panel
  .panel-bd
    .alert-text.alert-text-success.mt20.mb20
      p {{ $t("auth_management.intro") }}
    //- 用户列表
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

    pager(v-if="!loadingData", :total="empowers.length", :current.sync="currentPage", :page-count="pageCount")
</template>
<script>
  import Modal from '../../components/modal.vue';
  import Pager from '../../components/pager.vue';
  import api from '../../api';

  export default {
    name: 'AuthSettings',

    components: {
      'modal': Modal,
      'pager': Pager
    },

    data () {
      return {
        empowers: [],
        currentPage: 1,
        pageCount: 10,
        loadingData: false
      };
    },

    route: {
      data: function () {
        this.getEmpowers();
      }
    },

    methods: {
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
