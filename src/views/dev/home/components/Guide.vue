<template>
  <div class="guide-box">
    <div class="hd">
      <span class="title">开发指南</span>
    </div>
    <div class="bd">
      <div class="row">
        <div class="list col-12" v-for="guide in guides" :class="{'no-border': $index>=(guides.length-2)}">
          <div class="icon" :class="'book' + ($index+1)">
          </div>
          <div class="content">
            <div class="title">
              <span>{{guide.title}}</span>
            </div>
            <div class="introduce">
              <p>{{guide.introduce}}</p>
            </div>
            <div class="btn-box">
              <a class="btn btn-ghost mr10" v-for="btn in guide.buttons" @click="open(btn.link)">{{btn.text}}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'guide',

    data () {
      return {
        guides: [
          {
            title: '开发文档',
            introduce: '云智易平台提供了丰富的接口，将服务能力开放给上层应用和第三方系统',
            buttons: [
              {
                text: '浏览开发者文档',
                link: 'https://github.com/xlink-corp/xlink-sdk'
              }
            ]
          },
          {
            title: 'APP SDK下载',
            introduce: '云智易提供了Android和iOS平台的SDK和开发文档，协助开发者快速完成应用程序的接入。',
            buttons: [
              {
                text: 'iOS SDK',
                link: 'https://github.com/xlink-corp/xlink-sdk/blob/master/%E5%BA%94%E7%94%A8%E7%AB%AF%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/APP%20iOS%20SDK%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3.md'
              },
              {
                text: 'Android SDK',
                link: 'https://github.com/xlink-corp/xlink-sdk/blob/master/%E5%BA%94%E7%94%A8%E7%AB%AF%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/APP%20Android%20SDK%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3.md'
              }
            ]
          },
          {
            title: 'MCU SDK下载',
            introduce: '基于云智易的无线通讯模块，厂商可以轻松实现与任意MCU的集成，为设备增加可连接的特性',
            buttons: [
              {
                text: 'MCU SDK下载',
                link: 'http://support.xlink.cn/'
              }
            ]
          },
          {
            title: '硬件模拟器',
            introduce: '开发阶段即可使用真实通讯协议与云端、应用端交互，实现软硬件的平行开发，迅速缩短开发周期。',
            buttons: [
              {
                text: '下载软件',
                link: ''
              }
            ]
          },
          {
            title: '调试APP',
            introduce: '硬件工程师可在不依赖软件开发进度的情况下独立完成硬件与应用端的所有调试，优化软硬件开发流程。',
            buttons: [
              {
                text: 'iOS',
                link: ''
              },
              {
                text: 'Android',
                link: ''
              }
            ]
          },
          {
            title: '产测工具',
            introduce: '辅助量产客户进行自动化测试，为客户构建高效可靠的智慧产品量产测试体系，降低产品智能化对于产能的影响。',
            buttons: [
              {
                text: '下载软件',
                link: ''
              }
            ]
          }
        ]
      }
    },

    methods: {
      open (path) {
        console.log(path)
        window.open(path)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../../../assets/stylus/common'

  .guide-box
    .hd
      height 40px
      line-height 40px
      border-bottom 1px solid #ddd
      font-size 14px
      position relative
      &:after
        content ""
        display block
        width 15px
        border-bottom 1px solid #ddd
        position absolute
        top 100%
        left -15px
    .bd
      .list
        width 50%
        height 190px
        border-bottom 1px dashed #ddd
        padding 30px 10px
        box-sizing border-box
        position relative
        padding-left 70px
        &.no-border
          border-bottom 0
        .icon
          position absolute
          top 30px
          left 10px
          width 50px
          height 50px
          background no-repeat center top / 40px 50px
        .book1
          background-image url('../../../../assets/images/book1.png')
        .book2
          background-image url('../../../../assets/images/book2.png')
        .book3
          background-image url('../../../../assets/images/book3.png')
        .book4
          background-image url('../../../../assets/images/book4.png')
        .book5
          background-image url('../../../../assets/images/book5.png')
        .book6
          background-image url('../../../../assets/images/book6.png')
        .title
          font-size 18px
          color #333
        .introduce
          margin-top 15px
          margin-bottom 10px
          height 60px
          line-height 20px
          overflow hidden
          width 80%
          p
            margin-top 0
            margin-bottom 0
            font-size 12px
            color #666
        .btn-box
          .btn
            border-radius 3px

</style>
