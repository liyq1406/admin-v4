<template>
  <section>
    <div class="panel">
      <div class="panel-bd">
        <!-- 无产品时显示添加提示 -->
        <v-alert :cols="7" v-if="!products.length">
          <p>还没有产品哦，请<a v-link="{ path: '/product/create' }" class="hl-red">点击此处</a>添加</p>
        </v-alert>

        <!-- Start: 数据端点列表 -->
        <template v-else>
          <div class="action-bar">
            <v-select width="200px" placeholder="请选择产品" :label="currProduct.name">
              <span slot="label">产品：</span>
              <select v-model="currProduct" name="product" @change="getDatapoints">
                <option v-for="product in products" :value="product">{{ product.name }}</option>
              </select>
            </v-select>
          </div>
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
                        <v-switch size="small" :value.sync="datapoint.isControlable"></v-switch>
                      </span>
                    </td>
                    <td class="tac">
                      <span class="status">
                        <v-switch size="small" :value.sync="datapoint.isEnable"></v-switch>
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
        </template>
        <!-- Start: 数据端点列表 -->
      </div>
    </div>
  </section>
</template>

<script>
  import { globalMixins } from '../../mixins'
  import Alert from '../../components/Alert'
  import Select from '../../components/Select'
  import Switch from '../../components/Switch'
  import api from '../../api'

  export default {
    name: 'Devices_link',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'v-alert': Alert,
      'v-select': Select,
      'v-switch': Switch
    },

    data () {
      return {
        loadingDatapoint: false,
        datapoints: [],
        currProduct: {},
        products: []
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
            // TODO 接口完善时请删除这个遍历操作，并修改 HTML 中的的数据绑定字段
            res.data.map((item) => {
              item.isControlable = false
              item.isEnable = false
              return item
            })
            this.datapoints = res.data
            this.loadingDatapoint = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingDatapoint = false
        })
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
