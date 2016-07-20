<template>
  <div class="panel no-split-line">
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <div class="filter-bar">
          <div class="filter-group fl">
            <div class="filter-group-item">
              <v-select label="全部" width='110px' size="small">
                <span slot="label">显示</span>
              </v-select>
            </div>
          </div>
          <div class="filter-group fr">
            <div class="filter-group-item">
              <dropdown></dropdown>
            </div>
            <div class="filter-group-item">
              <search-box :key.sync="query" :active="searching" @cancel="getSubDevices" placeholder="请输入搜索内容" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getSubDevices">
                <button slot="search-button" @click="getSubDevices" class="btn btn-primary"><i class="fa fa-search"></i></button>
                <!-- <label>{{ $t('ui.user.search_user') }}</label> -->
              </search-box>
            </div>
          </div>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>MAC</th>
              <th>设备ID</th>
              <th>是否激活</th>
              <th>激活时间</th>
              <th>在线状态</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="subDevices.length > 0">
              <tr v-for="device in devices">
                <td><a href="#" class="hl-red">{{ device.id }}</a></td>
                <td>{{ device.mac }}</td>
                <td>{{ device.device_id }}</td>
                <td>{{ device.is_active }}</td>
                <td>{{ device.active_time | formatDate }}</td>
                <td><span v-if="device.is_online===0">下线</span><span v-if="device.is_online===1">在线</span></td>
              </tr>
            </template>
            <tr v-if="subDevices.length === 0">
              <td colspan="6" class="tac">
                <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getSubDevices"></pager>
    </div>
  </div>
</template>

<script>
import api from 'api'
import { globalMixins } from 'src/mixins'
import SearchBox from 'components/SearchBox'
import Dropdown from 'components/Dropdown'
import Select from 'components/Select'
import Pager from 'components/Pager'

export default {
  name: 'device-list',

  mixins: [globalMixins],

  components: {
    SearchBox,
    Dropdown,
    'v-select': Select,
    Pager
  },

  data () {
    return {
      searching: false,
      query: '',
      subDevices: [], // 用户绑定设备列表
      devices: [
        {
          id: 'dsfadfwew',
          mac: 'asdasdfaffw',
          device_id: 'sdasdfasdfasd',
          is_active: 0,
          active_time: '2016-1-1 19:21:32',
          is_online: 0
        }
      ]
    }
  },

  route: {
    data () {
      this.getSubDevices()
    }
  },

  methods: {
    /**
     * 获取用户订阅设备
     */
    getSubDevices () {
      api.user.subDeviceList(this.$route.params.id).then((res) => {
        if (res.status === 200) {
          this.subDevices = res.data
        }
      }).catch((res) => {
        // this.handleError(res)
      })
    },

    // 搜索
    handleSearch () {
      if (this.query.length === 0) {
        this.getSubDevices()
      }
    },

    // 切换搜索
    toggleSearching () {
      this.searching = !this.searching
    },

    // 取消搜索
    cancelSearching () {
      this.getSubDevices()
    }
  }
}
</script>
