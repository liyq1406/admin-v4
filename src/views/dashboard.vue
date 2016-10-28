<template>
  <div class="page-in">
    <div class="body row">
      <div class="tips" v-if="tips.length"><i class="fa fa-bullhorn" style="color: #000;margin-right:5px"></i><span v-for="tip in tips"><a :href="tip.link" >{{tip.title}}</a></span></div>
      <div class="dev-box container col-12">
        <div class="container-body">
          <div class="part part1 base-introduce">
            <div class="icon-box"></div>
            <div class="text-box">
              <h2>{{ $t('home.developer.title') }}</h2>
              <div class="description">{{ $t('home.developer.description') }}</div>
            </div>
          </div>

          <div class="part part2 product-list">
            <div class="title-box">
              <h2>{{ $t('home.developer.product_dev') }}</h2>
              <a class="check-all" v-show="isReleaseProductsCount + noReleaseProductsCount" @click="goto('/dev')">{{ $t('home.detail') }}({{isReleaseProductsCount + noReleaseProductsCount}}) ></a>
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
                    <span>{{ $t('home.authorization') }}：{{product['quota'] || 0}}</span>
                    <span class="ml10">| {{ $t('home.device_count') }}：{{product['total'] || '0'}}</span>
                    <span class="ml10">| {{ $t('home.status') }}：{{product['is_release'] ? $t('home.developer.published') : $t('home.developer.unpublished') }}</span>
                  </div>
                </div>
              </div>
              <div class="no-products ml10" v-show="devProducts.length
              === 0">
                <span class="lgrayfont">{{ $t('home.developer.no_product_tip') }}</span>
                <button class="btn bggray ml20" @click="goto('/dev/products/create')">
                  <i class="fa fa-plus"></i>
                {{ $t('home.developer.add_product') }}
                </button>
              </div>
            </div>
          </div>

          <div class="part part3 link-box">
            <div class="title-box">
              <h2>{{ $t('home.developer.dev_guide') }}</h2>
              <a class="check-all" @click="open('https://github.com/xlink-corp/xlink-sdk')">{{ $t('home.detail')}}></a>
            </div>
            <div class="content-box">
              <div class="link" v-for="link in links">
                <i class="fa fa-file-text-o"></i>
                <a @click="open(link.path)">{{link.content}}</a>
              </div>
            </div>
          </div>

          <div class="part part4 entry">
            <button class="btn btn-primary" @click="goto('/dev')">{{ $t('home.go_in') }} >></button>
          </div>
        </div>

      </div>
      <div class="operation-box container col-12">
        <div class="container-body">
          <div class="part part1 base-introduce">
            <div class="icon-box"></div>
            <div class="text-box">
              <h2>{{ $t('home.operation.title') }}</h2>
              <div class="description">{{ $t('home.operation.description') }}</div>
            </div>
          </div>

          <div class="part part2 product-list">
            <div class="title-box">
              <h2>{{ $t('home.operation.product_manager') }}</h2>
              <a class="check-all" v-show="isReleaseProductsCount" @click="goto('/operation/overview')">{{ $t('home.detail')}}({{isReleaseProductsCount}}) ></a>
            </div>
            <div class="content-box">
              <template v-if="corp.status!==0 && releaseProducts.length!==0">
                <div class="product" v-for="product in releaseProducts">
                  <div class="img-box">
                    <img :src="product.pic">
                  </div>
                  <div class="text-box">
                    <div class="line msg">
                      <a class="name" v-link="{'path': '/operation/products/' + product.id + '/overview'}">{{product.name}}</a>
                      <!-- <span class="product-id">({{product.id}})</span> -->
                    </div>
                    <div class="info">
                      <span>{{ $t('home.device_count') }}：{{product['total']}}</span>
                      <span class="ml10">| {{ $t('home.operation.actived') }}：{{product['activated']}}</span>
                      <span class="ml10">| {{ $t('home.operation.online') }}：{{product['online']}}</span>
                    </div>
                  </div>
                </div>
              </template>
              <div class="no-products ml10" v-show="corp.status===0">
                <div class="lgrayfont">{{ $t('home.operation.not_certified') }}</div>
                <div class="lgrayfont">{{ $t('home.operation.business_support') }}，<a class="hl-red" @click="open('http://www.xlink.cn/about.html')">{{ $t('home.operation.contact_info') }}</a></div>
              </div>
              <div class="no-products ml10 grayfont" v-show="corp.status!==0 && releaseProducts.length===0">
                <span class="lgrayfont">{{ $t('home.operation.publish_tip') }}：<i class="hl-red">400-291-234</i></span>
              </div>
            </div>
          </div>

          <div class="part part3 link">
            <div class="title-box">
              <h2>{{ $t('home.operation.fast_link') }}</h2>
              <!-- <a class="check-all" @click="goto('/operation/overview')">查看全部 ></a> -->
            </div>
            <div class="content-box">
              <div class="nav">
                <span>{{ $t('home.operation.product_manager') }}：</span>
                <a v-for="nav in nav.products" @click="goto(nav.path)">{{nav.content}}</a>
              </div>
              <div class="nav">
                <span>{{ $t('home.operation.alert') }}：</span>
                <a v-for="nav in nav.alerts" @click="goto(nav.path)">{{nav.content}}</a>
              </div>
              <div class="nav">
                <span>{{ $t('home.operation.users') }}：</span>
                <a v-for="nav in nav.users" @click="goto(nav.path)">{{nav.content}}</a>
              </div>
            </div>
          </div>

          <div class="part part4 entry">
            <button class="btn btn-primary " @click="enterOperation">{{ $t('home.go_in') }} >></button>
          </div>
        </div>
      </div>
      <div class="footer-banner" v-if="pics.length">
        <div v-for="pic in pics">
          <a v-if="pic.link" :href="pic.link"><img :src="pic.image" alt=""></a>
          <span v-else><img :src="pic.image" alt=""></span>
        </div>
      </div>
    </div>
    <div class="footer">
      <span>{{ $t('home.copy_right') }}</span>
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
      tips: [],
      pics: [],
      loading: false,
      isReleaseProductsCount: 0,
      noReleaseProductsCount: 0,
      products: [],
      productSummary: [],
      links: [
        {
          content: this.$t('home.how_to_link'),
          path: 'https://github.com/xlink-corp/xlink-sdk/blob/master/README.md'
        },
        {
          content: this.$t('home.app_demo_link'),
          path: 'https://github.com/xlink-corp/xlink-sdk/tree/master/应用端开发文档'
        },
        {
          content: this.$t('home.resful_link'),
          path: 'https://github.com/xlink-corp/xlink-sdk/tree/master/物联平台管理接口文档'
        }
      ],
      nav: {
        products: [
          {
            content: this.$t('home.product_overview'),
            path: '/operation/overview'
          }
        ],
        alerts: [
          {
            content: this.$t('home.alert_record'),
            path: '/operation/alerts/record'
          },
          {
            content: this.$t('home.alert_analysis'),
            path: '/operation/alerts/analysis'
          }
          // {
          //   content: '热力分布',
          //   path: '/operation/alerts/heat'
          // }
        ],
        users: [
          {
            content: this.$t('home.user_overview'),
            path: '/operation/users/overview'
          },
          {
            content: this.$t('home.user_list'),
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
      // },
      // info: {
      //   notify: [
      //     {
      //       _id: 1,
      //       tilte: '',
      //       link: '##',
      //       language: 'Zh-cn',
      //       ttl: 0,
      //       pubDate: ''
      //     }
      //   ],
      //   articles: [
      //     {
      //       _id: 1,
      //       title: '',
      //       link: '',
      //       description: '',
      //       content: '',
      //       language: 'Zh-cn',
      //       ttl: 12345678,
      //       pubDate: '',
      //       image: '',
      //       category: [],
      //       tags: []
      //     }
      //   ]
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
      this.$http.get('/static/data/platform_info.json').then((res) => {
        this.tips = res.data.notify
        this.pics = res.data.articles
      })
    }
  },
  methods: {
    /**
     * 获取产品概览
     * @param  {String} productId 产品ID
     * @return {void}
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
     * 获取所有产品
     * @return {void}
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
    },
    /**
     * 进入运营平台
     */
    enterOperation () {
      if (this.corp.status === 0) {
        this.open('http://ap.xlink.cn/#!/auto-login')
      } else {
        this.$route.router.go('/operation/overview')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/stylus/common'
  .bggray
    background-color #95A5A6
  .lgrayfont
    color #666
  /*.widmid
    width 1310px
    margin 0 auto*/
  .tips
    /*height 25px*/
    line-height 25px
    padding 5px 10px
    box-sizing border-box
    background-color #EAEDF2
    color #B1C3C8
    margin-bottom 20px
    &:hover
      color red
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
      padding 4px
      box-sizing border-box
      overflow auto
      .dev-box
        margin-bottom 30px
        border-right 1px solid #dddddd
        box-sizing border-box

    .container
      padding 0 80px 20px
      box-sizing border-box
      /*.container-body
        margin 0 20px 10px
        padding 10px 20px
        border 1px solid #dddddd
        border-radius 10px*/
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
        /*.content-box
          padding 0 10px
          box-sizing border-box
          width 100%*/
      .part1
        /*text-align center*/
        position relative
        min-height 85px
        .icon-box
          width 85px
          height 85px
          position absolute
          top 0
          left 0
          margin 0 auto
        .text-box
          margin-left 100px
          padding-top 6px
          h2
            margin-top 10px
            font-size 25px
            padding 0
            margin 0 0 20px 0
            color #333333
          .description
            color #bcbcbc
            margin-bottom 20px
            height 38px
      .part2
        height 171px
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
      text-align center

    .footer
      width 100%
      height 45px
      line-height 45px
      text-align center
      background #f6f6f6
      color #999
      border-top 1px solid #dddddd
      border-bottom 1px solid #dddddd
      position absolute
      bottom 53px
      left 0
</style>
