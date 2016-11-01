<template>
  <div class="panel">
    <div class="panel-hd">
      <h2>设备字段</h2>
    </div>
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <div class="filter-bar">
          <div class="filter-group fl">
            <div class="filter-group-item">
              <x-select width="90px" :label="currProduct.name" size="small">
                <span slot="label">显示:</span>
                <select v-model="selectedProduct" name="product">
                  <option v-for="product in products" :value="product">{{ product.name }}</option>
                </select>
              </x-select>
            </div>
          </div>
          <div class="filter-group fr">
            <div class="actions">
              <button class="btn btn-primary" @click="onAddBtnClick"><i class="fa fa-plus"></i>添加用户字段</button>
            </div>
          </div>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th class="wp50">字段名</th>
              <th class="tac">字段类别</th>
              <th class="tac">字段类型</th>
              <th class="tac">操作</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="fields.length > 0">
              <tr v-for="field in fields">
                <td>
                  <span>{{field.name}}</span>
                </td>
                <td class="tac">
                  <span>{{field.category }}</span>
                </td>
                <td class="tac">
                  <span>{{field.type}}</span>
                </td>
                <td class="tac">
                  <a class="hl-red">编辑</a>
                </td>
              </tr>
            </template>
            <tr v-if="fields.length === 0 && !loadingData">
              <td colspan="4" class="tac">
                <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  // import api from 'src/api'
  import Select from 'components/Select'
  import SearchBox from 'components/SearchBox'
  // import locales from 'consts/locales/index'
  // import _ from 'lodash'

  export default {
    name: 'device',

    mixins: [globalMixins],

    vuex: {
      getters: {
        products: ({ system }) => system.products
      }
    },
    components: {
      'x-select': Select,
      SearchBox
    },
    data () {
      return {
        loadingData: false,
        currProduct: {
          name: '当前产品'
        },
        fields: [
          {
            name: '昵称', // 字段名
            type: '类型1', // 类型
            category: '类别1' // 类别
          },
          {
            name: '昵称2', // 字段名
            type: '类型2', // 类型
            category: '类别2' // 类别
          }
        ]
      }
    },
    ready () {
    },
    methods: {
      /**
       * 添加字段按钮
       */
      onAddBtnClick () {
        console.log('添加字段')
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../../../../assets/stylus/common'

</style>
