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
    <div>
      <div class="panel-sub-hd bordered mb20">域名配置</div>

      <div class="part form">
        <div class="form-row row pl20">
          <label class="form-control col-4">域名:</label>
          <div class="controls col-16">
            <div class="input-text-wrap">
              <input type="text" placeholder="域名" class="input-text" v-model="model.domain" name="model.domain" readonly="true" id="domain">
            </div>
          </div>
          <div class="col-4">
            <div class="ml10">
              <button class="btn btn-ghost btn-lg btn-block" data-clipboard-target="#domain" id="btnCopy">复制</button>
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
                <image-uploader :images="images" @modified="onModifiedImages" img-width="200px" img-height="55px"></image-uploader>
                <div class="form-tips">图片规格：400*110</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-sub-hd bordered mb20">权限配置</div>

      <div class="panel-bd products-container mb30 clearfix">
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
            <template v-if="rows.length > 0">
              <tr v-for="(index, table) in rows" track-by="$index">
                <td class="hl-red">{{ table.title }}</td>
                <td>{{ table.description }}</td>
                <td class="tac"><switch :value.sync="table.is_visible" size="small"></switch></td>
              </tr>
            </template>
            <tr v-if="rows.length === 0 && !loadingData">
              <td :colspan="3" class="tac">
                <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <button class="btn btn-primary btn-xlg" @click.prevent.stop="setConfig">提交</button>
  </div>
</template>

<script>
import api from 'src/api'
import formatDate from 'filters/format-date'
import ClipBoard from 'clipboard'
import { CUSTOM_ORIGIN } from 'consts/config'

export default {
  name: 'config',
  vuex: {
    getters: {
      corp: ({ system }) => system.corp,
      productList: ({ products }) => products.released
    }
  },

  components: {
  },

  data () {
    return {
      rows: [{
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
      // }, {
      //   title: '智能维保',
      //   type: 'warranty',
      //   description: '管理设备维修、延保等内容（必须先在“开发平台-应用市场”中开启）',
      //   is_visible: false
      // }, {
      //   title: '用户反馈',
      //   type: 'helpdesk',
      //   description: '用户端可提交相关产品反馈至平台，可使用反馈分析等模块（必须先在“开发平台-应用市场”中开启）',
      //   is_visible: false
      }],
      model: {
        is_enable: false,
        domain: '',
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
    let clipboard = new ClipBoard('#btnCopy')

    // 监听拷贝成功事件
    clipboard.on('success', this.onCopySuccess)

    this.init()
    // this.getConfig()
  },

  watch: {
    productList () {
      this.init()
    },

    corp () {
      this.init()
    }
  },
  methods: {
    /**
     * 初始化
     */
    init () {
      if (this.productList.length && this.corp.hasOwnProperty('id')) {
        let products = _.cloneDeep(this.productList).map((product) => {
          product.is_visible = false
          return product
        })
        this.allProducts = products
        this.selectedProduct = products[0]
        this.getConfig()
      }
    },

    /**
     * 拷贝至剪贴板
     * @params {HTML DOM Event} e 事件
     */
    onCopySuccess (e) {
      // console.info('Action:', e.action)
      // console.info('Text:', e.text)
      // console.info('Trigger:', e.trigger)

      e.clearSelection()
    },

    selectProduct (product) {
      this.selectedProduct = product
      // this.selectProduct.is_visible = product.is_visible
    },
    // 获取配置信息
    getConfig () {
      // console.log(this.corp.id)
      api.heavyBuyer.getConfig(this.$route.params.id, this.corp.id).then((res) => {
        if (typeof res.data.is_enable === 'boolean') {
          this.model.is_enable = res.data.is_enable
        }
        this.model.login_context = res.data.login_context
        let origin = CUSTOM_ORIGIN || window.location.origin
        this.model.domain = `${origin}/#!/heavy-buyer-login/${this.corp.id}/${this.$route.params.id}`
        if (res.data.logo_url) {
          this.images.$set(0, res.data.logo_url)
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
          this.rows.forEach((table) => {
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
      console.log(this.model)
      let moduleAble = false
      let productAble = false
      if (this.model.login_context === '') {
        this.showNotice({
          type: 'error',
          content: '登录页面文案不能为空！'
        })
        return
      }
      // 是否将总开关置为关闭
      let turnOff = true
      // 处理模块配置提交数据
      let modeType = []
      this.rows.forEach((table) => {
        var obj = {
          type: table.type,
          is_visible: table.is_visible
        }
        // 只要有一个开关开启
        if (table.is_visible) {
          moduleAble = true
        }
        modeType.push(obj)
      })
      if (modeType.length === this.rows.length) {
        if (!moduleAble) {
          // 每个模块都没开启
          this.showNotice({
            type: 'error',
            content: '模块配置必须最少开启一项！'
          })
          return
        }
      }
      // 处理产品权限配置数据
      let limitType = []
      this.allProducts.forEach((product) => {
        var pobj = {
          product_id: product.id,
          is_visible: product.is_visible
        }
        // 只要有一个开关开启
        if (product.is_visible) {
          productAble = true
        }
        limitType.push(pobj)
        if (product.is_visible) {
          turnOff = false
        }
      })

      if (limitType.length === this.allProducts.length) {
        if (!productAble) {
          // 每个模块都没开启
          this.showNotice({
            type: 'error',
            content: '产品配置必须最少开启一项！'
          })
          return
        }
      }
      // 处理logo图片数据
      this.model.logo_url = this.images[0]
      if (limitType.length === this.allProducts.length && modeType.length === this.rows.length) {
        if (turnOff) {
          this.model.is_enable = false
        }
        this.model.product = limitType
        this.model.module = modeType
        console.log(this.model)
        api.heavyBuyer.setConfig(this.$route.params.id, this.model).then((res) => {
          // console.log(res)
          this.showNotice({
            type: 'success',
            content: '配置成功！'
          })
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
      min-height 250px
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
