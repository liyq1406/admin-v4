<template>
  <div data-toggle="buttons" class="btn-group">
    <slot name="label"></slot>
    <label v-for="item in items" :class="{'active': item.value === value}" class="btn btn-default">
      <input type="radio" autocomplete="off" checked="{{ checked }}" @click="onSelect(item.value)"/>{{ item.label }}
    </label>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        twoWay: true
      },
      items: {
        type: Array,
        default () {
          return []
        }
      }
    },

    methods: {
      onSelect (value) {
        this.value = value
        this.$dispatch('select', value)
      }
    }
  }
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
        opacity 0

    .label
      display inline-block
      margin-right 5px
</style>
