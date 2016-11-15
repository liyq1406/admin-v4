<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>购买记录</h2>
    </div>
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div class="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="key" :placeholder="$t('common.placeholder.search')" :active="searching" @cancel="" @search-activate="searching=!searching"  @press-enter="">
                  <x-select width="90px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </x-select>
                  <button slot="search-button" @click="" class="btn"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
          </div>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>订单编号</th>
                <th>产品</th>
                <th>单价</th>
                <th>数量</th>
                <th>实付款</th>
                <th>购买日期</th>
                <th>订单状态</th>
                <th class="tac">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders">
                <td>{{ order.id }}</td>
                <td>
                  <div class="info-row" v-for="product in order.products">{{ product.name }}</div>
                </td>
                <td>
                  <div class="info-row" v-for="product in order.products">￥{{ product.unit_price }}</div>
                </td>
                <td>
                  <div class="info-row" v-for="product in order.products">{{ product.count }}</div>
                </td>
                <td>¥{{ sum(order.products) }}</br>[{{ order.type }}]</td>
                <td>{{ order.date }}</td>
                <td>{{ order.status }}</td>
                <td>
                  <div class="info-row"><a href="#" class="hl-red">再次购买</a></div>
                  <div class="info-row"><a href="#" class="hl-red">删除订单</a></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pagination :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getOrders"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBox from 'components/SearchBox'
import { globalMixins } from 'src/mixins'

export default {
  name: 'Orders',

  mixins: [globalMixins],

  components: {
    SearchBox
  },

  data () {
    return {
      key: '',
      searching: false,
      loadingData: false,
      queryTypeOptions: [{
        label: '产品',
        value: 'product'
      }, {
        label: '订单号',
        value: 'id'
      }],
      queryType: {
        label: '产品',
        value: 'product'
      },
      orders: [],
      total: 0,
      currentPage: 1,
      countPerPage: 10
    }
  },

  route: {
    data () {
      this.getOrders()
    }
  },

  methods: {
    /**
     * 计算订单总价
     */
    sum (products) {
      return products.reduce((prev, curr) => {
        return prev + curr.unit_price * curr.count
      }, 0)
    },

    /**
     * 获取订单列表
     */
    getOrders () {
      let orders = []
      for (var i = 0; i < 5; i++) {
        orders.push({
          id: 'X829231',
          products: [{
            name: '全自动咖啡机',
            unit_price: 15,
            count: 200
          }, {
            name: '智能旋转洗衣机',
            unit_price: 20,
            count: 123
          }, {
            name: '智能空气云炖锅',
            unit_price: 5,
            count: 50
          }],
          type: '支付宝',
          date: '2014-02-10 15:00:28',
          status: '交易成功'
        })
      }
      this.total = 5
      this.orders = orders
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/stylus/common'

.info-row
  margin 5px 0
</style>
