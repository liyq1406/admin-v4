<template>
  <div class="x-percentage-bar">
    <div class="label">{{ percentage }}</div>
    <div class="bar-wrap">
      <span class="bar" :style="barStyles"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PercentageBar',

  props: {
    // 颜色
    color: {
      type: String,
      default: '#72D5DD'
    },

    // 占比
    percentage: {
      type: String,
      default: '0%'
    }
  },

  computed: {
    barStyles () {
      return {
        backgroundColor: this.color,
        width: this.percentage
      }
    }
  }
}
</script>

<style lang="stylus">
.x-percentage-bar
  clearfix()

  .label
    float left
    height 20px
    font-size 12px
    width 50px
    line-height 20px

  .bar-wrap
    margin-left 50px
    height 16px
    line-height 20px

    .bar
      display inline-block
      height 20px
</style>
