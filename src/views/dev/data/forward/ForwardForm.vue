<template>
  <form autocomplete="off" novalidate>
    <div class="form">
      <div class="form-row row" v-show="type==='add'">
        <label class="form-control col-4">产品:</label>
        <div class="controls col-14">
          <x-select v-show="type==='add'" :label="selectedProduct.label" width="200px">
            <select v-model="selectedProduct">
              <option v-for="opt in productOptions" :value="opt">{{ opt.label }}</option>
            </select>
          </x-select>
          <!-- <div class="product-name">
            <span>{{selectedProduct.label}}</span>
          </div> -->
        </div>
      </div>
      <div class="form-row row">
        <label class="form-control col-4">转发规则:</label>
        <div class="controls col-14">
          <div class="checkbox-group">
            <label v-for="type in dataForwardType" class="checkbox">
              <input type="checkbox" name="data_type" v-model="model.data_type" :value="$index+1"/>{{ type }}
            </label>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <label class="form-control col-4">分发类型:</label>
        <div class="controls col-14">
          <x-select :label="dataDestination[model.destination.type-1]" width="200px">
            <select v-model="model.destination.type" name="type" number>
              <option v-for="type in dataDestination" :value="$index+1" :selected="$index===0">{{ type }}</option>
            </select>
          </x-select>
        </div>
      </div>
      <div class="form-row row">
        <label class="form-control col-4">{{ '数据分发目的地' }}:</label>
        <div class="controls col-14">
          <div v-placeholder="'请输入URL'" class="input-text-wrap">
            <input v-model="model.destination.url" type="text" name="url" required minlength="2" maxlength="250" lazy class="input-text"/>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <label class="form-control col-4">{{ 'token' }}:</label>
        <div class="controls col-14">
          <div v-placeholder="'请输入token'" class="input-text-wrap">
            <input v-model="model.destination.token" type="text" name="token" required minlength="2" maxlength="250" lazy class="input-text"/>
          </div>
        </div>
      </div>
      <div class="form-actions row">
        <div class="col-20 col-offset-4">
          <button :disabled="submitting" :class="{'disabled':submitting}" class="btn btn-primary w100" v-text="submitting ? $t('common.handling') : $t('common.ok')" @click.prevent.stop="onSubmit"></button>
        </div>
      </div>
    </div>
  </form>

</template>

<script>
import api from 'api'
import { globalMixins } from 'src/mixins'
import store from 'store'
import Select from 'components/Select'
import Pager from 'components/Pager'
import Vue from 'vue'
// import * as config from 'consts/config'
import locales from 'consts/locales/index'
import _ from 'lodash'

export default {
  name: 'SnapshotForm',

  mixins: [globalMixins],

  components: {
    'x-select': Select,
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
      loadingData: false,
      // 已选产品
      selectedProduct: {
        id: '',
        label: ''
      },
      // 转发规则
      rule: {},
      // 转发规则浮层
      model: {
        data_type: [],
        destination: {
          type: '',
          url: '',
          token: ''
        }
      },
      dataForwardType: locales[Vue.config.lang].data.DATA_FORWARD_TYPES,
      dataDestination: locales[Vue.config.lang].data.DATA_DESTINATIONS,
      // 正在提交表单
      submitting: false
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
      if (this.type === 'edit' && result.length > 1) {
        this.selectedProduct = _.find(result, (item) => {
          return item.id === this.$route.params.productId
        })
      } else {
        this.selectedProduct = result[0]
      }
      return result
    }
  },

  ready () {
    if (this.type === 'edit') {
      this.getRule()
    }
  },

  methods: {
    getRule () {
      this.loadingData = true
      let params = {
        query: {
          id: {
            $in: this.$route.params.forwardId
          }
        }
      }
      api.dataForward.getRule(this.$route.params.productId, params).then((res) => {
        if (res.status === 200) {
          let rule = res.data.list[0]
          this.model = {
            data_type: [1, 4],
            destination: {
              type: rule.destination.type,
              url: rule.destination.url,
              token: rule.destination.token
            }
          }
          this.loadingData = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },
    /**
     * 表单提交
     * @author shengzhi
     */
    onSubmit () {
      if (this.submitting) return
      this.submitting = true
      if (this.type === 'add') {
        this.add()
      } else {
        this.edit()
      }
    },

    /**
     * 添加
     */
    add () {
      api.dataForward.addRule(this.selectedProduct.id, this.model).then((res) => {
        if (res.status === 200) {
          this.submitting = false
          this.showNotice({
            type: 'success',
            content: '添加成功'
          })
          this.$route.router.go('/dev/data/forward')
        }
      }).catch((res) => {
        this.handleError(res)
        this.submitting = false
      })
    },

    /**
     * 编辑
     * @return {[type]} [description]
     */
    edit () {
      api.dataForward.updateRule(this.$route.params.productId, this.$route.params.forwardId, this.model).then((res) => {
        if (res.status === 200) {
          this.submitting = false
          this.showNotice({
            type: 'success',
            content: '编辑成功'
          })
          this.$route.router.go('/dev/data/forward')
        }
      }).catch((res) => {
        this.handleError(res)
        this.submitting = false
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
