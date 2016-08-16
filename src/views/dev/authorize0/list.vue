<template>
  <div class="main">
    <div class="main-title">
      <h2>授权记录</h2>
    </div>
    <div class="row statistic-group bt">
      <div class="col-8">
        <statistic :info="recordSummary.all" :title="recordSummary.all.title" align="left">
        </statistic>
      </div>
      <div class="col-8">
        <statistic :info="recordSummary.used" :title="recordSummary.used.title" :has-target="true" align="left">
        </statistic>
      </div>
      <div class="col-8">
        <statistic :info="recordSummary.rest" :title="recordSummary.rest.title" :has-action="true" align="left" :showchange="true">
          <div slot="action">
            <button class="btn btn-ghost btn-sm">
            购买配额
            </button>
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
                <button class="btn btn-ghost btn-sm" @click="onShowAddModal">手动添加</button>
                <button class="btn btn-ghost btn-sm" @click="onShowAddModal2">批量导入</button>
              </div>
            </div>
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="key" :placeholder="$t('ui.overview.addForm.search_condi')" :active="searching" @cancel="" @search-activate="searching=!searching"  @press-enter="">
                  <v-select width="90px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </v-select>
                  <button slot="search-button" @click="" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
          </div>
          <x-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage"></x-table>
        </div>
      </div>
    </div>
    <!-- 手动添加浮层 -->
    <modal :show.sync="showAddModal" @close="onAddCancel" width="524px">
      <h3 slot="header">手动添加</h3>
      <div slot="body" class="form">
        <validator name="majorClientValidation">
          <form @submit.prevent="">
            <div class="form-row row">
              <label class="form-control col-6">产品:</label>
              <div class="controls filter-group-item col-18">
                <v-select :label="addModal.product.label">
                  <select v-model="addModal.product">
                    <option v-for="product in products" :value="industry">{{industry}}</option>
                  </select>
                </v-select>
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
    </modal>
    <!-- 批量导入浮层 -->
    <modal :show.sync="showAddModal2" @close="onAddCancel" width="400px">
      <h3 slot="header">批量导入</h3>
      <div slot="body" class="form">
        <validator name="majorClientValidation">
          <form @submit.prevent="">
            <div class="form-row row">
              <!-- <label class="form-control col-6">导入:</label> -->
              <button class="btn btn-ghost ben-sm"><i class="fa fa-share-square-o"></i>导入设备</button>
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
  </div>
</template>

<script>
  // import Vue from 'vue'
  // import api from 'api'
  import * as config from 'consts/config'
  // import locales from 'consts/locales/index'
  import Modal from 'components/Modal'
  import Pager from 'components/Pager'
  import Select from 'components/Select'
  // import _ from 'lodash'
  import { globalMixins } from 'src/mixins'
  import Table from 'components/Table'
  import SearchBox from 'components/SearchBox'
  import Breadcrumb from 'components/Breadcrumb'
  import Statistic from 'components/Statistic'

  export default {
    name: 'DataForward',

    mixins: [globalMixins],

    vuex: {
      getters: {
        products: ({ products }) => products.all
      }
    },

    components: {
      'x-table': Table,
      'modal': Modal,
      'pager': Pager,
      'v-select': Select,
      Breadcrumb,
      Statistic,
      'search-box': SearchBox
    },

    data () {
      return {
        showAddModal: false,
        showAddModal2: false,
        addModal: {},
        queryTypeOptions: [
          { label: '添加人', value: 'addman' }
        ],
        queryType: { label: '添加人', value: 'addman' },
        key: '',
        total: 0,
        currentPage: 1,
        countPerPage: config.COUNT_PER_PAGE,
        recordSummary: {
          all: {
            total: 2323,
            title: '授权额度'
          },
          used: {
            total: 135,
            title: '已使用'
          },
          rest: {
            total: 1125,
            title: '剩余额度'
          }
        },
        headers: [{
          key: 'time',
          title: '时间'
        }, {
          key: 'warrent',
          title: '授权数'
        }, {
          key: 'style',
          title: '导入方式'
        }, {
          key: 'addman',
          title: '添加人'
        }, {
          key: 'edit',
          title: '操作'
        }],
        alerts: [{}, {}]
      }
    },

    route: {
      data () {
      }
    },

    ready () {
    },

    computed: {
      tables () {
        var result = []
        this.alerts.map((item) => {
          let alert = {
            time: '2016-05-17',
            warrent: 12345,
            style: '批量导入',
            addman: 'demo@xlink.com',
            edit: '<button @click="" class="btn-link">刪除</button>',
            prototype: item
          }
          result.push(alert)
        })
        return result
      }
    },

    methods: {
      init () {
        this.selectedProduct = this.products[0] || {}
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

      /**
       * 每页显示的数量改变
       * @author weijie
       * @param  {Number} count 数量
       */
      onPageCountUpdate (count) {
        this.countPerPage = count
        this.getAlerts(true)
      },
      /**
       * 关闭添加大客户浮层
       * @return {[type]} [description]
       */
      onAddCancel () {
        this.adding = false
        this.showAddModal = false
        // this.$nextTick(() => {
        //   this.$resetValidation()
        // })
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
.bt
  border-top 1px solid #d9d9d9
  margin-bottom 20px
</style>
