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
      // 服务器返回的数据
      dataList: {},
      // 用于显示列表的数据
      fieldList: [],
      // 正在加载标志位
      loading: false,

      showEditLabelModal: false,

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
  },

  watch: {
    dataList () {
      this.init()
    }
  },
  route: {
    data () {
      this.getData()
    }
  },
  ready () {
  },

  methods: {
    /**
     * 是否显示按钮切换事件
     * @param  {[type]} field [description]
     * @return {[type]}       [description]
     */
    toggleHidden (field) {
      field.hidden = !field.hidden
      // console.log('这里要发请求出去设置隐藏与否')
      // console.log(this.sortDataList())
      this.loading = true
      api.product.getProductField(this.$route.params.id, this.sortDataList()).then((res) => {
        this.dataList = res.data
        this.loading = false
      }).catch((res) => {
        this.loading = false
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
      this.loading = true
      api.product.getProductField(this.$route.params.id).then((res) => {
        console.log(res)
        this.dataList = res.data
        this.loading = false
      }).catch((res) => {
        this.loading = false
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
      var result = []
      if (!this.dataList.base_fileds || !this.dataList.datapoints) {
        return
      }
      this.dataList.base_fileds.forEach((item) => {
        item.show = !item.hidden
        item.type = 'base_fileds'
      })
      this.dataList.datapoints.forEach((item) => {
        item.show = !item.hidden
        item.type = 'datapoints'
      })
      result = this.dataList.base_fileds.concat(this.dataList.datapoints)
      result.sort((a, b) => {
        a.sort - b.sort
      })
      this.fieldList = result
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
