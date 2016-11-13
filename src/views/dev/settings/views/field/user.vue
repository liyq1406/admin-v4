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

        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>序号</th>
              <th class="wp50">字段名</th>
              <th class="tac">字段类别</th>
              <th class="tac">字段类型</th>
              <th class="tac">显示</th>
              <th class="tac">操作</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="fields.length > 0">
              <tr v-for="field in fields">
                <td>
                  <span>{{field.sort}}</span>
                </td>
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
                  <switch :value="!field.hidden" @switch-toggle="toggleHidden(field)" size="small"></switch>
                </td>
                <td class="tac">
                  <a class="hl-red" @click="onEdit(field)">编辑</a>
                </td>
              </tr>
            </template>
            <tr v-if="fields.length === 0 && !loadingData">
              <td colspan="6" class="tac">
                <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 添加字段浮层 -->
    <modal :show.sync="showModal" @close="onCancel">
      <h3 slot="header">编辑用户字段</h3>
      <div slot="body" class="form">
        <validator name="majorClientValidation">
          <form autocomplete="off" @submit.prevent="onSubmit" novalidate>

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

            <div class="form-row row">
              <label class="form-control col-6">编辑序号:</label>
              <div class="controls col-18">
                <x-select :label="modal.targetIndex + ''">
                  <select v-model="modal.targetIndex">
                    <option v-for="n in fields.length" :value="n + 1">{{ n + 1 }}</option>
                  </select>
                </x-select>
              </div>
            </div>

            <!-- 提交按钮 -->
            <div class="form-actions">
              <!-- <label v-if="modalType === 'edit'" class="del-check">
                <input type="checkbox" name="del" v-model="delChecked"/> 删除此字段
              </label> -->
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
  import SearchBox from 'components/SearchBox'
  import Switch from 'components/Switch'
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
      Switch
    },

    data () {
      return {
        base_fields: [
          {
            'name': 'id',
            'label': 'ID',
            'hidden': false,
            'sort': 1,
            'value_type': 2
          },
          {
            'name': 'nickname',
            'label': '昵称',
            'hidden': false,
            'sort': 2,
            'value_type': 1
          },
          {
            'name': 'email',
            'label': '邮箱',
            'hidden': false,
            'sort': 3,
            'value_type': 1
          },
          {
            'name': 'phone',
            'label': '手机',
            'hidden': false,
            'sort': 4,
            'value_type': 1
          },
          {
            'name': 'create_date',
            'label': '注册时间',
            'hidden': false,
            'sort': 5,
            'value_type': 1
          },
          {
            'name': 'source',
            'label': '来源',
            'hidden': false,
            'sort': 6,
            'value_type': 2
          },
          // {
          //   'name': 'is_activated',
          //   'label': '激活状态',
          //   'hidden': false,
          //   'sort': 3,
          //   'value_type': 2
          // },
          {
            'name': 'status',
            'label': '在线状态',
            'hidden': false,
            'sort': 7,
            'value_type': 1
          }
        ],
        loadingData: false,
        showModal: false,
        editing: false,
        modal: {
          label: '',
          name: '',
          value_type: 1,
          targetIndex: -1
        },
        userFields: {}
      }
    },
    computed: {
      // 字段列表
      fields () {
        var result = []
        var userFields = this.base_fields
        if (this.userFields.base_fields && this.userFields.base_fields.length) {
          userFields = this.userFields.base_fields
        }
        userFields.forEach((item, index) => {
          var field = _.clone(item)
          field.category = 'base_fields'
          result.push(field)
        })
        result.sort((a, b) => {
          return a.sort - b.sort
        })
        result.forEach((item, index) => {
          item.sort = index + 1
        })
        return result
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
       * 是否显示按钮切换事件
       * @param  {[type]} field [description]
       * @return {[type]}       [description]
       */
      toggleHidden (field) {
        field.hidden = !field.hidden
        this.updateData(this.fields)
        // this.setFiled()
      },

      /**
      * 编辑字段
      */
      editField () {
        this.editing = true
        var params = _.cloneDeep(this.fields)
        var dSort = -0.1
        if (this.modal.sort < this.modal.targetIndex) dSort = dSort * -1
        var newField = {
          'name': this.modal.name,
          'label': this.modal.label,
          'hidden': this.modal.hidden,
          'sort': this.modal.targetIndex + dSort,
          'value_type': this.modal.value_type
        }
        params.splice(this.modal.sort - 1, 1, newField)
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
       * 显示浮层
       */
      onEdit (field) {
        var modal = _.clone(field)
        modal.targetIndex = field.sort
        this.modal = modal
        this.showModal = true
      },

      /**
       * 提交按钮
       */
      onSubmit () {
        this.editField()
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
