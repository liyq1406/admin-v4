<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>数据快照</h2>
    </div>
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <a class="btn btn-primary" v-link="{path: '/dev/data/snapshot/create'}"><i class="fa fa-plus"></i>添加快照配置</a>
          </div>
        </div>
        <div class="data-table">
          <div class="filter-bar">
            <div class="filter-group">
              <x-select :label="selectedProduct.label" width="160px" size="small">
                <span slot="label">显示</span>
                <select v-model="selectedProduct" @change="onProductSelect">
                  <option v-for="opt in productOptions" :value="opt">{{ opt.label }}</option>
                </select>
              </x-select>
            </div>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>快照ID</th>
                <th>快照名称</th>
                <th>产品名称</th>
                <th class="wp20">快照规则</th>
                <th class="wp20">创建时间</th>
                <th class="wp20">创建者</th>
                <th class="wp20">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="dp in filteredRules">
                <td>
                  <a class="hl">{{dp.id}}</a>
                </td>
                <td>
                  <a class="hl">{{dp.name}}</a>
                </td>
                <td>
                  <a class="hl">{{dp.productName}}</a>
                </td>
                <td>
                  <div v-if="dp.rule===3">定时更新/{{dp.interval}}分钟</div>
                  <div v-if="dp.rule===2">变化更新</div>
                  <div v-if="dp.rule===1">即时更新</div>
                </td>
                <td>{{dp.create_time | formatDate}}</td>
                <td>{{dp.creator}}</td>
                <td>
                  <a v-link="{ path: '/dev/data/snapshots/' + dp.productId + '/' + dp.id}" class="hl-red">查看快照</a>
                  <a class="hl-red ml10" v-link="{path: '/dev/data/snapshot/edit/'+dp.productId+'/'+dp.id}">编辑</a>
                </td>
              </tr>
              <tr v-if="filteredRules.length === 0">
                <td :colspan="6" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pagination v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" :simple="true"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import * as config from 'consts/config'
import { globalMixins } from 'src/mixins'
import api from 'api'

export default {
  name: 'Snapshots',

  mixins: [globalMixins],

  components: {
  },

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  data () {
    return {
      selectedProduct: {
        label: '全部',
        value: 0
      },
      rules: [],
      countPerPage: config.COUNT_PER_PAGE,
      currentPage: 1,
      total: 0
    }
  },

  route: {
    data () {
      this.init()
    }
  },

  computed: {
    // 下拉选项
    productOptions () {
      var result = [{
        label: '全部',
        value: 0
      }]

      this.products.forEach((item) => {
        var option = {}
        option.label = item.name
        option.value = item.id
        result.push(option)
      })

      return result
    },

    // 经过过滤的规则列表
    filteredRules () {
      let result = this.rules
      let offset = (this.currentPage - 1) * this.countPerPage
      let count = this.countPerPage

      if (this.selectedProduct.value) {
        result = result.filter((item) => {
          return item.productId === this.selectedProduct.value
        })
      }

      this.total = result.length

      result = result.slice(offset, offset + count)
      return result
    }
  },

  watch: {
    products () {
      this.init()
    }
  },

  methods: {
    /**
     * 初始化
     * @author shengzhi
     */
    init () {
      if (this.products.length) {
        this.getRules()
      }
    },

    /**
     * 处理产品切换
     * @author shengzhi
     */
    onProductSelect () {
      this.offset = 0
      this.currentPage = 1
    },

    /**
     * 获取快照规则
     * @author shengzhi
     */
    getRules () {
      this.rules = []
      this.products.forEach((product) => {
        api.snapshot.getRules(product.id).then((res) => {
          if (res.status === 200) {
              // 循环插入
            let rules = res.data.list.map((item) => {
              item.productName = product.name
              item.productId = product.id
              return item
            })
            let rulesTemp = this.rules.concat(rules)
            rulesTemp.sort((a, b) => {
              a = +new Date(a.create_time)
              b = +new Date(b.create_time)
              return b - a
            })
            this.rules = rulesTemp
          }
        }).catch((res) => {
          this.handleError(res)
        })
      })
    }
  }
}
</script>
