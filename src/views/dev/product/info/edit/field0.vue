<template>
  <div class="panel">
    <div class="panel-hd">
      <p>
        设备列表中包含以下字段，设定为“显示”字段将出现在设备列表视图中
      </p>
    </div>
    <div class="panel-bd">
      <div class="table-content data-table with-loading">
        <div class="icon-loading" v-show="loading">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <!-- <div class="filter-bar">
          123
        </div> -->
        <table class="table table-bordered">
          <thead>
            <tr>
              <th class="tac">
                序号
              </th>
              <th>
                字段ID
              </th>
              <th class="w50p">
                字段名
              </th>
              <th class="tac">
                类型
              </th>
              <th class="tac">
                显示
              </th>
              <th class="tac">
                排序
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="field in fieldList">
              <th class="tac">{{$index + 1}}</th>
              <th>{{field.name}}</th>
              <th>
                <a class="hl-red">{{field.label}}</a>
              </th>
              <th class="tac">{{translate(field.type)}}</th>
              <th class="tac">
                <switch :value="!field.hidden" @switch-toggle="toggleHidden(field)" size="small"></switch>
              </th>
              <th class="tac">
                <a class="hl-red">编辑</a>
              </th>
            </tr>
            <tr v-if="fieldList.length === 0">
              <td :colspan="6" class="tac">
                <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <modal :show.sync="showEditLabelModal">
      <h3 slot="header">编辑字段名</h3>
      <div slot="body" class="form">
        <validator name="editLabelValidation">
          <form novalidate @submit.prevent="onEditLabelSubmit">
            <div class="form-row row">
              <label class="form-control col-4">请输入字段名:</label>
              <div class="controls col-20">
                <div v-placeholder="$t('ui.product.placeholders.mode')" class="input-text-wrap">
                  <input v-model="editLabelModal.label" v-validate:label="{required: true, maxlength: 20}" type="text" name="editLabelModal.label" class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$editLabelValidation.label.touched && $editLabelValidation.label.required">请输入字段名</span>
                  <span v-if="$editLabelValidation.label.modified && $editLabelValidation.label.maxlength">字段名不能超过20个字符</span>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
              <button @click.prevent.stop="showDeviceEditModal = false" class="btn btn-default">{{ $t("common.cancel") }}</button>
            </div>
          </form>
        </validator>
      </div>
    </modal>
  </div>
</template>

<script>
import api from 'api'
// import * as config from 'consts/config'
import Select from 'components/Select'
import Switch from 'components/Switch'
import Modal from 'components/Modal'
// import _ from 'lodash'
// import { globalMixins } from 'src/mixins'

