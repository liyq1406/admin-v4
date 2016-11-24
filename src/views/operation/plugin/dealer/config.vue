<template>
  <div class="panel major-clients-config">
    <div class="part onoff-server-box">
      <div class="pic-box">
        <i class="fa fa-desktop"></i>
      </div>
      <div class="text-box">
        <div class="describe">
          <span>通过独立入口配置，可实现大客户以独立的网址登陆云智易平台，并且可对其权限进行配置；如：可设定大客户访问界面UI、产品权限、功能权限等；</span>
        </div>
        <div class="control mt10">
          <span class="label mr20">开启独立入口服务</span>
          <switch :value.sync="model.is_enable"></switch>
        </div>
      </div>
    </div>
    <div v-if="model.is_enable">
      <div class="panel-sub-hd bordered mb20">域名配置</div>

      <div class="part form">
        <div class="form-row row pl20">
          <label class="form-control col-4">域名:</label>
          <div class="controls col-20">
            <div class="input-text-wrap">
              <input type="text" placeholder="域名" class="input-text" v-model="model.domain" name="model.domain" readonly="true">
            </div>
          </div>
        </div>
      </div>

      <div class="panel-sub-hd bordered mb20">界面UI配置</div>

      <div class="part form">
        <div class="form-row row pl20">
          <label class="form-control col-4">登陆页面文案:</label>
          <div class="controls col-20">
            <div class="input-text-wrap">
              <input type="text" placeholder="登陆页面文案" class="input-text" v-model="model.login_context">
            </div>
          </div>
        </div>

        <div class="form-row row pl20">
          <label class="form-control col-4">企业Logo:</label>
          <div class="controls col-20">
            <div class="thumb-info">
              <div class="thumb">
                <image-uploader :images="images" @modified="onModifiedImages"></image-uploader>
                <div class="form-tips">图片规格：400*110</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-sub-hd bordered mb20">权限配置</div>

      <div class="panel-bd products-container clearfix">
        <!-- 应用列表  -->
        <div v-if="!allProducts.length" class="non">暂无产品</div>
        <div  v-if="allProducts.length" class="product-list-box fl">
          <div class="product" v-for="product in allProducts" :class="{'selected': product.id === selectedProduct.id}" @click="selectProduct(product)">
            <div>
              <span class="product-name">{{ product.name }}</span>
              <span class="product-name">设备数: {{ product.quota }}</span>
            </div>
            <!-- <div class="product-type">
              <span class="type">{{computedproductType(product.type)}}</span>
              <span class="ml5">版本号</span>
            </div> -->
          </div>
        </div>
        <!-- 应用详情 -->
        <div v-if="allProducts.length" class="panel product-details-box fr">
          <!-- 详情头部 -->
          <!-- <div class="panel-hd">
            <div class="product-name">
              <span>{{selectedproduct.name}}</span>
            </div>
          </div> -->
          <!-- 详情内容 -->
          <div class="panel mt15 mb20 no-split-line">
            <div class="panel-bd row">
              <div>
                <info-card :info="productSummary">
                  <div class="alert-record-summary">
                    <div class="up">
                      <h3 class="textoverflow wid">{{selectedProduct.name || '-'}}</h3>
                    </div>
                    <div class="down row">
                      <div class="col-12">
                        <span>{{selectedProduct.create_time | formatDate}}</span>
                      </div>
                      <div class="col-12">
                        <!-- <button>
                          <i class="fa fa-check"></i>
                          已处理
                        </button> -->
                        <label class="label mr20">
                          授权可见：
                          <tooltip placement="left" width="300px">
                            <p>开启授权可见，经销商账户可登录账号查看该产品下设备信息、状态、告警信息等。</p>
                            <i class="fa fa-question-circle hl-orange" slot="trigger"></i>
                          </tooltip>
                        </label>
                        <switch :value="selectedProduct.is_visible" @switch-toggle="productToggle"></switch>
                      </div>
                    </div>
                  </div>
                </info-card>
                <!-- <pre>{{selectedProduct|json}}</pre> -->
                <div>
                  <info-list :info="productInfo"></info-list>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-sub-hd bordered mb20">模块配置</div>

      <div class="intelligent-table-box part">
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>功能模块</th>
              <th class="tac">描述</th>
              <th class="tac">授权可见</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="tables.length > 0">
              <tr v-for="table in tables" track-by="$index">
                <td class="hl-red">{{ table.title }}</td>
                <td>{{ table.description }}</td>
                <td class="tac"><switch :value.sync="table.is_visible" size="small"></switch></td>
              </tr>
            </template>
            <tr v-if="tables.length === 0 && !loadingData">
              <td :colspan="3" class="tac">
                <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <button class="btn btn-primary btn-lg" @click.prevent.stop="setConfig">提交</button>
  </div>
