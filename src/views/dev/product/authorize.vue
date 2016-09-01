<template>
  <div class="main">
    <div class="main-title">
      <h2>授权记录</h2>
    </div>
    <div class="row statistic-group bt">
      <div class="col-8">
        <statistic :total="currentProduct.quota" title="授权额度" align="left">
        </statistic>
      </div>
      <div class="col-8">
        <statistic :total="used" title="已使用" :has-target="true" align="left">
        </statistic>
      </div>
      <div class="col-8">
        <statistic :total="remain" title="剩余额度" :has-action="true" align="left" :showchange="true" :animated="false">
          <div slot="action" class="hidden">
            <button class="btn btn-ghost btn-sm">购买配额</button>
          </div>
        </statistic>
      </div>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fl">
              <div class="filter-group-item">
                <span slot="label">明细：</span>
                <button @click="openModel" class="btn btn-ghost btn-sm">手动添加</button>
                <button class="btn btn-ghost btn-sm" @click="onShowAddModal2">
                <i class="fa fa-reply-all"></i>
                批量导入</button>
                <!-- <label :class="{'disabled':importing}" class="btn btn-ghost btn-upload">
                  <input type="file" v-el:mac-file="v-el:mac-file" name="macFile" @change.prevent="batchImport"/><i class="fa fa-reply-all"></i>批量导入
                </label> -->
              </div>
            </div>
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="query" :placeholder="$t('ui.overview.addForm.search_condi')" :active="searching" @cancel="getRecords" @search-activate="searching=!searching"  @press-enter="getRecords">
                  <!-- <x-select width="90px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </x-select> -->
                  <button slot="search-button" @click="getRecords" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
          </div>
          <x-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" @tbody-edit="getInfo"  @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage"></x-table>
        </div>
      </div>
    </div>
    <!-- 手动添加浮层 -->
    <!-- <modal :show.sync="showAddModal" @close="onAddCancel" width="524px">
      <h3 slot="header">手动添加</h3>
      <div slot="body" class="form">
        <validator name="majorClientValidation">
          <form @submit.prevent="">
            <div class="form-row row">
              <label class="form-control col-6">产品:</label>
              <div class="controls filter-group-item col-18">
                <x-select :label="addModal.product.label">
                  <select v-model="addModal.product">
                    <option v-for="product in products" :value="industry">{{industry}}</option>
                  </select>
                </x-select>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">MAC:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入MAC地址'" class="input-text-wrap">
                  <input v-model="addModal.mac" type="text" name="email" v-validate:email="{required: true}" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
              <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </validator>
      </div>
    </modal> -->
    <!-- 手动添加浮层 -->
    <modal :show.sync="showAddModal">
      <h3 slot="header">{{ $t("ui.overview.add_device") }}</h3>
      <div slot="body" class="form">
        <validator name="addValidation">
          <form novalidate @submit.prevent="onAddSubmit">
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.overview.addForm.mac") }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.overview.addForm.mac_placeholder')" class="input-text-wrap required-sign">
                  <input v-model="addModel.mac" type="text" name="mac" v-validate:mac="{required: true}" class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$addValidation.mac.touched && $addValidation.mac.required">
                    MAC为必填项
                  </span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">序列号:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入序列号'" class="input-text-wrap">
                  <input v-model="addModel.sn" type="text" name="sn" lazy class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">名字:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入名字'" class="input-text-wrap">
                  <input v-model="addModel.name" type="text" name="name"  lazy class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
              <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </validator>
      </div>
    </modal>
    <!-- 批量导入浮层 -->
    <modal :show.sync="showAddModal2" @close="onAddCancel" width="400px">
      <h3 slot="header">批量导入</h3>
      <div slot="body" class="form">
        <validator name="majorClientValidation">
          <form @submit.prevent="">
            <div class="form-row row">
              <!-- <label class="form-control col-6">导入:</label> -->
              <label :class="{'disabled':importing}" class="btn btn-ghost btn-upload">
                <input type="file" v-el:mac-file="v-el:mac-file" name="macFile" @change.prevent="batchImport"/><i class="fa fa-reply-all"></i>批量导入
              </label>
              <p><i class="fa fa-warning" style="color:red"></i><span style="color:#666">仅限txt、cav格式文件</span></p>
            </div>
            <div class="form-actions">
              <button @click.prevent.stop="onAddCancel2" class="btn btn-default">{{ $t("common.cancel") }}</button>
              <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </validator>
      </div>
    </modal>
    <modal :show.sync="showAddModal3" @close="onAddCancel3">
      <h3 slot="header">详细信息</h3>
      <div slot="body" class="form">
        <div class="form-row row">
          <label class="form-control col-6">记录ID:</label>
          <div class="controls col-18">
            <div class="input-text-wrap l32">{{info.id}}
            </div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-6">产品ID:</label>
          <div class="controls col-18">
            <div class="input-text-wrap l32">{{info.product_id}}
            </div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-6">授权数量:</label>
          <div class="controls col-18">
            <div class="input-text-wrap l32">{{info.auth_number}}
            </div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-6">授权人员账号:</label>
          <div class="controls col-18">
            <div class="input-text-wrap l32">{{info.auth_member}}
            </div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-6">授权时间:</label>
          <div class="controls col-18">
            <div class="input-text-wrap l32">{{info.create_time | formatDate }}
            </div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-6">MAC地址:</label>
          <div class="controls col-18">
            <div class="input-text-wrap l32">{{info.attribute[0].mac}}
            </div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-6">名称:</label>
          <div class="controls col-18">
            <div class="input-text-wrap l32">{{info.attribute[0].name}}
            </div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-6">序列号:</label>
          <div class="controls col-18">
            <div class="input-text-wrap l32">{{info.attribute[0].sn}}
            </div>
          </div>
        </div>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
