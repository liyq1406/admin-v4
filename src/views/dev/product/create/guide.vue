<template>
  <div class="creation-guide">
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
      <button class="btn btn-primary btn-lg" @click="goInfo">立即创建产品</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {},
  ready () {
    this.$emit('next', 'init')
  },
  methods: {
    goInfo () {
      this.$emit('next', 'guide')
    }
  },
  components: {}
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
</style>
