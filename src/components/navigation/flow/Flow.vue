<template>
  <div class="x-flow">
    <div class="tab-s2">
      <ul>
        <li v-for="item in steps" @click="handleClick($index)" class="tab-s2-item" :class="{'active':curr===$index+1, 'finished':curr>$index+1, 'unclickable':!clickable}">
          <span class="num">
            <i class="fa fa-check" v-if="curr>$index+1"></i>
            <i v-else>{{ $index+1 }}</i>
          </span>{{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Flow',

  props: {
    // 当前步骤
    curr: {
      type: Number,
      default: 1
    },

    // 步骤信息
    steps: {
      type: Array,
      default () {
        return []
      }
    },

    clickable: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
    }
  },

  methods: {
    /**
     * 处理点击事件
     */
    handleClick (index) {
      if (this.clickable) {
        this.$emit('step-clicked', index)
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../../../assets/stylus/common'

.x-flow
  .tab-s2
    & > ul
      margin-left 15px

    .tab-s2-item
      margin-right 20px

      .num
        display inline-block
        border 1px solid light-border-color
        size 16px
        line-height 16px
        border-radius 10px
        text-align center
        margin-right 5px

      &.active
      &.finished
        color red
        .num
          border-color red
          background-color red
          color #FFF

      &.unclickable
        cursor default
</style>
