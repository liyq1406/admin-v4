<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>数据转发</h2>
    </div>
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <a class="btn btn-primary" v-link="{path: '/dev/data/forward/create'}"><i class="fa fa-plus"></i>添加规则</a>
          </div>
        </div>
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div class="filter-bar">
            <div class="filter-group fl">
              <x-select :label="selectedProduct.name || ''" width="160px" size="small">
                <span slot="label">显示</span>
                <select v-model="selectedProduct" @change="getRule">
                  <option v-for="product in products" :value="product">{{ product.name }}</option>
                </select>
              </x-select>
            </div>
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="key" :placeholder="$t('ui.overview.addForm.search_condi')"></search-box>
              </div>
            </div>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>产品名称</th>
                <th>规则ID</th>
                <th>数据目的地</th>
                <th>数据分发类型</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rule in forwardRules | filterBy key in 'id'">
                <td>
                  <a class="hl">{{selectedProduct.name}}</a>
                </td>
                <td>{{rule.id}}</td>
                <td>{{rule.destination.url}}</td>
                <td>{{computedType(rule.destination.type)}}</td>
                <td>
                  <a v-link="{ path: $route.path + '/' + selectedProduct.id + '/' + rule.id}" class="hl-red">查看规则</a>
                  <a class="hl-red ml10" v-link="{path: '/dev/data/forward/edit/' + selectedProduct.id + '/' + rule.id}">编辑</a>
                </td>
              </tr>
              <tr v-if="forwardRules.length === 0">
                <td :colspan="5" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- <div class="data-points-footer">
          <pager v-if="forwardRules.length > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getRule"></pager>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
// import * as config from 'consts/config'
import Pager from 'components/Pager'
import Select from 'components/Select'
import SearchBox from 'components/SearchBox'
// import locales from 'consts/locales/index'
// import _ from 'lodash'
import { globalMixins } from 'src/mixins'
import api from 'api'

export default {
  name: 'DataTables',

  mixins: [globalMixins],

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  components: {
    Pager,
    SearchBox,
    'x-select': Select
  },

  data () {
    return {
      key: '',
      // 正在加载
      loadingData: false,
      // 当前产品
      selectedProduct: {},
      // // 列表总条数
      // total: 0,
      // // 每页显示条数
      // countPerPage: config.COUNT_PER_PAGE,
      // // 当前页码
      // currentPage: 1,
      // 转发规则列表
      forwardRules: [
        // {
        //   'id': '转发规则ID',
        //   'data_type': [
        //     '1',
        //     '2',
        //     '3',
        //     '4',
        //     '5'
        //   ],
        //   'destination': {
        //     'type': 1,
        //     'url': '转发URL地址',
        //     'token': 'URL地址验证令牌'
        //   }
        // }
      ]
    }
  },

  watch: {
    products () {
      this.init()
    }
  },

  route: {
    data () {
      this.init()
    }
  },

  methods: {
    /**
     * 初始化
     * @return {[type]} [description]
     */
    init () {
      this.selectedProduct = this.products[0] || {}
      this.getRule()
    },
    /**
     * 获取数据转发规则
     * @return {[type]} [description]
     */
    getRule () {
      if (!this.selectedProduct.id) {
        return
      }
      this.loadingData = true
      api.dataForward.getRule(this.selectedProduct.id).then((res) => {
        if (res.status === 200) {
          this.forwardRules = res.data.list
          this.total = res.data.count
          this.loadingData = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    /**
     * 当前类型的文案
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    computedType (type) {
      var result = {
        '1': '转发到外部url',
        '2': '转发到内部插件处理单元'
      }
      return result[type]
    }

  }
}
</script>

<style lang="stylus" scoped>
  @import '../../../../assets/stylus/common'
  .data-points-footer
    .pager
      margin 10px 0 0
</style>
