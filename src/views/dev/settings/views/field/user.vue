<template>
  <div class="panel">
    <div class="panel-hd">
      <div class="filter-group fr">
        <div class="actions">
          <button class="btn btn-primary" @click="onAdd"><i class="fa fa-plus"></i> 添加用户字段</button>
        </div>
      </div>
      <h2>用户字段</h2>
    </div>

    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
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
                  <span>{{field.label}}</span>
                </td>
                <td class="tac">
                  <span>{{computedCategory(field.category) }}</span>
                </td>
                <td class="tac">
                  <span>{{dataPointType(field.value_type)}}</span>
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

            <!-- 字段key -->
            <div class="form-row row">
              <label class="form-control col-6">字段key:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入字段key'" class="input-text-wrap">
                  <input v-model="modal.name" type="text" name="modal.name" v-validate:name="{required: true}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$majorClientValidation.name.touched && $majorClientValidation.name.required">请输入字段key</span>
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
                  <span v-if="$majorClientValidation.label.touched && $majorClientValidation.label.required">请输入字段名</span>
                </div>
              </div>
            </div>

            <!-- 选择字段类型 -->
            <div class="form-row row">
              <label class="form-control col-6">数据类型:</label>
              <div class="controls filter-group-item col-18">
                <x-select :label="dataPointType(modal.value_type)">
                  <select v-model="modal.value_type">
                    <option v-for="type in 3" :value="type+1">{{dataPointType(type+1)}}</option>
                  </select>
                </x-select>
              </div>
            </div>

            <!-- 提交按钮 -->
            <div class="form-actions">
              <label v-if="modalType === 'edit'" class="del-check">
                <input type="checkbox" name="del" v-model="delChecked"/> 删除此类别
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
  import { globalMixins } from 'src/mixins'
  import api from 'src/api'
  import Select from 'components/Select'
  import Modal from 'components/Modal'
  import SearchBox from 'components/SearchBox'
  import _ from 'lodash'
  // import locales from 'consts/locales/index'

  export default {
    name: 'user',

    mixins: [globalMixins],

    // vuex: {
    //   getters: {
    //     products: ({ products }) => products.all
    //   }
    // },
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
        modal: {
          label: '',
          name: '',
          value_type: 1
        },
        modalType: '',
        userFields: {
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
      // 字段列表
      fields () {
        var result = []
        this.userFields.base_fields.forEach((item, index) => {
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
      // 浮层标题
      modalTitle () {
        return this.modalType === 'add' ? '添加用户字段' : '编辑用户字段'
      }
    },
    route: {
      data () {
        this.getData()
      }
    },
    ready () {
      // this.test()
    },
    methods: {
      test () {
        this.updateData([])
      },
      /**
      * 添加字段
      */
      addField () {
        this.editing = true
        var params = _.cloneDeep(this.fields)
        var newField = _.clone(this.modal)
        newField.sort = params.length + 1
        params.push(newField)
        this.updateData(params)
      },

      /**
      * 编辑字段
      */
      editField () {
        this.editing = true
        var params = _.cloneDeep(this.fields)
        var newField = {
          'name': this.modal.name,
          'label': this.modal.label,
          'hidden': this.modal.hidden,
          'sort': this.modal.sort,
          'value_type': this.modal.value_type
        }
        params.splice(this.modal.sort - 1, 1, newField)
        this.updateData(params)
      },

      /**
       * 删除字段
       */
      deleteField () {
        this.editing = true
        var params = _.cloneDeep(this.fields)
        params.splice(this.modal.sort - 1, 1)
        this.updateData(params)
      },

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
            'value_type': item.value_type
          }
          params.base_fields.push(field)
        })
        api.customization.setUserCustomization(params).then((res) => {
          this.onCancel()
          this.userFields = res.data || {}
        }).catch((res) => {
          this.onCancel()
          this.handleError(res)
        })
      },

      /**
       * 获取数据
       */
      getData () {
        api.customization.getUserCustomization().then((res) => {
          if (res.data.base_fields && res.data.base_fields.length) {
            this.userFields = res.data || {}
          }
        }).catch((res) => {
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
