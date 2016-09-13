<template>
  <div class="panel user-device-list">
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="filter-bar">
          <div class="filter-group fl">
            <span class="table-title">设备列表</span>
          </div>
          <div class="filter-group fr">
            <div class="filter-group-item">
              <search-box :key.sync="query" :active="searching" placeholder="请输入搜索内容">
              </search-box>
            </div>
          </div>
        </div>
        <x-table
          :headers="headers"
          :tables="tables | filterBy query in 'id' 'mac'"
          :loading="tableLoadingData"
          @theader-active-date="sortBysomeKey"
          @theader-is-online="sortBysomeKey">

        </x-table>
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
    'x-select': Select,
    'x-table': Table,
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
        //   'id': '1725038552', // 设备id
        //   'mac': '设备MAC地址',
        //   'is_active': true, // 是否激活
        //   'active_date': '2015-10-09T08:15:40.843Z', // 激活时间
        //   'is_online': false, // 是否在线
        //   'product_id': '123123', // 所属的产品ID
        //   'sn': '1231', // 设备序列号
        //   'role': '0', // 0为管理员,1为用户
        //   'last_login': '2015-10-09T08:15:40.843Z',
        //   'active_code': '激活码',
        //   'authorize_code': '认证码',
        //   'mcu_mod': 'MCU型号',
        //   'mcu_version': 'MCU版本号',
        //   'firmware_mod': '固件型号',
        //   'firmware_version': '固件版本号',
        //   'access_key': '设备访问码'
        // }
      ],
      products: [],
      headers: [
        {
          key: 'name',
          title: '产品名称(型号)'
        },
        {
          key: 'mac',
          title: 'MAC'
        },
        {
          key: 'sn',
          title: '序列号（sn）'
        },
        {
          key: 'active_date',
          title: '激活时间',
          sortType: -1
        },
        {
          key: 'is_online',
          title: '在线状态'
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
        var product = {}
        this.products.forEach((item) => {
          if (item.id === device.product_id) {
            product = item
          }
        })
        var table = {
          name: this.computedName(product.name, device.role, product.mode),
          mac: device.mac,
          sn: device.sn, // 是否激活
          active_date: formatDate(device.active_date),
          is_online: device.is_online ? '在线' : '离线', // 是否在线
          prototype: device
        }
        result.push(table)
      })
      let sortType = -1
      this.headers.forEach((item) => {
        if (item.sortType) {
          sortType = item.sortType
        }
      })
      result.sort((a, b) => {
        return ((+new Date(a.active_date)) - (+new Date(b.active_date))) * sortType
      })
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
    computedName (name, role, mode) {
      var result = ''
      name = name || ''
      role = Number(role) || 0
      mode = mode || ''
      mode = 'leixi..........ng'
      result = '<div class="name-box"><i class="fa' + (role === 0 ? ' fa-user' : '') + '"></i><div class="name">' + name + '</div><div class="mode">' + mode + '</div></div>'
      return result
    },
    /**
     * 获取产品详情
     * @param  {[type]} productId [description]
     * @return {[type]}           [description]
     */
    getProduct (productId) {
      api.product.getProduct(productId).then((res) => {
        this.products.push(res.data)
        this.tableLoadingData = false
      }).catch((res) => {
        this.tableLoadingData = false
        this.handleError(res)
      })
    },
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
     * @return {[type]} [description]
     */
    getSubDevices () {
      this.tableLoadingData = true
      api.user.subDeviceList(this.$route.params.id, this.version).then((res) => {
        if (res.status === 200) {
          // res.data.list = [
          //   {
          //     'id': '1089865316', // 设备id
          //     'mac': '设备MAC地址',
          //     'is_active': true, // 是否激活
          //     'active_date': '2015-10-09T08:15:40.843Z', // 激活时间
          //     'is_online': false, // 是否在线
          //     'product_id': '1607d2aee669d4001607d2aee669d401', // 所属的产品ID
          //     'sn': '1231', // 设备序列号
          //     'role': '0', // 0为管理员,1为用户
          //     'last_login': '2015-10-09T08:15:40.843Z',
          //     'active_code': '激活码',
          //     'authorize_code': '认证码',
          //     'mcu_mod': 'MCU型号',
          //     'mcu_version': 'MCU版本号',
          //     'firmware_mod': '固件型号',
          //     'firmware_version': '固件版本号',
          //     'access_key': '设备访问码'
          //   },
          //   {
          //     'id': '1605929014', // 设备id
          //     'mac': '设备MAC地址',
          //     'is_active': true, // 是否激活
          //     'active_date': '2015-10-09T08:15:40.843Z', // 激活时间
          //     'is_online': false, // 是否在线
          //     'product_id': '1607d2ad172d52001607d2ad172d5201', // 所属的产品ID
          //     'sn': '1231', // 设备序列号
          //     'role': '0', // 0为管理员,1为用户
          //     'last_login': '2015-10-09T08:15:40.843Z',
          //     'active_code': '激活码',
          //     'authorize_code': '认证码',
          //     'mcu_mod': 'MCU型号',
          //     'mcu_version': 'MCU版本号',
          //     'firmware_mod': '固件型号',
          //     'firmware_version': '固件版本号',
          //     'access_key': '设备访问码'
          //   }
          // ]
          this.tableLoadingData = false
          this.subDevices = res.data.list
          this.version = res.data.version
          this.subDevices.forEach((item, index) => {
            this.getProduct(item.product_id)
          })
        }
      }).catch((res) => {
        this.tableLoadingData = false
        this.handleError(res)
      })
    }
  }
}
</script>
<style lang="stylus">
@import '../../../../assets/stylus/common'

  .user-device-list
    .table-title
      height 30px
      line-height 30px
      font-size 14px

    .name-box
      width 120px
      height 40px
      position relative
      padding-left 30px
      box-sizing border-box
      .fa
        display block
        position absolute
        left 5px
        top 2px
        width 15px
        height 15px
        font-size 18px
        color #999
      .name
        height 20px
        line-height 20px
        font-size 15px
        color #DA4E37
        text-overflow 100%
      .mode
        height 50px
        line-height 20px
        text-overflow 100%
        color #666666
</style>
