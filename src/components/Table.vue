<template>
  <div class="intelligent-table-box data-table with-loading">
    <div class="icon-loading" v-show="loading">
      <i class="fa fa-refresh fa-spin"></i>
    </div>
    <table class="table table-stripe table-bordered">
      <thead>
        <tr>
          <th v-show="selecting" class="tac">
            <input type="checkbox" v-model="selectedAll" @change="selectAllEvent($event)">
          </th>
          <th v-for="tHeader in headers" :class="{[tHeader.class]: true, 'pointer': tHeader.sortType || tHeader.pointer}" @click="theaderClick(tHeader, $index)">
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
        <template v-if="tables.length > 0">
          <tr v-for="(tableIndex, table) in tables" track-by="$index">
            <th v-show="selecting" class="tac">
              <input type="checkbox" :checked="tableIndex>-1" @change="selectedTablesChange(table)">
            </th>
            <td v-for="tHeader in headers" :class="tHeader.class" @click="tbodyClick(tHeader, table, tableIndex)">
              {{{table[tHeader.key]}}}
            </td>
          </tr>
        </template>
        <tr v-if="tables.length === 0">
          <td :colspan="headers.length + 1" class="tac">
            <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
          </td>
        </tr>
      </tbody>
    </table>
    <pager :total="total" :current="currentPage" :count-per-page="countPerPage" @page-update="pageCurrentChange" @count-update="pageCountUpdate"></pager>
  </div>
</template>

<script>
  import Pager from 'components/Pager'
  export default {
    /** *************必传传入参数格式********************************/
      // page: {
      //   total: 20, // 数据总数
      //   currentPage: 1, // 当前页
      //   countPerPage: 10 // 每页数量
      // },
      // headers：[
      //   {
      //     key: 'id', // 与tables的key对应 （必须）
      //     title: 'ID', // 标题的内容 （必须）
      //     class: 'tac', // 传入className 自动加入整一列中 多个类名用空格隔开 （非必须）
      //     sortType: -1, // 排序 传入1为升序 0为不排序  其他为降序 （非必须）
      //     tooltip: '提示', // 提示浮层显示内容 （非必须）
      //     pointer: true, // 是否显示可点 （非必须）
      //   },
      //   {
      //     key: 'creatTime', // 与tables的key对应 （必须）
      //     title: '创建时间' // 标题的内容 （必须）
      //   }
      // ],
      // tables: [
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
      // 参数是当前的已经选择的table数组

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
      // 参数是当前的已经选择的header对象和table对象 以及当前表格table在列表中的索引index
    /** **************************************/
    /** *************组件对外暴露slot*************************/
      // 表格头部内容
      // 名字： theader-{{key}} （key要转成非驼峰形式 即中划线）
    /** **************************************/
    props: {
      page: {
        type: Object,
        default () {
          return {}
        }
      },
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

      headers: {
        type: Array,
        default: [],
        twoWay: false
      },

      tables: {
        type: Array,
        default: [],
        twoWay: false
      }
    },

    components: {
      'pager': Pager
    },

    computed: {
      /**
       * 总数据数
       * @return {[type]} [description]
       */
      total () {
        return this.page.total || 0
      },
      /**
       * 每页条数
       * @return {[type]} [description]
       */
      countPerPage () {
        return this.page.countPerPage || 10
      },
      /**
       * 当前页码
       * @return {[type]} [description]
       */
      currentPage () {
        return this.page.currentPage || 1
      }
    },
    data () {
      return {
        // 已选择的数据
        selectedTables: [],
        // 是否全选
        selectedAll: false
      }
    },

    watch: {
      tables () {
        this.initSelected() // 修正选择状态
      }
    },
    methods: {
      /**
       * 每页显示数据条数改变
       * @param  {[type]} count [description]
       * @return {[type]}       [description]
       */
      pageCountUpdate (count) {
        this.$emit('page-count-update', count)
      },
      /**
       * 当前页改变
       * @return {[type]} [description]
       */
      pageCurrentChange (current) {
        this.$emit('current-page-change', current)
      },
      /**
       * 初始化选择状态
       * @return {[type]} [description]
       */
      initSelected () {
        if (this.selecting) {
          if (this.tables.length) {
            var arr = this.selectedTables.concat()
            arr.map((item) => {
              if (this.tables.indexOf(item) === -1) {
                this.selectedTables.$remove(item)
              }
            })
            this.selectedAll = this.tables.length === this.selectedTables.length
          } else {
            this.selectedTables = []
            this.selectedAll = false
          }
          this.$emit('selected-change', this.selectedTables)
        } else {
          this.selectedTables = []
          this.selectedAll = false
        }
      },

      /**
       * 全选按钮被点击
       * @param  {[type]} event [description]
       * @return {[type]}       [description]
       */
      selectAllEvent (event) {
        if (this.selecting) {
          var selected = event.target.checked
          if (selected) {
            this.selectedTables = [].concat(this.tables)
          } else {
            this.selectedTables = []
          }
          this.$emit('selected-change', this.selectedTables)
          // alert('全选')
        }
      },
      /**
       * theader点击事件
       * @param  {[type]} theader [description]
       * @param  {[type]} index   [description]
       * @return {[type]}         [description]
       */
      theaderClick (theader, index) {
        var key = this.hump2line(theader.key)
        key = key.replace('_', '-')
        this.$emit('theader-' + key, theader, index)
      },

      /**
       * tbody被点击事件
       * @param  {[type]} tHeader [description]
       * @param  {[type]} table   [description]
       * @return {[type]}         [description]
       */
      tbodyClick (theader, table, lineIndex) {
        var key = this.hump2line(theader.key)
        key = key.replace('_', '-')
        this.$emit('tbody-' + key, theader, table, lineIndex)
      },
      /**
       * 驼峰字符串转普通中划线字符串
       * @param  {[type]} humpName [description]
       * @return {[type]}          [description]
       */
      hump2line (humpName) {
        return humpName.replace(/([A-Z])/g, '-$1').toLowerCase()
      },

      /**
       * checkbox点击事件
       * @param  {[type]} table [description]
       * @return {[type]}       [description]
       */
      selectedTablesChange (table) {
        if (this.selecting) {
          if (this.selectedTables.indexOf(table) >= 0) {
            this.selectedTables.$remove(table)
          } else {
            this.selectedTables.push(table)
          }
          this.initSelected()
        }
      }
    }

  }
</script>

<style lang="stylus">
@import '../assets/stylus/common'

  .intelligent-table-box
    width 100%
    height auto
    overflow-y hidden
    overflow-x auto
    box-sizing border-box
    .pointer
      cursor pointer
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
