<template>
  <div class="guide-box">
    <div class="hd">
      <span class="title">开发指南</span>
    </div>
    <div class="bd">
      <div class="row">
        <div class="list col-12" v-for="(index, guide) in guides" :class="{'no-border': index>=(guides.length-2)}">
          <div class="icon" :class="'book' + (index+1)">
          </div>
          <div class="content">
            <div class="title">
              <span>{{guide.title}}</span>
            </div>
            <div class="introduce">
              <p>{{guide.introduce}}</p>
            </div>
            <div class="btn-box">
              <template v-for="btn in guide.buttons" >
                <a class="btn btn-ghost mr10" v-if="btn.link" @click="open(btn.link)">{{btn.text}}</a>
                <span v-else class="btn btn-ghost mr10 disabled">{{btn.text}}</span>
              </template>
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
          introduce: '云智易物联平台提供了丰富的开发接口，为设备接入、APP开发、平台对接提供了丰富的业务支持。',
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
              link: 'https://github.com/xlink-corp/ios-sdk'
            },
            {
              text: 'Android SDK',
              link: 'https://github.com/xlink-corp/android-sdk'
            }
          ]
        },
        {
          title: '硬件SDK下载',
          introduce: '云智易硬件SDK提供各种不同CPU架构的C库，方便快捷将各种硬件设备快速安全地接入到云智易物联平台，加快开发者开发周期。',
          buttons: [
            {
              text: 'MCU SDK下载',
              link: 'https://github.com/xlink-corp/device-sdk'
            }
          ]
        },
        {
          title: '硬件模拟器',
          introduce: '开发阶段即可使用真实通讯协议与云端、应用端交互，实现软硬件的平行开发，迅速缩短开发周期。',
          buttons: [
            {
              text: '下载软件',
              link: 'https://github.com/xlink-corp/xlink-sdk/tree/master/硬件模拟器_v3'
            }
          ]
        },
        {
          title: '调试APP',
          introduce: '硬件工程师可在不依赖软件开发进度的情况下独立完成硬件与应用端的所有调试，优化软硬件开发流程。',
          buttons: [
            {
              text: 'iOS',
              link: 'https://github.com/xlink-corp/ios-sdk'
            },
            {
              text: 'Android',
              link: 'https://github.com/xlink-corp/android-sdk'
            }
          ]
        },
        {
          title: '产测工具',
          introduce: '辅助量产客户进行自动化测试，为客户构建高效可靠的智慧产品量产测试体系，降低产品智能化对于产能的影响。',
          buttons: [
            {
              text: '敬请期待',
              link: ''
            }
          ]
        }
      ]
    }
  },

  methods: {
    /**
     * 新窗口打开链接
     * param {String} url 链接
     */
    open (url) {
      window.open(url)
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
