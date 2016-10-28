<template>
  <div class="info-confirm">
    <div class="panel mt30">
      <div class="panel-hd bordered">
        <h2><i class="num">1</i> 确认信息</h2>
      </div>
      <div class="panel-bd info">
        <p>登陆帐号：demotesthelloworld@xlink.com</p>
        <p>公司名称：广州云湾信息科技有限公司</p>
      </div>
    </div>
    <div class="panel mt30">
      <div class="panel-hd">
        <h2><i class="num">2</i> 选择购买信息 <span class="hints"><i class="fa fa-exclamation-triangle"></i>配额数须在区间1000-20000内，已开通0台</span></h2>
      </div>
      <div class="panel-bd">
        <table class="table table-bordered mt10 shopping-table">
          <thead>
            <tr>
              <th width="40%">产品 <span class="hl-red">4</span></th>
              <th width="20%">单价/台</th>
              <th width="20%">数量</th>
              <th width="20%">金额</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>全自动咖啡机</td>
              <td><span class="hl-red">￥5.00</span></td>
              <td>
                <div class="input-text-wrap">
                  <input type="text" class="input-text input-text-sm" value="200">
                </div>
              </td>
              <td><span class="hl-red">￥8000.00</span></td>
            </tr>
            <tr>
              <td>全自动咖啡机</td>
              <td><span class="hl-red">￥5.00</span></td>
              <td>
                <div class="input-text-wrap">
                  <input type="text" class="input-text input-text-sm" value="200">
                </div>
              </td>
              <td><span class="hl-red">￥8000.00</span></td>
            </tr>
            <tr>
              <td>全自动咖啡机</td>
              <td><span class="hl-red">￥5.00</span></td>
              <td>
                <div class="input-text-wrap">
                  <input type="text" class="input-text input-text-sm" value="200">
                </div>
              </td>
              <td><span class="hl-red">￥8000.00</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="order-submit mt20">
        <div class="order-details">合计：<span class="num">￥24000</span>元</div>
        <div class="actions mt20">
          <button class="btn btn-primary" @click="onBtnClick">去结算</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'

export default {
  name: 'Info',

  mixins: [globalMixins],

  data () {
    return {
      products: []
    }
  },

  methods: {
    /**
     * 处理结算按钮点击
     */
    onBtnClick () {
      this.$emit('check-out', this.products)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/stylus/common'

.info-confirm
  .info
    background #F9F9F9
    padding 10px 20px

.panel-hd
  margin-bottom 0

  .num
    display inline-block
    width 20px
    height 20px
    line-height 20px
    border-radius 50%
    text-align center
    background #2389c5
    color #fff
    font-size 12px
    position relative
    bottom 2px

  .hints
    color gray-light
    font-size 12px
    margin-left 20px

    .fa
      color orange

.shopping-table
  .input-text-wrap
    width 120px

.order-submit
  text-align right
  margin-bottom 40px

  .order-details
    font-size 18px
    color red

    .num
      font-size 36px

  .btn
    font-size 20px
    height 40px
    line-height 40px
    padding 0 50px
</style>
