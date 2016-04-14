<template>
  <section class="main-wrap">
    <div class="main">
      <div class="breadcrumb"><a v-link="{path: '/data/tables' }"><i class="fa fa-arrow-circle-left"></i>{{ $t("nav_aside.data") }}</a></div>
      <div class="row">
        <div class="col-20">
          <div class="panel">
            <div class="panel-hd">
              <h2>{{ $t("table.details") }}</h2>
            </div>
            <div class="panel-bd">
              <table class="table table-stripe table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{{ $t("table_record.fields.create") }}</th>
                    <th>{{ $t("table_record.fields.update") }}</th>
                    <th>{{ $t("table_record.fields.creator") }}</th>
                    <th class="tac">{{ $t("common.action") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="record in records">
                    <td>{{ record.objectId }}</td>
                    <td>{{ record.createAt | formatDate }}</td>
                    <td>{{ record.updateAt | formatDate }}</td>
                    <td>{{ record.creator }}</td>
                    <td class="tac">
                      <button @click="showRecord(record)" class="btn btn-link btn-sm">{{ $t("common.details") }}</button>
                    </td>
                  </tr>
                  <tr v-if="records.length === 0">
                    <td colspan="5" class="tac"><i v-if="$loadingRouteData" class="fa fa-refresh fa-spin"></i>
                      <div v-else="v-else" class="tips-null">{{ $t("common.no_records") }}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <pager v-if="records.length > pageCount" :total="total" :current.sync="currentPage" :page-count="pageCount"></pager>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 查看数据浮层-->
    <modal :show.sync="showModal">
      <h3 slot="header">{{ $t("table_record.details") }}</h3>
      <table slot="body" class="table table-stripe table-bordered">
        <tbody>
          <tr>
            <td>ID</td>
            <td>{{ model.objectId }}</td>
          </tr>
          <tr>
            <td>{{ $t("table_record.fields.create") }}</td>
            <td>{{ model.createAt | formatDate }}</td>
          </tr>
          <tr>
            <td>{{ $t("table_record.fields.update") }}</td>
            <td>{{ model.updateAt | formatDate }}</td>
          </tr>
          <tr>
            <td>{{ $t("table_record.fields.creator") }}</td>
            <td>{{ model.creator }}</td>
          </tr>
          <tr>
            <td colspan="2"><strong>{{ $t("table_record.value") }}</strong></td>
          </tr>
          <tr v-for="(key, val) in tableInfo.field">
            <td>{{ key }}</td>
            <td style="word-break: break-all;"><span v-if="key==='createAt' || key==='updateAt'">{{ model[key] | formatDate }}</span><span v-else="v-else">{{ model[key] }}</span></td>
          </tr>
        </tbody>
      </table>
      <div slot="footer" class="modal-footer">
        <button @click.prevent.stop="showModal = false" class="btn btn-primary">{{ $t("common.ok") }}</button>
      </div>
    </modal>
  </section>
</template>

<script>
  import api from '../../api'
  import Pager from '../../components/Pager'
  import Modal from '../../components/Modal'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'TableDetails',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'modal': Modal,
      'pager': Pager
    },

    data () {
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
      }
    },

    route: {
      data () {
        this.getRecords()
        return {
          tableInfo: this.getTableInfo()
        }
      }
    },

    computed: {
      queryCondition () {
        var condition = {
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount
        }
        return condition
      }
    },

    methods: {
      getRecords () {
        api.dataTable.queryData(this.$route.params.name, this.queryCondition).then((res) => {
          if (res.status === 200) {
            this.records = res.data.list
            this.total = res.data.count
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      getTableInfo () {
        return api.dataTable.getTable(this.$route.params.name)
      },

      showRecord (record) {
        api.dataTable.getData(this.$route.params.name, escape(record.objectId)).then((res) => {
          if (res.status === 200) {
            this.model = res.data
            this.showModal = true
          }
        })
      }
    }
  }
</script>
