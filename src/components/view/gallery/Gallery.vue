<template>
  <div class="x-gallery">
    <slot></slot>
    <div v-show="show" transition="lightbox" class="v-lightbox">
      <div class="v-lightbox-wrapper">
        <div class="v-lightbox-content">
          <img :src="pics[curr]" alt=""/>
          <i class="fa fa-times" @click="dismiss"></i>
        </div>
      </div>
      <div class="prev" @click="prev">
        <i class="fa fa-angle-left"></i>
      </div>
      <div class="next" @click="next">
        <i class="fa fa-angle-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Gallery',

    props: {
      // 图片集
      pics: {
        type: Array,
        default: []
      },

      // 当前索引
      curr: {
        type: Number,
        default: 0
      },

      // 是否显示
      show: {
        type: Boolean,
        required: true
      }
    },

    methods: {
      dismiss () {
        // this.show = false
        this.$emit('close', false)
      },

      prev () {
        this.curr -= 1
        if (this.curr < 0) {
          this.curr = this.pics.length - 1
        }
        this.$emit('switch', this.curr)
      },

      next () {
        this.curr += 1
        if (this.curr > this.pics.length - 1) {
          this.curr = 0
        }
        this.$emit('switch', this.curr)
      }
    }
  }
</script>

<style lang="stylus">
  @import "../../../assets/stylus/common"

  .x-gallery
    display inline-block

  .v-lightbox
    fixed left top
    size 100%
    background rgba(0, 0, 0, .6)
    z-index 1000
    display table
    transition opacity .2s ease

    .v-lightbox-wrapper
      display table-cell
      vertical-align middle
      text-align center

    .v-lightbox-content
      position relative
      margin 0 auto
      display inline-block
      max-width 800px
      box-shadow 0 2px 8px rgba(0, 0, 0, .3)
      transition all .3s ease

      img
        display block
        width 100%

      .fa
        absolute top -20px right -20px
        background #FFF
        size 40px
        border-radius 20px
        line-height 40px
        font-size 24px !important
        color gray-light
        box-shadow 0 1px 2px rgba(0, 0, 0, .2)
        cursor pointer

        &:hover
          color red

    .prev
    .next
      absolute top
      size 80px 100%
      transition background .2s ease
      cursor pointer

      .fa
        absolute left 50% top 50%
        font-size 60px !important
        size 80px
        color #FFF
        margin -40px 0 0 -40px !important
        text-align center

      &:hover
        background rgba(0, 0, 0, .3)

    .prev
      left 0

    .next
      right 0

  // 动画
  .lightbox-enter
  .lightbox-leave
    opacity 0

  .lightbox-enter .v-lightbox-content
  .lightbox-leave .v-lightbox-content
    transform scale(1.3)
</style>
