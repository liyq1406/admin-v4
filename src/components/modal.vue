<template lang="jade">
.modal(v-show="show || flag", transition="modal")
  .modal-wrapper
    .modal-dialog(:style="dialogStyle")
      .modal-header
        slot(name="header")
          h3 提示
      .modal-body
        slot(name="body")
      slot(name="footer")
      span.fa.fa-times-circle(@click="dismiss")
</template>

<script>
module.exports = {
  props: {
    width: {
      type: Number,
      default: 500
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

  data: function () {
    return {
      dialogStyle: {
        width: this.width + 'px'
      }
    };
  },

  methods: {
    dismiss: function () {
      this.show = false;
      this.$dispatch('close');
    }
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

    .table
      margin 0

  .form
    .form-row
      .controls
        width 330px

    .form-actions
      padding-left 0
      text-align right

      .del-check
        float left
        margin-top 10px

        input
          margin-right 5px

      .btn
        margin-left 10px

  .modal-footer
    padding 0 30px 20px
    text-align right
    clearfix()

</style>