</template>

<script>
import api from 'src/api'
import formatDate from 'filters/format-date'

export default {
  name: 'config',
  vuex: {
    getters: {
      corp: ({ system }) => system.corp,
      productList: ({ products }) => products.all
    }
  },

  components: {
  },

  data () {
    return {
      tables: [{
        title: '产品概览',
        type: 'summary',
        description: '查看产品概览，包括激活趋势、增长总数、产品热力分部等',
        is_visible: false
      }, {
        title: '设备管理',
        type: 'device_list',
        description: '查看设备列表、远程调试设备、查看历史记录、查看经销商、维保记录等',
        is_visible: false
      }, {
        title: '告警信息',
        type: 'alert',
        description: '管理告警详情与告警分析',
        is_visible: false
      }, {
        title: '设备地图',
        type: 'device_map',
        description: '查看设备地理位置详细分布',
        is_visible: false
      }, {
        title: '产品分析',
        type: 'analyse',
        description: '通过三个维度分析产品，包括单次时长、使用次数、时段分部等',
        is_visible: false
      }, {
        title: '智能维保',
        type: 'warranty',
        description: '管理设备维修、延保等内容',
        is_visible: false
      }, {
        title: '用户反馈',
        type: 'helpdesk',
        description: '用户端可提交相关产品反馈至平台，可使用反馈分析等模块',
        is_visible: false
      }],
      model: {
        is_enable: false,
        domain: 'http://test.admin.xlink.cn/#!/dealer/' + this.corp.id + '/' + this.$route.params.dealer_id,
        login_context: '',
        logo_url: ''
      },
      allProducts: [],
      productsStaus: [],
      domainName: '',
      images: [''],
      // productList: [{
      //   id: '0',
      //   name: '123213',
      //   account: 10
      // }, {
      //   id: '1',
      //   name: '22222',
      //   account: 23
      // }],
      selectedProduct: {}
    }
  },

  computed: {
    // 产品简介
    productSummary () {
      var result = {
        title: this.selectedProduct.name,
        online: '-',
        time: formatDate(this.selectedProduct.last_login)
      }
      return result
    },
    // 产品信息
    productInfo () {
      return {
        id: {
          label: '产品ID',
          value: this.selectedProduct.id || '-'
        },
        model: {
          label: '产品型号',
          value: this.selectedProduct.mode || '-'
        },
        type: {
          label: '连接类型',
          value: this.currType || '-'
        },
        describe: {
          label: '产品描述',
          value: this.selectedProduct.description || '-'
        }
      }
    },
    // allProducts () {
    //   var result = []
    //   _.cloneDeep(this.productList).forEach((product) => {
    //     product.is_visible = false
    //     this.productsStaus.forEach((status) => {
    //       if (status.product_id === product.id) {
    //         product.is_visible = status.is_visible || false
    //       }
    //     })
    //   })
    //   result = this.productList
    //   return result
    // },
    currType () {
      var value = this.selectedProduct.link_type
      var result
      var arr = ['wifi设备', 'Zigbee网关', '蓝牙设备', '蓝牙Mesh设备', 'PC设备']
      result = arr[value - 1]
      return result
    }
  },

  route: {
    data () {
    }
  },

  ready () {
    this.init()
    // this.getConfig()
  },

  watch: {
    productList () {
      this.init()
    }
  },
  methods: {
    /**
     * 初始化
     */
    init () {
      if (this.productList.length) {
        let products = _.cloneDeep(this.productList).map((product) => {
          product.is_visible = false
          return product
        })
        this.allProducts = products
        this.selectedProduct = products[0]
        this.getConfig()
      }
    },
    selectProduct (product) {
      this.selectedProduct = product
      // this.selectProduct.is_visible = product.is_visible
    },
    // 获取配置信息
    getConfig () {
      api.dealer.getConfig(this.$route.params.dealer_id, this.corp.id).then((res) => {
        console.log(res)
        this.model = res.data
        this.model.domain = 'http://test.admin.xlink.cn/#!/dealer/' + this.corp.id + '/' + this.$route.params.dealer_id
        if (this.model.logo_url) {
          this.images[0] = this.model.logo_url
        }
        // 处理产品配置
        res.data.product.forEach((product) => {
          this.allProducts.forEach((item) => {
            if (item.id === product.product_id) {
              item.is_visible = product.is_visible
            }
          })
        })
        // 处理模块配置
        res.data.module.forEach((model) => {
          this.tables.forEach((table) => {
            if (table.type === model.type) {
              table.is_visible = model.is_visible
            }
          })
        })
      }).catch((err) => {
        this.handleError(err)
      })
    },

    onModifiedImages (images) {
      // console.log(images)
      this.images = images
    },

    productToggle (val) {
      console.log(val)
      this.selectedProduct.is_visible = val
      // console.log(status)
    },
    setConfig () {
      if (this.model.login_context === '') {
        alert('登录页面文案不能为空！')
        return
      }
      // 处理模块配置提交数据
      let modeType = []
      this.tables.forEach((table) => {
        var obj = {
          type: table.type,
          is_visible: table.is_visible
        }
        modeType.push(obj)
      })
      // 处理产品权限配置数据
      let limitType = []
      this.allProducts.forEach((product) => {
        var pobj = {
          product_id: product.id,
          is_visible: product.is_visible
        }
        limitType.push(pobj)
      })
      // 处理logo图片数据
      this.model.logo_url = this.images[0]
      if (limitType.length === this.allProducts.length && modeType.length === this.tables.length) {
        this.model.product = limitType
        this.model.module = modeType
        console.log(this.model)
        api.dealer.setConfig(this.$route.params.dealer_id, this.model).then((res) => {
          console.log(res)
          this.init()
        }).catch((err) => {
          this.handleError(err)
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../../../assets/stylus/common'
  .products-container
    position relative
    width 100%
    height auto
    .product-list-box
      position relative
      width 200px
      height auto
      /*position absolute
      left 0
      top 0*/
      z-index 1
      .product
        width 100%
        /*height 60px*/
        background #f2f2f2
        border 1px solid #ddd
        border-right 0
        margin-bottom 3px
        box-sizing border-box
        padding 10px 20px
        position relative
        &.selected
          background #fff
          &:after
            content ""
            display block
            position absolute
            right -2px
            top 0
            width 3px
            height 100%
            background #fff
      .product-name
        display block
        height 22px
        font-size 14px
        text-overflow 100%
      .product-type
        color #BCBCBC
        font-size 13px
        text-overflow 100%
    .product-details-box
      position absolute
      top 0
      height 100%
      /*margin-left 200px*/
      border 1px solid #ddd
      /*min-height 500px*/
      padding 20px 35px 20px 235px
      width 100%
      box-sizing border-box
      .product-name
        font-size 22px
        height 40px
        line-height 40px
      .product-msg
        font-size 12px
        color #666
  .major-clients-config
    padding 10px
    box-sizing border-box
    .part
      margin-bottom 30px
    .pl20
      padding-left 20px
      box-sizing border-box
    .onoff-server-box
      width 700px
      height 100px
      position relative
      padding-left 190px
      box-sizing border-box
      .pic-box
        width 190px
        min-height 100px
        line-height 60px
        position absolute
        left 0
        /*background red*/
        font-size 100px
        text-align center
      .text-box
        line-height 28px
</style>
