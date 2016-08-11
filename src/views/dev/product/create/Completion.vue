<template>
  <div class="panel no-split-line">
    <div class="panel-body">
      <div class="completion row">
        <div class="pro-info col-8">
          <div class="pro-info-inner">
            <h3 class="name">空气净化器</h3>
            <div class="pro-features">
              <ul>
                <li>
                  <div class="label">产品型号：</div>
                  <div class="info">A3w</div>
                </li>
                <li>
                  <div class="label">产品类型：</div>
                  <div class="info">空气清洁</div>
                </li>
                <li>
                  <div class="label">连接类型：</div>
                  <div class="info">Wi-Fi</div>
                </li>
                <li>
                  <div class="label">产品描述：</div>
                  <div class="info">第一代家用智能空气净化器</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="dev-guide col-16">
          <div class="dev-guide-inner">
            <div class="tips">
              <h3>恭喜，产品创建成功！</h3>
              <p>您现在可以体验模拟设备或立即开始产品开发</p>
            </div>
            <div class="developers">
              <div class="dev-item">
                <div class="thumb"></div>
                <div class="info">
                  <h3>我是硬件开发者</h3>
                  <p>云智易向硬件开发工程师提供了xlink的文档、开发工具以及SDK下载。</p>
                  <div class="operation"><a href="#" class="link-start">立即开始</a></div>
                </div>
              </div>
              <div class="dev-item">
                <div class="thumb"></div>
                <div class="info">
                  <h3>我是APP开发者</h3>
                  <p>根据开发者身份，您可以选择iOS、Android的对应测试工具，以及相关的SDK文档，与设备进行联调。</p>
                  <div class="operation"><a href="#" class="link-start">立即开始</a></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'

export default {
  name: 'Completion',

  mixins: [globalMixins]
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'

.completion
  .pro-info
    margin-top 40px

    .pro-info-inner
      padding 20px 20px 80px 5px

    h3
      font-weight normal
      font-size 18px
      margin 0 15px 10px

    .pro-features
      li
        border-bottom 1px solid light-border-color
        padding 15px
        clearfix()

        .label
          float left
          color gray-light
          width 70px

        .info
          margin-left 72px

  .dev-guide
    margin-top 40px
    margin-bottom 20px

  .dev-guide-inner
    border-left 1px solid default-border-color
    padding 20px 40px 40px 50px

    .tips
      margin-bottom 30px

      h3
        font-size 24px
        font-weight normal
        margin 0 0 5px

      p
        margin 0
        color gray-light

    .developers
      .dev-item
        clearfix()
        margin-bottom 20px

        .thumb
          float left
          size 60px
          background #EEE
          border-radius 40px

        .info
          margin-left 80px

          h3
            font-size 14px
            margin 0
            line-height 24px
            font-weight normal

          p
            font-size 12px
            color gray-light
            margin 0
            line-height 22px

          .operation
            margin-top 5px

          .link-start
            display inline-block
            background #48B7AF
            color #FFF
            height 24px
            line-height 24px
            padding 0 20px

            &:hover
              text-decoration none
              background darken(#48B7AF, 10%)
</style>
