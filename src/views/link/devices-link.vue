<template>
  <section>
    <div class="panel">
      <div class="panel-hd">
        <div class="selectProduct">
          <a style="position:absolute;width:220px;top:15px" v-show="tips" v-link="{ path: '/product/create' }" class="nontip">没有产品，点击此处跳转添加页面</a>
          <v-select v-else width="200px" placeholder="请选择产品" :label="currProduct.name">
            <span slot="label">请选择产品：</span>
            <select v-model="currProduct" name="product" @change="Productstatus">
              <option v-for="product in products" :value="product">{{ product.name }}</option>
            </select>
          </v-select>
        </div>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingDatapoints">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>数据端点ID</th>
                <th>参数名称</th>
                <th>修改时间</th>
                <th class="tac">是否可控</th>
                <th class="tac">开启联动</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="datapoints.length > 0">
                <tr v-for="datapoint in datapoints">
                  <td>{{ datapoint.id }}</td>
                  <td>{{ datapoint.name }}</td>
                  <td>{{ datapoint.create_date | formatDate }}</td>
                  <td class="tac">
                    <span class="status">
                      <v-switch size="small" :value.sync="iscontrol"></v-switch>
                    </span>
                  </td>
                  <td class="tac">
                    <span class="status">
                      <v-switch size="small" :value.sync="islink"></v-switch>
                    </span>
                  </td>
                </tr>
              </template>
              <tr v-if="datapoints.length === 0 && !loadingDatapoints">
                <td colspan="5" class="tac">
                  <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import { globalMixins } from '../../mixins'
  import Select from '../../components/Select'
  import Switch from '../../components/Switch'
  import api from '../../api'

  export default {
    name: 'Devices_link',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'v-select': Select,
      'v-switch': Switch
    },

    data () {
      return {
        loadingDatapoint: false,
        datapoints: [],
        currProduct: {},
        products: [],
        iscontrol: false,
        islink: false
      }
    },

    route: {
      data () {
        this.getProducts()
      }
    },

    methods: {
      // 获取产品列表
      getProducts () {
        api.product.all().then((res) => {
          this.products = res.data
          this.currProduct = this.products[0]
          if (this.products.length === 0) {
            this.tips = true
            return
          }
          this.getDatapoints()
        }).catch((res) => {
          this.handleError(res)
        })
      },
      // 获取数据端点
      getDatapoints () {
        this.loadingDatapoint = true
        api.product.getDatapoints(this.currProduct.id).then((res) => {
          if (res.status === 200) {
            this.datapoints = res.data
            this.loadingDatapoint = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingDatapoint = false
        })
      },
      // 更改应用后获取列表与状态
      Productstatus () {
        this.getDatapoints()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../assets/stylus/common'
 .selectProduct
   float left
   margin 10px 0
</style>
