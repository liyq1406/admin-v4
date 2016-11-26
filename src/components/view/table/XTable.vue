<template>
  <div class="intelligent-table-box">
    <div class="table-content data-table with-loading" v-show="headers.length > 0">
      <div class="icon-loading" v-show="loading">
        <i class="fa fa-refresh fa-spin"></i>
      </div>
      <slot name="filter-bar"></slot>
      <table class="table" :class="{'table-bordered':bordered}">
        <thead>
          <tr>
            <th v-show="selecting" class="tac w20">
              <input type="checkbox" v-model="selectedAll" @change="selectAllEvent($event)">
            </th>
            <th v-for="(index, tHeader) in headers" class="theader" :class="headerClass(tHeader)" @click="theaderClick(tHeader, index)">
              <div class="theader-box">
                <slot :name="'theader-' + hump2line(tHeader.key)">
                  {{{tHeader.title}}}
                  <i class="fa fa-question-circle" v-tooltip="tHeader.tooltip" v-if="tHeader.tooltip"></i>
                  <div class="sort-box" v-if="tHeader.sortType">
                    <i class="fa fa-caret-up" :class="{'gray': tHeader.sortType!==1}"></i>
                    <i class="fa fa-caret-down" :class="{'gray': tHeader.sortType===1}"></i>
                  </div>
                </slot>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="rows.length > 0">
            <tr v-for="(rowIndex, row) in rows" track-by="$index">
              <th v-show="selecting" class="tac">
                <input type="checkbox" :checked="selectedRows.indexOf(row) > -1" @change="selectedRowsChange(row, rowIndex)">
              </th>
              <td v-for="tHeader in headers" :class="tHeader.class" @click.prevent="tbodyClick(tHeader, row, rowIndex, $event)">
                {{{row[tHeader.key]}}}
              </td>
            </tr>
          </template>
          <tr v-if="rows.length === 0">
            <td :colspan="headers.length + 1" class="tac">
              <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row" v-show="headers.length > 0">
      <div class="col-8">
        <slot name="left-foot">
        </slot>
      </div>
      <div class="col-16 fr">
        <pagination v-if="page.total" :total="total" :current="currentPage" :count-per-page="countPerPage" @page-update="pageCurrentChange" @count-update="pageCountUpdate" :simple="simplePage"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    /** *************必传传入参数格式********************************/
      // page: {
      //   total: 20, // 数据总数
      //   currentPage: 1, // 当前页
      //   countPerPage: 10 // 每页数量
      // },
      // headers：[
      //   {
      //     key: 'id', // 与rows的key对应 （必须）
      //     title: 'ID', // 标题的内容 （必须）
      //     class: 'tac', // 传入className 自动加入整一列中 多个类名用空格隔开 （非必须）
      //     sortType: -1, // 排序 传入1为升序 0为不排序  其他为降序 （非必须）
      //     tooltip: '提示', // 提示浮层显示内容 （非必须）
      //     pointer: true, // 是否显示可点 （非必须）
      //   },
      //   {
      //     key: 'creatTime', // 与rows的key对应 （必须）
      //     title: '创建时间' // 标题的内容 （必须）
      //   }
      // ],
      // rows: [
      //   {
      //     id: '<a href="">idididid</a>',
      //     creatTime: '123',
      //     updateTime: '更新时间',
      //     creater: '创建者',
      //     operation: '操作'
      //   },
      //   {
      //     id: 'idididid',
      //     creatTime: '创建时间',
      //     updateTime: '更新时间',
      //     creater: '创建者',
      //     operation: '操作'
      //   }
      // ]
    /** **********************************************/
    /** *************组件对外暴露事件*************************/
      // 事件名称：选择内容改变
      // @selected-change
      // 参数一个
      // 参数是当前的已经选择的row数组

      // 事件名称：每页显示数据条数改变
      // @page-count-update
      // 参数一个
      // 参数是变化后的数量

      // 事件名称：当前页改变
      // @current-page-change
      // 参数一个
      // 参数是当前页码

      // 事件名称：header点击事件 key是当前header的key值
      // @theader-{{key}} （key要转成非驼峰形式 即中划线）
      // 参数有两个
      // 参数是当前的已经选择的header对象和索引index

      // 事件名称：表格点击事件 key是当前header的key值
      // @tbody-{{key}} （key要转成非驼峰形式 即中划线）
      // 参数有三个：
      // 参数是当前的已经选择的header对象和row对象 以及当前表格row在列表中的索引index
    /** **************************************/
    /** *************组件对外暴露slot*************************/
      // 表格头部内容
      // 名字： theader-{{key}} （key要转成非驼峰形式 即中划线）
    /** **************************************/
    name: 'XTable',

    props: {
      // 是否正在加载
      loading: {
        type: Boolean,
        default: false,
        twoWay: false
      },

      // 是否开启选择模式
      selecting: {
        type: Boolean,
        default: false,
        twoWay: false
      },

      // 表头信息
      headers: {
        type: Array,
        default () {
          return []
        },
        twoWay: false
      },

      // 数据行
      rows: {
        type: Array,
        default () {
          return []
        },
        twoWay: false
      },

      // 是否带边框
      bordered: {
        type: Boolean,
        default: true
      },

      // 分页信息
      page: {
        type: Object,
        default () {
          return {}
        }
      },

      // 是否简洁分页
      simplePage: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      /**
       * 总数据数
       * @return {Number}
       */
      total () {
        return this.page.total - 0 || 0
      },

      /**
       * 每页条数
       * @return {Number}
       */
      countPerPage () {
        return this.page.countPerPage - 0 || 10
      },

      /**
       * 当前页码
       * @return {Number}
       */
      currentPage () {
        return this.page.currentPage - 0 || 1
      }
    },

    data () {
      return {
        selectedRows: [], // 已选择的数据
        selectedAll: false // 是否全选
      }
    },

    watch: {
      selecting () {
        this.selectedRows = []
        this.selectedAll = false
      },

      rows () {
        this.initSelected() // 修正选择状态
      }
    },

    methods: {
      /**
       * 每页显示数据条数改变
       * @param  {Number} count 每页显示数据条数
       */
      pageCountUpdate (count) {
        this.$emit('page-count-update', count)
      },

      /**
       * 当前页改变
       * @param  {Number} current 当前页
       */
      pageCurrentChange (current) {
        this.$emit('current-page-change', current)
      },

      /**
       * 初始化选择状态
       */
      initSelected () {
        if (this.selecting) {
          if (this.rows.length) {
            var arr = this.selectedRows.concat()
            arr.map((item, index) => {
              if (this.rows.indexOf(item) === -1) {
                this.selectedRows.splice(index, 1)
              }
            })
            this.selectedAll = this.rows.length === this.selectedRows.length
          } else {
            this.selectedRows = []
            this.selectedAll = false
          }
          this.$emit('selected-change', this.selectedRows)
        } else {
          this.selectedRows = []
          this.selectedAll = false
        }
      },

      /**
       * 全选按钮被点击
       * @param  {HTML DOM Event} event 事件
       */
      selectAllEvent (event) {
        if (this.selecting) {
          var selected = event.target.checked
          if (selected) {
            this.selectedRows = [].concat(this.rows)
          } else {
            this.selectedRows = []
          }
          this.$emit('selected-change', this.selectedRows)
          // alert('全选')
        }
      },

      /**
       * theader点击事件
       * @param  {Object} theader 表头
       * @param  {Number} index   对应的索引
       */
      theaderClick (theader, index) {
        var key = this.hump2line(theader.key)
        key = key.replace('_', '-')
        this.$emit('theader-' + key, theader, index)
      },

      /**
       * tbody被点击事件
       * @param  {Object} theader 表头
       * @param  {Object} row 数据行
       * @param  {Number} rowIndex 数据行索引
       * @param  {HTML DOM Event} ev 事件
       */
      tbodyClick (theader, row, rowIndex, ev) {
        var key = this.hump2line(theader.key)
        key = key.replace('_', '-')
        // TODO:待优化
        if (ev.target.tagName.toLowerCase() === 'a' || ev.target.tagName.toLowerCase() === 'button') {
          this.$emit('tbody-' + key, row, theader, rowIndex)
        }
      },

      /**
       * 驼峰字符串转普通中划线字符串
       * @param  {String} humpName 驼峰字符串
       * @return {String}
       */
      hump2line (humpName) {
        return humpName.replace(/([A-Z])/g, '-$1').toLowerCase()
      },

      /**
       * checkbox点击事件
       * @param  {Object} row 数据行
       */
      selectedRowsChange (row, index) {
        if (this.selecting) {
          if (this.selectedRows.indexOf(row) >= 0) {
            this.selectedRows.splice(index, 1)
          } else {
            this.selectedRows.push(row)
          }
          this.initSelected()
        }
      },

      /**
       * 计算theader的类名
       * @param  {Object} theader 表头
       * @return {Object}
       */
      headerClass (theader) {
        var result = {}
        if (theader.class) {
          result[theader.class] = true
        }
        result.pointer = Boolean(theader.sortType || theader.pointer)
        return result
      }
    }

  }
</script>

<style lang="stylus" scoped>
@import '../../../assets/stylus/common'

  .intelligent-table-box
    width 100%
    height auto
    box-sizing border-box
    overflow hidden
    .table-content
      overflow-x auto
      overflow-y hidden
    .pointer
      cursor pointer
    .theader
      /*min-width 80px*/
    .theader-box
      position relative
      width 100%
      height 100%
      .sort-box
        position absolute
        right 0
        top 0
        width 30px
        height 18px
        text-align right
        .fa
          display block
          width 30px
          height 9px
          line-height 9px
          margin 0
          overflow hidden
          color #636363
          &.gray
            color #bbbbbb
</style>
