<template>
  <section class="main-wrap">
    <div class="main">
      <!-- Start: 面包屑 -->
      <div class="breadcrumb"><a v-link="{path: '/plugins/warranty/work-orders/extended-warranties' }"><i class="fa fa-arrow-circle-left"></i>延保工单列表</a></div>
      <!-- : 面包屑 -->

      <!-- Start: 工单详情 -->
      <div class="panel">
        <div class="panel-hd">
          <h2>工单详情</h2>
        </div>
        <div class="panel-bd">
          <ul class="info-details">
            <li>
              <div class="label">工单编号:</div>
              <div class="info">{{workOrders._id}}</div>
            </li>
            <li>
              <div class="label">创建日期:</div>
              <div class="info">{{workOrders.expired_date | uniformDate}}</div>
            </li>
          </ul>
        </div>
      </div>
      <!-- End: 工单详情 -->

      <!-- Start: 客户信息 -->
      <div class="panel">
        <div class="panel-hd">
          <h2>客户信息</h2>
        </div>
        <div class="panel-bd">
          <ul class="info-details">
            <li>
              <div class="label">姓名:</div>
              <div class="info">{{workOrders.name}}</div>
            </li>
            <li>
              <div class="label">联系号码:</div>
              <div class="info">{{workOrders.phone}}</div>
            </li>
            <li>
              <div class="label">所在地区:</div>
              <div class="info">{{workOrders.province ? workOrders.province + workOrders.city + workOrders.district : ''}}</div>
            </li>
            <li>
              <div class="label">详细地址:</div>
              <div class="info">{{workOrders.address}}</div>
            </li>
            <li>
              <div class="label">备注内容:</div>
              <div class="info">{{workOrders.remark}}</div>
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
              <div class="info">{{workOrders.product_name}}</div>
            </li>
            <li>
              <div class="label">产品序列号:</div>
              <div class="info">{{workOrders.product_sn}}</div>
            </li>
            <li>
              <div class="label">产品型号:</div>
              <div class="info">{{workOrders.product_type}}</div>
            </li>
            <li>
              <div class="label">购买日期:</div>
              <div class="info">{{workOrders.purchase_date | uniformDate}}</div>
            </li>
            <li>
              <div class="label">延保期限:</div>
              <div class="info">{{workOrders.expired_date | uniformDate}}</div>
            </li>
          </ul>
        </div>
      </div>
      <!-- End: 产品信息 -->

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
        workOrders: {}
      }
    },

    route: {
      data () {
        this.getDetail()
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
      getDetail () {
        api.warranty.getWarrantyList(this.queryCondition).then((res) => {
          this.workOrders = res.data.list[0] || {}
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
