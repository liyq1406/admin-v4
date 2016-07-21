<template>
  <div class="x-btn-group">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ButtonGroup'
}
</script>

<style lang="stylus">
@import '../assets/stylus/common'

.x-btn-group
  font-size 0
  display inline-block
  vertical-align middle


  .btn
    position relative
    display inline-block
    box-sizing border-box
    border 1px solid #BBB
    background-image linear-gradient(top, #FDFDFD, #F5F5F5)
    font-size 8px
    padding 0 8px
    height 24px
    line-height 24px
    transition border-color .3s, color .3s
    outline none
    cursor pointer
    color #666
    box-shadow inset 1px 0 0 0 rgba(255, 255, 255, .5)
    margin-left -1px
    z-index 1

    /*&:first-child
      border-radius 2px 0 0 2px

    &:last-child
      border-radius 0 2px 2px 0*/

    &:hover
      border-color #888
      color #666
      z-index 10

    &.disabled
    &.disabled:hover
      border-color #BBB
      color #C3C3C3
      cursor not-allowed
</style>