export default {
  name: 'field',

  // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
  // mixins: [globalMixins, productSummaryMixin, setCurrProductMixin],

  components: {
    'x-select': Select,
    Switch,
    Modal
  },

  data () {
    return {
      base_fileds: [
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
          'sort': 1
        },
        {
          'name': 'is_active',
          'label': '是否激活',
          'hidden': false,
          'sort': 1
        },
        {
          'name': 'is_online',
          'label': '激活时间',
          'hidden': false,
          'sort': 1
        },
        {
          'name': 'is_online',
          'label': '是否在线',
          'hidden': false,
          'sort': 1
        },
        {
          'name': 'sn',
          'label': 'SN',
          'hidden': true,
          'sort': 1
        },
        {
          'name': 'online_count',
          'label': '累计在线时间',
          'hidden': true,
          'sort': 1
        },
        {
          'name': 'firmware_version',
          'label': '固件版本号',
          'hidden': true,
          'sort': 1
        }
      ],
      // 服务器返回的数据
      dataList: {},
      // 数据端点
      datapoints: false, // 接口返回前是false  接口返回后是数组
      // 用于显示列表的数据
      fieldList: [],
      // 正在加载标志位
      loadingDataPoint: true,
      loadingDataField: true,

      showEditLabelModal: false,

      editLabelModal: {
        label: ''
      },
      showEditSortModal: false,

      editing: false
    }
  },
  // vuex: {
  //   getters: {
  //     products: ({ products }) => products.all
  //   }
  // },

  computed: {
    loading () {
      return this.loadingDataPoint || this.loadingDataField
    }
  },

  watch: {
    dataList () {
      this.init()
    },
    datapoints () {
      this.init()
    }
  },
  route: {
    data () {
      this.getData()
      this.getDataPoint()
    }
  },
  ready () {
  },

  methods: {
    /**
     * 获取数据端点
     * @return {[type]} [description]
     */
    getDataPoint () {
      console.log('获取数据端点')
      this.loadingDataPoint = true
      api.product.getDatapoints(this.$route.params.id).then((res) => {
        if (res.status === 200) {
          this.datapoints = res.data
          this.loadingDataPoint = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingDataPoint = false
      })
    },
    /**
     * 编辑字段名表单提交
     * @return {[type]} [description]
     */
    onEditLabelSubmit () {
      console.log('编辑字段名表单提交')
    },
    /**
     * 是否显示按钮切换事件
     * @param  {[type]} field [description]
     * @return {[type]}       [description]
     */
    toggleHidden (field) {
      field.hidden = !field.hidden
      // console.log('这里要发请求出去设置隐藏与否')
      // console.log(this.sortDataList())
      this.setFiled()
    },
    setFiled () {
      this.loadingDataField = true
      api.product.getProductField(this.$route.params.id, this.sortDataList()).then((res) => {
        this.dataList = res.data
        this.loadingDataField = false
      }).catch((res) => {
        this.loadingDataField = false
        this.handleError(res)
      })
    },
    /**
     * 将当前数据重算位置 返回可以发给服务器的数据
     * @return {[type]} [description]
     */
    sortDataList (fieldList) {
      fieldList = fieldList || this.fieldList
      let result = {}
      result.base_fileds = []
      result.datapoints = []
      fieldList.forEach((item, index) => {
        let obj = {
          'name': item.name,
          'label': item.label,
          'hidden': item.hidden,
          'sort': index + 1
        }
        result[item.type].push(obj)
      })
      return result
    },
    /**
     * 向服务器获取数据
     * @return {[type]} [description]
     */
    getData () {
      this.loadingDataField = true
      api.product.getProductField(this.$route.params.id).then((res) => {
        this.dataList = res.data || {}
        this.loadingDataField = false
      }).catch((res) => {
        this.loadingDataField = false
        this.handleError(res)
      })
      // setTimeout(() => {
      //   this.dataList = {
      //     'base_fileds': [
      //       {
      //         'name': '111',
      //         'label': '222',
      //         'hidden': true,
      //         'sort': 1
      //       },
      //       {
      //         'name': '111',
      //         'label': '222',
      //         'hidden': false,
      //         'sort': 2
      //       }
      //     ],
      //     'datapoints': [
      //       {
      //         'index': 0,
      //         'name': '222',
      //         'label': '333',
      //         'hidden': true,
      //         'sort': 0
      //       },
      //       {
      //         'index': 0,
      //         'name': '222',
      //         'label': '333',
      //         'hidden': false,
      //         'sort': 3
      //       }
      //     ]
      //   }
      //   this.loading = false
      // }, 1000)
    },
    /**
     * 初始化 将服务器返回的数据合并成一个数据用于渲染页面
     * @return {[type]} [description]
     */
    init () {
      if (this.loading) {
        return
      }
      var result = []
      var needResetData = false
      if (!this.dataList.base_fileds) {
        needResetData = true
        this.dataList.base_fileds = this.base_fileds
      }
      this.dataList.base_fileds.forEach((item) => {
        item.show = !item.hidden
        item.type = 'base_fileds'
      })
      if (!this.dataList.datapoints) {
        needResetData = true
        this.dataList.datapoints = this.datapoints
      }
      this.dataList.datapoints = this.dataList.datapoints || this.datapoints || []
      let datapoints = this.dataList.datapoints.map((item) => {
        let obj = {}
        obj.name = item.name
        obj.label = item.label || item.name
        obj.hidden = item.hidden === false ? item.hidden : true
        obj.sort = item.sort || 2
        obj.show = !item.hidden
        obj.type = 'datapoints'
        return obj
      })
      result = this.dataList.base_fileds.concat(datapoints)
      result.sort((a, b) => {
        a.sort - b.sort
      })
      this.fieldList = result
      if (needResetData) {
        // this.setFiled()
      }
    },
    /**
     * 计算当前的类型 返回中文文本
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    translate (type) {
      return type === 'base_fileds' ? '基本字段' : '数据端点'
    }
  }
}
</script>

<style lang="stylus" scoped>

  .statistic-group
    border-top 1px solid default-border-color
  .w50p
    width 50%
</style>
