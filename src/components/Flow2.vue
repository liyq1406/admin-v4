<template>
  <div class="x-flow">
    <div class="tab">
      <div class="item" v-for="item in stepsBeautify" @click="handleClick($index)" :class="{'active':curr===$index+1, 'finished':curr>$index+1, 'unclickable':!clickable}" track-by="$index">
        <template v-if="item">
          <span class="num">
            <i class="fa fa-check" v-if="curr>$index+1"></i>
            <i v-else>{{ ($index / 2)+1 }}</i>
          </span>
          <span>{{ item }}</span>
        </template>
        <template v-else>
          <span class="link-line" v-if="$index !== steps.length - 1" :class="{'active':curr===$index+1, 'finished':curr>$index / 2, 'unclickable':!clickable}"></span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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

  computed: {
    stepsBeautify () {
      let temp = new Array(this.steps.length * 2 - 1)
      for (let i = 0; i < temp.length; i++) {
        if (i % 2 === 1) {
          temp[i] = false
        } else {
          temp[i] = this.steps[parseInt(i / 2)]
        }
      }
      return temp
    },
    itemSize () {
      return parseInt(24 / this.stepsBeautify.length)
    }
  },

  methods: {
    /**
     * 处理点击事件
     */
    handleClick (index) {
      if (this.clickable) {
        this.$emit('step-clicked', index / 2)
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/stylus/common'

.x-flow
  .tab
    border-bottom none
    text-align center
    .item
      box-sizing border-box
      text-align center
      display inline-block
      padding 0 10px
      box-sizing border-box
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
        color #1A9D1A
        border-bottom none
        .num
          border-color #1A9D1A
          /*background-color #1A9D1A*/
          /*color #FFF*/

      &.unclickable
        cursor default
      .link-line
        display inline-block
        vertical-align middle
        width 60px
        height 0
        &.unclickable
          border-bottom 1px solid #9A9A9A
        &.active
        &.finished
          border-bottom 1px solid #1A9D1A
</style>
