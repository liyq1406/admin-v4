<template lang="jade">
  .search-box(:class="{'auto-search': auto, 'active': active && key.length}")
    slot
    .search-box-input
      input(:placeholder="placeholder", v-model="key", @focus="handleFocus(key)", @blur="handleBlur(key)", @input="handleInput")
      .fa.fa-times-circle(@mousedown="handleCancelClick")
    slot(name="search-button")
</template>

<style lang="stylus">
  @import '../assets/stylus/common'

  // 搜索框
  .search-box
    display inline-block

    label
      margin-right 10px

  .search-box-input
    display inline-block
    position relative
    background #F1F1F1
    size 190px 30px

    input
      background transparent
      border none
      appearance none
      size 160px 30px
      line-height 30px
      padding 0 6px 0 10px
      font-size 12px
      box-sizing border-box

    .btn
      cursor pointer

    .fa
      absolute right 6px top 6px
      display none
      size 20px
      font-size 18px
      cursor pointer
      color #B0B0B1
      transition color .3s
      line-height 20px
      text-align center

      &:hover
        color red

  &.active
    .search-box-input
      .fa
        display inline

</style>

<script>
  module.exports = {
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
      handleCancelClick: function () {
        this.key = '';
        this.$dispatch('cancel');
      },

      handleInput: function () {
        this.$dispatch('search');
      },

      handleFocus: function (key) {
        this.$dispatch('search-activate', key);
      },

      handleBlur: function (key) {
        this.$dispatch('search-deactivate', key);
      }
    }
  };
</script>
