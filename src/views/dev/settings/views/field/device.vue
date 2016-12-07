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
                <select v-model="selectedProduct" name="selectedProduct">
                  <option v-for="product in products" :value="product">{{ product.name }}</option>
                </select>
              </x-select>
            </div>
          </div>
          <!-- <div class="filter-group fr">
            <div class="actions">
              <button class="btn btn-primary" @click="onAdd"><i class="fa fa-plus"></i> 添加设备字段</button>
            </div>
          </div> -->
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>序号</th>
              <th>字段ID</th>
              <th>字段名</th>
              <th class="tac">类型</th>
              <th class="tac">显示</th>
              <th class="tac">操作</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="fields.length > 0">
              <tr v-for="(index, field) in fields">
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
                  <span>{{computedCategory(field.category)}}</span>
                </td>
                <td class="tac">
                  <switch :value="!field.hidden" @switch-toggle="toggleHidden(field)" size="small"></switch>
                </td>
                <td class="tac">
                  <a class="hl-red" @click="onEdit(field, index)">编辑</a>
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
      <h3 slot="header">编辑设备字段</h3>
      <div slot="body" class="form">
        <validator name="validation">
          <form autocomplete="off" @submit.prevent="onSubmit" novalidate>

            <!-- 字段ID -->
            <!-- <div class="form-row row" v-if="canEdit">
              <label class="form-control col-6">字段ID:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入字段ID'" class="input-text-wrap">
                  <input v-model="modal.name" type="text" name="modal.name" v-validate:name="{required: true, notInArr: repeatKeys(modal.oldName), format: 'english'}" class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.name.touched && $validation.name.required">请输入字段ID</span>
                  <span v-if="$validation.name.touched && $validation.name.notInArr">字段ID已存在</span>
                  <span v-if="$validation.name.touched && $validation.name.format">字段ID只能包含英文</span>
                </div>
              </div>
            </div> -->

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
            <!-- <div class="form-row row" v-if="canEdit">
              <label class="form-control col-6">数据类型:</label>
              <div class="controls filter-group-item col-18">
                <x-select :label="dataPointType(modal.value_type)">
                  <select v-model="modal.value_type">
                    <option v-for="type in 3" :value="type+1">{{dataPointType(type+1)}}</option>
                  </select>
                </x-select>
              </div>
            </div> -->

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
              <label v-if="modal.category === 'snapshot_shuffle'" class="del-check">
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
  import api from 'api'
  // import locales from 'consts/locales/index'

  export default {
    name: 'device',
    vuex: {
      getters: {
        products: ({ products }) => products.all
      }
    },
    components: {
    },
    data () {
      return {
        // 基本字段
        base_fields: [
          {
            'name': 'mac',
            'label': 'MAC地址',
            'hidden': false,
            'sort': 1
          },
          {
            'name': 'id',
            'label': '设备ID',
            'hidden': false,
            'sort': 2
          },
          {
            'name': 'is_active',
            'label': '是否激活',
            'hidden': false,
            'sort': 3
          },
          {
            'name': 'active_date',
            'label': '激活时间',
            'hidden': false,
            'sort': 4
          },
          {
            'name': 'is_online',
            'label': '是否在线',
            'hidden': false,
            'sort': 5
          },
          {
            'name': 'sn',
            'label': 'SN',
            'hidden': true,
            'sort': 6
          },
          {
            'name': 'online_count',
            'label': '累计在线时间',
            'hidden': true,
            'sort': 7
          },
          {
            'name': 'firmware_version',
            'label': '固件版本号',
            'hidden': true,
            'sort': 8
          },
          {
            'name': 'device_addr',
            'label': '设备地址',
            'hidden': true,
            'sort': 9
          }
        ],
        DEALER: [
          {
            'name': 'name',
            'label': '所属经销商',
            'hidden': true,
            'sort': 10
          }
        ],
        HEAVY_BUYER: [
          {
            'name': 'name',
            'label': '所属大客户',
            'hidden': true,
            'sort': 11
          }
        ],
        SUBSCRIBE: [
          {
            'name': 'nickname',
            'label': '用户昵称',
            'hidden': true,
            'sort': 12
          },
          {
            'name': 'phone',
            'label': '用户手机',
            'hidden': true,
            'sort': 13
          },
          {
            'name': 'email',
            'label': '用户邮箱',
            'hidden': true,
            'sort': 14
          }
        ],
        // 正在加载字段数据标志位
        loadingDataField: false,
        // 正在加载数据端点标志位
        loadingDataPoint: false,
        // 显示浮层标志位
        showModal: false,
        // 正在编辑标志位
        editing: false,
        // 显示删除按钮标志位
        delChecked: false,
        // 已选择产品
        selectedProduct: {},
        // 浮层表单对象
        modal: {
          label: '',
          name: '',
          value_type: 1
        },
        // 正在编辑的字段索引
        editIndex: -1,
        // 当前浮层类型
        modalType: '',
        // 服务器返回的设备字段
        deviceFields: {},
        // 服务器返回的数据端点
        dataPoints: []
      }
    },
    computed: {
      // 字段列表
      fields () {
        var result = []
        // 当前基本字段 接口有的话取接口的 没有的话取默认值
        var baseFields = this.base_fields
        if (this.deviceFields.base_fields && this.deviceFields.base_fields.length > 0) {
          baseFields = this.deviceFields.base_fields
        }
        baseFields.forEach((item, index) => {
          var field = _.clone(item)
          field.category = 'base_fields'
          result.push(field)
        })

        // 经销商
        var dealer = this.DEALER
        if (this.deviceFields.dealer && this.deviceFields.dealer.length > 0) {
          dealer = this.deviceFields.dealer
        }
        dealer.forEach((item, index) => {
          var field = _.clone(item)
          field.category = 'dealer'
          result.push(field)
        })

        // 大客户
        var heavyBuyer = this.HEAVY_BUYER
        if (this.deviceFields.heavy_buyer && this.deviceFields.heavy_buyer.length > 0) {
          heavyBuyer = this.deviceFields.heavy_buyer
        }
        heavyBuyer.forEach((item, index) => {
          var field = _.clone(item)
          field.category = 'heavy_buyer'
          result.push(field)
        })

        // 订阅用户
        var subscribe = this.SUBSCRIBE
        if (this.deviceFields.subscribe && this.deviceFields.subscribe.length > 0) {
          subscribe = this.deviceFields.subscribe
        }
        subscribe.forEach((item, index) => {
          var field = _.clone(item)
          field.category = 'subscribe'
          result.push(field)
        })

        // 快照规则
        var snapshotShuffle = this.deviceFields.snapshot_shuffle || []
        snapshotShuffle.forEach((item, index) => {
          var field = _.clone(item)
          field.category = 'snapshot_shuffle'
          result.push(field)
        })

        // 计算当前产品数据端点 更新页面数据端点字段
        this.dataPoints.forEach((item, index) => {
          var dataPoint = {
            'category': 'datapoints',
            'index': item.index,
            'name': item.name,
            'label': item.name,
            'hidden': true,
            'sort': result.length + index
          }
          this.deviceFields.datapoints && this.deviceFields.datapoints.forEach((item2) => {
            if (item2.index === dataPoint.index && item2.name === dataPoint.name) {
              dataPoint.label = item2.label
              dataPoint.hidden = item2.hidden
              dataPoint.sort = item2.sort
            }
          })
          result.push(dataPoint)
        })

        // 所有字段排序
        result.sort((a, b) => {
          return a.sort - b.sort
        })

        // 所有字段重新计算索引
        result.forEach((item, index) => {
          item.sort = index + 1
        })
        return result
      },

      // 基本字段key值
      defaultFieldKeys () {
        return this.base_fields.map((item) => {
          return item.name
        })
      },

      // 基本字段key值
      // baseFieldKeys () {
      //   return this.fields.map((item) => {
      //     return item.name
      //   })
      // },

      // 正在加载标志位
      loadingData () {
        return this.loadingDataPoint || this.loadingDataPoint
      },

      // 当前产品
      currProduct () {
        var result = {}
        if (this.selectedProduct.name) {
          result = this.selectedProduct
        } else {
          result = this.products && this.products[0] || {}
        }
        return result
      }

      // 浮层标题
      // modalTitle () {
      //   return this.modalType === 'add' ? '添加设备字段' : '编辑设备字段'
      // }

      // 是否显示更多编辑权限标志位
      // canEdit () {
      //   var result = false
      //   var condition = [
      //     this.modal.category === 'base_fields',
      //     this.defaultFieldKeys.indexOf(this.modal.name) === -1,
      //     this.modalType === 'add'
      //   ]
      //   result = condition[0] && condition[1] || condition[2]
      //   return result
      // }
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
      // setTimeout(() => {
      //   this.test()
      // }, 4000)
    },

    methods: {
      test () {
        this.showNotice({
          type: 'error',
          content: '清除数据'
        })
        this.updateData([])
      },
      /**
       * 初始化数据
       */
      initData (product) {
        this.getData(product)
        this.getDataPoint(product)
      },

      /**
       * 添加字段
       */
      addField () {
        if (this.$validation.invalid) return this.$validate(true)
        this.editing = true
        var params = _.cloneDeep(this.fields)
        var newField = _.clone(this.modal)
        newField.category = 'base_fields'
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
        var dSort = -1
        if (this.modal.sort < this.modal.targetIndex) dSort = dSort * -1
        newField.sort = newField.targetIndex + dSort
        params.splice(this.modal.sort - 1, 1, newField)
        this.updateData(params)
      },

      /**
       * 删除字段
       */
      deleteField () {
        this.editing = true
        var params = _.cloneDeep(this.fields)
        console.log(this.sort)
        params.splice(this.modal.sort - 1, 1)
        console.log(params)
        this.updateData(params)
      },

      /**
       * 更新服务器数据
       */
      updateData (fields) {
        fields.sort((a, b) => {
          return a.sort - b.sort
        })
        var params = {}
        fields.forEach((item, index) => {
          if (item.category === 'datapoints') {
            let field = {
              'index': item.index,
              'name': item.name,
              'label': item.label,
              'hidden': item.hidden,
              'sort': index + 1
            }
            params[item.category] = params[item.category] || []
            params[item.category].push(field)
          } else {
            let field = _.clone(item)
            field.sort = index + 1
            params[item.category] = params[item.category] || []
            params[item.category].push(field)
          }
        })
        api.custom.field.setCustomFieldConfig(this.currProduct.id, params).then((data) => {
          this.onCancel()
          this.deviceFields = data || {}
        }).catch((res) => {
          this.onCancel()
          this.handleError(res)
        })
      },

      /**
       * 向服务器获取数据
       * @return {[type]} [description]
       */
      getData (product) {
        this.loadingDataField = true
        api.custom.field.getCustomFieldConfig(product.id).then((data) => {
          this.deviceFields = data || {}
          // if (data.base_fields && data.base_fields.length) {
          // }
          this.loadingDataField = false
        }).catch((res) => {
          this.loadingDataField = false
          this.handleError(res)
        })
      },

      /**
       * 获取数据端点
       * @return {[type]} [description]
       */
      getDataPoint (product) {
        this.loadingDataPoint = true
        api.product.getDatapoints(product.id).then((res) => {
          if (res.status === 200) {
            this.dataPoints = res.data
            this.loadingDataPoint = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingDataPoint = false
        })
      },

      /**
       * 返回除了某个key之外的基本字段
       */
      // repeatKeys (ignore) {
      //   return this.baseFieldKeys.filter((item) => {
      //     return item !== ignore
      //   })
      // },

      /**
       * 显示添加字段浮层
       */
      // onAdd () {
      //   this.modalType = 'add'
      //   this.modal.oldName = ''
      //   this.modal.label = ''
      //   this.modal.name = ''
      //   this.modal.hidden = false
      //   this.showModal = true
      // },

      /**
       * 显示浮层
       */
      onEdit (field, index) {
        this.modalType = 'edit'
        var modal = _.clone(field)
        modal.oldName = field.name
        modal.targetIndex = field.sort
        this.modal = modal
        this.delChecked = false
        this.showModal = true
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
       * 提交按钮
       */
      onSubmit () {
        if (this.delChecked) {
          this.deleteField()
        } else {
          this.editField()
        }
        // switch (this.modalType) {
        //   case 'add':
        //     this.addField()
        //     break
        //   case 'edit':
        //     if (this.delChecked) {
        //       this.deleteField()
        //     } else {
        //       this.editField()
        //     }
        //     break
        //   default:
        //     return
        // }
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
       * 计算当前类型
       */
      computedCategory (type) {
        var result = ''
        var group = {
          'base_fields': '基本字段',
          'datapoints': '数据端点',
          'heavy_buyer': '大客户信息',
          'dealer': '经销商信息',
          'snapshot_shuffle': '统计规则',
          'subscribe': '订阅用户信息'
        }
        result = group[type] || '未知'
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
