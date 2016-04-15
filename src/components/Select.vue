<template>
  <div :class="classes">
    <slot></slot>
    <div class="v-select-wrap" :style="selectWrapStyle">
      <div class="v-select-trigger">
        <span>{{ label }}</span>
        <select v-model="value" @change="handleChange">
          <option v-for="option in options" :value="option.value">{{ option.label }}</option>
        </select>
        <i class="caret"></i>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      // 占位符
      placeholder: {
        type: String,
        default: ''
      },

      // 选项
      options: {
        type: Array,
        default: []
      },

      // 选定值
      value: {
        type: String,
        default: '',
        twoWay: true
      },

      // 宽度
      width: {
        type: String,
        default: '100%'
      },

      // 尺寸
      // 可选：['small' | 'normal' | 'large'], 默认为 'normal'
      size: {
        type: String,
        default: 'normal'
      },

      // 类前缀
      classPrefix: {
        type: String,
        default: 'v-select'
      }
    },

    data () {
      return {
        selectWrapStyle: {
          width: this.width
        },
        active: false
      }
    },

    computed: {
      // 标签
      label () {
        var option = this.options.filter((option) => {
          return option.value === this.value
        })[0]
        return option ? option.label : (this.placeholder.length ? this.placeholder : '')
      },

      // 类
      classes () {
        var result = [this.classPrefix]
        var sizeCls = ({
          'small': 'sm'
        })[this.size] || ''

        if (sizeCls) {
          result.push(`${this.classPrefix}-${sizeCls}`)
        }

        if (this.value) {
          result.push(`${this.classPrefix}-active`)
        }

        return result.join(' ')
      }
    },

    methods: {
      handleChange (option) {
        this.$dispatch('select', option.value)
      },

      toggleDropdown () {
        this.active = !this.active
      }
    },

    ready () {
      this.$dispatch('select-created', this)
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  .v-select
    & > span
      display inline-block
      vertical-align middle

    .v-select-wrap
      position relative
      width 100%
      display inline-block
      background #FFF
      min-width 70px
      vertical-align middle

    .v-select-trigger
      position relative
      border 1px solid default-border-color
      height 30px
      line-height 30px
      padding 0 25px 0 10px
      cursor pointer

      span
        absolute left top
        padding-right 25px
        z-index 0
        text-indent 10px
        height 32px
        box-sizing border-box
        color gray-light
        text-overflow 100%

      select
        absolute left top
        appearance none
        size 100%
        font-size 14px
        opacity 0
        z-index 10
        font-family font-stack
        cursor pointer

      .caret
        absolute right 8px top 12px
        triangle gray-dark 10px down

  .v-select-sm
    .v-select-trigger
      height 24px
      line-height 24px
      padding-left 8px
      cursor pointer

      span
        text-indent 8px
        height 26px
        font-size 12px

      select
        font-size 12px

      .caret
        top 10px

  .v-select-active
    .v-select-trigger
      span
        color gray-darker
</style>
