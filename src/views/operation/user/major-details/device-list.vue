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
              <search-box :key.sync="query" :active="searching" @cancel="getSubDevices" placeholder="请输入搜索内容" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getSubDevices">
                <button slot="search-button" @click="getSubDevices" class="btn btn-primary"><i class="fa fa-search"></i></button>
                <!-- <label>{{ $t('ui.user.search_user') }}</label> -->
              </search-box>
            </div>
          </div>
        </div>
        <c-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" @theader-device-sum="sortBySomeKey" @theader-create-time="sortBySomeKey">
        </c-table>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
import { globalMixins } from 'src/mixins'
import SearchBox from 'components/SearchBox'
import Select from 'components/Select'
import { formatDate } from 'src/filters'
import Table from 'components/Table'

export default {
  name: 'device-list',

  mixins: [globalMixins],

  components: {
    SearchBox,
    'v-select': Select,
    'c-table': Table

  },

  data () {
    return {
      searching: false,
      query: '',
      total: 0,
      currentPage: 1,
      countPerPage: 10,
      loadingData: false,
      subDevices: [ // 用户绑定设备列表
        {
          'id': '设备ID',
          'mac': 'MAC地址',
          'name': '设备名称',
          'is_active': '是否激活',
          'active_date': '激活时间',
          'is_online': '是否在线',
          'last_login': '最近登录时间',
          'last_login_ip': '最近登录IP',
          'mcu_mod': 'MCU型号',
          'mcu_version': 'MCU版本号',
          'firmware_mod': '固件型号',
          'firmware': '固件版本号',
          'product_id': '产品ID',
          'region_id': '所在区域ID',
          'sn': '设备序列号',
          'create_time': '创建时间',
          'creator_id': '创建者ID',
          'creator_type': '创建者类型',
          'heavy_buyer': '大客户Id'
        }
      ],
      headers: [
        {
          key: 'name',
          title: '产品名称（型号）'
        },
        {
          key: 'mac',
          title: 'MAC'
        },
        {
          key: 'sn',
          title: '序号号（sn）'
          // tooltip: '提示内容'
        },
        {
          key: 'is_active',
          title: '是否激活',
          sortType: '-1'
        },
        {
          key: 'active_date',
          title: '激活时间',
          sortType: '-1'
        },
        {
          key: 'is_online',
          title: '在线状态',
          class: 'tac',
          sortType: '-1'
        }
      ],
      // 当前用于排序的字段
      sortKey: ''
    }
  },

  computed: {
    /**
     * 传入智能表格的分页对象
     * 国辉
     * @return {[type]} [description]
     */
    page () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },
    /**
     * 传入智能表格的数据对象
     * 国辉
     * @return {[type]} [description]
     */
    tables () {
      var result = []
      this.subDevices.map((device) => {
        var table = {
          name: device.name,
          mac: device.mac,
          sn: device.sn,
          is_active: this.computedStatus(device.is_active),
          active_date: formatDate(device.active_date),
          is_online: device.is_online,
          prototype: device
        }
        result.push(table)
      })
      return result
    },
    queryCondition () {
      var condition = {
        filter: [
          'id',
          'mac',
          'name',
          'is_active',
          'active_date',
          'is_online',
          'last_login',
          'last_login_ip',
          'mcu_mod',
          'mcu_version',
          'firmware_mod',
          'firmware',
          'product_id',
          'region_id',
          'sn',
          'create_time',
          'creator_id',
          'creator_type',
          'heavy_buyer'
        ],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {},
        query: {}
      }

      if (this.query.length > 0) {
        condition.query['account'] = { $like: this.query }
      }

      this.headers.map((item) => {
        if (item.sortType && (item.key === this.sortKey)) {
          condition.order[item.key] = (item.sortType === 1 ? 'asc' : 'desc')
        }
      })

      return condition
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
    },
    /**
     * 按某个属性排序
     * 国辉
     * @param  {[type]} table [description]
     * @return {[type]}       [description]
     */
    sortBySomeKey (header, index) {
      this.sortKey = header.key
      if (header.sortType === 1) {
        header.sortType = -1
      } else {
        header.sortType = 1
      }
      this.headers.$set(index, header)
      this.getSubDevices()
    }
  }
}
</script>
