<template>
  <div class="linkage-item">
    <div class="thumb">
      <slot name="thumb"></slot>
    </div>
    <div class="info">
      <h3>{{ name }}</h3>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LinkageItem',

    props: {
      // 名字
      name: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../../assets/stylus/common'

  .linkage-list
    .linkage-item
      clearfix()
      font-size 12px
      padding 20px 0
      border-bottom 1px solid default-border-color

      .thumb
        float left
        size 120px

        img
          size 100%

      .info
        margin-left 140px

        h3
          font-weight normal
          font-size 18px
          margin 30px 0 10px

      .label-text
        display inline-block
        vertical-align middle
        line-height 22px

      &:last-child
        border none
</style>
