<template>
  <div data-toggle="buttons" :class="classes">
    <slot name="label"></slot>
    <label v-for="item in items" :class="{'active': item.value === value}" :style="{width: width}" class="btn">
      <input type="radio" autocomplete="off" checked="{{ checked }}" @click="onSelect(item.value)"/>{{ item.label }}
    </label>
  </div>
</template>

<script>
  export default {
    name: 'RadioButtonGroup',

    props: {
      value: {
        twoWay: false
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
      },
      // 颜色 [red|...]
      color: {
        type: String,
        default: ''
      },
      width: {
        type: String,
        default: ''
      }
    },

    computed: {
      classes () {
        let result = ['x-radio-btn-group']
        if (this.color) {
          result.push(`x-radio-btn-group-${this.color}`)
        }
        return result.join(' ')
      }
    },

    methods: {
      onSelect (value) {
        let oldValue = this.value
        this.value = value
        this.$emit('select', value, oldValue)
      }
    }
  }
</script>

<style lang="stylus">
@import '../../../assets/stylus/common'

.x-radio-btn-group
  .btn
    position relative
    display inline-block
    box-sizing border-box
    border 1px solid #BBB
    background-image linear-gradient(top, #FDFDFD, #F5F5F5)
    font-size 12px
    padding 0 9px
    height 28px
    line-height 26px
    transition border-color .3s
    outline none
    cursor pointer
    color #666
    box-shadow inset 1px 0 0 0 rgba(255, 255, 255, .5)
    margin-left -1px
    z-index 1

    input[type="radio"]
      absolute left top
      appearance none
      opacity 0

    /*&:first-child
      border-radius 2px 0 0 2px

    &:last-child
      border-radius 0 2px 2px 0*/

    &:hover
      border-color #888
      color #666
      z-index 10

    &.active
      background #E7E7E7
      color #000
      /*font-weight bold*/
      box-shadow inset 1px 1px 3px #BBB
      z-index 1

      &:hover
        z-index 10

    &.disabled
    &.disabled:hover
      border-color #BBB
      color #C3C3C3
      cursor not-allowed
    /*.btn
      position relative
      height 28px
      line-height 28px
      padding 0 10px
      margin-left 1px
      cursor pointer

      input[type="radio"]
        absolute left top
        appearance none
        opacity 0*/

  .label
    display inline-block
    margin-right 5px

.x-radio-btn-group-red
  .btn.active
    background #DA4E37
    color: #FFF
    box-shadow inset 1px 1px 3px #c00
    border-color #A52429

/*.redline
  label
    background none!important
    color #666666
  label.active
    border-bottom 3px solid #DA4E37
    color #DA4E37*/
</style>
