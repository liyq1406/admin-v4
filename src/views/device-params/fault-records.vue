<template>
  <div class="panel">
    <div class="panel-bd">
      <table class="table table-stripe table-bordered wrongcodetable">
        <thead>
          <tr>
            <th>故障码</th>
            <th>故障</th>
            <th>时间</th>
            <!-- <th>操作</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records| limitBy pageCount (currentPage-1)*pageCount">
            <td>{{ record.content }}</td>
            <td v-if="record.content==='A12'">低压告警</td>
            <td v-if="record.content==='A13'">高压告警</td>
            <td v-if="record.content==='A21'">水温探头故障</td>
            <td v-if="record.content==='A22'">外机探头故障</td>
            <td v-if="record.content==='A23'">排气探头故障</td>
            <td v-if="record.content==='A25'">环境探头故障</td>
            <td v-if="record.content==='A26'">回气探头故障</td>
            <td v-if="record.content==='A41'">电流过载保护</td>
            <td v-if="record.content==='A71'">电加热异常</td>
            <td v-if="record.content==='A51'">和外机板连线中断</td>
            <td v-if="record.content==='A61'">排气温度过高</td>
            <td>{{ record.create_date }}</td>
            <!-- <td class="tac">
              <button @click="editRecord(record)" class="btn btn-link btn-sm">{{ $t("common.del") }}</button>
            </td> -->
          </tr>
          <tr v-if="records.length === 0">
            <td colspan="3" class="tac"><i v-if="$loadingRouteData" class="fa fa-refresh fa-spin"></i>
              <div v-else class="tips-null">{{ $t("common.no_records") }}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <pager v-if="!loadingRecord && records.length > pageCount" :total="records.length" :current.sync="currentPage" :page-count="pageCount"  @page-update="pageUpdate"></pager>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from '../../mixins'
  import Pager from '../../components/Pager'
  import api from '../../api'

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
            content: 'A12',
            create_date: '2016-3-30 13:40'
          },
          {
            content: 'A13',
            create_date: '2016-3-30 13:40'
          }
        ],
        loadingRecord: false,
        currentPage: 1,
        pageCount: 10
      }
    },
    ready () {
      // console.log(1111)
      // console.log(this.$route.params.product_id)
      // console.log(this.$route.params.device_id)
      this.getFault()
    },

    methods: {
      // 获取快照数据
      getFault (offset, limit, device_id) {
        offset = offset || 0
        limit = limit || 10
        device_id = this.$route.params.device_id
        var params = {
          offset: offset,
          limit: limit,
          query: {
            from: device_id
          }
        }
        this.loadingRecord = true
        api.snapshot.getFault(params).then((res) => {
          this.records = res.data.list
          this.loadingRecord = false
        }).catch((res) => {
          this.handleError(res)
        })
      },
      pageUpdate (offset) {
        this.getSnapshot((offset - 1) * 10, this.pageCount)
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../assets/stylus/common'
  .wrongcodetable,.wrongcodetable th
    text-align center
</style>
