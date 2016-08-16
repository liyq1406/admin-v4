<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>产品信息</h2>
    </div>
    <div class="panel no-split-line mt20">
      <div class="panel-bd">
        <div class="row">
          <div class="col-16">
            <!-- <div class="sale-details-head">智能烤箱<i class="fa fa-edit"></i></div> -->
            <div class="product-info">
              <info-card>
                <div class="product-name">{{ currentProduct.name }} <a href="#" @click.prevent="editProduct" class="fa fa-edit"></a></div>
                <div class="product-createtime">{{ currentProduct.create_time | formatDate }}</div>
              </info-card>
              <div class="actions">
                <button class="btn btn-ghost">发布产品</button>
              </div>
            </div>
            <div v-stretch="192">
              <info-list :info="productInfo"></info-list>
            </div>
          </div>
          <div class="col-8">
            <annulus :data="annulusInfo"></annulus>
            <div class="buy-access">
              <button class="btn btn-primary">购买授权</button>
            </div>
            <div class="buy-record">
              <span>购买记录</span>
            </div>
          </div>
        </div>

        <!-- <div class="mt10 mb40">
          <div class="filter-bar">
            <div class="filter-group fl">
              <h3 class="fl mr20">设备列表</h3>
              <button class="btn btn-primary">管理授权</button>
            </div>
            <div class="filter-group fl">
              <div class="filter-group-item ml20">
                <button class="btn btn-primary">管理授权</button>
              </div>
            </div>
          </div>
          <c-table :headers="headers" :tables="tables" :page="page" :loading="loadingData"></c-table>
        </div> -->
      </div>
    </div>

    <div class="panel">
      <div class="panel-hd panel-hd-full bordered">
        <h2 class="fl mr20">设备列表</h2>
        <button class="btn btn-primary">管理授权</button>
      </div>
      <div class="panel-bd">
        <c-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" @theader-active-date="sortBy" @theader-is-online="sortBy" @tbody-mac="linkToDetails" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage">
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
        <form v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editFormHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.product.fields.name") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.product.placeholders.name')" class="input-text-wrap">
                <input v-model="editModel.name" type="text" v-form-ctrl name="name" maxlength="32" required custom-validator="noSpacesPrefixAndSuffix" lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.product.fields.name')}) }}</span></div>
              <div v-if="editValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.product.fields.name')}) }}</span><span v-if="editValidation.name.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.product.fields.name'), 32]) }}</span><span v-if="editValidation.name.$error.customValidator">{{ $t('ui.validation.format', {field: $t('ui.product.fields.name')}) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.product.fields.desc") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.product.placeholders.desc')" class="input-text-wrap">
                <textarea v-model="editModel.description" type="text" v-form-ctrl name="description" maxlength="250" required lazy class="input-text"></textarea>
              </div>
              <div v-if="editValidation.$submitted && editValidation.description.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.description.$error.required">{{ $t('ui.validation.required', {field: $t('ui.product.fields.desc')}) }}</span></div>
              <div v-if="editValidation.description.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.description.$error.required">{{ $t('ui.validation.required', {field: $t('ui.product.fields.desc')}) }}</span><span v-if="editValidation.description.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.product.fields.desc'), 250]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.product.fields.link_type") }}:</label>
            <div class="controls col-18">
              <div class="select">
                <v-select :label="locales.data.DEVICE_TYPES[editModel.link_type-1]">
                  <select v-model="editModel.link_type" v-form-ctrl name="link_type">
                    <option v-for="type in deviceTypes" :value="$index+1" :selected="$index===0">{{ type }}</option>
                  </select>
                </v-select>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <div class="controls col-18 col-offset-6">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" name="is_registerable" v-model="editModel.is_registerable"/>{{ $t("ui.product.fields.is_registerable") }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row" v-show="editModel.link_type===5">
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
                  <input type="checkbox" name="ifsnapshot" v-model="editModel.ifsnapshot"/>开启快照功能
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
            <label class="del-check">
              <input type="checkbox" name="is_release" v-model="editModel.is_release"/>{{ $t("ui.product.fields.is_release") }}
            </label>
            <button @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
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
      query: '',
      sortKey: '',
      sortOrders: sortOrders,
      searching: false,
      visibility: {
        label: '全部',
        value: 'all'
      },
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
      editModel: {
        is_allow_multi_admin: false,
        ifsnapshot: false,
        name: '',
        description: '',
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
      headers: [
        {
          key: 'mac',
          title: 'MAC'
        },
        {
          key: 'id',
          title: '设备ID'
        },
        {
          key: 'is_active',
          title: '是否激活',
          tooltip: '提示'
        },
        {
          key: 'active_date',
          title: '激活时间',
          sortType: -1
        },
        {
          key: 'is_online',
          title: '在线状态',
          sortType: -1
        }
      ],
      annulusInfo: [
        {name: '授权设备', val: 10000},
        {name: '剩余份额', val: 20000}
      ]
    }
  },

  computed: {
    page () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },
    tables () {
      var result = []
      this.devices.map((item) => {
        var device = {
          id: item.id,
          mac: '<a class="hl-red">' + item.mac + '</a>',
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
      var condition = {
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

    productInfo () {
      let ret = {
        mode: {
          label: '产品型号',
          value: '-'
        },
        type: {
          label: '产品类型',
          value: '-'
        },
        link_type: {
          label: '连接类型',
          value: ''
        },
        qrcode: {
          label: '产品二维码',
          value: '-'
        },
        description: {
          label: '产品描述',
          value: ''
        },
        target: {
          label: '产品状态',
          value: '-'
        }
      }
      ret.link_type.value = this.locales.data.DEVICE_TYPES[this.currentProduct.link_type - 1]
      ret.description.value = this.currentProduct.description
      return ret
    }
  },

  route: {
    data () {
      this.getDevices()
    }
  },

  methods: {
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
     * 跳转至设备详情
     * @param  {[type]} table [description]
     * @return {[type]}       [description]
     */
    linkToDetails (table) {
      this.$route.router.go(`${this.$route.path}/${table.prototype.id}`)
    },

    // 获取设备列表
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

    // 搜索
    handleSearch () {
      if (this.query.length === 0) {
        this.getDevices()
      }
    },

    // 排序
    sortBy (key) {
      if (typeof key === 'object') {
        key = key.key
      }
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] === 'asc' ? 'desc' : 'asc'
      this.getDevices()
    },

    // 切换搜索
    toggleSearching () {
      this.searching = !this.searching
    },

    // 取消搜索
    cancelSearching () {
      this.getDevices()
    },

    // 编辑表单钩子
    editFormHook (form) {
      this.editForm = form
    },

    // 关闭编辑浮层并净化编辑表单
    resetEdit () {
      this.editing = false
      this.showEditModal = false
      this.delChecked = false
      setTimeout(() => {
        this.editModel = this.originEditModel
      }, 1000)
    },

    /**
     * 初始化产品编辑表单
     * @author shengzhi
     */
    editProduct () {
      api.snapshot.getRule(this.$route.params.id).then((res) => {
        this.showEditModal = true
        this.editModel.ifsnapshot = false
        this.editModel.name = this.currentProduct.name
        this.editModel.description = this.currentProduct.description
        this.editModel.link_type = this.currentProduct.link_type
        this.editModel.is_registerable = this.currentProduct.is_registerable
        this.editModel.is_active_register = this.currentProduct.is_active_register
        this.editModel.is_release = this.currentProduct.is_release
        this.editModel.id = this.$route.params.id
        this.editModel.is_allow_multi_admin = this.currentProduct.is_allow_multi_admin
        this.originEditModel = _.clone(this.editModel)

        // TODO: 优化逻辑
        if (res.data.list.length) {
          if (res.data.list[0].rule === 0) {
            this.editModel.ifsnapshot = false
          } else {
            this.editModel.ifsnapshot = true
          }
        } else {
          this.editModel.ifsnapshot = false
        }
      })
    },

    // 取消编辑
    onEditCancel () {
      this.resetEdit()
      // this.product = this.originEditModel
    },

    // 提交更新
    onEditSubmit () {
      if (this.delChecked && !this.editing) {
        this.editing = true
        var result = window.confirm('确认删除该产品吗?')
        if (result === true) {
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
        } else {
          this.editing = false
        }
      } else if (this.editValidation.$valid && !this.editing) {
        this.editing = true
        if (this.editModel.link_type === 5) {
          api.product.updateProduct(this.editModel).then(() => {
            api.product.getProduct(this.$route.params.id).then((res) => {
              if (res.status === 200) {
                // this.product = res.data
                this.resetEdit()
                this.updateProduct(res.data)
              }
            })
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        } else {
          var model = {
            name: this.editModel.name,
            description: this.editModel.description,
            link_type: this.editModel.link_type,
            is_registerable: this.editModel.is_registerable,
            is_release: this.editModel.is_release,
            is_allow_multi_admin: this.editModel.is_allow_multi_admin,
            id: this.editModel.id
          }
          api.product.updateProduct(model).then(() => {
            api.product.getProduct(this.$route.params.id).then((res) => {
              if (res.status === 200) {
                // this.product = res.data
                this.resetEdit()
                this.updateProduct(res.data)
              }
            })
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        }
        if (this.editModel.ifsnapshot) {
          var index = []
          for (let i = 0; i < 45; i++) {
            index.push(i)
          }
          var params = {
            rule: 3,
            interval: 30,
            storage: {
              // limit: 0,
              expire: 86400
            },
            datapoint: index
          }
          api.snapshot.getRule(this.$route.params.id).then((res) => {
            if (res.data.list.length === 0) {
              console.log(params)
              // console.log(res)
              api.snapshot.createRule(this.$route.params.id, params).then((res) => {
              })
            } else {
              var index = []
              for (let i = 0; i < 45; i++) {
                index.push(i)
              }
              var newParams = {
                _id: res.data.list[0].id,
                rule: 3,
                interval: 30,
                storage: {
                  // limit: 0,
                  expire: 86400
                },
                datapoint: index
              }
              api.snapshot.updateRule(this.$route.params.id, newParams).then((res) => {
                console.log('Update rule')
              })
            }
          })
        } else {
          api.snapshot.getRule(this.$route.params.id).then((res) => {
            if (res.data.list.length === 0) {
              console.log(11)
            } else {
              var index = []
              for (let i = 0; i < 45; i++) {
                index.push(i)
              }
              var morNewParams = {
                _id: res.data.list[0].id,
                rule: 0,
                interval: 30,
                storage: {
                  // limit: 0,
                  expire: 86400
                },
                datapoint: index
              }
              api.snapshot.updateRule(this.$route.params.id, morNewParams).then((res) => {
                console.log(111)
              })
            }
          })
        }
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
