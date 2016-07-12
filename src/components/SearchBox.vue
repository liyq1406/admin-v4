<template>
  <div :class="{'auto-search': auto, 'active': active && key.length}" class="search-box">
    <slot></slot>
    <div class="search-box-input">
      <input :placeholder="placeholder" v-model="key" @focus="handleFocus(key)" @blur="handleBlur(key)" @keyup.enter="$dispatch('press-enter')"/>
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
  font-size 0

  & > label
    margin-right 10px
    line-height 26px
    vertical-align middle
    font-size 12px

  .v-select
    display inline-block
    font-size 12px

  .btn
    cursor pointer
    height 26px
    line-height 24px
    vertical-align middle
    background-image linear-gradient(top, #fafafa, #dadada)
    padding 0 8px
    color gray-light
    border 1px solid default-border-color
    border-left 0
    box-sizing border-box
    font-size 12px

    .fa
      /*display inline-block*/
      margin 0

    &:hover
      color gray-dark

.search-box-input
  display inline-block
  position relative
  background #FFF
  size 190px 24px
  vertical-align middle
  border 1px solid default-border-color
  box-shadow inset 1px 1px 1px rgba(0, 0, 0, .05)

  input
    background transparent
    border none
    appearance none
    size 160px 24px
    line-height 24px
    padding 0 6px 0 10px
    font-size 12px
    box-sizing border-box

  .fa
    position absolute
    top 3px !important
    right 3px !important
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

    watch: {
      key () {
        this.$dispatch('search')
      }
    },

    methods: {
      handleCancelClick () {
        this.key = ''
        this.$dispatch('cancel')
      },

      // handleInput () {
      //   console.log(this.key)
      //   if (this.key) {
      //   }
      // },

      handleFocus (key) {
        this.$dispatch('search-activate', key)
      },

      handleBlur (key) {
        this.$dispatch('search-deactivate', key)
      }
    }
  }
</script>
