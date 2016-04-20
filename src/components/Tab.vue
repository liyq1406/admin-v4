<template>
  <nav class="tab">
    <ul>
      <li v-for="item in nav"><a v-if="item.link" v-link="item.link">{{ item.label }}</a><a v-else href="{{ item.url }}" target="_blank">{{ item.label }}</a></li>
    </ul>
  </nav>
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

      &:hover
        text-decoration none

      &.v-link-active
        padding-bottom 0
        border-bottom 2px solid red
        color red
</style>

<script>
export default {
  props: ['nav']
}
</script>
