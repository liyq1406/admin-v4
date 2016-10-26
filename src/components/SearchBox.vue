<template>
  <div :class="{'auto-search': auto, 'active': active && key.length}" class="search-box">
    <slot></slot>
    <div class="search-box-input">
      <input :placeholder="placeholder" v-model="key" type="text" @focus="handleFocus(key)" @blur="handleBlur(key)" :number="maxlength" @keypress.enter.prevent.stop="enterPress"/>
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
    line-height 28px
    vertical-align middle
    font-size 12px

  .x-select
    display inline-block
    font-size 12px

    .x-select-trigger
      border-color #BBB

  .btn
    cursor pointer
    height 28px
    line-height 26px
    vertical-align middle
    background-image linear-gradient(top, #FDFDFD, #F5F5F5)
    padding 0 10px
    color gray
    border 1px solid #BBB
    border-left 0
    box-sizing border-box
    font-size 12px

    .fa
      /*display inline-block*/
      margin 0

    &:hover
      border-color #999
      color gray-dark

.search-box-input
  display inline-block
  position relative
  background #FFF
  size 190px 26px
  vertical-align middle
  border 1px solid #BBB
  box-shadow inset 1px 1px 1px rgba(0, 0, 0, .05)
  margin-left -1px

  input
    background transparent
    border none
    appearance none
    size 160px 26px
    line-height 26px
    padding 0 6px 0 10px
    font-size 12px
    box-sizing border-box

  .fa
    position absolute
    top 4px !important
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
  import { globalMixins } from 'src/mixins'

  export default {
    mixins: [globalMixins],

    props: {
      max: false,
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
        if (this.max > 0) {
          if (this.key - 0 > this.max - 0) {
            this.showNotice({
              type: 'error',
              content: `输入的值不能大于${this.max}`
            })
            return
          }
        }
        this.$emit('search')
      }
    },

    methods: {
      enterPress () {
        this.$emit('press-enter')
      },
      handleCancelClick () {
        this.key = ''
        let inputDoms = this.$el.getElementsByTagName('input')
        if (inputDoms.length > 0) {
          let inputDom = inputDoms[0]
          inputDom.value = ''
        }
        this.$emit('cancel')
      },

      // handleInput () {
      //   console.log(this.key)
      //   if (this.key) {
      //   }
      // },

      handleFocus (key) {
        this.$emit('search-activate', key)
      },

      handleBlur (key) {
        this.$emit('search-deactivate', key)
      }
    }
  }
</script>
