<template>
  <div class="intelligent-table-box">
    <table class="table table-stripe table-bordered">
      <thead>
        <tr>
          <th v-show="selecting" class="tac">选择</th>
          <th v-for="tHeader in headers" :class="tHeader.class">{{tHeader.title}}</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="tables.length > 0">
          <tr v-for="table in tables" transition="rightToLeft">
            <th v-show="selecting" class="tac">
              <input type="checkbox" @change="selectedTableChange(table)">
            </th>
            <td v-for="tHeader in headers" :class="tHeader.class" @click="clickDown(tHeader, table)">{{{table[tHeader.key]}}}</td>
          </tr>
        </template>
        <tr v-if="tables.length === 0 && !loadingData">
          <td :colspan="headers.length" class="tac">
            <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
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
      //     key: 'id', // 与tables的key对应
      //     title: 'ID', // 标题的内容
      //     functionName: 'test',  // 调用函数的名字  函数需要定义在父组件的methods中 会返回当前选中的表格的headers和table对象
      //     class: 'tac' // 传入className 自动加入整一列中
      //   },
      //   {
      //     key: 'id',
      //     title: 'ID',
      //     functionName: 'test',
      //     class: 'tac'
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
      // 事件名称：
      // @selected-change
      // 参数是当前的已经选择的table数组
    /** **************************************/
    props: {
      // 是否开启选择模式
      selecting: {
        type: Boolean,
        default: false
      },

      headers: {
        type: Array,
        default: []
      },

      tables: {
        type: Array,
        default: []
      }
    },

    data () {
      return {
        selectedTable: []
      }
    },
    methods: {
      clickDown (tHeader, table) {
        if (this.$parent[tHeader.functionName]) {
          this.$parent[tHeader.functionName](tHeader, table)
        }
      },

      selectedTableChange (table) {
        if (this.selectedTable.indexOf(table) >= 0) {
          this.selectedTable.$remove(table)
        } else {
          this.selectedTable.push(table)
        }
        this.$dispatch('selected-change', this.selectedTable)
      }
    }

  }
</script>

<style lang="stylus">
@import '../assets/stylus/common'

  .intelligent-table-box
    width 100%
    overflow auto
    box-sizing border-box
</style>
