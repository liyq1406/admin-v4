<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>产品信息</h2>
    </div>
    <div class="panel no-split-line mt20">
      <div class="panel-bd">
        <div class="row">
          <div class="col-16">
            <div class="product-info">
              <info-card class="mb15">
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
                <a class="hl-red" slot="qrcode" @click.prevent="displayQrcode">点击查看</a>
              </info-list>
            </div>
          </div>
          <div class="col-8">
            <annulus :data="annulusInfo"></annulus>
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
        <!-- <button class="btn btn-primary">管理授权</button> -->
        <a v-link="{path: 'authorize'}" class="btn btn-primary">管理授权</a>
      </div>
      <div class="panel-bd">
        <c-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" @theader-active-date="sortBy" @theader-is-online="sortBy" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage">
          <div class="filter-bar" slot="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.overview.addForm.search_condi')" @cancel="getDevices" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getDevices">
                  <v-select width="90px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </v-select>
                  <button slot="search-button" @click="getDevices" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
            <div class="filter-group">
              <v-select width="90px" size="small" :label="visibility.label">
                <span slot="label">{{ $t('common.display') }}：</span>
                <select v-model="visibility" @change="getDevices">
                  <option v-for="option in locales.data.DEVICE_VISIBILITY_OPTIONS" :value="option">{{ option.label }}</option>
                </select>
              </v-select>
            </div>
          </div>
        </c-table>
      </div>
    </div>

    <!-- 编辑产品浮层-->
    <modal :show.sync="showEditModal">
      <h3 slot="header">{{ $t("ui.overview.editForm.header") }}</h3>
      <div slot="body" class="form">
        <!-- <form v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editFormHook"> -->
        <validator name="validation">
          <form novalidate @submit.prevent="onEditSubmit">
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.product.fields.name") }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.product.placeholders.name')" class="input-text-wrap">
                  <input v-model="editModel.name" type="text" name="editModel.name" v-validate:name="{required: true, maxlength: 32}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.name.touched && $validation.name.required">{{ $t('ui.validation.required', {field: $t('ui.product.fields.name')}) }}</span>
                  <span v-if="$validation.name.modified && $validation.name.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.product.fields.name'), 32]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.product.fields.mode") }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.product.placeholders.mode')" class="input-text-wrap">
                  <input v-model="editModel.mode" type="text" name="editModel.mode" v-validate:mode="{maxlength: 64}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.mode.modified && $validation.mode.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.product.fields.mode'), 64]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.product.fields.type") }}:</label>
              <div class="controls col-18">
                <div class="select">
                  <v-select :label="productType.label">
                    <select v-model="productType" name="productType">
                      <option v-for="opt in productTypeOptions" :value="opt">{{ opt.label }}</option>
                    </select>
                  </v-select>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.product.fields.link_type") }}:</label>
              <div class="controls col-18">
                <div class="select">
                  <v-select :label="locales.data.DEVICE_TYPES[editModel.link_type-1]">
                    <select v-model="editModel.link_type" name="link_type">
                      <option v-for="type in locales.data.DEVICE_TYPES" :value="$index+1" :selected="$index===0">{{ type }}</option>
                    </select>
                  </v-select>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.product.fields.desc") }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.product.placeholders.desc')" class="input-text-wrap">
                  <textarea v-model="editModel.description" type="text" name="editModel.description" v-validate:description="{required: true, maxlength: 250}" lazy class="input-text"></textarea>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.description.touched && $validation.description.required">{{ $t('ui.validation.required', {field: $t('ui.product.fields.desc')}) }}</span>
                  <span v-if="$validation.description.modified && $validation.description.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.product.fields.desc'), 250]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row mb0">
              <div class="controls col-18 col-offset-6">
                <div class="checkbox-group">
                  <label class="checkbox">
                    <input type="checkbox" name="is_registerable" v-model="editModel.is_registerable"/>{{ $t("ui.product.fields.is_registerable") }}
                  </label>
                </div>
              </div>
            </div>
            <div class="form-row row mb0" v-show="editModel.link_type===5">
              <div class="controls col-18 col-offset-6">
                <div class="checkbox-group">
                  <label class="checkbox">
                    <input type="checkbox" name="is_active_register" v-model="editModel.is_active_register"/>允许动态注册设备
                  </label>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <div class="controls col-18 col-offset-6">
                <div class="checkbox-group">
                  <label class="checkbox">
                    <input type="checkbox" name="is_allow_multi_admin" v-model="editModel.is_allow_multi_admin"/>允许设备多个管理员
                  </label>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <label class="del-check">
                <input type="checkbox" name="del" v-model="delChecked"/>{{ $t("ui.overview.editForm.del") }}
              </label>
              <button @click.prevent.stop="resetEdit" class="btn btn-default">{{ $t("common.cancel") }}</button>
              <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </validation>
      </div>
    </modal>
  </div>
