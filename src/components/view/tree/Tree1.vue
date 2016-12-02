<template>
  <div class="x-tree-1">
    <label>
      <!-- <input type="radio" class="hide-input" @blur="onBlur"> -->
      <div class="list"
      v-for="(index, list) in lists"
      :class="{'selected': list.treeIndex === selectedTreeIndex}" :style="computedListStyle(list)" v-show="list.show">
        <div class="tree-content">
          <i :class="computedIconClass(list)" @click.stop="onChangeShowHide(list)"></i>
          <span class="tree-content-label" @click.stop="selectedTreeIndex = list.treeIndex">{{list.label}}</span>
          <!-- <input type="text" class="edit-input" v-show="editing && list.treeIndex === selectedTreeIndex"> -->
          <div
          class="line"
          :style="'width:' + (unitPadding - 15) + 'px;left: -' + (unitPadding - 5) + 'px'"
          v-if="index !== 0"
          >
          </div>
          <div class="vertical-line" :style="'height: ' + verticalLineHeight(list, index) + 'px; left: -' + (unitPadding - 5) + 'px'"></div>
          <div class="selected-line"></div>
        </div>
      </div>
    </label>
  </div>
</template>

<script>
  export default {
    name: 'Tree',

    props: {
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      selectedTreeIndex: {
        type: String,
        default: ''
      },
      editing: {
        type: Boolean,
        default: false
      }
    },

    data () {
      return {
        // 左侧缩进
        unitPadding: '35',
        // 行高
        unitLineHeight: 32,
        // 对外暴露数据
        emitData: []
      }
    },

    computed: {
      /**
       * 计算属性 列表
       */
      lists () {
        var result = []
        this.data.forEach((item) => {
          var list = _.cloneDeep(item)
          list.level = this.computedLevel(item)
          list.open = this.computedOpen(item)
          list.show = this.computedListShow(list)
          list.childCount = this.computedChildCount(item)
          // list.showChildCount = this.computedShowChildCount(item)
          list.prototype = item
          result.push(list)
        })
        result = this.sort(result)
        return result || []
      },

      /**
       * 计算属性 最大等级
       */
      maxLevel () {
        var data = _.clone(this.data)
        var sortList = data.sort((a, b) => { return this.computedLevel(b) - this.computedLevel(a) })
        return sortList[0].treeIndex.split('-').length
      }
    },

    watch: {
      selectedTreeIndex (val) {
        var hasData = val && this.data.some((item) => {
          return item.treeIndex === val
        })
        if (!hasData) {
          val = ''
        }
        this.$emit('changed', val, this.data)
      }
    },

    ready () {
      this.init()
    },

    methods: {
      init () {
        setTimeout(() => {
          var treeBox = document.getElementById('tree-box')
          treeBox.addEventListener('click', () => {
            this.selectedTreeIndex = ''
          }, false)
        }, 1000)
      },
      onBlur () {
        this.selectedTreeIndex = ''
      },
      /**
       * 选择列表
       */
      selectList (list) {
        this.selectedTreeIndex === list.treeIndex
      },

      /**
       * 显示隐藏下级列表
       */
      onChangeShowHide (list) {
        var targetList = {}
        var targetIndex = -1
        var data = _.clone(this.data)
        data.forEach((item, index) => {
          if (item.treeIndex === list.treeIndex) {
            targetList = item
            targetList.open = !targetList.open
            targetIndex = index
          }
        })
        data[targetIndex] = targetList
        data.forEach((item) => {
          if (this.selectedTreeIndex.length > 2) {
            let selectedListParentIndex = this.selectedTreeIndex.replace(/-\d$/, '')
            if ((item.treeIndex === selectedListParentIndex) && !item.open) {
              this.selectedTreeIndex = ''
            }
          }
        })
        this.data = data
      },

      /**
       * 列表排序
       */
      sort (lists) {
        var result = []
        result = lists.sort((a, b) => {
          var result = 0
          for (let i = 0; i < this.maxLevel; i++) {
            let indexA = (a.treeIndex.split('-')[i] >= 0) ? a.treeIndex.split('-')[i] : -1
            let indexB = (b.treeIndex.split('-')[i] >= 0) ? b.treeIndex.split('-')[i] : -1
            result = indexA - indexB
            if (result) break
          }
          return result
        })
        return result
      },

      /**
       * 计算列表样式
       */
      computedListStyle (list) {
        var paddingLeft = this.unitPadding * (list.level - 1) || 0
        return `padding-left:${paddingLeft}px`
      },

      /**
       * 计算等级
       */
      computedLevel (list) {
        var level = list.treeIndex.split('-').length
        return level
      },

      /**
       * 计算icon类名
       */
      computedIconClass (list) {
        var results = ['fa fa-plus-square-o', 'fa fa-minus-square-o', 'fa fa-square-o']
        if (list.level === this.maxLevel) {
          return results[2]
        }
        var treeIndex = list.treeIndex
        var count = 0
        this.lists.forEach((item) => {
          if (item.treeIndex.indexOf(treeIndex) === 0) {
            count++
          }
        })
        if (count === 1) {
          return results[2]
        }
        if (list.open) {
          return results[1]
        } else {
          return results[0]
        }
      },

      /**
       * 计算下级数量
       */
      computedChildCount (list) {
        var result = -1
        if (!this.data.length) result = 0
        this.data.forEach((item) => {
          if (item.treeIndex.indexOf(list.treeIndex) === 0) {
            result++
          }
        })
        return result
      },

      /**
       * 计算列表显示条件
       */
      computedListShow (list) {
        if (list.treeIndex.length === 1) return true
        var parents = []
        parents = this.data.filter((item) => {
          return (list.treeIndex.indexOf(item.treeIndex + '-') === 0)
        })
        var parentOpen = parents.every((item) => {
          return item.open
        })
        return parentOpen
      },

      /**
       * 计算是否打开
       */
      computedOpen (list) {
        if (!list) return false
        var result = false
        var treeIndex = list.treeIndex
        var parents = []
        parents = this.data.filter((item) => {
          return (treeIndex.indexOf(item.treeIndex + '-') === 0)
        })
        result = parents.every((item) => {
          return item.open
        })
        if (!parents.length) {
          result = list.open
        }
        return result && list.open
      },

      /**
       * 计算竖线高度
       */
      verticalLineHeight (list, index) {
        var result = 0
        if (!index) return result
        for (let i = index - 1; i >= 0; i--) {
          if (!this.lists[i].show) {
            continue
          }
          result += this.unitLineHeight
          if (this.lists[i].level <= list.level) {
            break
          }
        }
        console.log(result)
        return result
      },

      /**
       * 求父列表
       */
      computedParent (list) {
        var parentTreeIndex = list.treeIndex.replace(/-\d$/, '')
        var result = null
        this.data.forEach((item) => {
          if (item.treeIndex === parentTreeIndex) {
            result = item
          }
        })
        return result
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../assets/stylus/common'

  .x-tree-1
    width 100%
    height 100%
    overflow auto
    position relative
    .list
      height 32px
      line-height 32px
      .tree-content
        position relative
        padding-left 20px
        box-sizing border-box
        .tree-content-label
          white-space nowrap
        span,i
          cursor pointer
        .edit-input
          position absolute
          left 20px
          width 100px
        .line
          position absolute
          height 0
          border-top 1px solid default-border-color
          top 50%
          transform translate(0, -1px)
        .vertical-line
          position absolute
          width 0
          border-left 1px solid default-border-color
          height 10px
          bottom 50%
      &.selected
        background #f3f3f3
        .fa
          background #f3f3f3
    .fa
      width 10px
      height 15px
      background #fff
      position absolute
      left 0
      top 50%
      transform translate(0, -50%)
      z-index 1
    .hide-input
      width 100%
      height 100%
      opacity 0.3
      position absolute
      left -9999px
</style>