// import Vue from 'vue'
import api from 'api'
import * as config from 'consts/config'
// import locales from 'consts/locales/index'
import Modal from 'components/Modal'
import Pager from 'components/Pager'
import Select from 'components/Select'
// import _ from 'lodash'
import { globalMixins } from 'src/mixins'
import { setCurrProductMixin } from './mixins'
import Table from 'components/Table'
import SearchBox from 'components/SearchBox'
import Breadcrumb from 'components/Breadcrumb'
import Statistic from 'components/Statistic2'
import { formatDate } from 'src/filters'

export default {
  name: 'Authorize',

  mixins: [globalMixins, setCurrProductMixin],

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  components: {
    'x-table': Table,
    'modal': Modal,
    'pager': Pager,
    'x-select': Select,
    Breadcrumb,
    Statistic,
    'search-box': SearchBox
  },

  data () {
    return {
      info: {
        id: '',
        auth_number: '',
        auth_member: '',
        create_time: '',
        product_id: '',
        attribute: [{
          mac: '',
          name: '',
          sn: ''
        }]
      },
      showAddModal: false,
      showAddModal2: false,
      showAddModal3: false,
      addModal: {},
      queryTypeOptions: [
        { label: '添加人', value: 'auth_member' }
      ],
      loadingData: false,
      addModel: {
        mac: '',
        sn: '',
        name: ''
      },
      queryType: { label: '添加人', value: 'auth_member' },
      key: '',
      query: '',
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      used: 0, // 已使用配额
      // recordSummary: {
      //   all: {
      //     count: 0,
      //     title: '授权额度'
      //   },
      //   used: {
      //     count: 0,
      //     title: '已使用'
      //   },
      //   rest: {
      //     count: 0,
      //     title: '剩余额度'
      //   }
      // },
      headers: [{
        key: 'time',
        title: '时间'
      }, {
        key: 'warrent',
        title: '授权数'
      }, {
        key: 'addman',
        title: '添加人'
      }, {
        key: 'edit',
        title: '操作'
      }],
      alerts: []
    }
  },

  route: {
    data () {
      this.getRecords()
      // 获取产品列表，并将获取的数量作为已用配额
      let condition = {
        limit: 1,
        offset: 0
      }
      api.device.getList(this.$route.params.id, condition).then((res) => {
        this.used = res.data.count
      }).catch((res) => {
        this.handleError(res)
      })
    }
  },

  computed: {
    // 剩余配额
    remain () {
      let total = this.currentProduct.quota || 0
      return (total - this.used) || 0
    },

    tables () {
      var result = []
      this.alerts.map((item) => {
        let alert = {
          time: formatDate(item.create_time),
          warrent: item.auth_number,
          addman: item.auth_member,
          edit: '<button class="btn-link">查看详情</button>',
          prototype: item
        }
        result.push(alert)
      })
      return result
    },
    queryCondition () {
      var condition = {
        filter: ['_id', 'auth_number', 'auth_member', 'create_time', 'product_id'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        query: {}
      }
      if (this.query.length > 0) {
        condition.query[this.queryType.value] = this.queryType.value === 'id' ? { $in: [Number(this.query)] } : { $like: this.query }
      }
      return condition
    }
  },

  methods: {
    getInfo (table, header, index) {
      // console.log(table.prototype)
      // this.showAddModal3 = true
      // api.product.getRecordInfo(this.$route.params.id, table.prototype._id).then((res) => {
      //   if (res.status === 200) {
      //     this.info = res.data
      //   }
      // }).catch((res) => {
      //   this.handleError(res)
      // })
      console.log(table)
      this.$route.router.go('/dev/products/' + this.$route.params.id + '/info/list/' + table.prototype._id)
    },
    // 查询导入设备历史纪录
    getRecords () {
      this.loadingData = true
      api.product.getRecords(this.$route.params.id, this.queryCondition).then((res) => {
        if (res.status === 200) {
          this.alerts = res.data.list
          this.loadingData = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },
    init () {
      this.selectedProduct = this.products[0] || {}
    },
    openModel () {
      this.addModel.mac = ''
      this.addModel.sn = ''
      this.addModel.name = ''
      this.showAddModal = true
    },
    // 关闭添加浮层并净化添加表单
    resetAdd () {
      this.adding = false
      this.showAddModal = false
      // this.addModel = _.clone(this.originAddModel)
      // this.$nextTick(() => {
      //   this.addForm.setPristine()
      // })
      this.addModel.mac = ''
      this.addModel.sn = ''
      this.addModel.name = ''
    },
    // 添加操作
    onAddSubmit () {
      this.$addValidation.mac.touched = true
      if (this.$addValidation.valid && !this.adding) {
        this.adding = true
        var arr = []
        arr[0] = this.addModel
        api.product.sendDevices(this.$route.params.id, arr).then((res) => {
          if (res.status === 200) {
            this.showNotice({
              type: 'success',
              content: '添加成功'
            })
            this.resetAdd()
            // this.getDevices()
            this.getRecords()
            this.adding = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.adding = false
        })
      }
    },
    /**
     * 当前页码改变
     * @author weijie
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      this.getAlerts()
    },
    // 批量导入
    batchImport () {
      var file = this.$els.macFile.files[0]
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        var reader = new window.FileReader()
        if (!/text\/\w+/.test(file.type)) {
          this.showNotice({
            type: 'error',
            content: file.name + this.$t('ui.upload.type_tips')
          })
          return false
        }
        reader.onerror = (evt) => {
          this.showNotice({
            type: 'error',
            content: this.$t('ui.upload.read_err')
          })
        }
        this.importing = true
        // 读取完成
        reader.onloadend = (evt) => {
          if (evt.target.readyState === window.FileReader.DONE) {
            var macArr = evt.target.result.replace(' ', '').replace(/\r\n/g, '\n').split('\n')
            var a = []
            macArr.forEach((element, index) => {
              if (element !== '') {
                a.push(element)
              }
            })
            macArr = a
            api.product.sendDevices(this.$route.params.id, macArr).then((res) => {
              if (res.status === 200) {
                this.showNotice({
                  type: 'success',
                  content: this.$t('ui.upload.success_msg')
                })
                this.getDevices()
                this.showAddModal2 = false
              }
              this.importing = false
            }).catch((res) => {
              this.handleError(res)
              this.importing = false
            })
          }
        }
        reader.readAsText(file)
      } else {
        this.showNotice({
          type: 'error',
          content: this.$t('ui.upload.compatiblity')
        })
      }
    },

    /**
     * 每页显示的数量改变
     * @author weijie
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.getAlerts(true)
    },
    // 添加表单钩子
    addFormHook (form) {
      this.addForm = form
    },
    /**
     * 关闭添加大客户浮层
     * @return {[type]} [description]
     */
    onAddCancel () {
      this.adding = false
      this.showAddModal = false
      this.addModel.mac = ''
      // this.$nextTick(() => {
      //   this.$resetValidation()
      // })
    },
    onAddCancel3 () {
      this.adding = false
      this.showAddModal3 = false
    },
    /**
     * 显示添加大客户的浮层
     * @return {[type]} [description]
     */
    onShowAddModal () {
      var addModal = {
        // 产品
        product: '',
        // MAC
        mac: ''
      }
      this.addModal = addModal
      this.showAddModal = true
    },
    /**
     * 关闭添加大客户浮层
     * @return {[type]} [description]
     */
    onAddCancel2 () {
      this.adding = false
      this.showAddModal2 = false
      // this.$nextTick(() => {
      //   this.$resetValidation()
      // })
    },
    /**
     * 显示添加大客户的浮层
     * @return {[type]} [description]
     */
    onShowAddModal2 () {
      var addModal = {}
      this.addModal = addModal
      this.showAddModal2 = true
    }
  }
}
</script>

<style lang="stylus" scoped>
.l32
  line-height 32px
.bt
  border-top 1px solid #d9d9d9
  margin-bottom 20px
</style>
