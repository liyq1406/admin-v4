<template>
  <div class="main">
    <div class="main-title">
      <h2>延保详情</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt15 mb20 no-split-line">
      <div class="panel-bd row">
        <div class="col-16">
          <info-card>
            <div class="alert-record-summary">

              <div class="up">
                <h3>滤网失效</h3>
                <span class="text-label-warning">二级</span>
              </div>
              <div class="down row">
                <div class="col-12">
                  <span>2016-12-03</span>
                  <span class="ml15">16:12:03</span>
                </div>
                <div class="col-12">
                  <button>
                    <i class="fa fa-check"></i>
                    已处理
                  </button>
                  <button>
                    <!-- <i class="fa fa-commenting"></i> -->
                    查看维修进度
                  </button>
                </div>
              </div>
            </div>
          </info-card>
          <div v-stretch="185">
            <div class="x-info-list-wrap">
              <div class="x-info-list">
                <div class="x-info-list-item threeDepart">
                  <div class="x-info-list-item-in">
                    <div class="x-label">维修设备</div>
                    <div class="x-val">电饭煲A1</div>
                  </div>
                </div>
                <div class="x-info-list-item threeDepart">
                  <div class="x-info-list-item-in">
                    <div class="x-label">持续时长</div>
                    <div class="x-val">2.1h</div>
                  </div>
                </div>
                <div class="x-info-list-item threeDepart">
                  <div class="x-info-list-item-in">
                    <div class="x-label">维修人员</div>
                    <div class="x-val">
                      <select name="" id="">
                        <option value="">小明</option>
                        <option value="">小张</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="x-info-list-item threeDepart">
                  <div class="x-info-list-item-in">
                    <div class="x-label">处理时间</div>
                    <div class="x-val">2016-07-18 18:00:00</div>
                  </div>
                </div>
                <div class="x-info-list-item threeDepart">
                  <div class="x-info-list-item-in">
                    <div class="x-label">维修费用</div>
                    <div class="x-val">210元</div>
                  </div>
                </div>
                <div class="x-info-list-item threeDepart">
                  <div class="x-info-list-item-in">
                    <div class="x-label">用户账号</div>
                    <div class="x-val">13800138000</div>
                  </div>
                </div>
                <div class="x-info-list-item oneDepart">
                  <div class="x-info-list-item-in">
                    <div class="x-label">用户评价</div>
                    <div class="x-val">好评</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-8 device-map with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div id="device-map" class="mt10 ml30" style="height: 220px"></div>
        </div>
      </div>
    </div>
    <div class="panel mt10">
      <div class="panel-hd">
        <h3>延保历史</h3>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
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
                <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
              </div>
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" @cancel="" :placeholder="'输入搜索内容'" @search-activate="" @search-deactivate="" @search="" @press-enter="">
                  <button slot="search-button" @click="" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
          </div>
          <c-table :headers="headers" :tables="tables" :page="page" @tbody-id="goDetails"></c-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../../../mixins'
import Breadcrumb from 'components/Breadcrumb'
import api from 'api'
import InfoCard from 'components/InfoCard'
import SearchBox from 'components/SearchBox'
import Table from 'components/Table'
import Select from 'components/Select'
import InfoList from 'components/InfoList'

