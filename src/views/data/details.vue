<template lang="jade">
  section.main-wrap
    .main
      .breadcrumb
        a(v-link="{path: '/data/tables' }")
          i.fa.fa-arrow-circle-left
          | 数据管理
      .row
        .col-20
          .panel
            .panel-hd
              h2 数据表详情
            .panel-bd
              //- 数据
              table.table.table-stripe.table-bordered
                thead
                  tr
                    th ID
                    th 创建时间
                    th 更新时间
                    th 创建者
                    th.tac 操作
                tbody
                  tr(v-for="record in records")
                    td {{record.object_id}}
                    td {{record.create}}
                    td {{record.update}}
                    td {{record.creator}}
                    td.tac
                      button.btn.btn-link.btn-sm(@click="showRecord(record)") 查看
                  tr(v-if="records.length === 0")
                    td.tac(colspan="5")
                      i.fa.fa-refresh.fa-spin(v-if="$loadingRouteData")
                      .tips-null(v-else) 暂无数据记录
              pager(:total="total", :current.sync="currentPage", :page-count="pageCount")

    // 查看数据浮层
    modal(:show.sync="showModal")
      h3(slot="header") 数据详情
      //- 数据
      table.table.table-stripe.table-bordered(slot="body")
        tbody
          tr
            td ID
            td {{model.object_id}}
          tr
            td 创建时间
            td {{model.create}}
          tr
            td 更新时间
            td {{model.update}}
          tr
            td 创建者
            td {{model.creator}}
          tr
            td(colspan="2")
              strong 字段值
          tr(v-for="(key, val) in tableInfo.field")
            td {{key}}
            td {{model[key]}}
      .modal-footer(slot="footer")
        button.btn.btn-primary(@click.prevent.stop="showModal = false") 确定

</template>

<script>
  var api = require('../../api');
  var Pager = require('../../components/pager.vue');
  var Modal = require('../../components/modal.vue');
  // var SearchBox = require('../../components/search-box.vue');

  module.exports = {
    components: {
      'modal': Modal,
      // 'search-box': SearchBox,
      'pager': Pager
    },

    data: function () {
      return {
        total: 0,
        /*
        query: '',
        searching: false,
        */
        tableInfo: {},
        records: [],
        currentPage: 1,
        pageCount: 10,
        showModal: false,
        model: {
          object_id: '',
          create: '',
          update: '',
          creator: ''
        }
      };
    },

    route: {
      data: function () {
        this.getRecords();

        return {
          // records: this.getRecords(),
          // records: [],
          tableInfo: this.getTableInfo()
        }
      }
    },

    computed: {
      queryCondition: function () {
        var condition = {
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount
        };
      }
    },

    methods: {
      /*
      handleSearch: function () {
        if (this.query.length === 0) {
          this.queryData();
        }
      },

      toggleSearching: function () {
        this.searching = !this.searching;
      },

      cancelSearching: function () {
        var self = this;
        this.getAllData().then(function (data) {
          self.records = data;
        });
      },*/

      getRecords: function () {
        var self = this;
        api.corp.refreshToken().then(function () {
          api.dataTable.queryData(self.$route.params.name, self.queryCondition).then(function (data) {
            self.records = data.list;
            self.total = data.count;
            /*
            self.records = [{
              object_id: '1234',
              create: '2015-12-06T08:12:56.889Z',
              update: '2015-12-06T08:12:56.889Z',
              a: '123',
              b: false,
              c: '567',
              creator: 'xiaolu'
            }];
            */
          });
        });
      },

      getTableInfo: function () {
        var self = this;
        return api.corp.refreshToken().then(function () {
          return api.dataTable.getTable(self.$route.params.name);
        })
      },

      showRecord: function (record) {
        this.model = record;
        this.showModal = true;
      }

    }
  };
</script>
