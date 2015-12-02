<template lang="jade">
  .pager.tar
    button.pager-btn.pager-prev(:class="{'disabled': current === 1}")
      i.fa.fa-chevron-left

    .pager-container(v-if="pages < 10")
      .pager-item(v-for="page in pages", :class="{'current': current === page + 1}",  @click="current = page + 1")
        span {{page + 1}}

    .pager-container(v-if="pages >= 10 && ( current <= 3 || current >= pages - 2)")
      .pager-item(v-for="page in 3", :class="{'current': current === page + 1}",  @click="current = page + 1")
        span {{page + 1}}
      .pager-item
        span(@click="showInput = !showInput") ...
        .pager-input(v-show="showInput")
          input(type="number", max="{{pages}}")
      .pager-item(v-for="offset in 3", :class="{'current': current === pages - 2 + offset}",  @click="current = pages - 2 + offset")
        span {{pages - 2 + offset}}
    //- input.pager-input(type="text")
    button.pager-btn.pager-next(:class="{'disabled': current === pages}")
      i.fa.fa-chevron-right
</template>

<style lang="stylus">
  @import '../assets/stylus/common'

  // 分页
  .pager
    font-size 0
    margin-bottom 40px

    .pager-btn
    .pager-item
      display inline-block
      vertical-align middle
      box-sizing border-box

    .pager-btn
      background #E5E5E5
      border none
      font-size 8px
      color #A8A8A8
      padding 0 10px
      height 26px
      line-height 28px
      transition background .3s, color .3s
      outline none

      &:hover
        background red
        color #FFF

      &.disabled
      &.disabled:hover
        background #F3F3F3
        color #C3C3C3
        cursor not-allowed

    .pager-container
      display inline-block
      vertical-align middle

    .pager-item
      position relative
      font-size 12px
      border 1px solid #E5E5E5
      transition background .3s, color .3s, border-color .3s

      span
        display inline-block
        padding 0 8px
        height 26px
        line-height 24px

      &:hover
        border-color red
        background red
        color #FFF
        cursor pointer

      &.current
        border-color red
        background #FFF
        color red

    .pager-input
      absolute left 50% top -40px
      margin-left -22px

      input
        width 44px
        text-align center
        border 1px solid #E5E5E5
        padding 0
        font-size 12px
        height 26px
        line-height 26px

      &:before
        absolute left 50% bottom -10px
        margin-left -5px
        content ""
        triangle #DDD 10px down

      &:after
        absolute left 50% bottom -9px
        margin-left -5px
        content ""
        triangle #FFF 10px down

    &.tal
      .pager-btn
      .pager-item
        margin-right 5px

    &.tar
    &.tac
      .pager-btn
      .pager-item
        margin-left 5px

</style>
<script>
  var config = require('../consts/config');

  module.exports = {
    props: {
      pageCount: {
        type: Number,
        default: config.pageCount
      },
      total: {
        type: Number
      },
      current: {
        type: Number,
        twoWay: true,
        default: 1
      }
    },

    data: function () {
      return {
        showInput: false
      }
    },

    computed: {
      pages: function () {
        return Math.ceil(this.total / this.pageCount);
      }
    },

    methods: {
    }
  };
</script>
