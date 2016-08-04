<template>
  <div class="x-info-list-wrap">
    <div class="x-info-list">
      <div class="x-info-list-item" v-for="(index, item) in info">
        <div class="x-info-list-item-in">
          <div class="x-label">{{ item.label }}</div>
          <div class="x-val">{{ item.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoCard',

  props: {
    // 信息
    info: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  data () {
    return {
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/stylus/common'

.x-info-list-wrap
  position relative
  overflow hidden

.x-info-list
  margin-top -1px
  clearfix()

  .x-info-list-item
    float left
    width 50%
    line-height 22px
    box-sizing border-box

    .x-info-list-item-in
      padding 8px 0 8px 8px
      /*border-top 1px solid default-border-color*/
      border-top none
      border-bottom 1px solid default-border-color

    .x-val
    .x-label
      height 22px
    .x-val
      overflow hidden
      white-space nowrap
      text-overflow ellipsis

    .x-label
      color gray-light

    &:nth-child(2n-1)
      .x-info-list-item-in
        margin-right 15px

    &:nth-child(2n)
      .x-info-list-item-in
        margin-left 15px
</style>
