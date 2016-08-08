<template>
  <div class="x-float-select-wrap">
    <dropdown :trigger-width="triggerWidth" :dropdown-width="dropdownWidth" :show.sync='showSelectPanel'>
      <div slot='trigger' class="trigger-wrap">
        <span class="trigger-label" :style="triggerStyle">{{selected.label}}</span>
        <i class="fa fa-sort-down trigger-i"></i>
      </div>
      <div class="select-wrap">
        <div v-for="item in list" @click="clicked($index, item)" class="item-wrap">
          <span class="item-wrap-label">{{item.label}}</span>
          <i v-if="selectsStatus[$index]" class="fa fa-check item-wrap-i"></i>
        </div>
      </div>
    </dropdown>
  </div>
</template>

<script>
import Dropdown from './Dropdown'

export default {
  name: 'FloatSelect',

  components: {
    Dropdown
  },

  props: {
    triggerWidth: {
      type: Number,
      default: 85
    },

    dropdownWidth: {
      type: Number,
      default: 165
    },

    list: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      selected: {
        value: 0,
        label: '全部'
      },
      selectsStatus: [],
      showSelectPanel: false
    }
  },

  computed: {
    triggerStyle () {
      // let wid = ${this.triggerWidth - 30}
      return {
        width: `${this.triggerWidth - 30}px`
      }
    }
  },

  watch: {
    list () {
      if (this.list.length > 0) {
        this.selected = this.list[0]

        this.selectsStatus.push(true)
        for (var i = 1; i < this.list.length; i++) {
          this.selectsStatus.push(false)
        }
      }
    }
  },

  ready () {
    if (this.list.length > 0) {
      this.selected = this.list[0]

      this.selectsStatus.push(true)
      for (var i = 1; i < this.list.length; i++) {
        this.selectsStatus.push(false)
      }
    }
  },

  methods: {
    clicked (index, item) {
      if (this.selectsStatus[index] === true) {
        return
      }
      var temp = []
      for (var i = 0; i < this.selectsStatus.length; i++) {
        if (i === index) {
          temp.push(true)
        } else {
          temp.push(false)
        }
      }

      this.selectsStatus = temp

      this.showSelectPanel = false
      this.selected = this.list[index]
      this.$emit('select', item)
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/stylus/common'
.x-float-select-wrap
  display inline-block
  .trigger-wrap
    padding 0 10px
    .trigger-label
      float left
      display inline-block
      text-align left
      line-height 24px
      vertical-align top
      white-space nowrap
      text-overflow ellipsis
      overflow hidden
    .trigger-i
      line-height 20px
      float right
  .select-wrap
    max-height 190px
    margin 3px
    overflow-y auto
    .item-wrap
      padding 3px 10px
      &:hover
        background-color #E9F1F5
      .item-wrap-i
        float right
        line-height 25px
        vertical-align middle
      .item-wrap-label
        line-height 25px
        vertical-align middle

</style>
