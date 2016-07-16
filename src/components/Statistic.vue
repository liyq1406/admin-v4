<template lang="html">
  <div :class="classes">
    <div class="info" v-animated-number="info.total"></div>
    <div class="change" v-if="info.change && info.change !== 0" :class="{'decrease': info.change < 0}">
      <i class="fa" :class="{'fa-long-arrow-up': info.change > 0, 'fa-long-arrow-down': info.change < 0}"></i>
      <span v-animated-number="info.change"></span>
    </div>
    <div class="tit">{{ title }}<i class="fa fa-question-circle" v-tooltip="tooltip" v-if="tooltip"></i></div>
    <div class="chart" v-if="hasChart">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Statistic',

  props: {
    title: {
      type: String,
      default: '总数'
    },

    tooltip: {
      type: String,
      default: ''
    },

    info: {
      type: Object,
      default () {
        return {}
      }
    },

    align: {
      type: String,
      default: 'center'
    },

    color: {
      type: String,
      default: ''
    },

    // 类前缀
    classPrefix: {
      type: String,
      default: 'x-statistic'
    },

    inline: {
      type: Boolean,
      default: false
    },

    hasChart: {
      type: Boolean,
      default: false
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
    color gray-dark

  & > .tit
    /*font-weight bold*/

    .fa
      margin-left 4px

  & > .info
    font-size 42px
    font-family 'PingFangSC-Ultralight', 'PingFang SC Ultralight', 'PingFang SC', arial
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
    color green

.x-statistic-blue
  & > .tit
  & > .info
    color blue

.x-statistic-orange
  & > .tit
  & > .info
    color orange

.x-statistic-inline
  text-align left
  max-width 200px
  margin 0 auto

  /*.tit
    absolute right 15px bottom 25px
    font-size 12px*/
  .tit
    text-align center
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
</style>
