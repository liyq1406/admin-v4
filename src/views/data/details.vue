<template lang="jade">
section.main-wrap
  .main
    .breadcrumb
      a(v-link="{path: '/data/tables' }")
        i.fa.fa-arrow-circle-left
        | {{ $t("nav_aside.data") }}
    .row
      .col-20
        .panel
          .panel-hd
            h2 {{ $t("table.details") }}
          .panel-bd
            //- 数据
            table.table.table-stripe.table-bordered
              thead
                tr
                  th ID
                  th {{ $t("table_record.fields.create") }}
                  th {{ $t("table_record.fields.update") }}
                  th {{ $t("table_record.fields.creator") }}
                  th.tac {{ $t("common.action") }}
              tbody
                tr(v-for="record in records")
                  td {{record.objectId}}
                  td {{record.createAt | formatDate}}
                  td {{record.updateAt | formatDate}}
                  td {{record.creator}}
                  td.tac
                    button.btn.btn-link.btn-sm(@click="showRecord(record)") {{ $t("common.details") }}
                tr(v-if="records.length === 0")
                  td.tac(colspan="5")
                    i.fa.fa-refresh.fa-spin(v-if="$loadingRouteData")
                    .tips-null(v-else) {{ $t("common.no_records") }}
            pager(v-if="records.length > pageCount", :total="total", :current.sync="currentPage", :page-count="pageCount")

  // 查看数据浮层
  modal(:show.sync="showModal")
    h3(slot="header") {{ $t("table_record.details") }}
    //- 数据
    table.table.table-stripe.table-bordered(slot="body")
      tbody
        tr
          td ID
          td {{model.objectId}}
        tr
          td {{ $t("table_record.fields.create") }}
          td {{model.createAt | formatDate}}
        tr
          td {{ $t("table_record.fields.update") }}
          td {{model.updateAt | formatDate}}
        tr
          td {{ $t("table_record.fields.creator") }}
          td {{model.creator}}
        tr
          td(colspan="2")
            strong {{ $t("table_record.value") }}
        tr(v-for="(key, val) in tableInfo.field")
          td {{key}}
          td(style="word-break: break-all;")
            span(v-if="key==='createAt' || key==='updateAt'") {{model[key] | formatDate}}
            span(v-else) {{model[key]}}
    .modal-footer(slot="footer")
      button.btn.btn-primary(@click.prevent.stop="showModal = false") {{ $t("common.ok") }}
</template>

<script>
  import api from '../../api';
  import Pager from '../../components/pager.vue';
  import Modal from '../../components/modal.vue';

  module.exports = {
    name: 'TableDetails',

    components: {
      'modal': Modal,
      'pager': Pager
    },

    data: function () {
      return {
        total: 0,
        tableInfo: {},
        records: [],
        currentPage: 1,
        pageCount: 10,
        showModal: false,
        model: {
          objectId: '',
          createAt: '',
          updateAt: '',
          creator: ''
        }
      };
    },

    route: {
      data: function () {
        this.getRecords();
        return {
          tableInfo: this.getTableInfo()
        };
      }
    },

    computed: {
      queryCondition: function () {
        var condition = {
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount
        };
        return condition;
      }
    },

    methods: {
      getRecords: function () {
        var self = this;
        api.corp.refreshToken().then(function () {
          api.dataTable.queryData(self.$route.params.name, self.queryCondition).then(function (data) {
            self.records = data.list;
            self.total = data.count;
          }).catch(function (error) {
            self.handleError(error);
          });
        });
      },

      getTableInfo: function () {
        var self = this;
        return api.corp.refreshToken().then(function () {
          return api.dataTable.getTable(self.$route.params.name);
        });
      },

      showRecord: function (record) {
        api.corp.refreshToken().then(() => {
          api.dataTable.getData(this.$route.params.name, escape(record.objectId)).then((data) => {
            this.model = data;
            this.showModal = true;
          });
        });
      }
    }
  };
</script>
