<template>
  <div data-toggle="buttons" :class="{'redline': hasline}" class="x-radio-btn-group">
    <slot name="label"></slot>
    <label v-for="item in items" :class="{'active': item.value === value}" class="btn btn-default">
      <input type="radio" autocomplete="off" checked="{{ checked }}" @click="onSelect(item.value)"/>{{ item.label }}
    </label>
  </div>
</template>

<script>
  export default {
    name: 'RadioButtonGroup',

    props: {
      value: {
        twoWay: true
      },
      items: {
        type: Array,
        default () {
          return []
        }
      },
      hasline: {
        type: Boolean,
        default: false
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

  .x-radio-btn-group
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
  .redline
    label
      background none!important
      color #666666
    label.active
      border-bottom 3px solid #DA4E37
      color #DA4E37
</style>
