<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>产品信息</h2>
    </div>
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="row">
          <div class="col-16">
            <div class="product-info">
              <info-card class="mb15" :pic="(currentProduct.pics && currentProduct.pics.length) ? currentProduct.pics[0] : ''">
                <div class="product-name">{{ currentProduct.name }} <a href="#" @click.prevent="editProduct" class="fa fa-edit"></a></div>
                <div class="product-createtime">{{ currentProduct.create_time | formatDate }}</div>
              </info-card>
              <div class="actions" v-show="currentProduct.name">
                <span class="released" v-if="currentProduct.is_release"><i class="fa fa-check"></i>已发布</span>
                <button class="btn btn-ghost" @click="releaseProduct" v-else>发布产品</button>
              </div>
            </div>
            <div v-stretch="182">
              <info-list :info="productInfo">
                <a class="hl-red" slot="key" @click.prevent="displayKey">点击查看</a>
                <a class="hl-red" slot="qrcode" @click.prevent="displayQrcode">点击查看</a>
              </info-list>
            </div>
          </div>
          <div class="col-8">
            <div class="annuls-chart">
              <chart :options="quotaOptions" :loading="firstRequest"></chart>
              <div class="quota" v-show="!rendering">
                <div class="quota-tit">产品配额</div>
                <div class="quota-sum">{{ currentProduct.quota }}</div>
              </div>
            </div>
            <div class="buy-access hidden">
              <button class="btn btn-primary" @click="onBuyButtonClick">购买授权</button>
            </div>
            <div class="buy-record hidden">
              <span>购买记录</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="panel mt20">
      <div class="panel-hd panel-hd-full bordered">
        <h2 class="fl mr20">设备列表</h2>
        <a v-link="{path: 'authorize'}" class="btn btn-primary">管理授权</a>
        <!-- <button class="btn btn-ghost ml10" @click="showExportQRCode = true">批量导出二维码</button> -->
      </div>
      <div class="panel-bd mt15">
        <x-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" @theader-active-date="sortBy" @theader-is-online="sortBy" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage" @tbody-sn="onShowDeviceEditModal">
          <div class="filter-bar" slot="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" :placeholder="$t('common.placeholder.search')" @cancel="getDevices(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" :max="(queryType.value === 'id'?2100000000: false)" @search="handleSearch" @press-enter="getDevices(true)">
                  <x-select width="90px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </x-select>
                  <button slot="search-button" @click="getDevices(true)" class="btn"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
            <div class="filter-group">
              <x-select width="90px" size="small" :label="visibility.label">
                <span slot="label">{{ $t('common.display') }}：</span>
                <select v-model="visibility" @change="getDevices(true)">
                  <option v-for="option in locales.data.DEVICE_VISIBILITY_OPTIONS" :value="option">{{ option.label }}</option>
                </select>
              </x-select>
            </div>
          </div>
          <button v-link="{path: 'online-offline-records', append: true}" class="btn btn-ghost mt10" slot="left-foot"><i class="fa fa-list"></i>查看上下线历史记录</button>
        </x-table>
      </div>
    </div>

    <!-- 查看产品密钥浮层 -->
    <modal :show.sync="showKeyModal">
      <h3 slot="header">{{ $t("ui.overview.key") }}</h3>
      <div slot="body" class="product-key tac">{{ productKey }}</div>
    </modal>

    <!-- 查看二维码浮层 -->
    <modal :show.sync="showQrcodeModal">
      <h3 slot="header">二维码</h3>
      <div slot="body" class="qrcode">{{ currentProduct.qrcode || 'XQR:T:P;V:1;PID:'+$route.params.id+';;' }}</div>
    </modal>

    <!-- 编辑设备浮层 -->
    <modal :show.sync="showDeviceEditModal">
      <h3 slot="header">编辑设备</h3>
      <div slot="body" class="form">
        <validator name="validation">
          <form autocomplete="off" novalidate @submit.prevent="onDeviceEditModalSubmit">
            <div class="form-row row">
              <label class="form-control col-4">SN:</label>
              <div class="controls col-20">
                <div v-placeholder="$t('ui.product.placeholders.mode')" class="input-text-wrap">
                  <input v-model="deviceEditModal.sn" type="text" name="deviceEditModal.sn" v-validate:sn="{format: 'sn', maxlength: 32}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.sn.modified && $validation.sn.format">序列号只能包含数字、英文字母和中划线，且不以中划线开头</span>
                  <span v-if="$validation.sn.touched && $validation.sn.modified && $validation.sn.maxlength">{{ $t('common.validation.maxlength', ['序列号', 32]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
              <button @click.prevent.stop="showDeviceEditModal = false" class="btn btn-default">{{ $t("common.cancel") }}</button>
            </div>
          </form>
        </validator>
      </div>
    </modal>
    <!-- <batch-export-qr :show.sync="showExportQRCode"></batch-export-qr> -->
  </div>
</template>

<script>
import api from 'api'
import { globalMixins } from 'src/mixins'
import { setCurrProductMixin } from '../mixins'
import { removeProduct, updateProduct } from 'store/actions/products'
import * as config from 'consts/config'
import Chart from 'components/Chart/index'
import formatDate from 'filters/format-date'
// import BatchExportQr from './batch-export-qr'

export default {
  name: 'ProductInfo',

  mixins: [globalMixins, setCurrProductMixin],

  vuex: {
    actions: {
      removeProduct,
      updateProduct
    }
  },

  components: {
    Chart
  },

  data () {
    var sortOrders = {}
    var descProperties = ['active_date']
    var ascProperties = ['mac']

    descProperties.forEach((key) => {
      sortOrders[key] = 'desc'
    })

    ascProperties.forEach((key) => {
      sortOrders[key] = 'asc'
    })

    return {
      // showExportQRCode: false,
      firstRequest: true,
      showQrcodeModal: false,
      query: '',
      sortKey: '',
      sortOrders: sortOrders,
      searching: false,
      visibility: {
        label: '全部',
        value: 'all'
      },
      used: 0,
      devices: [],
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      page: {
        total: 20, // 数据总数
        currentPage: 1, // 当前页
        countPerPage: 10 // 每页数量
      },
      loadingData: false,
      queryTypeOptions: [
        { label: 'MAC', value: 'mac' },
        { label: 'SN', value: 'sn' },
        { label: '设备ID', value: 'id' },
        { label: '设备名称', value: 'name' }
      ],
      queryType: {
        label: 'MAC',
        value: 'mac'
      },
      showKeyModal: false,
      productKey: '',
      delChecked: false,
      showDeviceEditModal: false,
      deviceEditModal: {
        sn: ''
      },
      headers: [{
        key: 'mac',
        title: 'MAC'
      }, {
        key: 'id',
        title: '设备ID',
        class: 'wp25'
      }, {
        key: 'is_active',
        title: '是否激活',
        tooltip: '设备已联网激活',
        class: 'wp10'
      }, {
        key: 'active_date',
        title: '激活时间',
        sortType: -1,
        class: 'wp20'
      }, {
        key: 'sn',
        title: 'SN'
      // }, {
      //   key: 'firmware',
      //   title: '固件版本号',
      //   class: 'tac'
      }, {
        key: 'is_online',
        title: '在线状态',
        sortType: -1,
        class: 'wp10'
      }]
    }
  },

  computed: {
    // 产品配额
    annulusInfo () {
      let used = (this.used >= this.currentProduct.quota) ? this.currentProduct.quota : this.used
      // 剩余配额
      let remain = this.currentProduct.quota ? this.currentProduct.quota - used : 0

      return [{
        name: '授权设备',
        value: used
      }, {
        name: '剩余配额',
        value: remain
      }]
    },

    // 配额图表选项
    quotaOptions () {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        series: [{
          name: '数量',
          type: 'pie',
          avoidLabelOverlap: false,
          labelLine: {
            normal: {
              show: false
            }
          },
          radius: ['50%', '70%'],
          // center: ['50%', '60%'],
          label: {
            normal: {
              show: false
            }
          },
          data: this.annulusInfo,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
    },

    // 分页信息
    page () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },

    // 设备列表
    tables () {
      var result = []
      this.devices.map((item) => {
        var device = {
          id: item.id,
          mac: item.mac,
          is_active: item.is_active ? '是' : '否',
          active_date: formatDate(item.active_date),
          sn: '<a class="hl-red">' + (item.sn || ' - ') + '</a>',
          firmware: item.firmware,
          is_online: item.is_online ? '<span class="hl-green">在线</span>' : '<span class="hl-gray">下线</span>',
          prototype: item
        }
        result.push(device)
      })
      return result
    },

    // 筛选条件
    queryCondition () {
      let condition = {
        filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'sn', 'firmware', 'last_login'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: this.sortOrders,
        query: {}
      }

      if (this.query.length > 0) {
        this.currentPage = 1
        condition.query[this.queryType.value] = this.queryType.value === 'id' ? { $in: [Number(this.query)] } : { $like: this.query }
      }

      switch (this.visibility.value) {
        case 'online':
          condition.query['is_online'] = { $in: [true] }
          break
        case 'offline':
          condition.query['is_online'] = { $in: [false] }
          break
        case 'active':
          condition.query['is_active'] = { $in: [true] }
          break
        case 'inactive':
          condition.query['is_active'] = { $in: [false] }
          break
        default:
      }

      return condition
    },

    // 产品信息
    productInfo () {
      return {
        mode: {
          label: '产品型号',
          value: this.currentProduct.mode || '-'
        },
        type: {
          label: '产品类型',
          value: this.getTypeLabelByValue(this.currentProduct.type)
        },
        link_type: {
          label: '连接类型',
          value: this.locales.data.DEVICE_TYPES[this.currentProduct.link_type - 1]
        },
        id: {
          label: '产品ID',
          value: this.currentProduct.id
        },
        description: {
          label: '产品描述',
          value: this.currentProduct.description
        },
        key: {
          label: '产品密钥',
          slot: true
        },
        qrcode: {
          label: '产品二维码',
          slot: true
        }
      }
    }
  },

  route: {
    data () {
      // 切换产品不切换路由的时候重置上次的编辑状态
      this.delChecked = false
      this.query = ''
      this.currentPage = 1
      // 初次获取设备列表，并将获取的数量作为已用配额
      this.firstRequest = true
      this.getDevices()
      // let condition = {
      //   filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'sn', 'last_login'],
      //   limit: this.countPerPage,
      //   offset: 0,
      //   order: this.sortOrders
      // }
      // api.device.getList(this.$route.params.id, condition).then((res) => {
      //   console.log(res.data)
      //   this.devices = res.data.list
      //   this.used = this.total = res.data.count
      // }).catch((res) => {
      //   this.handleError(res)
      // })
    }
  },

  methods: {
    setSn () {
      let productId = this.$route.params.id
      let deviceId = this.deviceEditModal.deviceId
      let params = {
        sn: this.deviceEditModal.sn
      }
      api.product.updateDeviceMsg(productId, deviceId, params).then((res) => {
        this.getDevices()
        this.showDeviceEditModal = false
      }).catch((res) => {
        this.handleError(res)
      })
    },
    /**
     * sn编辑浮层提交表单
     * @return {[type]} [description]
     */
    onDeviceEditModalSubmit () {
      this.setSn()
      // if (this.deviceEditModal.sn.length) {
      //   this.setSn()
      // } else {
      //   this.showNotice({
      //     type: 'error',
      //     content: '请输入设备sn'
      //   })
      // }
    },
    /**
     * 显示sn编辑浮层
     * @param  {[type]} device [description]
     * @return {[type]}        [description]
     */
    onShowDeviceEditModal (device) {
      this.deviceEditModal.sn = device.prototype.sn
      this.deviceEditModal.deviceId = device.id
      this.showDeviceEditModal = true
    },
    /**
     * 处理购买按钮点击
     * @author shengzhi
     */
    onBuyButtonClick () {
    },

    // 查看产品密钥
    displayKey () {
      api.product.getProductKey(this.$route.params.id).then((res) => {
        if (res.status === 200) {
          this.productKey = res.data.key
          this.showKeyModal = true
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 查看二维码
     * @author shengzhi
     */
    displayQrcode () {
      this.showQrcodeModal = true
    },

    /**
     * 通过值获取产品类型
     * @author shengzhi
     * @param {Number} val 目标值
     */
    getTypeLabelByValue (val) {
      let result = '-'
      let type = _.find(this.locales.data.PRODUCT_TYPES, (item) => {
        return item.value === val
      })
      if (type) {
        result = type.label
      }
      return result
    },

    /**
     * 当前页码改变
     * @author shengzhi
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      this.getDevices()
    },

    /**
     * 每页显示的数量改变
     * @author shengzhi
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.getDevices()
    },

    /**
     * 获取设备列表
     * @author shengzhi
     */
    getDevices (reset) {
      if (this.queryType.value === 'id') {
        if (this.query - 0 > 2100000000) {
          this.showNotice({
            type: 'error',
            content: '设备ID不可超过2100000000'
          })
          return
        }
      }
      if (reset === true) {
        this.currentPage = 1
      }
      this.loadingData = true
      api.device.getList(this.$route.params.id, this.queryCondition).then((res) => {
        this.devices = res.data.list
        this.total = res.data.count
        // 初次请求，设备数量就是已使用配额
        if (this.firstRequest) {
          this.used = res.data.count
        }
        this.loadingData = false
        this.firstRequest = false
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    /**
     * 搜索
     * @author shengzhi
     */
    handleSearch () {
      if (this.query.length === 0) {
        this.getDevices(true)
      }
    },

    /**
     * 排序
     * @author shengzhi
     */
    sortBy (key) {
      if (typeof key === 'object') {
        key = key.key
      }
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] === 'asc' ? 'desc' : 'asc'
      this.getDevices()
    },

    /**
     * 切换搜索
     * @author shengzhi
     */
    toggleSearching () {
      this.searching = !this.searching
    },

    /**
     * 取消搜索
     * @author shengzhi
     */
    cancelSearching () {
      this.getDevices()
    },

    /**
     * 发布产品
     * @author shengzhi
     */
    releaseProduct () {
      if (window.confirm('已发布的产品将不允许被删除，确认发布？')) {
        let editModel = _.cloneDeep(this.currentProduct)
        editModel.is_release = true
        api.product.updateProduct(editModel).then((res) => {
          api.product.getProduct(this.$route.params.id).then((res) => {
            if (res.status === 200) {
              this.updateProduct(res.data)
              this.showNotice({
                type: 'success',
                content: '产品发布成功'
              })
            }
          })
        }).catch((res) => {
          this.handleError(res)
          this.editing = false
        })
      }
    },

    /**
     * 编辑产品
     * @author shengzhi
     */
    editProduct () {
      this.$route.router.go({path: 'edit', append: true})
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'

.annuls-chart
  position relative

.quota
  position absolute
  width 100px
  top 85px
  left 50%
  margin-left -50px
  text-align center
  color #999

.quota-tit
  font-size 10px
  margin 5px 0

.quota-sum
  font-size 20px
  margin 5px 0
  color black

.product-info
  position relative

  .actions
    absolute right top 10px

    .btn
      vertical-align middle

    .released
      display inline-block
      border 1px solid #BBB
      height 26px
      line-height 26px
      padding 0 15px
      color green
      vertical-align middle
      font-size 12px

.product-name
  margin 0px 10px 5px 0px
  font-size 18px
  i
    margin-left 5px

.buy-access
  text-align center
  margin-top -10px
  button
    width 140px
    border-radius 3px
.buy-record
  text-align center
  margin-top 3px
  color #999999

.product-key
  font-size 20px

.qrcode
  font-size 16px
  word-wrap break-word
</style>
