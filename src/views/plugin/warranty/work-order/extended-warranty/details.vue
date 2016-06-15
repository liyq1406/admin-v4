<template>
  <section class="main-wrap">
    <div class="main">
      <!-- Start: 面包屑 -->
      <div class="breadcrumb"><a v-link="{path: '/plugins/warranty/' + $route.params.app_id + '/work-orders/extended-warranties'}"><i class="fa fa-arrow-circle-left"></i>延保工单列表</a></div>
      <!-- : 面包屑 -->

      <!-- Start: 工单详情 -->
      <div class="panel">
        <div class="panel-hd">
          <h2>工单详情</h2>
        </div>
        <div class="panel-bd">
          <ul class="info-details">
            <li class="row">
              <div class="col-3 label">工单编号:</div>
              <div class="col-21 info">{{workOrders._id}}</div>
            </li>
            <li class="row">
              <div class="col-3 label">创建日期:</div>
              <div class="col-21 info">{{workOrders.expired_date | uniformDate}}</div>
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
            <li class="row">
              <div class="col-3 label">姓名:</div>
              <div class="col-21 info">{{workOrders.name}}</div>
            </li>
            <li class="row">
              <div class="col-3 label">联系号码:</div>
              <div class="col-21 info">{{workOrders.phone}}</div>
            </li>
            <li class="row">
              <div class="col-3 label">所在地区:</div>
              <div class="col-21 info">{{workOrders.province ? workOrders.province + workOrders.city + workOrders.district : ''}}</div>
            </li>
            <li class="row">
              <div class="col-3 label">详细地址:</div>
              <div class="col-21 info">{{workOrders.address}}</div>
            </li>
            <li class="row">
              <div class="col-3 label">备注内容:</div>
              <div class="col-21 info">{{workOrders.remark}}</div>
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
            <li class="row">
              <div class="col-3 label">产品名称:</div>
              <div class="col-21 info">{{workOrders.product_name}}</div>
            </li>
            <li class="row">
              <div class="col-3 label">产品序列号:</div>
              <div class="col-21 info">{{workOrders.product_sn}}</div>
            </li>
            <li class="row">
              <div class="col-3 label">产品型号:</div>
              <div class="col-21 info">{{workOrders.product_type}}</div>
            </li>
            <li class="row">
              <div class="col-3 label">购买日期:</div>
              <div class="col-21 info">{{workOrders.purchase_date | uniformDate}}</div>
            </li>
            <li class="row">
              <div class="col-3 label">延保期限:</div>
              <div class="col-21 info">{{workOrders.expired_date | uniformDate}}</div>
            </li>
          </ul>
        </div>
      </div>
      <!-- End: 产品信息 -->

    </div>
  </section>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import { pluginMixins } from '../../../mixins'
  import api from 'api'

  export default {
    name: 'OrderDetails',

    layout: 'admin',

    mixins: [globalMixins, pluginMixins],

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
        var self = this
        var argvs = arguments
        var fn = self.getDetail
        this.getAppToKen(this.$route.params.app_id, 'warranty').then((token) => {
          api.warranty.getWarrantyList(this.$route.params.app_id, token, this.queryCondition).then((res) => {
            this.workOrders = res.data.list[0] || {}
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

<style lang="stylus">
  @import '../../../../../assets/stylus/common'
</style>
