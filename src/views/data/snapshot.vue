<template>
  <div>
    <div class="panel">
      <div class="panel-bd">
        <div class="form">
          <div class="form-row row">
            <label class="form-control col-6">产品:</label>
            <div class="controls col-18">
              <v-select :label="productTypes[productType.value].label" width="200px">
                <select v-model="productType" @change="getProductData">
                  <option v-for="i in productTypes" :value="i">{{ i.label }}</option>
                </select>
              </v-select>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">快照规则:</label>
            <div class="controls col-9">
              <v-select :label="timeIntervals[timeInterval.value].label" width="200px">
                <select v-model="timeInterval">
                  <option v-for="i in timeIntervals" :value="i">{{ i.label }}</option>
                </select>
              </v-select>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">快照数据:</label>
            <div class="controls col-18">
              <div class="editSnapshot">
                <div v-for="i in dataPointsShow" class="data-tag">{{i}}</div>
              </div>
              <button class="btn btn-ghost btn-sm" @click="showAddModal=true"><i class="fa fa-edit"></i>选择快照数据项</button>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6 height-wrap"></label>
            <div class="controls col-18">
              <button class="btn btn-primary" @click="addSnapshotRule">添加快照配置</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-hd">
        <h2>快照配置列表</h2>
      </div>
      <div class="panel-bd">
        <div class="rule-type">
          <div class="rule-select">
            <v-select :label="productTypes[productType.value].label" width="200px">
              <span slot="label">选择产品</span>
              <select v-model="productType" @change="getProductData">
                <option v-for="i in productTypes" :value="i">{{ i.label }}</option>
              </select>
            </v-select>
          </div>
        </div>
        <div class="data-table">
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>产品名称</th>
                <th>快照规则</th>
                <th>创建时间</th>
                <th>创建者</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 3">
                <td>
                  <a @click.prevent="showEditModal=true" class="hl-red">热水器</a>
                </td>
                <td>ted</td>
                <td>2019.0.1</td>
                <td>哈哈</td>
                <td>
                  <a v-link="{ path: '/data/snapshot/123' }" class="hl-red">查看快照</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- 添加选择快照数据项浮层-->
    <modal :show.sync="showAddModal" width="600px">
      <h3 slot="header">选择快照数据项</h3>
      <div slot="body" class="form">
        <div class="table-wrap">
          <div class="data-table">
            <table class="table table-stripe table-bordered">
              <thead>
                <tr>
                  <th>索引</th>
                  <th>端点ID</th>
                  <th>数据类型</th>
                  <th>单位符号</th>
                  <th>描述</th>
                  <th>选择</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in currentPageCount">
                  <td>{{dataPoints[(currentPage - 1) * pageCount + i].index}}</td>
                  <td>{{dataPoints[(currentPage - 1) * pageCount + i].id}}</td>
                  <td>{{dataPoints[(currentPage - 1) * pageCount + i].type}}</td>
                  <td>{{dataPoints[(currentPage - 1) * pageCount + i].symbol}}</td>
                  <td>{{dataPoints[(currentPage - 1) * pageCount + i].description}}</td>
                  <td><input v-model="dataPoints[(currentPage - 1) * pageCount + i].selected" type="checkbox"/></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="data-points-footer">
            <pager v-if="dataPoints.length > pageCount" :total="dataPoints.length" :current.sync="currentPage" :page-count="pageCount" @page-update=""></pager>
          </div>
        </div>
        <div class="form-actions snapshot-select">
          <button @click="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          <button @click="onAddSubmit" type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
        </div>
      </div>
    </modal>
    <!-- 结束添加选择快照数据项浮层-->
    <!-- 编辑快照数据项浮层-->
    <modal :show.sync="showEditModal" width="600px">
      <h3 slot="header">选择快照数据项</h3>
      <div slot="body" class="form">
        <div class="data-table">
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>索引</th>
                <th>端点ID</th>
                <th>数据类型</th>
                <th>单位符号</th>
                <th>描述</th>
                <th>选择</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in dataPoints">
                <td>{{i.index}}</td>
                <td>{{i.id}}</td>
                <td>{{i.type}}</td>
                <td>{{i.symbol}}</td>
                <td>{{i.description}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="form-actions snapshot-select">
          <button @click="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          <button @click="onEditSubmit" type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
        </div>
      </div>
    </modal>
    <!-- 结束 编辑快照数据项浮层-->
  </div>
</template>

<script>
  // import Vue from 'vue'
  // import api from '../../api'
  import Pager from '../../components/Pager'
  import Modal from '../../components/Modal'
  import Select from '../../components/Select'
  // import locales from '../../consts/locales/index'
  // import _ from 'lodash'
  import { globalMixins } from '../../mixins'
  import api from '../../api'

  export default {
    name: 'DataTables',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'modal': Modal,
      'pager': Pager,
      'v-select': Select
    },

    data () {
      return {
        showAddModal: false,
        showEditModal: false,
        productType: {
          label: '请选择产品类型',
          value: 0,
          id: ''
        },
        timeIntervals: [{
          label: '5分钟',
          value: 0
        },
        {
          label: '10分钟',
          value: 1
        },
        {
          label: '20分钟',
          value: 2
        },
        {
          label: '30分钟',
          value: 3
        },
        {
          label: '1小时',
          value: 4
        },
        {
          label: '2小时',
          value: 5
        }],
        timeInterval: {
          label: '5分钟',
          value: 0
        },
        products: [{
          name: ''
        }],
        dataPoints: [],
        pageCount: 10,
        currentPage: 1
      }
    },

    route: {
      data () {
        this.init()
      }
    },

    computed: {
      productTypes () {
        var types = [{
          label: '请选择产品类型',
          value: 0,
          id: ''
        }]

        var i = 1
        this.products.forEach((item) => {
          var type = {}
          type.label = item.name
          type.value = i
          type.id = item.id
          i++
          types.push(type)
        })

        return types
      },
      dataPointsShow () {
        var datas = []
        this.dataPoints.forEach((item) => {
          var data = ''
          if (item.selected === true) {
            data = item.name
            datas.push(data)
          }
        })

        return datas
      },
      currentPageCount () {
        if (this.dataPoints.length > 0) {
          var index = this.dataPoints.length - (this.currentPage - 1) * this.pageCount
          console.log(index)
          return index >= 10 ? 10 : index
        }
      }
    },

    methods: {
      addSnapshotRule () {
      },
      onAddCancel () {
        this.showAddModal = false
      },
      onAddSubmit () {
        this.showAddModal = false
      },
      onEditCancel () {
        this.showEditModal = false
      },
      onEditSubmit () {
        this.showEditModal = false
      },
      init () {
        this.getProducts()
      },
      getProducts () {
        api.product.all().then((res) => {
          this.products = res.data
        }, (err) => {
          this.handleError(err)
        })
      },
      getProductData () {
        api.product.getDatapoints(this.productType.id).then((res) => {
          var datas = []
          res.data.forEach((item) => {
            var data = {}
            data.selected = false
            data.index = item.index
            data.id = item.id
            data.name = item.name
            data.type = item.type
            data.symbol = item.symbol
            data.description = item.description
            datas.push(data)
          })
          this.dataPoints = datas
        }, (err) => {
          this.handleError(err)
        })
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../assets/stylus/common'
  .editSnapshot
    line-height 32px
  .data-tag
    display inline-block
    color gray
    margin-right 10px
  .snapshot-select
    margin-top 30px
  .height-wrap
    height 1.5em
  .table-wrap
    height 100%
    width 100%
    overflow-x scroll
  .rule-type
    float right
    margin-top 10px
    margin-bottom 10px
</style>
