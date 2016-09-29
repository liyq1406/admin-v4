<template>
  <div class="guide-box">
    <div class="title-box">
      <span>最新公告</span>
    </div>
    <div class="content-box">
      <div class="notice" v-for="notice in notices">
        <div class="icon">
          <i class="fa" :class="'fa-' + notice.icon"></i>
        </div>
        <div class="msg-box">
          <div class="title">
            <a :href="notice.url" target="_blank">{{{notice.title}}}</a>
          </div>
          <div class="time-box">
            <span>{{notice.time}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'notice',

    data () {
      return {
        notices: [
          {
            icon: 'file-text-o',
            title: '云智易物联平台发布4.2.24049版本!<br>[更新说明]',
            time: '2016-09-29',
            url: 'http://support.xlink.cn/hc/kb/article/210598'
          },
          {
            icon: 'apple',
            title: 'iOS SDK 更新v3.0版本！',
            time: '2016-08-12',
            url: 'https://github.com/xlink-corp/ios-sdk'
          },
          {
            icon: 'android',
            title: 'Android SDK 更新v3.0版本！',
            time: '2016-07-27',
            url: 'https://github.com/xlink-corp/android-sdk'
          },
          {
            icon: 'file-code-o',
            title: 'JSSDK微信版V1.1.2',
            time: '2016-07-14',
            url: 'https://github.com/xlink-corp/JS-SDK'
          },
          {
            icon: 'file-code-o',
            title: '设备端SDK已更新至V3',
            time: '2016-07-14',
            url: 'https://github.com/xlink-corp/device-sdk'
          }
        ]
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../../../assets/stylus/common'

  .guide-box
    width 100%
    border 1px solid #ddd
    box-sizing border-box
    .title-box
      height 30px
      line-height 30px
      background #e9e9e9
      color #333333
      padding-left 10px
      box-sizing border-box
      font-size 12px
    .content-box
      width 100%
      height 395px
      overflow auto
      .notice
        width 100%
        padding 10px 10px 10px 40px
        box-sizing border-box
        border-bottom 1px solid #ddd
        position relative
        font-size 12px
        &:last-child
          border-bottom 0
        .icon
          position absolute
          left 15px
          top 15px
          font-size 15px
        .title
          line-height 20px
        .time-box
          font-size 10px
          color #999999
</style>
