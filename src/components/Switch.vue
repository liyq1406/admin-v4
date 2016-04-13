<template>
  <div @click="toogle" :class="{'switch-on':value}" class="switch">
    <div v-text="value ? '开启' : '关闭'" class="switch-block"></div>
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
    display inline-block
    background #F3F3F3
    size 100px 26px
    line-height 26px
    text-align right
    cursor pointer
    user-select none
    font-size 12px

    .switch-block
      display inline-block
      width 50px
      text-align center
      background #DDD
      color #A3A3A3

  .switch-on
    text-align left

    .switch-block
      background green
      color #FFF
</style>
