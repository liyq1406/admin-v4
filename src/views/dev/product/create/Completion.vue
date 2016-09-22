<template>
  <div class="panel">
    <div class="panel-body">
      <div class="completion row">
        <div class="pro-info col-8">
          <div class="pro-info-inner">
            <h3 class="name">{{ product.name }}</h3>
            <div class="pro-features">
              <ul>
                <li>
                  <div class="label">产品型号：</div>
                  <div class="info">{{ product.mode }}</div>
                </li>
                <li>
                  <div class="label">产品类型：</div>
                  <div class="info">{{ getProductModeByValue(product.type) }}</div>
                </li>
                <li>
                  <div class="label">连接类型：</div>
                  <div class="info">{{ getLabelByValue(product.link_type) }}</div>
                </li>
                <li>
                  <div class="label">产品描述：</div>
                  <div class="info">{{ product.description }}</div>
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
              <div class="dev-item dev-hardware">
                <div class="thumb"></div>
                <div class="info">
                  <h3>我是硬件开发者</h3>
                  <p>云智易向硬件开发工程师提供了xlink的文档、开发工具以及SDK下载。</p>
                  <div class="operation"><a v-link="{path: '/dev/products/' + product.id + '/debug'}" class="link-start">立即开始</a></div>
                </div>
              </div>
              <div class="dev-item dev-app">
                <div class="thumb"></div>
                <div class="info">
                  <h3>我是APP开发者</h3>
                  <p>根据开发者身份，您可以选择iOS、Android的对应测试工具，以及相关的SDK文档，与设备进行联调。</p>
                  <!-- <div class="operation"><a v-link="{path: '/dev/products/' + product.id + '/virtual-devices'}" class="link-start">立即开始</a></div> -->
                  <div class="operation"><a v-link="{path: '/dev/home'}" class="link-start">立即开始</a></div>
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
import _ from 'lodash'

export default {
  name: 'Completion',

  mixins: [globalMixins],

  props: {
    product: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  methods: {
    /**
     * 根据值获取 label
     * @author shengzhi
     * @param {Number} val 值
     */
    getLabelByValue (val) {
      return this.locales.data.DEVICE_TYPES[val - 1] || '--'
    },
    /**
     * 根据产品类型值获取 label
     * @author shengzhi
     * @param {Number} val 值
     */
    getProductModeByValue (val) {
      if (!this.locales.data.PRODUCT_TYPES) {
        return
      }
      let ret = ''
      let type = _.find(this.locales.data.PRODUCT_TYPES, (item) => {
        return item.value === val
      })

      if (type) {
        ret = type.label
      }
      return ret
    }
  }
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
          background-repeat no-repeat
          background-size cover

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

      .dev-hardware
        .thumb
          background-image url("../../../../assets/images/products/creation/pc.png")

      .dev-app
        .thumb
          background-image url("../../../../assets/images/products/creation/phone.png")
</style>
