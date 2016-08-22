<template>
  <form novalidate @submit="onSubmit">
    <div class="form">
      <div class="form-row row">
        <label class="form-control col-3">产品:</label>
        <div class="controls col-21">
          <v-select :label="selectedProduct.label" width="200px">
            <select v-model="selectedProduct" @change="getDatapoints">
              <option v-for="opt in productOptions" :value="opt">{{ opt.label }}</option>
            </select>
          </v-select>
        </div>
      </div>
      <div class="form-row row">
        <label class="form-control col-3">快照规则:</label>
        <div class="controls col-21">
          <v-select :label="rule.label" width="200px">
            <select v-model="rule">
              <option v-for="opt in locales.data.SNAPSHOT_INTERVAL" :value="opt">{{ opt.label }}</option>
            </select>
          </v-select>
        </div>
      </div>
      <div class="form-row row">
        <label class="form-control col-3">快照数据:</label>
        <div class="controls col-21">
          <div class="control-text" v-if="!loadingData && !datapoints.length"><span class="hl-gray">暂无数据</span></div>
          <div class="table-wrap" v-if="!loadingData && datapoints.length">
            <div class="data-table with-loading">
              <div class="icon-loading" v-show="loadingData">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
              <table class="table table-stripe table-bordered">
                <thead>
                  <tr>
                    <th width="5%">选择</th>
                    <th widht="10%">索引</th>
                    <th width="30%">数据类型</th>
                    <th width="15%">单位符号</th>
                    <th width="40%">描述</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="dp in datapoints | limitBy countPerPage (currentPage-1)*countPerPage">
                    <td><input type="checkbox" @click="toggleSelected(dp)"/></td>
                    <td>{{dp.index}}</td>
                    <td>{{getTypeByValue(dp.type).label}}</td>
                    <td>{{dp.symbol}}</td>
                    <td>{{dp.description}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="data-points-footer">
              <pager v-if="datapoints.length > countPerPage" :total="datapoints.length" :current="currentPage" :count-per-page="countPerPage" @page-update="onPageUpdate" :simple="true"></pager>
            </div>
          </div>
        </div>
      </div>
      <div class="form-actions row">
        <div class="col-20 col-offset-3">
          <button :disabled="submiting" :class="{'disabled':submiting}" class="btn btn-primary">{{ $t('common.ok') }}</button>
        </div>
      </div>
    </div>
  </form>

</template>

<script>
import { globalMixins } from 'src/mixins'
import store from 'store'
import Select from 'components/Select'
import Pager from 'components/Pager'
import api from 'api'
import _ from 'lodash'

export default {
  name: 'SnapshotForm',

  mixins: [globalMixins],

  components: {
    'v-select': Select,
    Pager
  },

  store,

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  props: {
    type: {
      type: String,
      default: 'add'
    }
  },

  data () {
    return {
      selectedProduct: {}, // 已选产品
      rule: {}, // 快照规则
      submiting: false,
      selectedDatapoints: [],
      allDatapoints: [],
      currentPage: 1,
      countPerPage: 10,
      loadingData: false
    }
  },

  computed: {
    // 产品选项
    productOptions () {
      let result = this.products.map((item) => {
        return {
          id: item.id,
          label: item.name
        }
      })
      result.unshift({
        id: 0,
        label: '请选择产品'
      })
      this.selectedProduct = result[0]

      return result
    },

    // 数据端点
    datapoints () {
      let result = this.allDatapoints.map((item) => {
        item.selected = false
        this.selectedDatapoints.forEach((index) => {
          if (index === item.index) {
            item.selected = true
          }
        })
        return item
      })
      return result
    }
  },

  ready () {
    this.rule = this.locales.data.SNAPSHOT_INTERVAL[0]
  },

  methods: {
    /**
     * 判断数据端点是否已选
     * @author shengzhi
     * @param {Object} datapoint 目标数据端点
     */
    isSelected (datapoint) {
      let ret = false
      this.selectedDatapoints.forEach((item) => {
        if (item === datapoint.index) {
          ret = true
        }
      })
      return ret
    },

    toggleSelected (datapoint) {
      if (this.isSelected(datapoint)) {
        this.selectedDatapoints.$remove(datapoint.index)
      } else {
        this.selectedDatapoints.push(datapoint.index)
      }
    },

    /**
     * 处理翻页
     * @param  {Number} page 目标页码
     * @author shengzhi
     */
    onPageUpdate (page) {
      this.currentPage = page
    },

    /**
     * 通过值查找类型
     * @param  {Number} type 值
     * @author shengzhi
     */
    getTypeByValue (value) {
      return _.find(this.locales.data.DATAPOINT_TYPES, (o) => {
        return o.value === value
      })
    },

    /**
     * 获取数据端点
     * @author shengzhi
     */
    getDatapoints () {
      if (this.selectedProduct.id && this.selectedProduct.id === 0) {
        this.datapoints = []
      }

      this.loadingData = true
      // 获取产品数据端点列表
      api.product.getDatapoints(this.selectedProduct.id).then((res) => {
        if (res.status === 200) {
          this.allDatapoints = res.data

          // 获取产品的已选数据端点列表
          api.snapshot.getRule(this.selectedProduct.id).then((res) => {
            if (res.status === 200) {
              this.loadingData = false
              this.selectedDatapoints = res.data.datapoint || []
            }
          }).catch((res) => {
            this.loadingData = false
            this.handleError(res)
          })
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 表单提交
     * @author shengzhi
     */
    onSubmit () {
      let model = {
        rule: 3,
        interval: this.rule.value,
        storage: {
          expire: 0
        },
        datapoint: this.selectedDatapoints
      }
      api.snapshot.createRule(this.product.Id, model).then((res) => {
        if (res.status === 200) {
          console.log(res)
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'

.form
  max-width 800px
</style>
