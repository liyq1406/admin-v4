<template>
  <div class="data-table">
    <table class="table">
      <thead>
        <tr>
          <th v-for="tHeader in headers" :class="headerClass(tHeader)" @click="theaderClick(tHeader, $index)">
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
        <template v-if="resetTables.length > 0">
          <tr v-for="(tableIndex, table) in resetTables" track-by="$index">
            <td v-for="tHeader in headers" :class="tHeader.class">
              <template v-if="tHeader.key === 'percent'">
                <percentage-bar :percentage="table.percent" :color="table.color"></percentage-bar>
              </template>
              <template v-else>
                {{{table[tHeader.key]}}}
              </template>
            </td>
          </tr>
        </template>
        <tr v-if="resetTables.length === 0">
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
    name: 'percentTable',

    props: {
      // 颜色主题
      type: {
        type: Number,
        default: 1
      },
      headers: {
        type: Array,
        default () {
          return []
        }
      },
      tables: {
        type: Array,
        default () {
          return [
            {
              test: 'asd',
              percent: 50
            }
          ]
        }
      }
    },

    computed: {
      resetTables () {
        var result = []
        result = this.tables.map((item, index) => {
          item.percent = String(item.percent).replace('%', '') + '%'
          item.color = item.color || this.colors[index]
          return item
        })
        return result
      },
      /**
       * 用于渲染的颜色数组
       * @return {[type]} [description]
       */
      colors () {
        const colorArr = [
          ['#d1485a', '#ef5f70', '#fb9475', '#fab979', '#f1d588', '#e6f3a4', '#a5e69c', '#69d5b3', '#56becc', '#6990d5']
        ]
        let result = colorArr[this.type - 1] || colorArr[0]
        if (!(this.percentSort === -1 || this.percentSort === 0)) {
          result.reverse()
        }
        return result
      },
      /**
       * 当前的百分比排序
       * @return {[type]} [description]
       */
      percentSort () {
        let result = -1
        this.headers.forEach((item) => {
          if (item.key === 'percent') {
            result = item.sortType
          }
        })
        return result
      }
    },
    created () {
      this.checkData()
    },

    watch: {
      headers () {
        this.checkData()
      },
      tables () {
        this.checkData()
      }
    },
    methods: {
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
       * 检查传入数据是否正确
       * @return {[type]} [description]
       */
      checkData () {
        // 检查headers是否含有percent 如果没有的话自动为其插入
        // let hasPercent = false
        // this.headers.forEach((item) => {
        //   if (item.key === 'percent') {
        //     hasPercent = true
        //     if (item.sortType === undefined) {
        //       item.sortType = -1
        //     }
        //   }
        // })
        // if (!hasPercent) {
        //   let header = {
        //     key: 'percent',
        //     title: '占比',
        //     sortType: -1,
        //     class: 'tal'
        //   }
        //   this.headers.push(header)
        // }
        // 检查tables是否含有percent属性 如果没有的话默认是0
        // this.tables.forEach((item, index) => {
        //   item.percent = String(item.percent).replace('%', '') + '%'
        //   item.color = item.color || this.colors[index]
        // })
        // console.log(this.tables)
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
       * 计算theader的类名
       * @param  {[type]} tHeader [description]
       * @return {[type]}         [description]
       */
      headerClass (tHeader) {
        var result = {}
        if (tHeader.class) {
          result[tHeader.class] = true
        }
        result.pointer = Boolean(tHeader.sortType || tHeader.pointer)
        return result
      }
    }
  }
</script>
<style lang="stylus" scoped>
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
