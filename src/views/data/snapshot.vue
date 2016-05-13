<template>
  <div>
    <div class="panel">
      <div class="panel-bd">
        <div class="form">
          <div class="form-row row">
            <label class="form-control col-6">产品:</label>
            <div class="controls col-18">
              <v-select :label="productTypes[productType.value].label" width="200px">
                <select v-model="productType" @change="getProductData(true)">
                  <option v-for="type in productTypes" :value="type">{{ type.label }}</option>
                </select>
              </v-select>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">快照规则:</label>
            <div class="controls col-9">
              <v-select :label="timeIntervals[timeInterval.value].label" width="200px">
                <select v-model="timeInterval">
                  <option v-for="time in timeIntervals" :value="time">{{ time.label }}</option>
                </select>
              </v-select>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">快照数据:</label>
            <div class="controls col-18">
              <div class="edit-snapshot">
                <div v-for="dp in dataPointsShow" class="data-tag">{{dp}}</div>
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
            <v-select :label="ruleProductTypes[ruleProductType.value].label" width="200px">
              <span slot="label">选择产品</span>
              <select v-model="ruleProductType" @change="getProductRules(true)">
                <option v-for="i in ruleProductTypes" :value="i">{{ i.label }}</option>
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
              <tr v-for="dp in productsRules | limitBy pageCount (currentRulesPage-1)*pageCount">
                <td>
                  <a class="hl">{{dp.productName}}</a>
                </td>
                <td><div v-if="dp.rule===3">定时更新/{{dp.interval}}分钟</div></td>
                <td>{{dp.create_time | formatDate}}</td>
                <td>{{dp.creator}}</td>
                <td>
                  <a v-link="{ path: '/data/snapshot/' + dp.productID}" class="hl-red">查看快照</a>
                  <a @click.prevent="editSnapshot(dp)" class="hl-red ml20">编辑</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="data-points-footer">
          <pager v-if="productsRules.length > pageCount" :total="productsRules.length" :current.sync="currentRulesPage" :page-count="pageCount" @page-update=""></pager>
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
                  <th>选择</th>
                  <th>索引</th>
                  <th>端点ID</th>
                  <th>数据类型</th>
                  <th>单位符号</th>
                  <th>描述</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="dp in dataPoints | limitBy pageCount (currentPage-1)*pageCount">
                  <td><input v-model="dp.selected" type="checkbox"/></td>
                  <td>{{dp.index}}</td>
                  <td>{{dp.id}}</td>
                  <td>{{dp.type}}</td>
                  <td>{{dp.symbol}}</td>
                  <td>{{dp.description}}</td>
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

    <!-- 添加 编辑快照浮层-->
    <modal :show.sync="showEditModal" width="600px">
      <h3 slot="header">编辑快照规则</h3>
      <div slot="body" class="form">
        <div class="form">
          <div class="form-row row">
            <label class="form-control col-6">快照规则:</label>
            <div class="controls col-9">
              <v-select :label="timeIntervals[timeIntervalEdit.value].label" width="200px">
                <select v-model="timeIntervalEdit">
                  <option v-for="time in timeIntervals" :value="time">{{ time.label }}</option>
                </select>
              </v-select>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">快照数据:</label>
            <div class="controls col-18">
              <div class="edit-snapshot">
                <div v-for="dps in ruleDataPointsShow" class="data-tag">{{dps}}</div>
              </div>
              <button class="btn btn-ghost btn-sm" @click="showEditPointModal=true"><i class="fa fa-edit"></i>选择快照数据项</button>
            </div>
          </div>
        </div>
        <div class="form-actions snapshot-select">
          <label class="del-check">
            <input type="checkbox" name="del" v-model="delRuleChecked"/>删除规则
          </label>
          <button @click="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          <button @click="onEditSubmit" type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
        </div>
      </div>
    </modal>
    <!-- 结束 编辑快照浮层-->

    <!-- 添加 编辑快照数据项浮层-->
    <modal :show.sync="showEditPointModal" width="600px">
      <h3 slot="header">修改快照数据项</h3>
      <div slot="body" class="form">
        <div class="table-wrap">
          <div class="data-table">
            <table class="table table-stripe table-bordered">
              <thead>
                <tr>
                  <th>选择</th>
                  <th>索引</th>
                  <th>端点ID</th>
                  <th>数据类型</th>
                  <th>单位符号</th>
                  <th>描述</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="dp in editDataPoints | limitBy pageCount (currentEditPage-1)*pageCount">
                  <td><input v-model="dp.selected" type="checkbox"/></td>
                  <td>{{dp.index}}</td>
                  <td>{{dp.id}}</td>
                  <td>{{dp.type}}</td>
                  <td>{{dp.symbol}}</td>
                  <td>{{dp.description}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="data-points-footer">
            <pager v-if="editDataPoints.length > pageCount" :total="editDataPoints.length" :current.sync="currentEditPage" :page-count="pageCount" @page-update=""></pager>
          </div>
        </div>
        <div class="form-actions snapshot-select">
          <button @click="onEditPointCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          <button @click="onEditPointSubmit" type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
        </div>
      </div>
    </modal>
    <!-- 结束添加选择快照数据项浮层-->
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
        showEditPointModal: false,
        delRuleChecked: false,
        productType: {
          label: '请选择产品类型',
          value: 0,
          id: ''
        },
        ruleProductType: {
          label: '全部',
          value: 0,
          id: ''
        },
        timeIntervals: [{
          label: '10分钟',
          value: 0
        },
        {
          label: '20分钟',
          value: 1
        },
        {
          label: '30分钟',
          value: 2
        },
        {
          label: '1小时',
          value: 3
        }],
        timeInterval: {
          label: '10分钟',
          value: 0
        },
        timeIntervalEdit: {
          label: '10分钟',
          value: 0
        },
        products: [{
          name: ''
        }],
        dataPoints: [],
        editDataPoints: [],
        pageCount: 10,
        currentPage: 1,
        currentRulesPage: 1,
        currentEditPage: 1,
        productsRules: [],
        ruleDataPointsShow: [],
        curentEditRule: {}
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
      ruleProductTypes () {
        var types = [{
          label: '全部',
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
      ruleDataPointsShow () {
        var datas = []
        this.editDataPoints.forEach((item) => {
          var data = ''
          if (item.selected === true) {
            data = item.name
            datas.push(data)
          }
        })

        return datas
      },

      addRules () {
        var rule = {
          rule: 3,
          interval: 30,
          storage: {
            // limit: 0, // 不支持
            // expire: 0 // 有效期 单位是秒（s） 0表示永久存储
          },
          datapoint: []
        }

        this.dataPoints.forEach((item) => {
          if (item.selected === true) {
            rule.datapoint.push(item.index)
          }
        })

        switch (this.timeInterval.value) {
          case 0:
            rule.interval = 10
            break
          case 1:
            rule.interval = 20
            break
          case 2:
            rule.interval = 30
            break
          case 3:
            rule.interval = 60
            break
          default:
            break
        }
        return rule
      },
      editRules () {
        var rule = {
          _id: '',
          rule: 3,
          interval: 30,
          storage: {
            // limit: 0, // 不支持
            // expire: 0 // 有效期 单位是秒（s） 0表示永久存储
          },
          datapoint: []
        }
        rule._id = this.curentEditRule.id
        this.editDataPoints.forEach((item) => {
          if (item.selected === true) {
            rule.datapoint.push(item.index)
          }
        })

        switch (this.timeIntervalEdit.value) {
          case 0:
            rule.interval = 10
            break
          case 1:
            rule.interval = 20
            break
          case 2:
            rule.interval = 30
            break
          case 3:
            rule.interval = 60
            break
          default:
            break
        }
        return rule
      }
    },

    methods: {
      addSnapshotRule () {
        this.checkSnapshotExsit()
      },
      checkSnapshotExsit () {
        api.snapshot.getRule(this.productType.id).then((res) => {
          if (res.status === 200) {
            if (res.data.count > 0) {
              // 存在就不创建
              alert('规则已创建')
            } else {
              this.createSnapshotRule()
            }
          }
        }, (err) => {
          this.handleError(err)
        })
      },
      createSnapshotRule () {
        if (this.productType.value === 0) {
          return
        }
        api.snapshot.createRule(this.productType.id, this.addRules).then((res) => {
          if (res.status === 200) {
            this.productsRules = [] // 清空数组重新获取
            this.getProductRules(true)
          }
        }, (err) => {
          this.handleError(err)
        })
      },
      editSnapshotRule () {
        api.snapshot.updateRule(this.curentEditRule.productID, this.editRules).then((res) => {
          if (res.status === 200) {
            this.getProductRules(true)
          }
        }, (err) => {
          this.handleError(err)
        })
      },
      deleteSnapshotRule () {
        api.snapshot.deleteRule(this.curentEditRule.productID, this.curentEditRule.id).then((res) => {
          if (res.status === 200) {
            this.delRuleChecked = false
            this.getProductRules(true)
          }
        }, (err) => {
          this.handleError(err)
        })
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
        if (this.delRuleChecked) {
          // 删除
          var ret = window.confirm('确认删除快照规则')
          if (ret) {
            this.deleteSnapshotRule()
            this.showEditModal = false
          }
        } else {
          this.editSnapshotRule()
          this.showEditModal = false
        }
      },
      onEditPointCancel () {
        this.showEditPointModal = false
      },
      onEditPointSubmit () {
        this.showEditPointModal = false
      },
      init () {
        this.getProducts()
      },
      getProducts () {
        api.product.all().then((res) => {
          this.products = res.data
          this.getRules()
        }, (err) => {
          this.handleError(err)
        })
      },
      getRules () {
        this.productsRules = []
        this.products.forEach((item) => {
          var product = item
          api.snapshot.getRule(item.id).then((res) => {
            if (res.status === 200) {
              if (res.data.count > 0) {
                // 循环插入
                res.data.list.forEach((item) => {
                  item.productName = product.name
                  item.productID = product.id
                  this.productsRules.push(item)
                })
              }
            }
          }, (err) => {
            this.handleError(err)
          })
        })
      },
      getProductRules (clearPage) {
        if (clearPage) {
          this.currentRulesPage = 1
        }
        this.productsRules = []
        if (this.ruleProductType.value === 0) {
          this.getRules()
        } else {
          var self = this
          api.snapshot.getRule(this.ruleProductType.id).then((res) => {
            if (res.status === 200) {
              if (res.data.count > 0) {
                // 循环插入
                res.data.list.forEach((item) => {
                  item.productName = self.ruleProductType.label
                  item.productID = self.ruleProductType.id
                  this.productsRules.push(item)
                })
              }
            }
          }, (err) => {
            this.handleError(err)
          })
        }
      },
      getProductData (clearPage, rule) {
        if (clearPage) {
          this.currentPage = 1
        }
        if (this.productType.value === 0 && !rule) {
          return
        }
        var id = rule ? rule.productID : this.productType.id
        api.product.getDatapoints(id).then((res) => {
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
            if (rule) {
              var finded = false
              rule.datapoint.forEach((item) => {
                if (data.index === item) {
                  finded = true
                }
              })
              if (finded) {
                data.selected = true
              }
            }
            datas.push(data)
          })
          if (rule) {
            this.editDataPoints = datas
          } else {
            this.dataPoints = datas
          }
        }, (err) => {
          this.handleError(err)
        })
      },
      editSnapshot (rule) {
        this.curentEditRule = rule
        this.showEditModal = true
        this.ruleDataPointsShow = []
        this.getProductData(false, rule)
        switch (rule.interval) {
          case 10:
            this.timeIntervalEdit.value = 0
            break
          case 20:
            this.timeIntervalEdit.value = 1
            break
          case 30:
            this.timeIntervalEdit.value = 2
            break
          case 60:
            this.timeIntervalEdit.value = 3
            break
          default:
            break
        }

        if (rule.interval === 60) {
          this.timeIntervalEdit.label = '1小时'
        } else {
          this.timeIntervalEdit.label = rule.interval.toString() + '分钟'
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../assets/stylus/common'
  .edit-snapshot
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
