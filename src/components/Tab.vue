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
      // <tab :nav="secondaryNav" :ban="[$t('sub_nav.product.wechat'), $t('sub_nav.product.dataforward')]"></tab>
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
