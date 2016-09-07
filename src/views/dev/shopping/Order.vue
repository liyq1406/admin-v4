<template>
  <div class="panel">
    <table class="table table-bordered mt20">
      <thead>
        <tr>
          <th>产品</th>
          <th>单价说明</th>
          <th>数量</th>
          <th>资费</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>全自动咖啡机</td>
          <td><span class="hl-red">￥5.00</span></td>
          <td>200</td>
          <td><span class="hl-red">￥8000.00</span></td>
        </tr>
        <tr>
          <td>全自动咖啡机</td>
          <td><span class="hl-red">￥5.00</span></td>
          <td>200</td>
          <td><span class="hl-red">￥8000.00</span></td>
        </tr>
        <tr>
          <td>全自动咖啡机</td>
          <td><span class="hl-red">￥5.00</span></td>
          <td>200</td>
          <td><span class="hl-red">￥8000.00</span></td>
        </tr>
        <tr>
          <td colspan="4" class="tar">
            <span class="mr30">已选产品: <span class="hl-red">3</span></span>
            <span class="mr30">设备总量: <span class="hl-red">6000</span></span>
            <span class="mr30">订单总额: <span class="hl-red">￥24000</span></span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="order-submit">
      <div class="pay-types">
        <h3><span>选择支付方式</span></h3>
        <div class="inner">
          <div class="pay-type-item zhifubao">
            <label>
              <input type="radio" name="pay_type"><span>支付宝</span>
            </label>
          </div>
          <div class="pay-type-item weixin">
            <label>
              <input type="radio" name="pay_type"><span>微信支付</span>
            </label>
          </div>
          <div class="pay-type-item yinlian">
            <label>
              <input type="radio" name="pay_type"><span>银联</span>
            </label>
          </div>
        </div>
      </div>
      <div class="order-details">
        <div class="inner">
          <p>订单合计：<span class="hl-red num">￥240000</span><span class="hl-red unit">/元</span></p>
          <p>公司名称：广州云湾信息技术有限公司</p>
          <p>帐号信息：yunz23221hiyi@xlink,com</p>
        </div>
      </div>
      <div class="actions">
        <button class="btn btn-primary" @click="onBtnClick">提交订单</button>
      </div>
      <div class="terms">
        <label><input type="checkbox" name="terms">《云智易配额管理服务条款》</label>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'

export default {
  name: 'Order',

  mixins: [globalMixins],

  data () {
    return {
      order: {}
    }
  },

  methods: {
    /**
     * 处理订单提交按钮点击
     */
    onBtnClick () {
      this.$emit('order-submit', this.order)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/stylus/common'

.order-submit
  text-align right
  margin-bottom 40px

  .pay-types
    clearfix()

    h3
      clearfix()
      font-weight normal
      color gray
      font-size 16px

      span
        float right
        width 456px
        text-align left

    .inner
      float right
      font-size 0
      margin-bottom 20px

    .pay-type-item
      display inline-block
      font-size 16px
      margin-left 30px
      color #FFF

      span
        display inline-block
        background-color #CCC
        padding 5px 15px 5px 40px
        background-repeat no-repeat
        background-position 10px center
        margin-left 15px

    .zhifubao
      span
        background-color #56ABE4
        background-image url('../../../assets/images/shopping/zhifubao.png')

    .weixin
      span
        background-color #090
        background-image url('../../../assets/images/shopping/weixin.png')

    .yinlian
      span
        background-color #999
        background-image url('../../../assets/images/shopping/yinlian.png')

  .order-details
    clearfix()

    .inner
      float right
      border 1px solid red
      width 400px
      padding 0 20px 10px

    .num
      font-size 36px

    .unit
      font-size 18px

  .btn
    font-size 20px
    height 40px
    line-height 40px
    padding 0 50px

  .terms
    margin-top 10px
</style>
