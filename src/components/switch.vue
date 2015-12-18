<template lang="jade">
  .switch(@click="toogle", :class="{'switch-on':value}")
    .switch-block(v-text="value ? '开启' : '关闭'")
</template>

<script>
  module.exports = {
    props: {
      value: {
        type: Boolean,
        twoWay: true
      }
    },

    data: function () {
      return {

      };
    },

    methods: {
      toogle: function () {
        this.$dispatch('switch-toggle');
        this.value = !this.value;
      }
    }

  };
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
