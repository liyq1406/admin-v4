<template>
  <div class="main">
    <div class="main-title" :class="{'bordered': currStep===0}">
      <h2>创建产品</h2>
    </div>
    <!-- 引导页 -->
    <div class="creation-guide" v-show="currStep===0">
      <div class="slogan">
        <h2>在xlink管理台，便捷的管理您的产品开发</h2>
        <p>云智易开发平台为企业客户提供从开发到量产阶段的技术支持和服务</p>
      </div>
      <div class="creation-flow">
        <div class="creation-flow-item">
          <i class="icon"></i>
          <span>创建产品</span>
        </div>
        <div class="creation-flow-item">
          <i class="icon"></i>
          <span>配置产品</span>
        </div>
        <div class="creation-flow-item">
          <i class="icon"></i>
          <span>开发指引</span>
        </div>
        <div class="creation-flow-item">
          <i class="icon"></i>
          <span>产测调试</span>
        </div>
        <div class="creation-flow-item">
          <i class="icon"></i>
          <span>发布产品</span>
        </div>
      </div>
      <div class="actions">
        <button class="btn btn-primary btn-lg" @click="currStep=1">立即创建产品</button>
      </div>
    </div>

    <div class="pro-flow" v-show="currStep>0">
      <flow :curr="currStep" :steps="steps"></flow>
    </div>

    <!-- 填写产品信息 -->
    <div class="pro-section" v-show="currStep===1">
      <info @next-step="onInfoSubmit"></info>
    </div>

    <!-- 创建数据模型 -->
    <div class="pro-section" v-show="currStep===2">
      <datapoints></datapoints>
      <div class="actions">
        <button class="btn btn-primary btn-lg" @click="onProductSubmit">配置完成，下一步</button>
      </div>
    </div>

    <!-- 完成 -->
    <div class="pro-section" v-show="currStep===3">
      <completion></completion>
    </div>
  </div>
</template>

<script>
import Flow from 'components/Flow'
import Info from './Info'
import Datapoints from './Datapoints'
import Completion from './Completion'
import { globalMixins } from 'src/mixins'

export default {
  name: 'Creation',

  mixins: [globalMixins],

  components: {
    Flow,
    Info,
    Datapoints,
    Completion
  },

  data () {
    return {
      currStep: 2, // 当前步骤 [0|1|2|3]
      steps: ['填写产品信息', '创建数据模型', '完成']
    }
  },

  methods: {
    /**
     * 提交信息
     */
    onInfoSubmit (info) {
      console.log(info)
      this.currStep = 2
    },

    /**
     * 提交产品信息
     */
    onProductSubmit () {
      // TODO 调用创建产品接口
      this.currStep = 3
    }
  }
}
</script>

<style lang="stylus">
@import '../../../../assets/stylus/common'

.creation-guide
  text-align center
  padding 50px 0 80px

  .slogan
    margin-bottom 90px

    h2
      margin 0 0 15px
      font-size 20px
      font-weight normal

    p
      margin 0
      color gray-light

.creation-flow
  font-size 0
  margin-bottom 50px
  display inline-block
  border-top 6px dotted #EEE

  .creation-flow-item
    display inline-block
    width 72px
    font-size 12px
    margin-right 88px
    margin-top -39px

    .icon
      display block
      size 72px
      border 1px solid default-border-color
      border-radius 40px
      margin-bottom 5px
      background #F8F8F8

    &:last-child
      margin-right 0

.pro-section
  .actions
    padding 15px
    border-top 1px solid light-border-color

    .btn
      width 150px
</style>
