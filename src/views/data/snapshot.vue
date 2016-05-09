<template>
  <div>
    <div class="panel">
      <div class="panel-bd">
        <div class="form">
          <div class="form-row row">
            <label class="form-control col-6">产品:</label>
            <div class="controls col-18">
              <v-select :label="productTypes[productType.value].label" width="200px">
                <select v-model="productType">
                  <option v-for="i in productTypes" :value="i">{{ i.label }}</option>
                </select>
              </v-select>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">快照规则:</label>
            <div class="controls col-9">
              <v-select :label="updateRules[updateRule.value].label" width="200px">
                <select v-model="updateRule">
                  <option v-for="i in updateRules" :value="i">{{ i.label }}</option>
                </select>
              </v-select>
            </div>
            <div class="controls col-9" v-if="updateRule.value==0">
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
                <div v-for="i in snapshotData" class="data-tag">{{i.label}}</div>
              </div>
              <button class="btn btn-ghost btn-sm" @click="showEditModal=true"><i class="fa fa-edit"></i>编辑快照数据</button>
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
                <td @click="showAddModal=true">
                  <a>热水器</a>
                </td>
                <td>ted</td>
                <td>2019.0.1</td>
                <td>哈哈</td>
                <td v-link="{ path: '/data/snapshot/123' }">
                  <a>查看快照</a>
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
              <tr v-for="i in 8">
                <td>1</td>
                <td>ted</td>
                <td>tupe</td>
                <td>kg</td>
                <td>xxxx</td>
                <td><input type="checkbox"/></td>
              </tr>
            </tbody>
          </table>
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
              <tr v-for="i in 8">
                <td>1</td>
                <td>ted</td>
                <td>tupe</td>
                <td>kg</td>
                <td>xxxx</td>
                <td><input type="checkbox"/></td>
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
        productTypes: [{
          label: '请选择产品类型',
          value: 0
        },
        {
          label: '热水器',
          value: 1
        },
        {
          label: '饮水机',
          value: 2
        }],

        productType: {
          label: '请选择产品类型',
          value: 0
        },

        updateRules: [{
          label: '定时更新',
          value: 0
        },
        {
          label: '上报更新',
          value: 1
        },
        {
          label: '变化更新',
          value: 2
        }],

        updateRule: {
          label: '定时更新',
          value: 0
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
        snapshotData: [{
          label: 'led',
          value: 0
        },
        {
          label: 'POWER',
          value: 1
        },
        {
          label: 'inr',
          value: 2
        },
        {
          label: 'mode',
          value: 3
        },
        {
          label: 'mode',
          value: 4
        },
        {
          label: 'dashboard',
          value: 5
        }]
      }
    },

    route: {
      data () {
      }
    },

    computed: {
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
</style>
