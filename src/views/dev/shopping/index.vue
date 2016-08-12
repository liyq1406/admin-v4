<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>在线购买</h2>
    </div>

    <div class="shopping-flow">
      <flow :curr="currStep" :steps="steps"></flow>
    </div>

    <!-- 确认信息和选择购买信息 -->
    <div class="shopping-section" v-show="currStep===1 || currStep===2">
      <info @next-step="onInfoSubmit"></info>
    </div>

    <!-- 确认订单 -->
    <div class="shopping-section" v-show="currStep===3 || currStep===4">
      <order></order>
      <div class="actions">
        <button class="btn btn-primary btn-lg" @click="onOrderSubmit">提交订单</button>
      </div>
    </div>

    <!-- 支付成功 -->
    <div class="shopping-section" v-show="currStep===5">
      <completion></completion>
    </div>
  </div>
</template>

<script>
import Flow from 'components/Flow'
import Info from './Info'
import Order from './Order'
import Completion from './Completion'
import { globalMixins } from 'src/mixins'

export default {
  name: 'Creation',

  mixins: [globalMixins],

  components: {
    Flow,
    Info,
    Order,
    Completion
  },

  data () {
    return {
      currStep: 5, // 当前步骤 [0|1|2|3]
      steps: ['确认信息', '选择购买信息', '确认订单', '在线支付', '支付成功']
    }
  },

  methods: {
    /**
     * 提交信息
     */
    onInfoSubmit (info) {
      console.log(info)
      this.currStep = 3
    },

    /**
     * 提交订单信息
     */
    onOrderSubmit () {
      // TODO 调用创建产品接口
      this.currStep = 5
    }
  }
}
</script>

<style lang="stylus">
@import '../../../assets/stylus/common'
</style>
