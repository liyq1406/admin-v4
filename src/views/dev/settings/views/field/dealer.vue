<template>
  <div class="panel">
    <div class="panel-hd">
      <h2>用户字段</h2>
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
              <button class="btn btn-primary" @click="onAddBtnClick"><i class="fa fa-plus"></i> 添加用户字段</button>
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
    <!-- 添加字段浮层 -->
    <modal :show.sync="showAddModal" @close="onAddCancel">
      <h3 slot="header">新增用户字段</h3>
      <div slot="body" class="form">
        <validator name="majorClientValidation">
          <form autocomplete="off" @submit.prevent="addField" novalidate>
            <!-- 选择产品 -->
            <div class="form-row row">
              <label class="form-control col-6">选择产品:</label>
              <div class="controls filter-group-item col-18">
                <x-select :label="addModal.product.name">
                  <select v-model="addModal.product">
                    <option v-for="product in products" :value="product">{{product.name}}</option>
                  </select>
                </x-select>
              </div>
            </div>

            <!-- 字段key -->
            <div class="form-row row">
              <label class="form-control col-6">字段key:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入字段key'" class="input-text-wrap">
                  <input v-model="addModal.key" type="text" name="addModal.key" v-validate:key="{required: true}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$majorClientValidation.key.touched && $majorClientValidation.key.required">请输入字段key</span>
                </div>
              </div>
            </div>

            <!-- 字段名 -->
            <div class="form-row row">
              <label class="form-control col-6">字段名:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入字段名'" class="input-text-wrap">
                  <input v-model="addModal.name" type="text" name="addModal.name" v-validate:name="{required: true}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$majorClientValidation.name.touched && $majorClientValidation.name.required">请输入字段名</span>
                </div>
              </div>
            </div>

            <!-- 选择字段类型 -->
            <div class="form-row row">
              <label class="form-control col-6">数据类型:</label>
              <div class="controls filter-group-item col-18">
                <x-select :label="dataPointType(addModal.type)">
                  <select v-model="addModal.type">
                    <option v-for="type in 9" :value="type+1">{{dataPointType(type+1)}}</option>
                  </select>
                </x-select>
              </div>
            </div>

            <!-- 提交按钮 -->
            <div class="form-actions">
              <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
              <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </validator>
      </div>
    </modal>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  // import api from 'src/api'
  import Select from 'components/Select'
  import SearchBox from 'components/SearchBox'
  // import locales from 'consts/locales/index'

  export default {
    name: 'user',

    mixins: [globalMixins],

    vuex: {
      getters: {
        products: ({ products }) => products.all
      }
    },
    components: {
      'x-select': Select,
      SearchBox
    },

    data () {
      return {
        loadingData: false,
        showAddModal: false,
        adding: false,
        // 已选择产品
        selectedProduct: {},
        addModal: {
          product: '',
          key: '',
          name: '',
          type: 1
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
    computed: {
      // 当前产品
      currProduct () {
        var result = {}
        if (this.selectedProduct.name) {
          result = this.selectedProduct
        } else {
          result = this.products && this.products[0]
        }
        return result || {}
      }
    },
    route: {
      data () {
      }
    },
    ready () {
    },
    methods: {
      /**
       * 显示添加字段浮层
       */
      onAddBtnClick () {
        console.log('添加字段')
        this.addModal.product = this.currProduct
        this.showAddModal = true
      },

      /**
       * 新增字段
       */
      addField () {

      },
      /**
       * 关闭添加大客户浮层
       * @return {[type]} [description]
       */
      onAddCancel () {
        this.adding = false
        this.showAddModal = false
        this.$resetValidation()
      },
      /**
       * 计算当前类型
       * @param  {[type]} type [description]
       * @return {[type]}      [description]
       */
      dataPointType (type) {
        var result = ''
        switch (type - 0) {
          case 1:
            result = '布尔类型'
            break
          case 2:
            result = '单字节(无符号)'
            break
          case 3:
            result = '16位短整型（有符号）'
            break
          case 4:
            result = '32位整型（有符号）'
            break
          case 5:
            result = '浮点'
            break
          case 6:
            result = '字符串'
            break
          case 7:
            result = '字节数组'
            break
          case 8:
            result = '16位短整型（无符号）'
            break
          case 9:
            result = '32位整型（无符号）'
            break
          default:
            result = '未知'
            break
        }
        return result
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../../../../assets/stylus/common'

</style>
