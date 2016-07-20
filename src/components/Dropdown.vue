<template>
  <div class="x-dropdown-wrap" :class="classes">
    <div class="trigger" @click="show=!show" :style="triggerStyle">
      <slot name="trigger">
        <i class="fa fa-bars"></i>
      </slot>
    </div>
    <div v-show='show' class="x-dropdown" :style="dropdownStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import EventListener from './utils/EventListener'

export default {
  name: 'Dropdown',

  props: {
    // 是否显示下拉框
    show: {
      type: Boolean,
      default: false,
      twoway: true
    },

    // 下拉框宽度
    dropdownWidth: {
      type: Number,
      default: 120
    },

    // 触发器宽度
    triggerWidth: {
      type: Number,
      default: 120
    },

    // 对齐位置
    pos: {
      type: String,
      default: 'align-bottom-left'
    },

    // 类前缀
    classPrefix: {
      type: String,
      default: 'x-dropdown'
    }
  },

  data () {
    return {
      rect: {},
      dropdownStyle: {
        width: `${this.dropdownWidth}px`
      },
      triggerStyle: {
        width: `${this.triggerWidth}px`
      }
    }
  },

  computed: {
    // 类
    classes () {
      var result = []
      var posCls = ({
        'align-bottom-left': 'abl',
        'align-bottom-right': 'abr'
      })[this.pos] || ''

      if (posCls) {
        result.push(`${this.classPrefix}-${posCls}`)
      }

      return result.join(' ')
    }
  },

  ready () {
    this.$dispatch('dropdown-created', this)
    this._closeEvent = EventListener.listen(window, 'click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.show = false
      }
    })
    window.setTimeout(() => {
      this.width = this.$el.getBoundingClientRect().width
      this.height = this.$el.getBoundingClientRect().height
      this.rect.x = this.$el.getBoundingClientRect().left + document.documentElement.scrollLeft
      this.rect.y = this.$el.getBoundingClientRect().top + document.documentElement.scrollTop

      if (this.rect.x + this.dropdownWidth > document.body.clientWidth) {
        this.pos = 'align-bottom-right'
      }
    }, 500)
  },

  beforeDestroy () {
    if (this._closeEvent) {
      this._closeEvent.remove()
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/stylus/common'

.x-dropdown-wrap
  display inline-block
  vertical-align middle
  position relative

  .trigger
    height 26px
    width 100%
    display inline-block
    vertical-align middle
    text-align center
    cursor pointer
    background-color #FCFCFC
    border 1px solid #BCBCBC
    box-sizing border-box

    i
      line-height 24px

  .x-dropdown
    position absolute
    min-width 30px
    padding 5px
    background #FFF
    border 1px solid #C3C3C3
    box-shadow 0 1px 2px rgba(0, 0, 0, .2)
    z-index 10000
    box-sizing border-box

.x-dropdown-abl
  .x-dropdown
    left 0
    top 26px

.x-dropdown-abr
  .x-dropdown
    right 0
    top 26px
</style>
