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
                <a class="hl-red" @click="onShowEditLabelModal(field, $index)">{{field.label}}</a>
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
              <label class="form-control col-5">请输入字段名:</label>
              <div class="controls col-19">
                <div v-placeholder="$t('ui.product.placeholders.mode')" class="input-text-wrap">
                  <input v-model="editLabelModal.label" v-validate:label="{required: true, maxlength: 20}" type="text" name="editLabelModal.label" class="input-text"/>
                </div>
                <div class="form-tips" :class="{'form-tips-error': $editLabelValidation.label.touched && $editLabelValidation.label.required || $editLabelValidation.label.modified && $editLabelValidation.label.maxlength}">
                  <span>注：字段名不能为空，且不超过20个字符</span>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
              <button @click.prevent.stop="onCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
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
import _ from 'lodash'
import { globalMixins } from 'src/mixins'

export default {
  name: 'field',

  mixins: [globalMixins],

  components: {
    'x-select': Select,
    Switch,
    Modal
  },

  data () {
    return {
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
          'name': 'is_online',
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
        label: '',
        index: 0
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
     * 浮层的取消按钮
     * @return {[type]} [description]
     */
    onCancel () {
      this.showEditLabelModal = false
      this.showEditSortModal = false
      this.$resetValidation()
    },
    /**
     * 显示编辑字段名浮层
     * @param  {[type]} field [description]
     * @return {[type]}       [description]
     */
    onShowEditLabelModal (field, index) {
      this.showEditLabelModal = true
      this.editLabelModal.label = field.label
      this.editLabelModal.index = index
    },
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
      let fieldList = _.clone(this.fieldList)
      fieldList[this.editLabelModal.index].label = this.editLabelModal.label
      this.setFiled(fieldList)
    },
    /**
     * 是否显示按钮切换事件
     * @param  {[type]} field [description]
     * @return {[type]}       [description]
     */
    toggleHidden (field) {
      field.hidden = !field.hidden
      this.setFiled()
    },
    setFiled (fieldList) {
      this.loadingDataField = true
      console.log('调用设置接口')
      console.log(this.sortDataList(fieldList))
      api.product.setProductField(this.$route.params.id, this.sortDataList(fieldList)).then((res) => {
        this.onCancel()
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
      result.base_fields = []
      result.datapoints = []
      fieldList.forEach((item, index) => {
        let obj = {
          'name': item.name,
          'label': item.label,
          'hidden': item.hidden,
          'sort': index + 1
        }
        if (item.type === 'datapoints') {
          console.log(item.index)
          obj.index = item.index
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
    },
    /**
     * 初始化 将服务器返回的数据合并成一个数据用于渲染页面
     * @return {[type]} [description]
     */
    init () {
      // 判断数据是否加载完成 如果正在loading则return
      if (this.loading) {
        return
      }
      // 存放最终的计算结果
      var result = []
      // 是否需要向后端重置数据的标志位 弱下方执行完成之后标志位为true 就会去向服务器发请求重置当前的字段列表
      var needResetData = false
      // 判断服务器时候有返回基本字段信息
      if (!this.dataList.base_fields) {
        // 若没有返回基本字段信息 则将标志位设置为true
        needResetData = true
        // 读取默认的基本字段信息 默认前五个显示 三个隐藏 一共八个 具体看data()里面的定义
        this.dataList.base_fields = this.base_fields
      }
      // 初始化基本字段信息 给基本字段加上是否显示字段 加上类型字段
      this.dataList.base_fields.forEach((item) => {
        item.show = !item.hidden
        item.type = 'base_fields'
      })
      // 判断服务器有无返回数据端点
      if (!this.dataList.datapoints) {
        // 弱无返回数据端点 将标志位变为true
        needResetData = true
        // 用获取数据端点接口返回的数据端点作为当前数据端点的默认值
        this.dataList.datapoints = this.datapoints
      }
      // 如果当前标志位仍然为false
      if (!needResetData) {
        if (this.dataList.datapoints.length === this.datapoints.length) {
          var dArray = this.dArray(this.dataList.datapoints, this.datapoints, 'name')
          if (dArray.length) {
            needResetData = true
          }
        } else {
          needResetData = true
        }
      }
      // 初始化数据端点 用获取数据端点接口返回的数据端点去初始化当前的每个类型为数据端点的产品字段
      let datapoints = []
      this.datapoints.forEach((item1) => {
        let hasPoints = false
        this.dataList.datapoints.forEach((item2) => {
          if (item1.name === item2.name) {
            hasPoints = true
            let obj = {}
            obj.name = item2.name
            obj.label = item2.label
            obj.hidden = item2.hidden || false
            obj.sort = item2.sort
            obj.show = !obj.hidden
            obj.type = 'datapoints'
            obj.index = item2.index
            datapoints.push(obj)
          }
        })
        if (!hasPoints) {
          let obj = {}
          obj.name = item1.name
          obj.label = item1.name
          obj.hidden = true
          obj.sort = item1.index + 9
          obj.show = !obj.hidden
          obj.type = 'datapoints'
          obj.index = item1.index
          datapoints.push(obj)
        }
      })

      // 将基本字段数组和数据端点数组合并成一个
      result = this.dataList.base_fields.concat(datapoints)
      // 用sort字段去排序
      result.sort((a, b) => {
        return a.sort - b.sort
      })
      this.fieldList = result
      // 判断标志位needResetData 如果为true  则向服务器发请求重置字段列表
      if (needResetData) {
        this.setFiled()
      }
    },
    /**
     * 计算当前的类型 返回中文文本
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    translate (type) {
      return type === 'base_fields' ? '基本字段' : '数据端点'
    },

    dArray (arr1, arr2, key) {
      var result1 = _.differenceBy(arr1, arr2, key)
      var result2 = _.differenceBy(arr2, arr1, key)
      return result1.concat(result2)
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
