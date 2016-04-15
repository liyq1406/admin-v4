<template>
  <div :class="{'auto-search': auto, 'active': active && key.length}" class="search-box">
    <slot></slot>
    <div class="search-box-input">
      <input :placeholder="placeholder" v-model="key" @focus="handleFocus(key)" @blur="handleBlur(key)" @input="handleInput" @keyup.enter="$dispatch('press-enter')"/>
      <div @mousedown="handleCancelClick" class="fa fa-times-circle"></div>
    </div>
    <slot name="search-button"></slot>
  </div>
</template>

<style lang="stylus">
  @import '../assets/stylus/common'

  // 搜索框
  .search-box
    display inline-block

    label
      margin-right 10px

    .v-select
      display inline-block

    .btn-primary
      vertical-align middle

  .search-box-input
    display inline-block
    position relative
    background #F1F1F1
    size 190px 32px
    vertical-align middle

    input
      background transparent
      border none
      appearance none
      size 160px 32px
      line-height 32px
      padding 0 6px 0 10px
      font-size 12px
      box-sizing border-box

    .btn
      cursor pointer

    .fa
      position absolute
      top 6px !important
      right 6px !important
      display none
      width 20px !important
      height 20px !important
      font-size 18px
      cursor pointer
      color #B0B0B1
      transition color .3s
      line-height 20px !important
      text-align center

      &:hover
        color red

  &.active
    .search-box-input
      .fa
        display inline

</style>

<script>
  export default {
    props: {
      key: {
        type: String,
        twoWay: true,
        default: ''
      },
      auto: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: ''
      },
      active: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      handleCancelClick () {
        this.key = ''
        this.$dispatch('cancel')
      },

      handleInput () {
        this.$dispatch('search')
      },

      handleFocus (key) {
        this.$dispatch('search-activate', key)
      },

      handleBlur (key) {
        this.$dispatch('search-deactivate', key)
      }
    }
  }
</script>
