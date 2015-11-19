<template lang="jade">
nav.tab
  ul
    li(v-for="item in nav")
      a(v-link="item.link") {{item.label}}
</template>

<style lang="stylus">
@import '../assets/stylus/common'

// 选项卡
.tab
  margin-top 20px

  ul
    reset-list()
    font-size 0

  li
    display inline-block
    margin-right 20px
    font-size 14px

    a
      display block
      padding 2px 10px
      line-height 42px

      &.v-link-active
        padding-bottom 0
        border-bottom 2px solid red
        color red
</style>

<script>
module.exports = {
  props: ['nav']
};
</script>