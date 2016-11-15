<template>
  <div class="main with-loading">
    <div class="icon-loading" v-show="submitting">
      <i class="fa fa-refresh fa-spin"></i>
    </div>

    <div class="main-title">
      <h2>在线购买</h2>
    </div>

    <div class="shopping-flow">
      <flow :curr="currStep" :steps="steps"></flow>
    </div>

    <!-- 确认信息和选择购买信息 -->
    <div class="shopping-section" v-show="currStep===1 || currStep===2">
      <info @check-out="onCheckout"></info>
    </div>

    <!-- 确认订单 -->
    <div class="shopping-section" v-show="currStep===3 || currStep===4">
      <order @order-submit="onOrderSubmit"></order>
    </div>

    <!-- 支付成功 -->
    <div class="shopping-section" v-show="currStep===5">
      <completion></completion>
    </div>
  </div>
</template>

<script>
import Info from './Info'
import Order from './Order'
import Completion from './Completion'
export default {
  name: 'Creation',
  components: {
    Info,
    Order,
    Completion
  },

  data () {
    return {
      submitting: false,
      currStep: 2, // 当前步骤 [1|2|3|4|5]
      steps: ['确认信息', '选择购买信息', '确认订单', '在线支付', '支付成功']
    }
  },

  methods: {
    /**
     * 提交信息
     */
    onCheckout (products) {
      console.log(products)
      this.currStep = 3
    },

    /**
     * 提交订单信息
     */
    onOrderSubmit (order) {
      console.log(order)
      // TODO 调用创建订单接口
      this.currStep = 4
      this.submitting = true
      window.setTimeout(() => {
        this.currStep = 5
        this.submitting = false
      }, 1000)
      window.setTimeout(() => {
        this.$route.router.replace('orders')
      }, 3000)
    }
  }
}
</script>

<style lang="stylus">
@import '../../../assets/stylus/common'
</style>
