<template>
  <div class="page-in">
    <div class="body row">
      <div class="tips">维护公告：今日9-23 04：00-05：00将进行系统升级！ </div>
      <div class="row widmid">
        <div class="dev-box container col-12">
          <div class="container-body">
            <div class="part part1 base-introduce">
              <div class="icon-box"></div>
              <div class="text-box">
                <h2>我是开发</h2>
                <div class="description">在开发平台创建产品、开发调试产品，配置产品设备属性，发布产品上线</div>
              </div>
            </div>

            <div class="part part2 product-list">
              <div class="title-box">
                <h2>产品开发</h2>
                <a class="check-all" v-show="isReleaseProductsCount + noReleaseProductsCount" @click="goto('/dev')">查看全部({{isReleaseProductsCount + noReleaseProductsCount}}) ></a>
              </div>
              <div class="content-box">
                <div class="product" v-for="product in devProducts">
                  <div class="img-box">
                    <img :src="product.pic">
                  </div>
                  <div class="text-box">
                    <div class="line msg">
                      <a class="name" v-link="{'path': '/dev/products/' + product.id + '/info'}">{{product.name}}</a>
                      <!-- <span class="product-id">({{product.id}})</span> -->
                    </div>
                    <div class="info">
                      <span>授权：{{product['quota'] || 0}}</span>
                      <span class="ml10">| 设备数：{{product['total'] || '0'}}</span>
                      <span class="ml10">| 状态：{{product['is_release']?'已发布':'未发布'}}</span>
                    </div>
                  </div>
                </div>
                <div class="no-products ml10 grayfont" v-show="devProducts.length === 0">
                  <span>您还没有任何产品，请点击按钮开始创建</span>
                  <button class="btn btn-success ml20 bradius" @click="goto('/dev/products/create')">
                    <i class="fa fa-plus"></i>
                    添加产品
                  </button>
                </div>
              </div>
            </div>

            <div class="part part3 link-box">
              <div class="title-box">
                <h2>开发指南</h2>
                <a class="check-all">查看全部 ></a>
              </div>
              <div class="content-box">
                <div class="link" v-for="link in links">
                  <i class="fa fa-file-text-o"></i>
                  <a @click="open(link.path)">{{link.content}}</a>
                </div>
              </div>
            </div>

            <div class="part part4 entry">
              <button class="btn btn-primary bradius" @click="goto('/dev')">立即进入</button>
            </div>
          </div>

        </div>
        <div class="operation-box container col-12">
          <div class="container-body">
            <div class="part part1 base-introduce">
              <div class="icon-box"></div>
              <div class="text-box">
                <h2>我是运营</h2>
                <div class="description">在运营平台查看设备数据、用户数据，查看设备运行状态并针对设备和用户数据统计运营数据</div>
              </div>
            </div>

            <div class="part part2 product-list">
              <div class="title-box">
                <h2>产品管理</h2>
                <a class="check-all" v-show="isReleaseProductsCount" @click="goto('/operation/overview')">查看全部({{isReleaseProductsCount}}) ></a>
              </div>
              <div class="content-box">
                <div class="product" v-if="corp.status!==0 && releaseProducts.length!==0" v-for="product in releaseProducts">
                  <div class="img-box">
                    <img :src="product.pic">
                  </div>
                  <div class="text-box">
                    <div class="line msg">
                      <a class="name" v-link="{'path': '/operation/products/' + product.id + '/overview'}">{{product.name}}</a>
                      <!-- <span class="product-id">({{product.id}})</span> -->
                    </div>
                    <div class="info">
                      <span>设备数：{{product['total']}}</span>
                      <span class="ml10">| 激活：{{product['activated']}}</span>
                      <span class="ml10">| 在线：{{product['online']}}</span>
                    </div>
                  </div>
                </div>
                <div class="no-products ml10 grayfont" v-show="corp.status===0">
                  <span>您的账号目前尚未认证，待认证成功后，即可使用运营平台，任何疑问联系：400-291-234</span>
                </div>
                <div class="no-products ml10 grayfont" v-show="corp.status!==0 && releaseProducts.length===0">
                  <span>暂未发布产品，马上去开发平台发布一款产品，即可使用运营平台，任何疑问联系：400-291-234</span>
                </div>
              </div>
            </div>

            <div class="part part3 link">
              <div class="title-box">
                <h2>快捷导航</h2>
                <!-- <a class="check-all" @click="goto('/operation/overview')">查看全部 ></a> -->
              </div>
              <div class="content-box">
                <div class="nav">
                  <span>产品管理：</span>
                  <a v-for="nav in nav.products" @click="goto(nav.path)">{{nav.content}}</a>
                </div>
                <div class="nav">
                  <span>告警服务：</span>
                  <a v-for="nav in nav.alerts" @click="goto(nav.path)">{{nav.content}}</a>
                </div>
                <div class="nav">
                  <span>用户管理：</span>
                  <a v-for="nav in nav.users" @click="goto(nav.path)">{{nav.content}}</a>
                </div>
              </div>
            </div>

            <div class="part part4 entry">
              <button class="btn btn-primary bradius" @click="goto('/operation/overview')">立即进入</button>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="footer-banner">
      <img src="/static/images/banner.jpg" alt="">
    </div>
    <div class="footer">
      <span>© 2016  云智易 |  www.xlink.cn</span>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import api from 'api'

