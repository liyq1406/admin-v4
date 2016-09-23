<template>
  <div :class="classes">
    <div class="thumb" v-if="!thumbHidden"><img :src="picture"/></div>
    <div class="info">
      <slot>
        <h3>{{ info.title }}</h3>
        <div class="desc">
          <span :class="{'on-line':info.online, 'off-line':!info.online}" v-text="info.online?'在线':'下线'"></span><span>{{ info.time }}</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import deviceThumb from '../assets/images/device_thumb.png'

export default {
  name: 'InfoCard',

  props: {
    // 图片
    pic: {
      type: String,
      default: deviceThumb
    },

    thumbHidden: {
      type: Boolean,
      default: false
    },

    // 信息
    info: {
      type: Object,
      default () {
        return {
          title: '',
          online: false,
          time: ''
        }
      }
    }
  },

  computed: {
    picture () {
      return this.pic || deviceThumb
    },

    classes () {
      let cls = ['x-info-card']

      if (this.thumbHidden) {
        cls.push('thumb-hidden')
      }

      return cls.join(' ')
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/stylus/common'

.x-info-card
  margin-bottom 10px
  clearfix()

  .thumb
    float left
    size 60px

    img
      display block
      size 100%

  .info
    margin-left 80px
    padding-top 5px

    h3
      height 30px
      font-weight normal
      font-size 20px
      margin 0

    .desc
      color gray-light
      font-size 12px

      span
        line-height 20px
        display inline-block
        margin-right 15px

      .on-line
      .off-line
        position relative
        padding-left 12px

        &:before
          absolute left top 6px
          content ''
          size 8px
          border-radius 10px
          background-color #C3C3C3

      .off-line
        &:before
          background-color #C3C3C3

      .on-line
        color green
        &:before
          background-color green

  &.thumb-hidden
    .info
      margin-left 0
</style>
