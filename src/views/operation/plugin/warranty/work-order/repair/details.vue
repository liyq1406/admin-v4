<template>
  <div class="main">
    <div class="main-title">
      <h2>维修详情</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt15 mb20 no-split-line">
      <div class="panel-bd row">
        <div class="col-16">
          <info-card>
            <div class="alert-record-summary">

              <div class="up">
                <h3 class="textoverflow wid">{{repairOrder.remark || '-'}}</h3>
                <a v-link="{path: '/operation/plugins/warranty/' + this.$route.params.app_id + '/work-orders/repair/edit/' + this.$route.params.id}" class="fa fa-edit"></a>
              </div>
              <div class="down row">
                <div class="col-12">
                  <span>{{repairOrder.create_time | formatDate}}</span>
                </div>
                <div class="col-12">
                  <!-- <button>
                    <i class="fa fa-check"></i>
                    已处理
                  </button> -->
                  <x-select :label="status.label" width="110px" size="small">
                    <select v-model="status"  @change="changeStatus">
                      <option :value="opt" v-for="opt in statusOptions">{{ opt.label }}</option>
                    </select>
                  </x-select>
                  <!-- <button>
                    <i class="fa fa-commenting"></i>
                    查看维修进度
                  </button> -->
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
                    <div class="x-val">{{repairOrder.product_sn || '-'}}</div>
                  </div>
                </div>
                <div class="x-info-list-item threeDepart">
                  <div class="x-info-list-item-in">
                    <div class="x-label">持续时长</div>
                    <div class="x-val">{{lasting || '正在计算……'}}</div>
                  </div>
                </div>
                <!-- <div class="x-info-list-item threeDepart">
                  <div class="x-info-list-item-in">
                    <div class="x-label">维修人员</div>
                    <div class="x-val">
                      <select name="" id="">
                        <option value="">小明</option>
                        <option value="">小张</option>
                      </select>
                    </div>
                  </div>
                </div> -->
                <div class="x-info-list-item threeDepart">
                  <div class="x-info-list-item-in">
                    <div class="x-label">维修人员</div>
                    <div class="x-val">{{repairOrder.assigned_name || '-'}}</div>
                  </div>
                </div>
                <div class="x-info-list-item threeDepart">
                  <div class="x-info-list-item-in">
                    <div class="x-label">处理时间</div>
                    <div class="x-val">{{repairOrder.manage_time | formatDate}}</div>
                  </div>
                </div>
                <div class="x-info-list-item threeDepart">
                  <div class="x-info-list-item-in">
                    <div class="x-label">维修费用</div>
                    <div class="x-val">{{repairOrder.fees || '-'}}</div>
                  </div>
                </div>
                <div class="x-info-list-item threeDepart">
                  <div class="x-info-list-item-in">
                    <div class="x-label">用户帐号</div>
                    <div class="x-val">{{repairOrder.account || '-'}}</div>
                  </div>
                </div>
                <div class="x-info-list-item oneDepart">
                  <div class="x-info-list-item-in">
                    <div class="x-label">用户评价</div>
                    <div class="x-val">-</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="x-info-list-item wholeDepart">
              <div class="x-info-list-item-in">
                <div class="x-label">现象说明</div>
                <div class="x-val textoverflow">{{repairOrder.remark || '-'}}</div>
              </div>
            </div>
            <div class="x-info-list-item oneDepart">
              <div class="x-info-list-item-in">
                <div class="x-label">维修图片</div>
                <div v-if="repairOrder.images && !repairOrder.images[0]" class="x-val">暂无图片</div>
                <div v-else class="pic-ul">
                  <div v-for="pic in repairOrder.images" class="pic">
                    <image :src="pic"></image>
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
        <h3>维修历史</h3>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fl">
              <div class="filter-group-item">
                <x-select :label="queryType.label" width='110px' size="small">
                  <span slot="label">状态</span>
                  <select v-model="queryType" @change="getHistory(true)">
                    <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                  </select>
                </x-select>
              </div>
            </div>
            <div class="filter-group fr">
              <!-- <div class="filter-group-item">
                <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
              </div> -->
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" @cancel="getHistory(true)" :placeholder="'输入工单编号'" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="" @press-enter="getHistory(true)">
                  <button slot="search-button" @click="getHistory(true)" class="btn"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
          </div>
          <x-table :headers="headers" :tables="tables" :page="page" @tbody-id="goDetails" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage"></x-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../../../mixins'
import { warrantyMixins } from '../../mixins'
import api from 'api'
import InfoCard from 'components/InfoCard'
import SearchBox from 'components/SearchBox'
import Table from 'components/Table'
import InfoList from 'components/InfoList'
import formatDate from 'filters/format-date'
import * as config from 'consts/config'

