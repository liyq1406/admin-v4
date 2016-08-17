<template>
  <div class="main">
    <div class="main-title bordered">
      <div class="title-wrap">
        <h2>固件管理</h2>
      </div>
    </div>
    <nav class="tab">
      <ul>
        <li v-for="item in tabItems">
          <a @click="selectLevel($index)" :class="{'active':currIndex===$index}">{{ item }}</a>
        </li>
      </ul>
    </nav>
    <template v-if="!currIndex">
      <message></message>
    </template>
    <template v-else>
      <update></update>
    </template>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import Message from './message'
  import Update from './update'

  export default {
    name: 'Alert',

    mixins: [globalMixins],

    components: {
      Message,
      Update
    },

    data () {
      return {
        tabItems: ['版本信息', '上传新固件'],
        currIndex: 0
      }
    },
    methods: {
      selectLevel (index) {
        this.currIndex = index
      }
    }
  }
</script>

<style lang='stylus' scoped>
@import '../../../../assets/stylus/common'
// tab
// 选项卡
.bt
  border-top 1px solid #d9d9d9
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

      &.active
        height 28px
        background-color #fff
        border 1px solid default-border-color
        border-bottom none!important
        position relative
        bottom -1px
        font-weight bold

.title-wrap
  clear both
</style>
