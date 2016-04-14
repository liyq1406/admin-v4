<template>
  <div class="panel">
    <div class="panel-bd">
      <table class="table table-stripe table-bordered wrongcodetable">
        <thead>
          <tr>
            <th>故障码</th>
            <th>故障</th>
            <th>时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records| limitBy pageCount (currentPage-1)*pageCount">
            <td>{{ record.code }}</td>
            <td>{{ record.fault }}</td>
            <td>{{ record.time }}</td>
            <td class="tac">
              <button @click="editRecord(record)" class="btn btn-link btn-sm">{{ $t("common.del") }}</button>
            </td>
          </tr>
          <tr v-if="records.length === 0">
            <td colspan="4" class="tac"><i v-if="$loadingRouteData" class="fa fa-refresh fa-spin"></i>
              <div v-else="v-else" class="tips-null">{{ $t("common.no_records") }}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <pager v-if="!loadingRecord && records.length > pageCount" :total="records.length" :current.sync="currentPage" :page-count="pageCount"></pager>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from '../../../../mixins'
  import Pager from '../../../../components/Pager'

  export default {
    name: 'BasicInfo',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'pager': Pager
    },

    data () {
      return {
        records: [
          {
            code: 123456,
            fault: '故障',
            time: '2016-3-30 13:40'
          },
          {
            code: 123456,
            fault: '故障',
            time: '2016-3-30 13:40'
          },
          {
            code: 123456,
            fault: '故障',
            time: '2016-3-30 13:40'
          },
          {
            code: 123456,
            fault: '故障',
            time: '2016-3-30 13:40'
          },
          {
            code: 123456,
            fault: '故障',
            time: '2016-3-30 13:40'
          },
          {
            code: 123456,
            fault: '故障',
            time: '2016-3-30 13:40'
          },
          {
            code: 123456,
            fault: '故障',
            time: '2016-3-30 13:40'
          },
          {
            code: 123456,
            fault: '故障',
            time: '2016-3-30 13:40'
          },
          {
            code: 123456,
            fault: '故障',
            time: '2016-3-30 13:40'
          },
          {
            code: 123456,
            fault: '故障',
            time: '2016-3-30 13:40'
          },
          {
            code: 123456,
            fault: '故',
            time: '2016-3-30 13:40'
          }
        ],
        loadingRecord: false,
        currentPage: 1,
        pageCount: 10
      }
    },

    methods: {
      editRecord (params) {
        console.log(params)
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../../assets/stylus/common'
  .wrongcodetable,.wrongcodetable th
    text-align center
</style>