export default {
  name: 'Dashboard',

  layouts: ['topbar'],

  mixins: [globalMixins],

  vuex: {
    getters: {
      corp: ({ system }) => system.corp
    }
  },

  data () {
    return {
      loading: false,
      isReleaseProductsCount: 0,
      noReleaseProductsCount: 0,
      products: [],
      productSummary: [],
      links: [
        {
          content: '如何接入智能？',
          path: 'https://github.com/xlink-corp/xlink-sdk/tree/master/%E8%AE%BE%E5%A4%87%E7%AB%AF%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3'
        },
        {
          content: '如何开发一个APP',
          path: 'https://github.com/xlink-corp/xlink-sdk/tree/master/%E5%BA%94%E7%94%A8%E7%AB%AF%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3'
        },
        {
          content: '获取SDK',
          path: 'https://github.com/xlink-corp/xlink-sdk'
        }
      ],
      nav: {
        products: [
          {
            content: '产品概览',
            path: '/operation/overview'
          }
        ],
        alerts: [
          {
            content: '告警记录',
            path: '/operation/alerts/record'
          },
          {
            content: '告警分析',
            path: '/operation/alerts/analysis'
          }
          // {
          //   content: '热力分布',
          //   path: '/operation/alerts/heat'
          // }
        ],
        users: [
          {
            content: '用户概览',
            path: '/operation/users/overview'
          },
          {
            content: '用户列表',
            path: '/operation/users/list'
          // },
          // {
          //   content: '人群画像',
          //   path: '/operation/users/portrait'
          }
          // {
          //   content: '用户标签',
          //   path: '/operation/users/overview'
          // }
        ]
      }
    }
  },

  computed: {
    /**
     * 用于显示的产品数组
     * @return {[type]} [description]
     */
    allProducts () {
      var result = []
      this.products.forEach((item1) => {
        var product = {}
        product.name = item1.name
        product.id = item1.id
        product.is_release = item1.is_release
        product.quota = item1.quota
        product.pic = item1.pics[0] || '/static/images/device_thumb.png'
        this.productSummary.forEach((item2) => {
          if (product.id === item2.id) {
            product.total = item2['total'] || 0
            product.activated = item2['activated'] || 0
            product.online = item2['online'] || 0
          }
        })
        result.push(product)
      })
      return result
    },
    releaseProducts () {
      var result = []
      this.allProducts.map((item) => {
        if (item.is_release) {
          result.push(item)
        }
      })
      return result
    },
    devProducts () {
      var result = []
      this.allProducts.map((item) => {
        if (!item.is_release) {
          result.push(item)
        }
      })
      this.allProducts.map((item) => {
        if (item.is_release && result.length < 2) {
          result.push(item)
        }
      })
      return result
    }
  },
  route: {
    data () {
      this.getProducts()
    }
  },
  methods: {
    /**
     * 获取产品概览
     * @param  {[type]} productId [description]
     * @return {[type]}           [description]
     */
    getProductSummary (productId) {
      api.statistics.getProductSummary(productId).then((res) => {
        res.data.id = productId
        this.productSummary.push(res.data)
      }).catch((res) => {
        this.handleError(res)
      })
    },
    /**
     * 获取产品
     * @return {[type]} [description]
     */
    getProducts () {
      this.loading = true
      api.product.all().then((res) => {
        var isReleaseProducts = []
        var noReleaseProducts = []
        res.data.forEach((item) => {
          if (item.is_release) {
            isReleaseProducts.push(item)
          } else {
            noReleaseProducts.push(item)
          }
        })
        this.isReleaseProductsCount = isReleaseProducts.length
        this.noReleaseProductsCount = noReleaseProducts.length
        if (isReleaseProducts.length > 2) {
          isReleaseProducts.length = 2
        }
        if (noReleaseProducts.length > 2) {
          noReleaseProducts.length = 2
        }
        this.products = isReleaseProducts.concat(noReleaseProducts)
        this.loading = false
        res.data.forEach((item) => {
          this.getProductSummary(item.id)
        })
      }).catch((res) => {
        this.loading = false
        this.handleError(res)
      })
    },
    /**
     * 在新窗口中打开
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    open (path) {
      window.open(path)
    },
    /**
     * 切换路由到..
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    goto (path) {
      this.$route.router.go(path)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/stylus/common'
  .widmid
    width 1310px
    margin 0 auto
  .tips
    /*height 25px*/
    line-height 25px
    padding 5px 10px
    box-sizing border-box
    background-color #fafafa
    color #da4e37
    margin-bottom 20px
  .bradius
    border-radius 10px
  .grayfont
    color #bcbcbc
  .page-in
    width 100%
    height 100%
    position relative
    padding-bottom 107px
    box-sizing border-box
    background #fff
    .body
      width 100%
      height 100%
      padding 15px
      box-sizing border-box
      overflow auto
      .dev-box
        /*border-right 1px solid #dddddd*/
        box-sizing border-box

    .container
      /*padding 0 80px 20px*/
      box-sizing border-box
      .container-body
        margin 0 20px 10px
        padding 10px 20px
        border 1px solid #dddddd
        border-radius 10px
      &.dev-box
        .icon-box
          background url('../assets/images/developer.png') no-repeat center center / 90% 90%

      &.operation-box
        .icon-box
          background url('../assets/images/operation.png') no-repeat center center / 90% 90%

      .part
        width 100%
        height auto
        margin-top 15px
        .title-box
          height 30px
          border-bottom 1px solid #ccc
          padding 0 10px
          position relative
          line-height 30px
          h2
            color #333333
            font-size 14px
            display inline
          .check-all
            position absolute
            right 10px
            text-align right
            color #999
            &:hover
              color red
        .content-box
          padding 0 10px
          box-sizing border-box
          width 100%
      .part1
        text-align center
        position relative
        min-height 85px
        .icon-box
          width 85px
          height 85px
          /*position absolute
          top 0
          left 0*/
          margin 0 auto
        .text-box
          /*margin-left 100px*/
          padding-top 6px
          h2
            margin-top 10px
            font-size 25px
            padding 0
            margin 0 0 20px 0
            color #333333
          .description
            color #bcbcbc
            margin-bottom 60px
      .part2
        .product
          width 100%
          height 50px
          overflow hidden
          margin-top 20px
          position relative
          padding-left 70px
          box-sizing border-box
          .img-box
            width 50px
            height 50px
            border 1px solid #ccc
            box-sizing border-box
            position absolute
            left 0
            top 0
            img
              width 100%
              height 100%
          .text-box
            height 100%
            color #999999
            .msg
              line-height 30px
              height 30px
              white-space nowrap
              text-overflow 100%
              .name
                font-size 16px
                color #DA4E37
        .no-products
          height 120px
          padding-top 50px
          box-sizing border-box
          font-size 12px
      .part3
        .content-box
          padding-top 10px
        .nav
        .link
          width 100%
          height 20px
          margin-top 10px
          overflow hidden
          line-height 20px
          .fa
            width 15px
            height 15px
        .nav
          a
            margin-left 10px
      .part4
        text-align center
        margin-top 30px
        .btn
          width 155px
          height 33px
          background-color #da4e37
          font-size 14px
    .footer-banner
      width 100%
      height 100px
      position absolute
      left 0
      bottom 100px
      text-align center

    .footer
      width 100%
      height 45px
      line-height 45px
      text-align center
      background #f6f6f6
      color #999
      /*border-top 1px solid #dddddd*/
      border-bottom 1px solid #dddddd
      position absolute
      bottom 53px
      left 0
</style>
