<template>
  <div class="panel">
    <div class="panel-hd">
      <h2>产品字段</h2>
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
                <select v-model="selectedProduct" name="selectedProduct">
                  <option v-for="product in products" :value="product">{{ product.name }}</option>
                </select>
              </x-select>
            </div>
          </div>
          <div class="filter-group fr">
            <div class="actions">
              <button class="btn btn-primary" @click="onAdd"><i class="fa fa-plus"></i> 添加产品字段</button>
            </div>
          </div>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>字段key</th>
              <th>字段名</th>
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
                <td>
                  <span>{{field.label}}</span>
                </td>
                <td class="tac">
                  <span>{{computedCategory(field.category)}}</span>
                </td>
                <td class="tac">
                  <span>{{dataType(field.value_type)}}</span>
                </td>
                <td class="tac">
                  <a class="hl-red" @click="onEdit(field, $index)">编辑</a>
                </td>
              </tr>
            </template>
            <tr v-if="fields.length === 0 && !loadingData">
              <td colspan="5" class="tac">
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
        <validator name="validation">
          <form autocomplete="off" @submit.prevent="onSubmit" novalidate>

            <!-- 字段key -->
            <div class="form-row row" v-if="canEdit">
              <label class="form-control col-6">字段key:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入字段key'" class="input-text-wrap">
                  <input v-model="modal.name" type="text" name="modal.name" v-validate:name="{required: true, notInArr: repeatKeys(modal.oldName), format: 'englist'}" class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.name.touched && $validation.name.required">请输入字段key</span>
                  <span v-if="$validation.name.touched && $validation.name.notInArr">字段key已存在</span>
                  <span v-if="$validation.name.touched && $validation.name.format">字段key只能包含英文</span>
                </div>
              </div>
            </div>

            <!-- 字段名 -->
            <div class="form-row row">
              <label class="form-control col-6">字段名:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入字段名'" class="input-text-wrap">
                  <input v-model="modal.label" type="text" name="modal.label" v-validate:label="{required: true}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.label.touched && $validation.label.required">请输入字段名</span>
                </div>
              </div>
            </div>

            <!-- 选择字段类型 -->
            <div class="form-row row" v-if="canEdit">
              <label class="form-control col-6">数据类型:</label>
              <div class="controls filter-group-item col-18">
                <x-select :label="dataType(modal.value_type)">
                  <select v-model="modal.value_type">
                    <option v-for="type in 3" :value="type+1">{{dataType(type+1)}}</option>
                  </select>
                </x-select>
              </div>
            </div>

            <!-- 默认值 -->
            <div class="form-row row" v-if="canEdit">
              <label class="form-control col-6">默认值:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入默认值'" class="input-text-wrap">
                  <input v-model="modal.default_value" type="text" name="modal.default_value" v-validate:default="{required: true}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.default.touched && $validation.default.required">请输入默认值</span>
                </div>
              </div>
            </div>

            <!-- 提交按钮 -->
            <div class="form-actions">
              <label v-if="modalType === 'edit' &&  canEdit" class="del-check">
                <input type="checkbox" name="del" v-model="delChecked"/> 删除此字段
              </label>
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
  import api from 'src/api'
  // import locales from 'consts/locales/index'

  export default {
    name: 'product',
    vuex: {
      getters: {
        products: ({ products }) => products.all
      }
    },
    components: {
    },
    data () {
      return {
        // 默认字段
        base_fields: [
          {
            'name': 'name',
            'label': '产品名称',
            'hidden': false,
            'sort': 1,
            'value_type': 1,
            'default_value': ''
          },
          {
            'name': 'mode',
            'label': '产品型号',
            'hidden': false,
            'sort': 2,
            'value_type': 1,
            'default_value': ''
          },
          {
            'name': 'type',
            'label': '产品类型',
            'hidden': false,
            'sort': 3,
            'value_type': 2,
            'default_value': 0
          },
          {
            'name': 'link_type',
            'label': '连接类型',
            'hidden': false,
            'sort': 4,
            'value_type': 2,
            'default_value': 0
          },
          {
            'name': 'description',
            'label': '产品描述',
            'hidden': false,
            'sort': 5,
            'value_type': 1,
            'default_value': ''
          }
        ],
        // 加载数据标志位
        loadingData: false,
        // 现实浮层
        showModal: false,
        // 正在编辑
        editing: false,
        // 删除按钮是否出现标志位
        delChecked: false,
        // 已选择产品
        selectedProduct: {},
        // 浮层
        modal: {
          label: '',
          name: '',
          value_type: 1,
          default_value: '',
          oldName: ''
        },
        // 浮层类型
        modalType: '',
        // 当前正在编辑的字段索引
        editIndex: -1,
        // 服务器返回的产品字段
        productFields: {}
      }
    },
    computed: {
      // 字段列表
      fields () {
        var result = []
        var baseFields = this.productFields.base_fields || this.base_fields
        baseFields.forEach((item, index) => {
          var field = _.clone(item)
          field.category = this.baseFieldKeys.indexOf(item.name) >= 0 ? 'base_fields' : 'custom_fields'
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

      /**
       * 当前产品
       */
      currProduct () {
        if (this.selectedProduct.name) {
          return this.selectedProduct
        } else {
          return this.products && this.products[0] || {}
        }
      },

      /**
       * 是否可以有更多编辑权限
       */
      canEdit () {
        var result = false
        var condition = [
          this.modal.category === 'custom_fields',
          this.modalType === 'add'
        ]
        result = condition[0] || condition[1]
        return result
      },

      /**
       * 基本字段key表
       */
      baseFieldKeys () {
        var result = this.base_fields.map((item) => {
          return item.name
        })
        return result || []
      },

      // 浮层标题
      modalTitle () {
        return this.modalType === 'add' ? '添加产品字段' : '编辑产品字段'
      }
    },
    watch: {
      currProduct (product) {
        if (product && product.id) {
          this.initData(product)
        }
      }
    },
    route: {
      data () {
        if (this.currProduct && this.currProduct.id) {
          this.initData(this.currProduct)
        }
      }
    },
    ready () {
    },
    methods: {
      // 测试函数 用于清空服务器上的数据
      test () {
        this.updateData([])
      },

      /**
       * 初始化数据
       */
      initData (product) {
        this.getData(product)
      },

      /**
       * 向服务器获取数据
       * @return {[type]} [description]
       */
      getData (product) {
        this.loadingData = true
        api.customization.getProductCustomization(product.id).then((res) => {
          this.productFields = res.data || {}
          this.loadingData = false
        }).catch((res) => {
          this.loadingData = false
          this.handleError(res)
        })
      },

      /**
       * 添加字段
       */
      addField () {
        if (this.$validation.invalid) return this.$validate(true)
        this.editing = true
        var params = _.cloneDeep(this.fields)
        var newField = _.clone(this.modal)
        newField.category = 'custom_fields'
        newField.sort = params.length + 1
        params.push(newField)
        this.updateData(params)
      },

      /**
       * 编辑字段
       */
      editField () {
        if (this.$validation.invalid) return this.$validate(true)
        this.editing = true
        var params = _.cloneDeep(this.fields)
        var newField = _.clone(this.modal)
        params.splice(this.editIndex, 1, newField)
        this.updateData(params)
      },

      /**
       * 删除字段
       */
      deleteField () {
        this.editing = true
        var params = _.cloneDeep(this.fields)
        params.splice(this.editIndex, 1)
        this.updateData(params)
      },

      /**
       * 更新服务器数据
       */
      updateData (fields) {
        fields.sort((a, b) => {
          return a.sort - b.sort
        })
        var params = {
          base_fields: []
        }
        fields.forEach((item, index) => {
          var field = {
            'name': item.name,
            'label': item.label,
            'hidden': item.hidden,
            'sort': index + 1,
            'value_type': item.value_type,
            'default_value': item.default_value || ''
          }
          params.base_fields.push(field)
        })
        api.customization.setProductCustomization(this.currProduct.id, params).then((res) => {
          this.onCancel()
          this.productFields = res.data || {}
        }).catch((res) => {
          this.onCancel()
          this.handleError(res)
        })
      },

      /**
       * 显示添加字段浮层
       */
      onAdd () {
        this.modalType = 'add'
        this.modal.label = ''
        this.modal.name = ''
        this.modal.default_value = ''
        this.modal.oldName = ''
        this.modal.hidden = false
        this.showModal = true
      },

      /**
       * 显示浮层
       */
      onEdit (field, index) {
        this.modalType = 'edit'
        this.modal = _.clone(field)
        this.modal.oldName = field.name
        this.editIndex = index
        this.delChecked = false
        this.showModal = true
      },

      /**
       * 返回除了某个key之外的基本字段
       */
      repeatKeys (ignore) {
        return this.baseFieldKeys.filter((item) => {
          return item !== ignore
        })
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

      /**
       * 解析类别成文字
       */
      computedCategory (type) {
        var result = ''
        switch (type) {
          case 'base_fields':
            result = '默认字段'
            break
          case 'custom_fields':
            result = '自定义字段'
            break
          default:
            result = '未知'
            break
        }
        return result
      },

      /**
       * 解析当前类型
       * @param  {[type]} type [description]
       * @return {[type]}      [description]
       */
      dataType (type) {
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
