<template lang="jade">
  .btn-group(data-toggle="buttons")
    slot(name="label")
    label.btn.btn-default(v-for="item in items", :class="{'active': item.value === value}")
      input(type="radio", autocomplete="off", checked="{{checked}}", @click="onSelect(item.value)")
      | {{item.label}}
</template>

<script>
  module.exports = {
    props: {
      value: {
        twoWay: true
      },
      items: {
        type: Array,
        default: []
      }
    },

    methods: {
      onSelect: function (value) {
        this.value = value;
        this.$dispatch('select', value);
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

    .label
      display inline-block
      margin-right 5px
</style>
