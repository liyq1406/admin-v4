<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>数据端点</h2>
    </div>
    <div class="container">
      <div class="action-bar">
        <div slot="filter-bar" class="filter-bar">
          <div class="action-group fl">
            <button @click="addDataPoint" class="btn btn-primary"><i class="fa fa-plus"></i> {{ $t("ui.datapoint.add_datapoint") }}</button>
          </div>
          <div class="filter-group fr">
            <div class="filter-group-item">
              <search-box :key.sync="key" :placeholder="$t('common.placeholder.search')"></search-box>
            </div>
          </div>
        </div>
      </div>
      <x-table :headers="headers" :tables="tables" @tbody-edit="editDataPoint">

      </x-table>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import * as config from 'consts/config'
import api from 'api'

export default {
  name: 'ProductInfo',

  mixins: [globalMixins],

  components: {
  },

  data () {
    return {
      total: 0,
      countPerPage: config.COUNT_PER_PAGE,
      currentPage: 1,
      key: '',
      datapoints: [
        {
          index: 0,
          name: '名字',
          type: 2,
          symbol: 'symbol',
          description: 'description'
        }
      ],
      headers: [
        {
          key: 'index',
          title: '索引'
        },
        {
          key: 'name',
          title: '端点ID'
        },
        {
          key: 'type',
          title: '数据类型'
        },
        {
          key: 'symbol',
          title: '单位符号'
        },
        {
          key: 'description',
          title: '描述',
          class: 'wp40'
        },
        {
          key: 'is_write',
          title: '读写',
          class: 'tac'
        },
        {
          key: 'edit',
          title: '操作',
          class: 'tac'
        }
      ]
    }
  },

  computed: {
    /**
     * 表格内容数据
     * @return {[type]} [description]
     */
    tables () {
      var result = []
      this.datapoints.forEach((item) => {
        let datapoint = {
          id: item.id,
          index: item.index,
          name: item.name,
          type: this.dataPointType(item.type),
          symbol: item.symbol,
          description: item.description,
          'is_write': item.is_write ? '可读写' : '只读',
          edit: '<a class="hl-red">编辑</a>'
        }
        // 根据搜索框内容过滤
        let reg = new RegExp(this.key)
        let regTarget = datapoint.index + datapoint.name + datapoint.type + datapoint.symbol + datapoint.description
        if (this.key.length === 0 || reg.test(regTarget)) {
          result.push(datapoint)
        }
      })
      return result
    },
    maxIndex () {
      let temp = [-1]
      this.datapoints.forEach((item) => {
        temp.push(item.index)
      })
      return Math.max(...temp) + 1
    }
  },
  route: {
    data () {
      this.getDatapoints()
    }
  },

  methods: {
    /**
     * 获取数据端点列表
     * @return {[type]} [description]
     */
    getDatapoints () {
      this.loadingData = true
      api.product.getDatapoints(this.$route.params.id).then((res) => {
        if (res.status === 200) {
          this.datapoints = res.data
          this.loadingData = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },
    /**
     * 添加数据端点
     */
    addDataPoint () {
      this.$route.router.go(this.$route.path + '/add/' + this.maxIndex)
    },
    /**
     * 编辑数据端点
     * @param  {[type]} datapoint [description]
     * @return {[type]}           [description]
     */
    editDataPoint (datapoint) {
      this.$route.router.go(this.$route.path + '/edit/' + datapoint.id)
    },
    /**
     * 计算当前类型
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    dataPointType (type) {
      var result = ''
      switch (type) {
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
@import '../../../../assets/stylus/common'

  .container
    padding 10px
    box-sizing border-box
    .filter-bar
      padding-left 0
      padding-right 0
</style>
