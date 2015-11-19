<template lang="jade">
.modal.modal-tips.hidden
  .modal-dialog
    .modal-header
      h3 提示
    .modal-body
  span.close
</template>

<script>
module.exports = {
  ready: function () {

  }
};
</script>

<style lang="stylus">
@import '../assets/stylus/common'

.modal
  absolute left top
  size 100%
  background rgba(0, 0, 0, .6)
  z-index 1000

  .modal-dialog
    background rgba(255, 255, 255, .9)
    width 80%
    absolute left 50% top 50%
    margin-left -40%
    border-radius 1rem
    text-align center

  .modal-header
    padding 2.5rem 1rem 1rem

    h2
      font-weight normal
      color gray-darker
      font-size 1.8rem
      margin 0

  .modal-body
    padding 0 1rem 2.5rem

    p
      margin 0
      color gray-dark
      font-size 1.4rem

    input[type="text"]
      text-align center
      border 1px solid #A0A0A0
      display block
      font-size 1.4rem
      padding 1rem
      width 100%
      box-sizing border-box
      border-radius 1rem
      color gray-dark

    .radio
      position relative
      display block
      color gray-dark
      background #FFF
      border-radius 1rem
      font-size 1.6rem
      padding 0.5rem 1rem
      margin-bottom 0.8rem
      text-align left

      input[type="radio"]
        absolute right 1rem top .6rem
        appearance none
        border none
        background transparent
        size 2.2rem

        &:checked
          background-size 2.2rem

  .modal-footer
    border-top 1px solid #DCDCDC
    text-align center
    clearfix()

    .btn-link
      float left
      width 50%
      background transparent
      border none
      color #00AEFF
      font-size 1.4rem
      padding 1rem 0
      text-align center

      & + .btn-link
        border-left 1px solid #DCDCDC
        box-sizing border-box

    .btn-block
      width 100%

.modal-tips
  .modal-dialog
    margin-top -10rem

.modal-change-name
  .modal-dialog
    margin-top -10rem

.modal-select-device
  .modal-dialog
    position relative
    margin-top -20rem

    &:after
      absolute left 50% bottom -3.1rem
      content ""
      size 10rem 3.1rem
      margin-left -5rem
      background-size 10rem 3.1rem

  .radio-group
    height 21rem
    overflow auto

  .modal-footer
    border none

  .btn-submit
    position relative
    z-index 10
    margin-bottom -2rem
    size 8.15rem
    background-size 8.15rem
</style>