export default {
  name: 'OrderDetails',

  mixins: [globalMixins, pluginMixins, warrantyMixins],

  components: {
    InfoCard,
    InfoList,
    'x-table': Table,
    SearchBox
  },

  data () {
    return {
      token: JSON.parse(window.localStorage.pluginsToken)[this.$route.params.app_id].token,
      query: '',
      branch: {},
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      total: 0,
      statusOptions: [{
        label: '未处理',
        value: 0
      }, {
        label: '维修中',
        value: 1
      }, {
        label: '维修完成',
        value: 2
      }],
      status: {
        label: '未处理',
        value: 0
      },
      repairOrder: {},
      repairDetails: {},
      breadcrumbNav: [{
        label: '全部',
        link: `/operation/plugins/warranty/${this.$route.params.app_id}/work-orders/repair`
      }, {
        label: '工单详情'
      }],
      historys: [],
      queryTypeOptions: [
        { label: '全部', value: 'all' },
        { label: '待处理', value: 0 },
        { label: '维修中', value: 1 },
        { label: '维修完成', value: 2 }
      ],
      queryType: {
        label: '全部',
        value: 'all'
      },
      searching: false,
      headers: [
        {
          key: 'id',
          title: '工单编号'
        },
        // {
        //   key: 'mac',
        //   title: '维修设备(mac)'
        // },
        {
          key: 'create_date',
          title: '创建时间'
        },
        {
          key: 'person',
          title: '维修人员'
        },
        {
          key: 'content',
          title: '维修内容',
          class: 'tac w200'
        },
        // {
        //   key: 'addr',
        //   title: '地点'
        // },
        // {
        //   key: 'level',
        //   title: '维修等级',
        //   class: 'tac'
        // },
        {
          key: 'state',
          title: '状态',
          class: 'tac'
        }
      ]
    }
  },

  computed: {
    lasting () {
      var result = this.prettyDuration(this.repairOrder.lasting)
      return result
    },
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
          id: '<a class="hl-red">' + item._id + '</a>',
          create_date: formatDate(item.create_time),
          person: item.assigned_name,
          content: item.remark,
          // state: resetState(item.state),
          state: resetState(item.status || 0),
          prototype: item
        }
        result.push(history)
      })
      return result
      function resetState (state) {
        var result = [
          {
            text: '待处理',
            color: '#6699CC'
          },
          {
            text: '维修中',
            color: '#CC6600'
          },
          {
            text: '维修完成',
            color: '#090'
          }
        ]
        var html = '<div class="state" style="color: ' + result[state - 0].color + '">' + result[state - 0].text + '</div>'
        return html
      }
      // function resetLevel (state) {
      //   var resutl = [
      //     {
      //       text: '一级',
      //       backgroundColor: '#ff9966'
      //     },
      //     {
      //       text: '二级',
      //       backgroundColor: '#9cc'
      //     },
      //     {
      //       text: '三级',
      //       backgroundColor: '#cb4a52'
      //     }
      //   ]
      //   var html = '<div class="level tac" style="color:#FFF; background-color: ' + resutl[state - 1].backgroundColor + ';;width: 50px;display: inline-block">' + resutl[state - 1].text + '</div>'
      //   return html
      // }
    },
    queryCondition () {
      var condition = {
        filter: [],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {'create_time': -1},
        query: {}
      }

      condition.query.product_id = this.repairOrder.product_id

      if (this.queryType.value !== 'all') {
        condition.query.status = this.queryType.value
      }
      if (this.query !== '') {
        condition.query._id = {$in: [this.query]}
      }

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
    /**
     * 当前页码改变
     * @author weijie
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      this.getHistory()
    },
    toggleSearching () {
      this.searching = !this.searching
    },

    /**
     * 每页显示的数量改变
     * @author weijie
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.getHistory(true)
    },
    goDetails (table) {
      console.log(table)
      this.$route.router.go('/operation/plugins/warranty/' + this.$route.params.app_id + '/work-orders/repair/' + table.prototype._id)
    },
    getData () {
      this.total = 50
      this.historys = []
    },
    /**
     * 将毫秒数格式化为合适显示的时间段
     */
    prettyDuration (n) {
      let hours = (n / 3600000).toFixed(1)
      if (hours > 1) {
        return `${hours}小时`
      } else {
        return `${Math.floor(n / 60000)}分钟`
      }
    },
    // 计算持续时间
    dealTime (obj) {
      // 起始时间
      let begin = ''
      let end = ''
      // if (obj.manage_time) {
      //   begin = new Date(formatDate(obj.manage_time))
      // } else {
      //   begin = new Date(formatDate(obj.create_time))
      // }
      // 如果工单未处理完成，持续时间为工单创建时间到当前时间
      if (obj.status !== 2) {
        begin = new Date(formatDate(obj.create_time))
        end = new Date()
      } else if (obj.status === 2) {
        // 如果工单处理完成，持续时间为工单创建时间到处理时间
        begin = new Date(formatDate(obj.create_time))
        end = new Date(formatDate(obj.manage_time))
      }
      // let end = new Date()
      // 持续时间
      obj.lasting = end.getTime() - begin.getTime()
    },
    getRepairOrder () {
      // token 不存在，无权限访问
      if (!this.token) {
        this.showNoTokenError()
        return
      }

      var condition = {
        filter: [],
        limit: 1,
        offset: 0,
        order: {},
        query: {
          _id: this.$route.params.id
        }
      }
      api.warranty.getOrderWorkList(this.$route.params.app_id, condition).then((res) => {
        this.repairOrder = res.data.list[0] || {}
        if (this.repairOrder.status === 0) {
          this.status = {
            label: '未处理',
            value: 0
          }
        } else if (this.repairOrder.status === 1) {
          this.status = {
            label: '维修中',
            value: 1
          }
        } else if (this.repairOrder.status === 2) {
          this.status = {
            label: '维修完成',
            value: 2
          }
        }
        // 计算持续时间
        this.dealTime(this.repairOrder)
        // 查询网点信息
        condition.query._id = this.repairOrder.branch_id
        api.warranty.getBranchList(this.$route.params.app_id, condition).then((res) => {
          this.branch = res.data.list[0] || {}
        }).catch((err) => {
          this.handleError(err)
        })
        this.getHistory()
        // 查询维修详情信息
        // condition.query = {}
        // condition.query.order_id = this.repairOrder._id
        // api.warranty.getRepairDetailList(this.$route.params.app_id, condition).then((res) => {
        //   this.repairDetails = res.data.list[0] || {}
        //   // 获取历史
        //   this.getHistory()
        // }).catch((err) => {
        //   this.handleError(err)
        // })
      }).catch((err) => {
        this.handleError(err)
      })
    },
    getHistory (reset) {
      // token 不存在，无权限访问
      if (!this.token) {
        this.showNoTokenError()
        return
      }

      if (reset) {
        this.currentPage = 1
      }
      api.warranty.getOrderWorkList(this.$route.params.app_id, this.queryCondition).then((res) => {
        this.total = res.data.count
        console.log(res.data.list)
        this.historys = res.data.list
      }).catch((err) => {
        this.handleError(err)
      })
    },
    // 控制时间
    timeValue (n) {
      return n < 10 ? `0${n}` : `${n}`
    },
    changeStatus () {
      // token 不存在，无权限访问
      if (!this.token) {
        this.showNoTokenError()
        return
      }

      var time = new Date().getFullYear() + '-' + this.timeValue(new Date().getMonth() + 1) + '-' + this.timeValue(new Date().getDate()) + 'T' + this.timeValue(new Date().getHours()) + ':' + this.timeValue(new Date().getMinutes()) + ':' + this.timeValue(new Date().getSeconds()) + '.000Z'
      console.log(time)
      var params = {
        status: this.status.value,
        manage_time: time
      }
      api.warranty.editRepairDetailList(this.$route.params.app_id, this.$route.params.id, params).then((res) => {
        this.getRepairOrder()
        this.showNotice({
          type: 'info',
          content: '修改状态成功！'
        })
      }).catch((err) => {
        this.handleError(err)
      })
    }
  }
}
</script>

<style lang='stylus'>
@import '../../../../../../assets/stylus/common'
.wid
  max-width 300px
.textoverflow
  overflow hidden
  text-overflow ellipsis
.wholeDepart
  border-bottom 1px solid #d9d9d9
  width 100%
.pic
  width 160px
  height 120px
  border 1px solid #d9d9d9
  margin 10px 10px 10px 0
  box-sizing border-box
  display inline-block
  img
    width 100%
    height 100%
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
  /*border-top 1px solid default-border-color*/

  .x-val
  .x-label
    height 22px

  .x-label
  /*.x-val*/
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
  .x-select
    /*border 1px solid #BCBCBC*/
    outline none
    background-color #FAFAFA
    color #323232
    height 24px
    float right
    margin-right 20px
    i
      font-size 15px
  .table
    .level
      display inline-block
      width 50px
</style>
