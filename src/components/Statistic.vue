<template>
  <div :class="classes">
    <div class="tit" v-if="align==='center'">{{ title }}<i class="fa fa-question-circle" v-tooltip="tooltip" v-if="tooltip"></i></div>
    <div class="info" v-animated-number="info.total"></div>
    <div class="unit" v-if="info.unit">{{info.unit}}</div>
    <div class="change" v-if="info.change && info.change !== 0" :class="{'decrease': info.change < 0}">
      <i class="fa" :class="{'fa-long-arrow-up': info.change > 0, 'fa-long-arrow-down': info.change < 0}"></i>
      <span v-animated-number="info.change"></span>
      <span class="ml10">{{ percentage }}</span>
    </div>
    <div class="tit" v-if="align!=='center'">{{ title }}<i class="fa fa-question-circle" v-tooltip="tooltip" v-if="tooltip"></i></div>
    <div class="target" v-if="hasTarget">
      <slot></slot>
    </div>
    <div class="chart" v-if="hasChart">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Statistic',

  props: {
    // 标题
    title: {
      type: String,
      default: '总数'
    },

    // 标题提示说明
    tooltip: {
      type: String,
      default: ''
    },

    // 数据
    info: {
      type: Object,
      default () {
        return {
          unit: ''
        }
      }
    },

    // 对齐方式
    align: {
      type: String,
      default: 'center'
    },

    // 配色
    color: {
      type: String,
      default: ''
    },

    // 类前缀
    classPrefix: {
      type: String,
      default: 'x-statistic'
    },

    // 行内显示
    inline: {
      type: Boolean,
      default: false
    },

    // 是否带图表
    hasChart: {
      type: Boolean,
      default: false
    },

    // 是否带目标
    hasTarget: {
      type: Boolean,
      default: false
    },

    // 保留小数点后多少位
    digits: {
      type: Number,
      default: 2
    }
  },

  computed: {
    // 类
    classes () {
      var result = [this.classPrefix]

      if (this.color) {
        result.push(`${this.classPrefix}-${this.color}`)
      }

      if (this.inline) {
        result.push(`${this.classPrefix}-inline`)
      }

      if (this.align) {
        result.push(`${this.classPrefix}-${this.align}`)
      }

      return result.join(' ')
    },

    percentage () {
      return Math.abs(this.info.change / (this.info.total || 1) * 100).toFixed(this.digits) + '%'
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/stylus/common'

.x-statistic
  text-align center
  padding 15px
  box-sizing border-box
  position relative

  & > .tit
  & > .info
  & > .unit
    color gray-dark

  & > .tit
    /*font-weight bold*/

    .fa
      margin-left 4px

  & > .info
  & > .unit
    /*font-size 42px
    font-family 'PingFangSC-Ultralight', 'PingFang SC Ultralight', 'PingFang SC', arial*/
    font-size 36px
    font-weight 100

  & > .change
    absolute right 15px top 15px
    color green
    white-space nowrap
    font-size 0

    span
      font-size 12px

    .fa
      font-size 12px
      margin-right 2px
      font-size 13px

    &.decrease
      color red

  & > .chart
    display inline-block
    size 150px 40px

.x-statistic-green
  & > .tit
  & > .info
  & > .unit
    color green

.x-statistic-blue
  & > .tit
  & > .info
  & > .unit
    color blue

.x-statistic-orange
  & > .tit
  & > .info
    color orange

.x-statistic-inline
  text-align left
  max-width 200px
  margin 0 auto

  .tit
    absolute right 15px bottom 25px
    font-size 12px

.x-statistic-left
  text-align left
  padding 5px 15px 15px 40px
  & > .tit
    color gray-light
  & > .change
    position relative
    top -18px
    left 5px
  & > .info
  & > .unit
  & > .change
    display inline-block

.statistic-group
  border-bottom 1px solid default-border-color

.col-6 + .col-6
  .x-statistic
    &:after
      absolute left top 15%
      size 1px 70%
      content ''
      background #E5E5E5
.target
  font-size 10px!important
  color #307fc1
  .change-reduse
    color red
  .change-increase
    color green
</style>
