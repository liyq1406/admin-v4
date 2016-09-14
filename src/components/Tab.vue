<template>
  <nav class="tab">
    <ul>
      <li v-for="item in nav">
        <template v-if="isInBanNav(item)">
          <a v-if="debug" v-link="item.link">{{ item.label }}</a>
        </template>
        <template v-else>
          <a v-link="item.link">{{ item.label }}</a>
        </template>
        <!-- <a v-else href="{{ item.url }}" target="_blank">{{ item.label }}</a> -->
      </li>
    </ul>
  </nav>
</template>

<script>
import { globalMixins } from '../mixins'

export default {
  mixins: [globalMixins],

  props: {
    nav: {
      type: Array,
      default () {
        return []
      }
    },

    // 需要线上隐藏的入口列表
    // 例子：
    // <tab :nav="secondaryNav" :ban="[$t('ui.subs.product.wechat'), $t('ui.subs.product.dataforward')]"></tab>
    ban: {
      type: Array,
      default () {
        return []
      }
    }
  },

  methods: {
    isInBanNav (navItem) {
      var result = false
      this.ban.forEach((item) => {
        if (navItem.label === item) {
          result = true
          return
        }
      })
      return result
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/stylus/common'

// 选项卡
.tab
  margin 15px 0
  padding 0 15px
  border-bottom 1px solid default-border-color

  ul
    reset-list()
    font-size 0

  li
    display inline-block
    font-size 13px

    a
      display block
      padding 0 20px
      line-height 28px
      color gray

      &:hover
        text-decoration none
        color gray-darker

      &.v-link-active
        height 29px
        background-color #fff
        border 1px solid default-border-color
        border-bottom none!important
        position relative
        bottom -1px
        font-weight bold
</style>
