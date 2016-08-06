<template>
  <div class="panel no-split-line">
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="filter-bar">
          <div class="filter-group fl">
            <span class="table-title">设备列表</span>
            <!-- <div class="filter-group-item">
              <v-select label="全部" width='110px' size="small">
                <span slot="label">显示</span>
              </v-select>
            </div> -->
          </div>
          <div class="filter-group fr">
            <!-- <div class="filter-group-item">
              <dropdown></dropdown>
            </div> -->
            <div class="filter-group-item">
              <search-box :key.sync="query" :active="searching" placeholder="请输入搜索内容">
              </search-box>
            </div>
          </div>
        </div>
        <c-table
          :headers="headers"
          :tables="tables | filterBy query in 'id' 'mac'"
          :loading="tableLoadingData"
          @theader-active-date="sortBysomeKey"
          @theader-is-online="sortBysomeKey">
        </c-table>
      </div>
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
import Table from 'components/Table'
import { formatDate } from 'src/filters'

export default {
  name: 'device-list',

  mixins: [globalMixins],

  components: {
    SearchBox,
    Dropdown,
    'v-select': Select,
    'c-table': Table,
    Pager
  },

  data () {
    return {
      searching: false,
      query: '',
      version: 0, // 当前的版本号
      tableLoadingData: false,
      orderKey: 'active_date', // 默认按时间排序
      subDevices: [ // 用户绑定设备列表
        // {
        //   'id': '设备ID',
        //   'mac': '设备MAC地址',
        //   'is_active': true, // 是否激活
        //   'active_date': '2015-10-09T08:15:40.843Z',
        //   'is_online': false, // 是否在线
        //   'last_login': '2015-10-09T08:15:40.843Z',
        //   'active_code': '激活码',
        //   'authorize_code': '认证码',
        //   'mcu_mod': 'MCU型号',
        //   'mcu_version': 'MCU版本号',
        //   'firmware_mod': '固件型号',
        //   'firmware_version': '固件版本号',
        //   'product_id': '所属的产品ID',
        //   'access_key': '设备访问码'
        // }
      ],
      headers: [
        {
          key: 'mac',
          title: 'MAC'
        },
        {
          key: 'id',
          title: '设备ID'
        },
        {
          key: 'is_active',
          title: '是否激活',
          tooltips: '提示'
        },
        {
          key: 'active_date',
          title: '激活时间',
          sortType: -1
        },
        {
          key: 'is_online',
          title: '是否在线',
          sortType: -1
        }
      ]
    }
  },

  computed: {
    /**
     * 传入智能表格的数据对象
     * 国辉
     * @return {[type]} [description]
     */
    tables () {
      var result = []
      this.subDevices.map((device) => {
        var table = {
          id: device.id,
          mac: device.mac,
          is_active: device.is_active ? '是' : '否', // 是否激活
          active_date: formatDate(device.active_date),
          is_online: device.is_online ? '是' : '否', // 是否在线
          prototype: device
        }
        result.push(table)
      })
      var order = this.order
      // 按照是否在线排序
      if (this.orderKey === 'is_online') {
        result.sort((a, b) => {
          if (order[this.orderKey] === 1) {
            return a.prototype[this.orderKey]
          } else {
            return !a.prototype[this.orderKey]
          }
        })
      }
      // 按照时间排序
      if (this.orderKey === 'active_date') {
        result.sort((a, b) => {
          return (new Date(a.prototype[this.orderKey]) - new Date(b.prototype[this.orderKey])) * order[this.orderKey]
        })
      }
      return result
    },
    /**
     * 当前需要排序的对象
     * 国辉
     * @return {[type]} [description]
     */
    order () {
      var result = {}
      this.headers.map((item) => {
        if (item.sortType) {
          result[item.key] = (item.sortType === 1 ? 1 : -1)
        }
      })
      return result
    }
  },
  route: {
    data () {
      this.getSubDevices()
    }
  },

  methods: {
    /**
     * 按某个属性排序
     * @param  {[type]} header [description]
     * @param  {[type]} index  [description]
     * @return {[type]}        [description]
     */
    sortBysomeKey (header, index) {
      if (header.sortType === 1) {
        header.sortType = -1
      } else {
        header.sortType = 1
      }
      this.orderKey = header.key
      this.headers.$set(index, header)
    },
    /**
     * 获取用户订阅设备
     */
    getSubDevices () {
      this.tableLoadingData = true
      api.user.subDeviceList(this.$route.params.id, this.version).then((res) => {
        if (res.status === 200) {
          this.tableLoadingData = false
          this.subDevices = res.data.list
          this.version = res.data.version
        }
      }).catch((res) => {
        this.tableLoadingData = false
        // this.handleError(res)
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  .table-title
    height 30px
    line-height 30px
    font-size 14px

</style>
