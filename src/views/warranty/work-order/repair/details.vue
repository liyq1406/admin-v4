<template>
  <section class="main-wrap">
    <div class="main">
      <div class="breadcrumb"><a v-link="{path: '/warranty/work-orders/repair' }"><i class="fa fa-arrow-circle-left"></i>维修工单列表</a></div>
      <div class="row">
        <div class="col-24">
          <div class="panel">
            <div class="panel-hd">
              <h2>工单详情</h2>
            </div>
            <div class="panel-bd">
              <ul class="device-details">
                <li>
                  <div class="label">工单编号:</div>
                  <div class="info"></div>
                </li>
                <li>
                  <div class="label">创建日期:</div>
                  <div class="info"></div>
                </li>
                <li>
                  <div class="detail-title">网点信息</div>
                </li>
                <li>
                  <div class="label">网点信息:</div>
                  <div class="info"></div>
                </li>
                <li>
                  <div class="label">负责人:</div>
                  <div class="info"></div>
                </li>
                <li>
                  <div class="label">联系电话:</div>
                  <div class="info"></div>
                </li>
                <li>
                  <div class="label">所在地区:</div>
                  <div class="info"></div>
                </li>
                <li>
                  <div class="label">详细地址:</div>
                  <div class="info"></div>
                </li>
                <li>
                  <div class="label">处理客服:</div>
                  <div class="info"></div>
                </li>
                <li>
                  <div class="detail-title">客户信息</div>
                </li>
                <li>
                  <div class="label">客户姓名:</div>
                  <div class="info"></div>
                </li>
                <li>
                  <div class="label">联系电话:</div>
                  <div class="info"></div>
                </li>
                <li>
                  <div class="label">所在地区:</div>
                  <div class="info"></div>
                </li>
                <li>
                  <div class="label">详细地址:</div>
                  <div class="info"></div>
                </li>
                <li>
                  <div class="detail-title">产品信息</div>
                </li>
                <li>
                  <div class="label">产品名称:</div>
                  <div class="info"></div>
                </li>
                <li>
                  <div class="label">产品序列号:</div>
                  <div class="info"></div>
                </li>
                <li>
                  <div class="label">产品型号:</div>
                  <div class="info"></div>
                </li>
                <li>
                  <div class="label">购买日期:</div>
                  <div class="info"></div>
                </li>
                <li>
                  <div class="label">延保期限:</div>
                  <div class="info"></div>
                </li>
                <li>
                  <div class="detail-title">维修信息</div>
                </li>
                <li>
                  <div class="label">故障描述:</div>
                  <div class="info"></div>
                </li>
                <li>
                  <div class="label">更换配件:</div>
                  <div class="info"></div>
                </li>
                <li>
                  <div class="label">处理结果:</div>
                  <div class="info"></div>
                </li>
                <li>
                  <div class="label">维护费用:</div>
                  <div class="info"></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import { globalMixins } from '../../../../mixins'

  export default {
    name: 'OrderDetails',

    layout: 'admin',

    mixins: [globalMixins],

    data () {
      return {}
    },

    methods: {
    }
  }
</script>

<style lang="stylus">
  @import '../../../../assets/stylus/common'
</style>
