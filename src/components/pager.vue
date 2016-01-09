<template lang="jade">
.pager.tar(v-if="total > 0")
  button.pager-btn.pager-prev(:class="{'disabled': current === 1}", :disabled="current === 1", @click="current = current - 1")
    i.fa.fa-chevron-left

  .pager-container(v-if="pages < 10")
    .pager-item(v-for="page in pages", :class="{'current': current === page + 1}",  @click="current = page + 1")
      span {{page + 1}}

  .pager-container(v-if="pages >= 10 && ( current <= 3 || current >= pages - 2)")
    .pager-item(v-for="page in 3", :class="{'current': current === page + 1}",  @click="current = page + 1")
      span {{page + 1}}
    .pager-more
      span(@click="toggleInput($event)") ...
      .pager-input(v-show="showInput")
        input(type="number", max="{{pages}}", @change="onInput")
    .pager-item(v-for="offset in 3", :class="{'current': current === pages - 2 + offset}",  @click="current = pages - 2 + offset")
      span {{pages - 2 + offset}}

  .pager-container(v-if="pages >= 10 && current > 3 && current < pages - 2")
    .pager-item(:class="{'current': current === 1}",  @click="current = 1")
      span 1
    .pager-more
      span(@click="toggleInput1($event)") ...
      .pager-input(v-show="showInput1")
        input(type="number", max="{{pages}}", @change="onInput")
    .pager-item(v-for="offset in 3", :class="{'current': current === current - 1 + offset}",  @click="current = current - 1 + offset")
      span {{current - 1 + offset}}
    .pager-more
      span(@click="toggleInput2($event)") ...
      .pager-input(v-show="showInput2")
        input(type="number", max="{{pages}}", @change="onInput")
    .pager-item(:class="{'current': current === pages}",  @click="current = pages")
      span {{pages}}
  //- input.pager-input(type="text")
  button.pager-btn.pager-next(:class="{'disabled': current === pages}", :disabled="current === pages", @click="current = current + 1")
    i.fa.fa-chevron-right
</template>


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
        showInput: false,
        showInput1: false,
        showInput2: false
      };
    },

    watch: {
      current: function () {
        this.$dispatch('page-update');
      }
    },

    computed: {
      pages: function () {
        return Math.ceil(this.total / this.pageCount);
      }
    },

    methods: {
      toggleInput: function (evt) {
        this.showInput = !this.showInput;
        if (this.showInput) {
          evt.target.parentNode.getElementsByTagName('input')[0].focus();
        }
      },

      toggleInput1: function (evt) {
        this.showInput1 = !this.showInput1;
        if (this.showInput1) {
          evt.target.parentNode.getElementsByTagName('input')[0].focus();
        }
      },

      toggleInput2: function (evt) {
        this.showInput2 = !this.showInput2;
        if (this.showInput2) {
          evt.target.parentNode.getElementsByTagName('input')[0].focus();
        }
      },

      onInput: function (evt) {
        var page = Number(evt.target.value);
        // alert(typeof page === 'number');
        if (typeof page === 'number') {
          page = Math.floor(page);
          this.showInput = false;
          this.showInput1 = false;
          this.showInput2 = false;
          this.current = page;
          evt.target.value = '';
        } else {
          alert('请输入数字');
        }
      }
    }
  };
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  // 分页
  .pager
    font-size 0
    margin-bottom 40px

    .pager-btn
    .pager-item
    .pager-more
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
      cursor pointer

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
    .pager-more
      position relative
      font-size 12px
      transition background .3s, color .3s, border-color .3s

      span
        display inline-block
        padding 0 8px
        border 1px solid #E5E5E5
        height 24px
        line-height 24px

        &:hover
          border-color red
          background red
          color #FFF
          cursor pointer

    .pager-item
      &.current
        span
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
      .pager-more
        margin-right 5px

    &.tar
    &.tac
      .pager-btn
      .pager-item
      .pager-more
        margin-left 5px

</style>
