<template>
  <div :class="classes">
    <div class="progress-bar" v-el:bar :style="progressBarStyle">
      <div class="num" :style="numStyle"><span v-el:count>{{ count }}</span></div>
      <span  v-if="showPercent" class="percentage" :class="{'fixed': percentage < 8}">{{ percentage }}%</span>
    </div>
    <div class="min">{{ min }}</div>
    <div class="max">{{ max }}</div>
    <div v-show="showText" class="pause-txt">升级暂停</div>
    <div v-show="showText" class="finished-txt">完成升级</div>
  </div>
</template>

<script>
export default {
  props: {
    // 最小值
    min: {
      type: Number,
      default: 0
    },

    // 最大值
    max: {
      type: Number,
      default: 1
    },

    // 数量
    count: {
      type: Number,
      default: 0
    },

    // 暂停？
    pause: {
      type: Boolean,
      default: false
    },
    // 显示百分比？
    showPercent: {
      type: Boolean,
      default: true
    },
    // 显示进度文案？
    showText: {
      type: Boolean,
      default: true
    },

    // 类前缀
    classPrefix: {
      type: String,
      default: 'x-progress'
    }
  },

  data () {
    return {
      numStyle: {}
    }
  },

  computed: {
    // 百分占比
    percentage () {
      return Math.round(this.count / (this.max - this.min) * 1000) / 10
    },

    // 进度条样式
    progressBarStyle () {
      return {
        width: `${this.percentage}%`
      }
    },

    // 类
    classes () {
      var result = [this.classPrefix]

      if (this.pause) {
        result.push(`${this.classPrefix}-pause`)
      }

      if (this.count === this.max) {
        result.push(`${this.classPrefix}-finished`)
      }

      return result.join(' ')
    }
  },

  ready () {
    this.$nextTick(() => {
      let pos = this.$els.bar.clientWidth - this.$els.count.clientWidth / 2
      let gap = this.$el.clientWidth - this.$els.count.clientWidth
      let offset = 0
      if (pos >= 0 && pos < gap) {
        offset = pos
      } else if (pos >= gap) {
        offset = gap
      }
      this.numStyle = {
        visibility: 'visible',
        left: `${offset}px`
      }
    })
  },

  methods: {}
}
</script>

<style lang="stylus">
@import '../assets/stylus/common'

.x-progress
  position relative
  background-color #CCC
  height 16px
  margin 25px 0

  .min
  .max
    absolute bottom -20px
    font-size 10px

  .min
    padding-left 5px
    left 0
    border-left 1px solid default-border-color

  .max
    padding-right 5px
    right 0
    border-right 1px solid default-border-color

  .progress-bar
    position relative
    background-color #0CC
    height 16px

    &:after
      absolute right top -8px
      content ""
      triangle #CCC 16px down
      margin-right -8px

  .num
    absolute right top -24px
    width 100%
    /*margin-right -50px*/
    font-size 10px
    visibility hidden

    span
      display inline-block

  .percentage
    absolute right 5px top
    font-size 10px
    color #FFF
    line-height 16px

    &.fixed
      left 5px
      right auto

  .pause-txt
  .finished-txt
    absolute right top -24px
    display none

  .pause-txt
    color #F60

  .finished-txt
    color green

.x-progress-pause
  .progress-bar
    background-color #F60

  .num
    display none

  .progress-bar
    &:after
      display none

  .pause-txt
    display inline

.x-progress-finished
  .num
    display none

  .progress-bar
    &:after
      display none

  .finished-txt
    display inline
</style>