</template>

<script>
import api from 'api'
import { globalMixins } from 'src/mixins'
import { setCurrProductMixin } from '../mixins'
import { removeProduct, updateProduct } from 'store/actions/products'
import * as config from 'consts/config'
import InfoList from 'components/InfoList'
import InfoCard from 'components/InfoCard'
import Annulus from 'components/g2-charts/Annulus'
import Table from 'components/Table'
import SearchBox from 'components/SearchBox'
import Modal from 'components/Modal'
import Select from 'components/Select'
import store from 'store'
import _ from 'lodash'
import { formatDate } from 'src/filters'

export default {
  name: 'ProductInfo',

  mixins: [globalMixins, setCurrProductMixin],

  store,

  vuex: {
    actions: {
      removeProduct,
      updateProduct
    }
  },

  components: {
    'c-table': Table,
    'v-select': Select,
    InfoCard,
    InfoList,
    Annulus,
    Modal,
    SearchBox
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
      qrcodeModal: {
        show: false
      },
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
        { label: '设备ID', value: 'id' },
        { label: '设备名称', value: 'name' }
      ],
      queryType: {
        label: 'MAC',
        value: 'mac'
      },
      showEditModal: false,
      delChecked: false,
      productType: {},
      editModel: {
        is_allow_multi_admin: false,
        name: '',
        description: '',
        mode: '',
        type: 0,
        link_type: '',
        is_registerable: false,
        is_active_register: false,
        is_release: false,
        id: ''
      },
      originEditModel: {},
      editValidation: {},
      tables: [
        {
          time: '<a class="hl-red">2016-03-18 08:10:19</a>',
          count: 2000,
          user: '12@qq.com'
        }, {
          time: '<a class="hl-red">2016-04-18 08:10:19</a>',
          count: 4000,
          user: '113@163.com'
        }, {
          time: '<a class="hl-red">2016-05-18 08:10:19</a>',
          count: 6000,
          user: 'djfds@gmail.com'
        }
      ],
      // headers: [
      //   {
      //     key: 'time',
      //     title: '操作时间',
      //     class: 'tac'
      //   },
      //   {
      //     key: 'count',
      //     title: '导入设备数',
      //     class: 'tac'
      //   },
      //   {
      //     key: 'user',
      //     title: '操作人',
      //     class: 'tac'
      //   }
      // ],
      headers: [{
        key: 'mac',
        title: 'MAC'
      }, {
        key: 'id',
        title: '设备ID'
      }, {
        key: 'is_active',
        title: '是否激活',
        tooltip: '提示'
      }, {
        key: 'active_date',
        title: '激活时间',
        sortType: -1
      }, {
        key: 'is_online',
        title: '在线状态',
        sortType: -1
      }]
    }
  },

  computed: {
    // 产品配额
    annulusInfo () {
      // 剩余配额
      let remain = this.currentProduct.quota - this.used

      return [{
        name: '授权设备',
        val: this.used
      }, {
        name: '剩余份额',
        val: remain || 0
      }]
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
        filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'last_login'],
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
          value: this.currentProduct.mode || ''
        },
        type: {
          label: '产品类型',
          value: this.getTypeLabelByValue(this.currentProduct.type)
        },
        link_type: {
          label: '连接类型',
          value: this.locales.data.DEVICE_TYPES[this.currentProduct.link_type - 1]
        },
        qrcode: {
          label: '产品二维码',
          slot: true,
          value: '-'
        },
        description: {
          label: '产品描述',
          value: this.currentProduct.description
        }
      }
    },

    // 产品类型选项
    productTypeOptions () {
      let types = this.locales.data.PRODUCT_TYPES.slice(1)
      this.productType = types[0]
      return types
    }
  },

  route: {
    data () {
      // 初次获取设备列表，并将获取的数量作为已用配额
      let condition = {
        filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'last_login'],
        limit: this.countPerPage,
        offset: 0,
        order: this.sortOrders
      }
      api.device.getList(this.$route.params.id, condition).then((res) => {
        this.devices = res.data.list
        this.used = this.total = res.data.count
      }).catch((res) => {
        this.handleError(res)
      })
    }
  },

  methods: {
    /**
     * 处理购买按钮点击
     * @author shengzhi
     */
    onBuyButtonClick () {
    },

    /**
     * 查看二维码
     * @author shengzhi
     */
    displayQrcode () {
      this.qrcodeModal.show = true
    },

    /**
     * 通过值获取产品类型
     * @author shengzhi
     * @param {Number} val 目标值
     */
    getTypeLabelByValue (val) {
      let result = ''
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
     * 获取所有设备
     * @author shengzhi
     */
    getAllDevices () {
      api.device.getList(this.$route.params.id, this.queryCondition).then((res) => {
        this.devices = res.data.list
        this.total = res.data.count
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 获取设备列表
     * @author shengzhi
     */
    getDevices () {
      this.loadingData = true
      api.device.getList(this.$route.params.id, this.queryCondition).then((res) => {
        this.devices = res.data.list
        this.total = res.data.count
        this.loadingData = false
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
        this.getDevices()
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
     * 关闭编辑浮层并净化编辑表单
     * @author shengzhi
     */
    resetEdit () {
      this.editing = false
      this.showEditModal = false
      this.delChecked = false
    },

    /**
     * 发布产品
     * @author shengzhi
     */
    releaseProduct () {
      if (window.confirm('已发布的产品将不允许被删除，确认发布？')) {
        this.editModel = _.cloneDeep(this.currentProduct)
        this.editModel.is_release = true
        api.product.updateProduct(this.editModel).then((res) => {
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
     * 初始化产品编辑表单
     * @author shengzhi
     */
    editProduct () {
      this.showEditModal = true
      this.editModel = _.clone(this.currentProduct)
      // 保存当前产品信息以便恢复编辑前状态
      this.originEditModel = _.clone(this.editModel)
    },

    /**
     * 提交更新
     * @author shengzhi
     */
    onEditSubmit () {
      if (this.delChecked && !this.editing) { // 删除
        this.editing = true
        if (window.confirm('确认删除该产品吗?')) {
          api.product.deleteProduct(this.$route.params.id).then((res) => {
            if (res.status === 200) {
              this.resetEdit()
              this.removeProduct(this.currentProduct)
              this.$route.router.go('/dev')
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        }
      } else if (this.$validation.valid && !this.editing) { // 编辑
        this.editing = true
        this.editModel.type = this.productType.value
        api.product.updateProduct(this.editModel).then(() => {
          api.product.getProduct(this.$route.params.id).then((res) => {
            if (res.status === 200) {
              this.resetEdit()
              this.updateProduct(res.data)
              this.editing = false
            }
          })
        }).catch((res) => {
          this.handleError(res)
          this.editing = false
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
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
</style>
