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
              <x-select width="90px" :label="selectedProduct.label" size="small">
                <span slot="label">显示:</span>
                <select v-model="selectedProduct" name="product">
                  <option v-for="product in productOptions" :value="product">{{ product.label }}</option>
                </select>
              </x-select>
            </div>
          </div>
          <div class="filter-group fr">
            <div class="actions">
              <button class="btn btn-primary" @click="onAdd"><i class="fa fa-plus"></i> 添加用户字段</button>
            </div>
          </div>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>序号</th>
              <th>字段ID</th>
              <th>字段名</th>
              <th class="tac">类型</th>
              <th class="tac">显示</th>
              <th class="tac">排序</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="fields.length > 0">
              <tr v-for="field in fields">
                <td>
                  <span>{{field.sort}}</span>
                </td>
                <td>
                  <span>{{field.name}}</span>
                </td>
                <td>
                  <span>{{field.label}}</span>
                </td>
                <td class="tac">
                  <span>{{computedCategory(field.type)}}</span>
                </td>
                <td class="tac">
                  <span>{{!field.hidden}}</span>
                </td>
                <td class="tac">
                  <a class="hl-red" @click="onEdit(field)">编辑</a>
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
    <modal :show.sync="showModal" @close="onCancel">
      <h3 slot="header">{{modalTitle}}</h3>
      <div slot="body" class="form">
        <validator name="majorClientValidation">
          <form autocomplete="off" @submit.prevent="onSubmit" novalidate>
            <!-- 选择产品 -->
            <div class="form-row row">
              <label class="form-control col-6">选择产品:</label>
              <div class="controls filter-group-item col-18">
                <x-select :label="modal.product.name">
                  <select v-model="modal.product">
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
                  <input v-model="modal.key" type="text" name="modal.key" v-validate:key="{required: true}" lazy class="input-text"/>
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
                  <input v-model="modal.name" type="text" name="modal.name" v-validate:name="{required: true}" lazy class="input-text"/>
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
                <x-select :label="dataPointType(modal.type)">
                  <select v-model="modal.type">
                    <option v-for="type in 9" :value="type+1">{{dataPointType(type+1)}}</option>
                  </select>
                </x-select>
              </div>
            </div>

            <!-- 提交按钮 -->
            <div class="form-actions">
              <button @click.prevent.stop="onCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
              <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
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
  import Modal from 'components/Modal'
  import SearchBox from 'components/SearchBox'
  // import locales from 'consts/locales/index'
  import _ from 'lodash'

  export default {
    name: 'device',

    mixins: [globalMixins],

    vuex: {
      getters: {
        products: ({ products }) => products.all
      }
    },
    components: {
      'x-select': Select,
      SearchBox,
      Modal
    },
    data () {
      return {
        loadingData: false,
        showModal: false,
        editing: false,
        delChecked: false,
        // 已选择产品
        selectedProduct: {
          label: '全部',
          value: 0
        },
        modal: {
          product: {},
          label: '',
          name: '',
          value_type: 1
        },
        modalType: '',
        deviceFields: {
          base_fields: [
            {
              'name': 'nickname',
              'label': '昵称',
              'hidden': false,
              'sort': 1,
              'value_type': 1
            },
            {
              'name': 'gender',
              'label': '性别',
              'hidden': false,
              'sort': 2,
              'value_type': 1
            },
            {
              'name': 'age',
              'label': '年龄',
              'hidden': false,
              'sort': 3,
              'value_type': 1
            }
          ]
        }
      }
    },
    computed: {
      fields () {
        var result = []
        this.deviceFields.base_fields.forEach((item, index) => {
          var field = _.clone(item)
          field.category = 'base_field'
          result.push(field)
        })
        result.sort((a, b) => {
          return a.sort - b.sort
        })
        result.forEach((item, index) => {
          item.sort = index + 1
        })
        return result
      },
      // 下拉选项
      productOptions () {
        var result = [{
          label: '全部',
          value: 0
        }]

        this.products.forEach((item) => {
          var option = {}
          option.label = item.name
          option.value = item.id
          result.push(option)
        })

        return result
      },
      modalTitle () {
        return this.modalType === 'add' ? '添加设备字段' : '编辑设备字段'
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
      onAdd () {
        this.modalType = 'add'
        this.modal.label = ''
        this.modal.name = ''
        this.modal.hidden = false
        this.showModal = true
      },

      /**
       * 显示浮层
       */
      onEdit (field) {
        this.modalType = 'edit'
        this.modal = _.clone(field)
        this.delChecked = false
        this.showModal = true
      },

      /**
       * 提交按钮
       */
      onSubmit () {
        switch (this.modalType) {
          case 'add':
            this.addField()
            break
          case 'edit':
            if (this.delChecked) {
              this.deleteField()
            } else {
              this.editField()
            }
            break
          default:
            return
        }
      },

      /**
       * 关闭浮层
       * @return {[type]} [description]
       */
      onCancel () {
        this.editing = false
        this.showModal = false
        this.$resetValidation()
      },

      computedCategory (type) {
        var result = ''
        switch (type) {
          case 'base_field':
            result = '基本字段'
            break
          case 'base_fields':
            result = '基本字段'
            break
          default:
            result = '未知'
            break
        }
        return result
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
            result = '字符串'
            break
          case 2:
            result = '32位整形(有符号)'
            break
          case 3:
            result = '浮点'
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