export default {
  name: 'OrderDetails',

  mixins: [globalMixins, pluginMixins],

  components: {
    Breadcrumb,
    InfoCard,
    InfoList,
    'c-table': Table,
    'v-select': Select,
    SearchBox
  },

  data () {
    return {
      branch: {},
      repairOrder: {},
      repairDetails: {},
      breadcrumbNav: [{
        label: '全部',
        link: `/operation/plugins/warranty/${this.$route.params.app_id}/work-orders/repair`
      }, {
        label: '工单详情'
      }],
      historys: [],
      headers: [
        {
          key: 'id',
          title: '工单编号'
        },
        {
          key: 'mac',
          title: '维修设备(mac)'
        },
        {
          key: 'invalid_time',
          title: '到期时间',
          sortType: -1
        },
        {
          key: 'time',
          title: '延保时间',
          sortType: -1
        },
        {
          key: 'addr',
          title: '地点'
        },
        {
          key: 'state',
          title: '状态',
          class: 'tac'
        }
      ]
    }
  },

  computed: {
    page () {
      return {
        currentPage: this.currentPage,
        countPerPage: this.countPerPage,
        total: this.total
      }
    },
    tables () {
      var result = []
      this.historys.map((item) => {
        var history = {
          id: '<a class="hl-red">' + item.id + '</a>',
          mac: item.mac,
          invalid_time: item.invalid_time,
          time: item.time,
          addr: item.addr,
          state: item.state,
          prototype: item
        }
        result.push(history)
      })
      return result
    },
    queryCondition () {
      var condition = {
        filter: [],
        limit: 1,
        offset: 0,
        order: {},
        query: {}
      }

      condition.query._id = this.$route.params.id

      return condition
    },

    branchArea () {
      var area = this.branch.province + this.branch.city + this.branch.district
      if (typeof area === 'string') {
        return area
      } else {
        return ''
      }
    },

    clientArea () {
      var area = this.repairOrder.province + this.repairOrder.city + this.repairOrder.district
      if (typeof area === 'string') {
        return area
      } else {
        return ''
      }
    }
  },

  route: {
    data () {
      this.getData()
      this.getRepairOrder()
    }
  },

  methods: {
    goDetails (table) {
      this.$route.router.go(this.$route.path + '/' + table.prototype.id)
    },
    getData () {
      this.total = 50
      this.historys = [
        {
          id: '111111111',
          mac: 'macmacmac',
          invalid_time: '2016-07-32 18:00:00',
          time: '2016-07-32 18:00:00',
          addr: '龙腾18',
          state: 1
        },
        {
          id: '222222222',
          mac: 'macmacmac',
          invalid_time: '2016-07-32 18:00:00',
          time: '2016-07-32 18:00:00',
          addr: '龙腾18',
          state: 1
        }
      ]
    },
    getRepairOrder () {
      var self = this
      var argvs = arguments
      var fn = self.getRepairOrder
      var condition = {
        filter: [],
        limit: 1,
        offset: 0,
        order: {},
        query: {}
      }
      this.getAppToKen(this.$route.params.app_id, 'warranty').then((token) => {
        api.warranty.getOrderWorkList(this.$route.params.app_id, token, this.queryCondition).then((res) => {
          this.repairOrder = res.data.list[0] || {}

          // 查询网点信息
          condition.query._id = this.repairOrder.branch_id
          api.warranty.getBranchList(this.$route.params.app_id, token, condition).then((res) => {
            this.branch = res.data.list[0] || {}
          }).catch((err) => {
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'warranty'
            }
            self.handlePluginError(err, env)
          })

          // 查询维修详情信息
          condition.query = {}
          condition.query.order_id = this.repairOrder._id
          api.warranty.getRepairDetailList(this.$route.params.app_id, token, condition).then((res) => {
            this.repairDetails = res.data.list[0] || {}
          }).catch((err) => {
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'warranty'
            }
            self.handlePluginError(err, env)
          })
        }).catch((err) => {
          var env = {
            'fn': fn,
            'argvs': argvs,
            'context': self,
            'plugin': 'warranty'
          }
          self.handlePluginError(err, env)
        })
      })
    }
  }
}
</script>

<style lang='stylus'>
@import '../../../../../../assets/stylus/common'
.x-info-list-wrap
  /*position relative*/
  overflow hidden

.x-info-list
  margin-top -1px
  clearfix()

  .x-info-list-item
    float left
    line-height 22px
    box-sizing border-box

    .x-info-list-item-in
      padding 8px 0 8px 8px
      border-top 1px solid default-border-color

    .x-val
    .x-label
      height 22px

    .x-label
    .x-val
      color gray-light

    /*&:nth-child(2n-1)
      .x-info-list-item-in
        margin-right 15px

    &:nth-child(2n)
      .x-info-list-item-in
        margin-left 15px*/
.alert-record-summary
.up
  h3
    height 30px
    font-weight normal
    font-size 20px
    margin 0
    display inline-block
    vertical-align middle
  span
    width 55px
    vertical-align middle
    margin-left 15px

.down
  color gray-light
  font-size 12px
  button
    border 1px solid #BCBCBC
    outline none
    background-color #FAFAFA
    color #323232
    height 24px
    float right
    margin-right 20px
    i
      font-size 15px
</style>
