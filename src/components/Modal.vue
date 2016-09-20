<template>
  <div v-show="show || flag" transition="modal" class="modal">
    <div class="modal-wrapper">
      <div :style="dialogStyle" class="modal-dialog">
        <div class="modal-header">
          <slot name="header">
            <h3>提示</h3>
          </slot>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <slot name="footer"></slot><span @click="dismiss" class="fa fa-times-circle"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '500px'
    },
    show: {
      type: Boolean,
      required: true,
      twoway: true
    },
    flag: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      dialogStyle: {
        width: this.width
      }
    }
  },

  methods: {
    dismiss () {
      this.show = false
      this.$dispatch('close')
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/stylus/common'

.modal
  fixed left top
  size 100%
  background rgba(0, 0, 0, .6)
  z-index 10100
  display table
  transition opacity .2s ease

  .modal-wrapper
    display table-cell
    vertical-align middle

  .modal-dialog
    position relative
    margin 0 auto
    width 500px
    box-shadow 0 2px 8px rgba(0, 0, 0, .3)
    transition all .3s ease

    .fa-times-circle
      absolute right top
      size 40px
      line-height 40px
      text-align center
      cursor pointer
      font-size 16px
      color #666
      transition color .3s

      &:hover
        color red

  .modal-header
    padding 8px 15px
    border-bottom 1px solid #DDD
    background #FFF

    h3
      font-weight normal
      color gray-darker
      margin 0

  .modal-body
    padding 20px 30px
    max-height 540px
    overflow-y auto
    box-sizing border-box
    background #FFF

    .table
      margin 0

    // 错误信息
    .error-msg
      text-align center
      margin-bottom 30px

    .x-alert
      margin 30px 0

  .modal-actions
      text-align center

      .btn
        width 120px

  .modal-footer
    padding 0 30px 20px
    text-align right
    background #FFF
    clearfix()
</style>
