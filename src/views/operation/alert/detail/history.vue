<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <div class="filter-bar">
          <div class="filter-group fr">
            <!-- <div class="filter-group-item">
              <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
            </div> -->
            <div class="filter-group-item">
              <search-box :key.sync="key" :placeholder="$t('ui.overview.addForm.search_condi')" :active="searching" @cancel="getList()" @search="getList()" @press-enter="getList()">
                <button slot="search-button" @click="getList()" class="btn btn-primary"><i class="fa fa-search"></i></button>
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
                <td>{{ record.create_date | formatDate }}</td>
                <td>{{ record.lasting }}h</td>
                <td>{{ record.alert_name }}</td>
                <td>{{ record.location}}</td>
                <td>
                  <template v-if="record.tags"><span v-for="tag in record.tags | toTags" :class="{'text-label-danger':tag==='严重', 'text-label-info':tag==='轻微'}" class="text-label">{{ alert.tag }}</span></template>
                </td>
                <td><span v-if="record.is_read">已处理</span><span v-else>未处理</span></td>
              </tr>
            </template>
            <tr v-if="records.length === 0 && !loadingData">
              <td colspan="6" class="tac">
                <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getList"></pager>
    </div>
  </div>
</template>

<script>
import api from 'api'
import * as config from 'consts/config'
import Pager from 'components/Pager'
import SearchBox from 'components/SearchBox'
import { globalMixins } from 'src/mixins'
import { formatDate } from 'src/filters'

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
      records: [],
      deviceID: '',
      key: '',
      total: 0,
      countPerPage: config.COUNT_PER_PAGE,
      currentPage: 1
    }
  },

  ready () {
    this.getList()
  },

  computed: {

    queryCondition () {
      var condition = {
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {},
        query: {
          from: {
            $in: [this.deviceID]
          }
        }
      }
      if (this.key !== '') {
        condition.query.id = {$in: [this.key]}
      }

      return condition
    }
  },
  methods: {
    // 获取告警历史@author weijie
    getList () {
      var params = {
        offset: 0,
        limit: 30,
        query: {
          // _id: this.$route.params.id
          id: {
            $in: [this.$route.params.id]
          }
        }
      }
      // 先获取当前告警详情设备ID
      api.alert.getAlerts(params).then((res) => {
        if (res.status === 200) {
          this.total = res.data.count
          this.deviceID = res.data.list[0].from
          // 再获取当前设备的告警记录列表
          // var item = {
          //   offset: 0,
          //   limit: 30,
          //   query: {
          //     // _id: this.$route.params.id
          //     from: {
          //       $in: [this.deviceID]
          //     }
          //   }
          // }
          api.alert.getAlerts(this.queryCondition).then((res) => {
            if (res.status === 200) {
              // console.log(res.data.list)
              // this.alerts = res.data.list
              this.records = res.data.list.map((item) => {
                // 计算已读告警持续时间
                if (item.is_read) {
                  let beginTime = new Date(formatDate(item.create_date))
                  let endTime = new Date(formatDate(item.read_time))
                  let lasting = (endTime.getTime() - beginTime.getTime()) / 3600000
                  // console.log(lasting.toFixed(1))
                  item.lasting = lasting.toFixed(1)
                } else {
                  // 计算未读告警持续时间
                  let beginTime = new Date(formatDate(item.create_date))
                  let endTime = new Date()
                  let lasting = (endTime.getTime() - beginTime.getTime()) / 3600000
                  // console.log(lasting.toFixed(1))
                  item.lasting = lasting.toFixed(1)
                }
                return item
              })
            }
          }).catch((res) => {
            this.handleError(res)
          })
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>
