<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="filter-bar record-overview-filter-bar">
        <div class="filter-group fl">
          <div class="filter-group-item mr20 mt5">
            <span style="font-size: 12px; font-weight:700; color:#666666">告警历史</span>
          </div>
        </div>
        <div class="filter-group fr">
          <div class="filter-group-item mr20 mt5">
            <search-box :key.sync="key" :placeholder="$t('ui.overview.addForm.search_condi')">
              <button slot="search-button" @click="" class="btn btn-primary"><i class="fa fa-search"></i></button>
            </search-box>
            <div class="record-overview-share-btn ml20">
              <a class="fa fa- fa-share-square-o"></a>
            </div>
          </div>
        </div>
      </div>
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>时间</th>
              <th>持续时长</th>
              <th>告警内容</th>
              <th>地点</th>
              <th>告警等级</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="records.length > 0">
              <tr v-for="record in records">
                <td>{{ record.createTime }}</td>
                <td>{{ record.duration }}</td>
                <td>{{ record.content}}</td>
                <td>{{ record.area }}</td>
                <td><span class="text-label-warning" style="width: 55px">中等</span></td>
                <td>{{ record.status }}</td>
              </tr>
            </template>
            <tr v-if="records.length === 0 && !loadingData">
              <td colspan="5" class="tac">
                <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getAlerts"></pager>
    </div>
  </div>
</template>

<script>
import Pager from 'components/Pager'
import SearchBox from 'components/SearchBox'
import { globalMixins } from 'src/mixins'

export default {
  name: 'record-history',

  mixins: [globalMixins],

  components: {
    Pager,
    SearchBox
  },

  data () {
    return {
      loadingData: false,
      records: [
        {
          createTime: '2016-09-18 08:19:23',
          duration: '3小时',
          content: '设备下线',
          area: '湖北 武汉',
          level: 1,
          status: 0
        }
      ]
    }
  }
}
</script>

<style lang="stylus">
.record-overview-filter-bar
  background-color #F2F2F2
  border-top solid 1px #CCCCCC
  border-left solid 1px #CCCCCC
  border-right solid 1px #CCCCCC
  height 45px
  margin-top 15px
.record-overview-share-btn
  width 24px
  display inline-block
  line-height 24px
  border solid 1px #BCBCBC
  vertical-align middle
  font-size 18px
  text-align center
</style>
