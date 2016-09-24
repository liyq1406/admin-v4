<template>
  <div class="main">
    <div class="main-title" :class="{'bordered': currStep===0}">
      <h2>创建产品</h2>
    </div>

    <div class="pro-flow" v-show="currStep>0">
      <flow :curr="currStep" :steps="steps"></flow>
    </div>

    <div class="pro-section">
      <router-view transition="view" transition-mode="out-in" class="view" @next="next"></router-view>
    </div>
  </div>
</template>

<script>
import Flow from 'components/Flow'
import { globalMixins } from 'src/mixins'

export default {
  name: 'Creation',

  mixins: [globalMixins],

  components: {
    Flow
  },

  data () {
    return {
      currStep: 0, // 当前步骤 [0|1|2|3]
      steps: ['填写产品信息', '创建数据端点', '完成']
    }
  },

  methods: {
    /**
     * 提交信息
     */
    onInfoSubmit (product) {
      this.currStep = 2
      this.$route.router.replace({path: `${product.id}/data-points`})
    },

    /**
     * 提交数据端点信息
     */
    onDatapointSubmit (productId) {
      this.currStep = 3
      this.$route.router.replace({path: 'completion'})
    },
    next (step, data) {
      switch (step) {
        case 'init':
          this.currStep = 0
          break
        case 'info':
          this.onInfoSubmit(data)
          break
        case 'guide':
          this.currStep = 1
          this.$route.router.replace('baseinfo')
          break
        case 'data-points':
          this.onDatapointSubmit(data)
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../../../../assets/stylus/common'

.pro-section
  .actions
    padding 15px
    border-top 1px solid light-border-color

    .btn
      width 150px
</style>
