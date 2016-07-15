<template>
  <div class="drop-down-wrap">
    <div class="trigger" @click='show=!show'>
      <slot name="trigger">
        <i class="fa fa-bars"></i>
      </slot>
    </div>
    <div v-if='show' class="list-wrap">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="stylus">
.drop-down-wrap
  .trigger
    height 28px
    width 30px
    display inline-block
    text-align center
    cursor pointer
    background-color #FCFCFC
    border 1px solid #BCBCBC
    i
      line-height 28px

  .dropdown
    absolute left top 28px
    min-width 120px
    padding 5px
    background #FFF
    border 1px solid #C3C3C3
    box-shadow 0 1px 2px rgba(0, 0, 0, .2)
    z-index 10000
</style>
