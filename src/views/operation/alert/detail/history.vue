<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <div class="filter-bar">
          <div class="filter-group fr">
            <div class="filter-group-item">
              <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
            </div>
            <div class="filter-group-item">
              <search-box :key.sync="key" :placeholder="$t('ui.overview.addForm.search_condi')">
                <button slot="search-button" @click="" class="btn btn-primary"><i class="fa fa-search"></i></button>
              </search-box>
            </div>
          </div>
          <h3>告警历史</h3>
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
