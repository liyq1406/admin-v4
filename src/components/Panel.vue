<template>
  <div class="x-panel">
    <div class="x-panel-hd">
      <slot name="right-actions"></slot>
      <h2 v-if="title">{{ title }}</h2>
      <slot name="left-actions"></slot>
    </div>
    <div class="x-panel-bd">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Panel',

  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus">
// 配置
@import '../assets/stylus/common'

.x-panel
  background #FFF
  padding 0 15px
  box-sizing border-box

.x-panel-hd
  /*border-bottom 1px solid light-border-color*/
  position relative
  clearfix()

  h2
    display inline-block
    margin 0
    font-size 15px
    font-weight normal
    height 20px
    line-height 20px
    margin-top 20px
    padding-left 8px

    .fa
      margin-right 5px

  .left-actions
    display inline-block

    .x-select
      display inline-block
      margin 12px 0 0 20px

    .x-radio-btn-group
      display inline-block
      margin-left 20px

  .right-actions
    float right

  .date
    float right
    margin-top 20px

  .status
    float right
    margin-top 20px
    font-size 12px

  .search-box
    float right
    margin-top 10px

    .x-select
      float none
      margin 0

  .actions
    float right
    margin-top 15px
    font-size 0

    .btn
      height 26px
      line-height 26px
      font-size 12px

    .btn-ghost
      line-height 24px

  &.with-actions
    h2
      float left

.x-panel-sub-hd
  background #F7F7F7
  font-size 16px
  padding 6px 10px

.x-panel-bd
  position relative
  box-sizing border-box

  .status-bar
    .area-select
      display inline-block

  .controls
    .area-select
      display inline-block
      .x-select
        display inline-block

  .action-bar
    clearfix()
    padding-top 20px
    margin-bottom 20px

    .x-select
      display inline-block

    .search-box
      float right

  .action-group
    clearfix()

    .btn
      float left
      margin-right 10px

  .form
    padding 30px 0

  .modal
    .form
      padding 0
</style>
