<template>
  <section class="main-wrap">
    <div class="main">
      <!-- Start: 面包屑 -->
      <div class="breadcrumb"><a v-link="{path: '/plugins/warranty/' + $route.params.app_id + 'work-orders/repair' }"><i class="fa fa-arrow-circle-left"></i>维修工单列表</a></div>
      <!-- End: 面包屑 -->

      <!-- Start: 工单详情 -->
      <div class="panel">
        <div class="panel-hd">
          <h2>工单详情</h2>
        </div>
        <div class="panel-bd">
          <ul class="info-details">
            <li>
              <div class="label">工单编号:</div>
              <div class="info">{{repairOrder._id}}</div>
            </li>
            <li>
              <div class="label">创建日期:</div>
              <div class="info">{{repairOrder.create_time | uniformDate}}</div>
            </li>
          </ul>
        </div>
      </div>
      <!-- End: 工单详情 -->

      <!-- Start: 网点信息 -->
      <div class="panel">
        <div class="panel-hd">
          <h2>网点信息</h2>
        </div>
        <div class="panel-bd">
          <ul class="info-details">
            <li>
              <div class="label">网点名称:</div>
              <div class="info">{{branch.name}}</div>
            </li>
            <li>
              <div class="label">负责人:</div>
              <div class="info">{{branch.director}}</div>
            </li>
            <li>
              <div class="label">联系电话:</div>
              <div class="info">{{branch.phone}}</div>
            </li>
            <li>
              <div class="label">所在地区:</div>
              <div class="info">{{branch.province + branch.city + branch.district}}</div>
            </li>
            <li>
              <div class="label">详细地址:</div>
              <div class="info">{{branch.address}}</div>
            </li>
            <li>
              <div class="label">处理客服:</div>
              <div class="info">{{repairOrder.linkman}}</div>
            </li>
          </ul>
        </div>
      </div>
      <!-- End: 网点信息 -->

      <!-- Start: 客户信息 -->
      <div class="panel">
        <div class="panel-hd">
          <h2>客户信息</h2>
        </div>
        <div class="panel-bd">
          <ul class="info-details">
            <li>
              <div class="label">客户姓名:</div>
              <div class="info">{{repairOrder.linkman}}</div>
            </li>
            <li>
              <div class="label">联系电话:</div>
              <div class="info">{{repairOrder.phone}}</div>
            </li>
            <li>
              <div class="label">所在地区:</div>
              <div class="info">{{repairOrder.province ? repairOrder.province + repairOrder.city + repairOrder.district : ''}}</div>
            </li>
            <li>
              <div class="label">详细地址:</div>
              <div class="info">{{repairOrder.address}}</div>
            </li>
          </ul>
        </div>
      </div>
      <!-- End: 客户信息 -->

      <!-- Start: 产品信息 -->
      <div class="panel">
        <div class="panel-hd">
          <h2>产品信息</h2>
        </div>
        <div class="panel-bd">
          <ul class="info-details">
            <li>
              <div class="label">产品名称:</div>
              <div class="info">{{repairOrder.product_name}}</div>
            </li>
            <li>
              <div class="label">产品序列号:</div>
              <div class="info">{{repairOrder.product_sn}}</div>
            </li>
            <li>
              <div class="label">产品型号:</div>
              <div class="info">{{repairOrder.product_type}}</div>
            </li>
            <li>
              <div class="label">购买日期:</div>
              <div class="info">{{repairOrder.purchase_date | uniformDate}}</div>
            </li>
            <li>
              <div class="label">延保期限:</div>
              <div class="info">{{repairOrder.expired_date | uniformDate}}</div>
            </li>
          </ul>
        </div>
      </div>
      <!-- End: 产品信息 -->

      <!-- Start: 维修信息 -->
      <div class="panel">
        <div class="panel-hd">
          <h2>维修信息</h2>
        </div>
        <div class="panel-bd">
          <ul class="info-details">
            <li>
              <div class="label">故障描述:</div>
              <div class="info">{{repairDetails.fault}}</div>
            </li>
            <li>
              <div class="label">更换配件:</div>
              <div class="info">{{repairDetails.accessories}}</div>
            </li>
            <li>
              <div class="label">处理结果:</div>
              <div class="info">{{repairDetails.solutions}}</div>
            </li>
            <li>
              <div class="label">维护费用:</div>
              <div class="info">{{repairDetails.fees}}</div>
            </li>
          </ul>
        </div>
      </div>
      <!-- End: 维修信息 -->

    </div>
  </section>
</template>

<script>
  import { globalMixins } from '../../../../../mixins'
  import api from '../../../../../api'

  export default {
    name: 'OrderDetails',

    layout: 'admin',

    mixins: [globalMixins],

    data () {
      return {
        branch: {},
        repairOrder: {},
        repairDetails: {}
      }
    },

    route: {
      data () {
        this.getRepairOrder()
      }
    },

    computed: {
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
      }
    },

    methods: {
      getRepairOrder () {
        var condition = {
          filter: [],
          limit: 1,
          offset: 0,
          order: {},
          query: {}
        }
        api.warranty.getOrderWorkList(this.queryCondition).then((res) => {
          this.repairOrder = res.data.list[0] || {}

          // 查询网点信息
          condition.query._id = this.repairOrder.branch_id
          api.warranty.getBranchList(condition).then((res) => {
            this.branch = res.data.list[0] || {}
          }).catch((res) => {
            this.handleError(res)
          })

          // 查询维修详情信息
          condition.query = {}
          condition.query._id = this.repairOrder.repair_id
          api.warranty.getRepairDetailList(condition).then((res) => {
            this.repairDetails = res.data.list[0] || {}
          }).catch((res) => {
            this.handleError(res)
          })
        }).catch((res) => {
          this.handleError(res)
        })
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../../../assets/stylus/common'
</style>
