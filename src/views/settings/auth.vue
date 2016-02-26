<template lang="jade">
.panel
  .panel-bd
    .alert-text.alert-text-success
      p {{ $t("auth_management.intro") }}
    table.table.table-stripe.table-bordered
      thead
        tr
          th {{ $t("common.name") }}
          th Access Key ID
          th.tac Access Key Secret
      tbody
        template(v-if="accessKeys.length > 0 && !loadingData")
          tr(v-for="accessKey in accessKeys | limitBy pageCount (currentPage-1)*pageCount")
            td {{accessKey.name}}
            td {{accessKey.access_id}}
            td.tac
              button.btn.btn-link.btn-sm(@click="viewAccessKey(accessKey.secret)") {{ $t('common.details') }}
        tr(v-if="loadingData")
          td.tac(colspan="3")
            .tips-null
              i.fa.fa-refresh.fa-spin
              span {{ $t("common.data_loading") }}
        tr(v-if="accessKeys.length === 0 && !loadingData")
          td.tac(colspan="3")
            .tips-null
              span {{ $t("common.no_records") }}
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
      .secret-key.tac(slot="body") {{secretKey}}
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
      // empowers: [],
      accessKeys: [],
      currentPage: 1,
      pageCount: 10,
      loadingData: false,
      showKeyModal: false,
      secretKey: ''
    };
  },

  route: {
    data: function () {
      // this.getEmpowers();
      this.getAccessKeys();
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
          self.accessKeys = data;
          self.loadingData = false;
        }).catch(function (error) {
          self.handleError(error);
          self.loadingData = false;
        });
      });
    },

    /**
     * 查看密钥
     * @param  {String} secret 密钥
     */
    viewAccessKey (secret) {
      this.secretKey = secret;
      this.showKeyModal = true;
    }

    /*
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
    */
  }
};

</script>

<style lang="stylus" scoped>
.secret-key
  font-size 20px
</style>
