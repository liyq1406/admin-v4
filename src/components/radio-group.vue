<template lang="jade">
  .btn-group(data-toggle="buttons")
    label.btn.btn-default(v-for="item in items", :class="{'active': item === value}")
      input(type="radio", autocomplete="off", checked="{{checked}}", @click="handleClick(item)")
      | {{item}}
</template>

<script>
  module.exports = {
    props: {
      value: {
        type: String,
        default: ''
      },
      items: {
        type: Array,
        default: []
      }
    },

    methods: {
      handleClick: function (data) {
        this.$dispatch('check', data);
      }
    }
};
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  .btn-group
    .btn
      position relative
      height 25px
      line-height 25px
      padding 0 10px
      margin-left 1px
      cursor pointer

      input[type="radio"]
        absolute left top
        appearance none
</style>