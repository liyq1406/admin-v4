<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>统计规则</h2>
    </div>
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <a class="btn btn-primary" v-link="{path: '/dev/data/statistics-rule/add'}"><i class="fa fa-plus"></i>添加统计规则</a>
          </div>
        </div>
        <x-table :headers="headers" :tables="tables" @tbody-operation="editRule">
        </x-table>
      </div>
    </div>
  </div>
</template>

<script>
import * as config from 'consts/config'
import Table from 'components/Table'
import SearchBox from 'components/SearchBox'
import { globalMixins } from 'src/mixins'
import formatDate from 'filters/format-date'
import api from 'api'

export default {
  name: 'statictis-rule',

  mixins: [globalMixins],

  components: {
    SearchBox,
    'x-table': Table
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
      total: 0,
      statisticsRules: [],
      headers: [
        {
          key: 'name',
          title: '规则名称'
        },
        {
          key: 'description',
          title: '描述'
        },
        {
          key: 'create_time',
          title: '创建时间'
        },
        {
          key: 'autor',
          title: '创建者'
        },
        {
          key: 'operation',
          title: '操作'
        }
      ]
    }
  },

  route: {
    data () {
      this.getStatisticRules()
    }
  },

  computed: {
    // 下拉选项
    tables () {
      let res = []
      this.statisticsRules.forEach((item) => {
        res.push({
          name: item.name,
          description: item.describe,
          create_time: formatDate(item.create_time),
          autor: item.creator,
          operation: '<button class="btn-link">编辑</button>',
          id: item.id
        })
      })
      return res
    }
  },

  watch: {
    products () {
      if (this.products && this.products.length) {
        this.getStatisticRules()
      }
    }
  },

  methods: {
    /**
     * 获取统计快照规则
     * @author guohao
     */
    getStatisticRules () {
      this.statisticsRules = []
      this.products.forEach((product) => {
        api.snapshot.getRules(product.id).then((res) => {
          if (res.status === 200 && res.data.list && res.data.list.length) {
            res.data.list.forEach((snap) => {
              api.snapshot.getStatisticRules(product.id, snap.id).then((res) => {
                if (res.status === 200 && res.data.list && res.data.list.length) {
                  this.statisticsRules = this.statisticsRules.concat(res.data.list)
                }
              }).catch((res) => {
                this.handleError(res)
              })
            })
          }
        }).catch((res) => {
          this.handleError(res)
        })
      })
    },
    editRule (rule) {
      this.$route.router.go({path: 'statistics-rule/edit/' + rule.id})
    }
  }
}
</script>
