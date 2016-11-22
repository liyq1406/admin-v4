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
          <switch></switch>
        </div>
      </div>
    </div>

    <div class="panel-sub-hd bordered mb20">域名配置</div>

    <div class="part form">
      <div class="form-row row pl20">
        <label class="form-control col-4">域名:</label>
        <div class="controls col-20">
          <div class="input-text-wrap" v-placeholder="'域名'">
            <input type="text" class="input-text" v-model="domainName">
          </div>
        </div>
      </div>
    </div>

    <div class="panel-sub-hd bordered mb20">界面UI配置</div>

    <div class="part form">
      <div class="form-row row pl20">
        <label class="form-control col-4">登陆页面文案:</label>
        <div class="controls col-20">
          <div class="input-text-wrap" v-placeholder="'登陆页面文案'">
            <input type="text" class="input-text" v-model="">
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

    <div class="panel-bd products-container">
      <!-- 应用列表  -->
      <div v-if="!productList.length" class="non">暂无产品</div>
      <div  v-if="productList.length" class="product-list-box">
        <div class="product" v-for="product in productList" :class="{'selected': product.id === selectedProduct.id}" @click="selectedProduct=product">
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
      <div v-if="productList.length" class="panel product-details-box">
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
                      <switch></switch>
                    </div>
                  </div>
                </div>
              </info-card>
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
              <td class="tac"><switch :value.sync="table.status" size="small"></switch></td>
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
</template>

<script>
// import api from 'src/api'
import formatDate from 'filters/format-date'

export default {
  name: 'config',
  vuex: {
    getters: {
      productList: ({ products }) => products.all
    }
  },

  components: {
  },

  data () {
    return {
      tables: [{
        title: '产品概览',
        description: '查看产品概览，包括激活趋势、增长总数、产品热力分部等',
        status: true
      }, {
        title: '设备管理',
        description: '查看设备列表、远程调试设备、查看历史记录、查看经销商、维保记录等',
        status: true
      }, {
        title: '告警信息',
        description: '管理告警详情与告警分析',
        status: true
      }, {
        title: '设备地图',
        description: '查看设备地理位置详细分布',
        status: true
      }, {
        title: '产品分析',
        description: '通过三个维度分析产品，包括单次时长、使用次数、时段分部等',
        status: true
      }, {
        title: '智能维保',
        description: '管理设备维修、延保等内容',
        status: true
      }, {
        title: '用户反馈',
        description: '用户端可提交相关产品反馈至平台，可使用反馈分析等模块',
        status: true
      }],
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
        this.selectedProduct = this.productList[0]
      }
    },
    onModifiedImages (images) {
      console.log(images)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../../../assets/stylus/common'
  .products-container
    position relative
    width 100%
    height 100%
    .product-list-box
      width 200px
      height auto
      position absolute
      left 0
      top 0
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
      height 100%
      margin-left 200px
      border 1px solid #ddd
      /*min-height 500px*/
      padding 20px 35px
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
