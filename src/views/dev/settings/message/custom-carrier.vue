<template>
  <div class="main">
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <a class="btn btn-primary" v-link="{path: '/dev/settings/message/add'}"><i class="fa fa-plus"></i>添加运营商</a>
          </div>
        </div>
        <div class="data-table">
          <!-- <div class="filter-bar">
            <div class="filter-group">
              <x-select :label="selectedProduct.label" width="160px" size="small">
                <span slot="label">显示</span>
                <select v-model="selectedProduct" @change="onProductSelect">
                  <option v-for="opt in productOptions" :value="opt">{{ opt.label }}</option>
                </select>
              </x-select>
            </div>
          </div> -->
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>序号</th>
                <th>名称</th>
                <th class="wp20">描述</th>
                <th class="wp20">类型</th>
                <th class="wp20">区号</th>
                <th class="wp20">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="operator in operators">
                <td>
                  {{$index + 1}}</td>
                <td>{{operator.name}}</td>
                <td>{{operator.desc}}</td>
                <td>
                  <span v-if="operator.type===1">阿里大于</span>
                  <span v-if="operator.type===2">twilio</span>
                </td>
                <td>{{operator.area_code}}</td>
                <td>
                  <a class="hl-red ml10" v-link="{path: '/dev/settings/message/edit/' + operator.account_id}">编辑</a>
                </td>
              </tr>
              <tr v-if="operators.length === 0">
                <td :colspan="6" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" :simple="true"></pager>
      </div>
    </div>
  </div>
</template>

<script>
import * as config from 'consts/config'
import Pager from 'components/Pager'
import Select from 'components/Select'
import { globalMixins } from 'src/mixins'
import api from 'api'

export default {
  name: 'Snapshots',

  mixins: [globalMixins],

  components: {
    'pager': Pager,
    'x-select': Select
  },

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  data () {
    return {
      operators: [
        // {
        //   account_id: 12345,
        //   name: '名称一',
        //   desc: '这是买哦书',
        //   area_code: '+86',
        //   type: 1
        // }
      ],
      countPerPage: config.COUNT_PER_PAGE,
      currentPage: 1,
      total: 0
    }
  },

  route: {
    data () {
      this.getList()
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
    // 查询条件
    queryCondition () {
      let condition = {
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage
      }
      return condition
    }
  },

  watch: {
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
     * 获取列表
     */
    getList () {
      this.loadingData = true
      // 获取产品数据端点列表
      // var params = {
      //   offset: 0,
      //   limit: 10
      // }
      api.message.getList(this.queryCondition).then((res) => {
        if (res.status === 200) {
          this.loadingData = false
          this.currentPage = 1
          this.operators = res.data.carrier
        }
      }).catch((res) => {
        this.loadingData = false
        this.handleError(res)
      })
    }
  }
}
</script>
