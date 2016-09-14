<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>互联设置</h2>
    </div>
    <div class="panel mt20">
      <div class="panel-bd">
        <!-- 无产品时显示添加提示 -->
        <x-alert v-if="!products.length && !loadingProducts && !loadingDatapoints" :cols="7">
          <p>还没有产品哦，请<a v-link="{ path: '/dev/products/create/guide' }" class="hl-red">点击此处</a>添加</p>
        </x-alert>

        <!-- Start: 数据端点列表 -->
        <template v-if="products.length && !loadingProducts">
          <div class="data-table with-loading">
            <div class="filter-bar">
              <div class="filter-group">
                <x-select width="160px" placeholder="请选择产品" size="small" :label="currProduct.name">
                  <span slot="label">产品：</span>
                  <select v-model="currProduct" name="product" @change="getDatapoints">
                    <option v-for="product in products" :value="product">{{ product.name }}</option>
                  </select>
                </x-select>
              </div>
            </div>
            <div class="icon-loading" v-show="loadingDatapoints">
              <i class="fa fa-refresh fa-spin"></i>
            </div>
            <table class="table table-stripe table-bordered">
              <thead>
                <tr>
                  <th width="10%">索引</th>
                  <th width="25%">端点ID</th>
                  <th>描述</th>
                  <!-- <th>修改时间</th> -->
                  <th width="15%" class="tac">是否可控</th>
                  <th width="15%" class="tac">开启联动</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="datapoints.length > 0">
                  <tr v-for="datapoint in datapoints">
                    <td>{{ datapoint.index }}</td>
                    <td>{{ datapoint.name }}</td>
                    <td>{{ datapoint.description }}</td>
                    <!-- <td>{{ datapoint.create_date | formatDate }}</td> -->
                    <td class="tac">
                      <span class="status">
                        <x-switch size="small" :value.sync="datapoint.isControlable"></x-switch>
                      </span>
                    </td>
                    <td class="tac">
                      <span class="status">
                        <x-switch size="small" :value.sync="datapoint.isEnable"></x-switch>
                      </span>
                    </td>
                  </tr>
                </template>
                <tr v-if="datapoints.length === 0">
                  <td colspan="5" class="tac">
                    <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <!-- Start: 数据端点列表 -->
      </div>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import Alert from 'components/Alert'
  import Select from 'components/Select'
  import Switch from 'components/Switch'
  import api from 'api'

  export default {
    name: 'Settings',

    mixins: [globalMixins],

    components: {
      'x-alert': Alert,
      'x-select': Select,
      'x-switch': Switch
    },

    data () {
      return {
        loadingProducts: false,
        loadingDatapoints: false,
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
      /**
       * 获取产品列表
       * @author shengzhi
       */
      getProducts () {
        this.loadingProducts = true
        api.product.all().then((res) => {
          this.loadingProducts = false
          if (res.data.length > 0) {
            this.products = res.data
            this.currProduct = this.products[0]
            this.getDatapoints()
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingProducts = false
        })
      },

      /**
       * 获取数据端点
       * @author shengzhi
       */
      getDatapoints () {
        this.loadingDatapoints = true
        api.product.getDatapoints(this.currProduct.id).then((res) => {
          if (res.status === 200) {
            // TODO 接口完善时请删除这个遍历操作，并修改 HTML 中的的数据绑定字段 #shengzhi
            res.data.map((item) => {
              item.isControlable = false
              item.isEnable = false
              return item
            })
            this.datapoints = res.data
            this.loadingDatapoints = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingDatapoints = false
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../assets/stylus/common'
 .selectProduct
   float left
   margin 10px 0
</style>
