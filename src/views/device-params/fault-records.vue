<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <table class="table table-stripe table-bordered wrongcodetable">
          <thead>
            <tr>
              <th>故障码</th>
              <th>故障</th>
              <th>时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in records">
              <td>{{ record.alert_value }}</td>
              <td>{{ record.content }}</td>
              <td>{{ record.create_date }}</td>
            </tr>
            <tr v-if="records.length === 0 && !loadingData">
              <td colspan="3" class="tac">
                <div class="tips-null">{{ $t("common.no_records") }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage"  @page-update="pageUpdate"></pager>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import Pager from 'components/Pager'
  import api from 'api'
  import * as config from 'consts/config'

  export default {
    name: 'BasicInfo',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'pager': Pager
    },

    data () {
      return {
        records: [],
        loadingData: false,
        currentPage: 1,
        countPerPage: config.COUNT_PER_PAGE,
        total: 0
      }
    },
    ready () {
      this.getFault()
    },

    methods: {
      // 获取快照数据
      getFault (offset, limit, deviceId) {
        offset = offset || 0
        limit = limit || 10
        deviceId = this.$route.params.device_id
        var params = {
          offset: offset,
          limit: limit,
          query: {
            'from': Number(deviceId)
          }
        }
        this.loadingData = true
        api.snapshot.getFault(params).then((res) => {
          var records = res.data.list
          records.map(function (item) {
            item.create_date = item.create_date.replace(/t/i, ' ')
            item.create_date = item.create_date.replace(/z/i, '')
            item.create_date = item.create_date.replace('.' + item.create_date.split('.')[1], '')
          })
          this.records = records
          this.total = res.data.count
          this.loadingData = false
        }).catch((res) => {
          this.handleError(res)
        })
      },
      pageUpdate (offset) {
        this.getSnapshot((offset - 1) * 10, this.countPerPage)
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../assets/stylus/common'
  .wrongcodetable,.wrongcodetable th
    text-align center
</style>
