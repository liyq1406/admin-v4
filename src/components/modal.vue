<template lang="jade">
.modal(v-show="show", transition="modal")
  .modal-wrapper
    .modal-dialog(:style="dialogStyle")
      .modal-header
        slot(name="header")
          h3 提示
      .modal-body
        slot(name="body")
      span.fa.fa-times-circle(@click="show = false")
</template>

<script>
module.exports = {
  props: {
    width: {
      type: Number
    },
    show: {
      type: Boolean,
      required: true,
      twoway: true
    }
  },

  data: function () {
    return {
      dialogStyle: {
        width: this.width + 'px',
        height: this.height + 'px',
        marginLeft: -this.width / 2 + 'px',
        marginTop: -this.height / 2 + 'px'
      }
    };
  },

  ready: function () {

  }
};
</script>

<style lang="stylus">
@import '../assets/stylus/common'

.modal
  fixed left top
  size 100%
  background rgba(0, 0, 0, .6)
  z-index 1000
  display table
  transition opacity .3s ease

  .modal-wrapper
    display table-cell
    vertical-align middle

  .modal-dialog
    position relative
    background rgba(255, 255, 255, .95)
    margin 0 auto
    width 500px
    box-shadow 0 2px 8px rgba(0, 0, 0, .3)
    transition all .3s ease

    .fa-times-circle
      absolute right top 3px
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
    padding 10px 20px
    border-bottom 1px solid #DDD

    h3
      font-weight normal
      color gray-darker
      margin 0

  .modal-body
    padding 30px

  .form
    .form-row
      .controls
        width 330px

    .form-actions
      padding-left 0
      text-align right

      .btn
        margin-left 10px
</style>
