<template>
  <div class="v-select">
    <slot></slot>
    <div :class="{'open':active}" class="btn-group">
      <button @click.prevent="toggleDropdown" @blur="deactivate" class="btn btn-default active"><span class="content">{{ label }}</span></button>
      <div :style="dropdownMenuStyle" class="dropdown-menu">
        <ul>
          <li v-for="option in options" @mousedown="handleClick(option)">{{ option.label }}
            <div v-show="option.value === value" class="fa fa-check"></div>
          </li>
        </ul>
      </div><i @click="toggleDropdown" class="caret"></i>
    </div>
  </div>
</template>

<script>
  import EventListener from './utils/EventListener'

  export default {
    props: {
      options: {
        type: Array,
        default: []
      },
      value: {
        type: String,
        default: '',
        twoWay: true
      },
      height: {
        type: Number,
        default: 100
      }
    },

    data () {
      return {
        dropdownMenuStyle: {
          height: this.height + 'px'
        },
        active: false
      }
    },

    computed: {
      label () {
        var option = this.options.filter((option) => {
          return option.value === this.value
        })[0]
        return option ? option.label : ''
      }
    },

    methods: {
      handleClick (option) {
        this.value = option.value
        this.$dispatch('select', option.value)
        this.deactivate()
      },

      toggleDropdown () {
        this.active = !this.active
      },

      deactivate () {
        this.active = false
      }
    },

    ready () {
      this.$dispatch('select-created', this)
      this._closeEvent = EventListener.listen(window, 'click', (e) => {
        if (!this.$el.contains(e.target)) {
          this.deactivate()
        }
      })
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

  .v-select
    .btn-group
      display inline-block
      position relative
      z-index 100

      i.caret
        absolute right 10px top 10px
        triangle #FFF 10px down

      .btn
        padding 0 30px 0 20px
        max-width 140px
        box-sizing border-box
        height 25px
        line-height 25px

        span
          display block
          text-overflow 100%

      .dropdown-menu
        absolute right top 26px
        display none
        width 140px
        height 0
        border 1px solid red
        background #FFF
        overflow auto
        box-sizing border-box

        li
          position relative
          font-size 12px
          line-height 24px
          height 24px
          color red
          cursor pointer
          padding 0 10px
          overflow hidden
          white-space nowrap
          text-overflow "…"

          &:hover
            background red
            color #FFF

          .fa
            absolute right 10px top 5px

    .open > .dropdown-menu
      display block
</style>
