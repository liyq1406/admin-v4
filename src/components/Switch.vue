<template>
  <div @click="toogle" :class="{'switch-on':value}" class="switch">
    <div class="switch-block"></div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        twoWay: true
      }
    },

    data () {
      return {

      }
    },

    methods: {
      toogle () {
        this.$dispatch('switch-toggle')
        this.value = !this.value
      }
    }

  }
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  .switch
    position relative
    display inline-block
    background #CCC
    size 42px 26px
    line-height 26px
    cursor pointer
    user-select none
    font-size 12px
    border-radius 30px

    .switch-block
      absolute left 1px top 1px
      size 24px
      background #FFF
      border-radius 30px
      transition left .2s ease-in-out
      box-shadow 0 0 2px rgba(0, 0, 0, .2)

  .switch-on
    background green
    text-align left

    .switch-block
      left 17px
</style>
