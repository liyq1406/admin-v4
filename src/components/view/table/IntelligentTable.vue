<template>
  <div class="intelligent-table-box">
    <table class="table table-stripe table-bordered">
      <thead>
        <tr>
          <th v-show="selecting" class="tac">
            <input type="checkbox" v-model="selectedAll" @change="selectAllEvent($event)">
          </th>
          <th v-for="tHeader in headers" :class="tHeader.class">{{{tHeader.title}}}</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="rows.length > 0">
          <tr v-for="(rowIndex, row) in rows" track-by="$index">
            <th v-show="selecting" class="tac">
              <input type="checkbox" :checked="selectedRows.indexOf(row)>-1" @change="selectedRowsChange(row, rowIndex)">
            </th>
            <td v-for="tHeader in headers" :class="tHeader.class" @click="clickDown(tHeader, row)">{{{row[tHeader.key]}}}</td>
          </tr>
        </template>
        <tr v-if="rows.length === 0 && !loadingData">
          <td :colspan="headers.length + 1" class="tac">
            <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    /** *************传入参数格式********************************/
      // headers：[
      //   {
      //     key: 'id', // 与rows的key对应
      //     title: 'ID', // 标题的内容
      //     functionName: 'test',  // 调用函数的名字  函数需要定义在父组件的methods中 会返回当前选中的表格的headers和row和lineIndex
      //     class: 'tac', // 传入className 自动加入整一列中
      //     sortable: false,
      //     tooltip: '提示'
      //   },
      //   {
      //     key: 'creatTime',
      //     title: '创建时间',
      //     functionName: 'test',
      //     class: 'tac'，
      //     sortable: false,
      //     tooltip: '提示'
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
      // 事件名称：
      // @selected-change
      // 参数是当前的已经选择的row数组
    /** **************************************/
    name: 'IntelligentTable',

    props: {
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

      rows: {
        type: Array,
        default: [],
        twoWay: false
      },

      selectedRows: {
        type: Array,
        default: function () { return [] },
        twoWay: false
      }
    },
    data () {
      return {
        selectedAll: false
      }
    },
    watch: {
      rows () {
        this.initSelected() // 修正选择状态
      }
    },
    methods: {
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
       * @param  {[type]} event [description]
       * @return {[type]}       [description]
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
       * tbody被点击事件
       * @param  {[type]} tHeader [description]
       * @param  {[type]} row   [description]
       * @return {[type]}         [description]
       */
      clickDown (tHeader, row) {
        var lineIndex = this.rows.indexOf(row)
        if (this.$parent[tHeader.functionName]) {
          this.$parent[tHeader.functionName](tHeader, row, lineIndex)
        }
      },

      /**
       * checkbox点击事件
       * @param  {[type]} row [description]
       * @return {[type]}       [description]
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
      }
    }

  }
</script>

<style lang="stylus">
@import '../../../assets/stylus/common'

  .intelligent-table-box
    width 100%
    overflow auto !important
    box-sizing border-box
</style>
