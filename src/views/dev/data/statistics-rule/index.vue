<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>统计规则</h2>
    </div>
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <a class="btn btn-primary" v-link="{path: '/dev/data/snapshot/create'}"><i class="fa fa-plus"></i>添加统计规则</a>
          </div>
        </div>
        <x-table :headers="headers" :tables="tables" @tbody-edit="editDataPoint">
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
import proxy from './restful-proxy'

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
          key: 'status',
          title: '状态'
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
      return []
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
      this.products.forEach((product) => {
        proxy.getStatisticRules(product.id).then((res) => {
          console.log(res)
        }).catch((res) => {
          this.handleError(res)
        })
      })
    }
  }
}
</script>
