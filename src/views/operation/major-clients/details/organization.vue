<template>
  <div class="panel">
    <div class="organization-box">
      <div class="tree-box">
        <div class="btn-group-box">
          <!-- 添加兄弟接点 -->
          <button class="btn btn-ghost btn-sm"
          :class="{'disabled': !btnCanUse.add}">
            <!-- <i class="fa fa-share"></i> -->1
          </button>

          <!-- 添加子节点 -->
          <button class="btn btn-ghost btn-sm"
          :class="{'disabled': !btnCanUse.addChild}">
            <!-- <i class="fa fa-share"></i> -->2
          </button>

          <!-- 删除 -->
          <button class="btn btn-ghost btn-sm"
          :class="{'disabled': !btnCanUse.delete}">
            <i class="fa fa-trash-o"></i>
          </button>

          <!-- 上移 -->
          <button class="btn btn-ghost btn-sm"
          :class="{'disabled': !btnCanUse.up}">
            <i class="fa fa-long-arrow-up"></i>
          </button>

          <!-- 下移 -->
          <button class="btn btn-ghost btn-sm"
          :class="{'disabled': !btnCanUse.down}">
            <i class="fa fa-long-arrow-down"></i>
          </button>

          <!-- 编辑 -->
          <button class="btn btn-ghost btn-sm"
          :class="{'disabled': !btnCanUse.edit}"
          @click.stop="onEditName">
            <i class="fa fa-edit"></i>
          </button>
        </div>
        <div class="tree-container">
          <tree1 :data="organizationTree" @changed="changed"></tree1>
        </div>
      </div>
      <div class="detail-box">222</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'organization',
  components: {
  },

  data () {
    return {
      // 已选择的树索引
      selectedTreeIndex: '',
      // 组织数据
      organizationData: [],
      // 正在编辑状态标志位
      editing: false
    }
  },

  computed: {
    /**
     * 计算属性 组织信息列表 传入组件的数据
     */
    organizationTree () {
      var result = []
      this.organizationData.forEach((item) => {
        var list = _.clone(item)
        list.label = item.name
        list.open = true
        list.treeIndex = (item.id === this.majorClientId) ? '0' : ''
        result.push(list)
      })
      result = this.resetTreeIndex(result)
      console.log(result)
      return result
    },

    majorClientId () {
      return this.$route.params.id
    },

    /**
     * 计算属性 组织信息列表 传入组件的数据
     */
    organizationTree1 () {
      var result = [
        {
          label: '0',
          treeIndex: '0',
          open: true
        },
        {
          label: '0-0',
          treeIndex: '0-0',
          open: true
        },
        {
          label: '0-1',
          treeIndex: '0-1',
          open: true
        },
        {
          label: '0-1-0',
          treeIndex: '0-1-0',
          open: true
        },
        {
          label: '0-2',
          treeIndex: '0-2',
          open: true
        }
      ]
      return result
    },

    /**
     * 按钮是否可点
     */
    btnCanUse () {
      var result = {
        // 添加兄弟组织
        add: false,
        // 添加子组织
        addChild: false,
        // 删除
        delete: false,
        // 向上移动
        up: false,
        // 向下移动
        down: false,
        // 编辑
        edit: false
      }
      // 如果没有选中
      if (!this.selectedTreeIndex) return result

      // 如果有选中 可编辑 可添加同级组织 可添加下级组织
      result.edit = true
      result.add = true
      result.addChild = true
      // 如果选中的是第一个 可删除
      if (this.selectedTreeIndex.length === 1) return result
      // 如果选中的不是第一个
      result.delete = true
      var indexs = this.selectedTreeIndex.split('-')
      var sort = indexs[indexs.length - 1]
      if (sort > 0) {
        result.up = true
      }
      var newIndexs = _.clone(indexs)
      newIndexs[newIndexs.length - 1]++
      var nextIndex = newIndexs.join('-')
      var hasNext = this.organizationTree.some((item) => {
        return item.treeIndex === nextIndex
      })
      result.down = hasNext
      return result
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
    getData () {
      this.organizationData = [
        {
          'id': '11',
          'parent': '',
          'name': '0',
          'sort': '0',
          'create_time': '创建时间,例:2015-10-09T08:15:40.843Z'
        },
        {
          'id': '22',
          'parent': '11',
          'name': '0-0',
          'sort': '0',
          'create_time': '创建时间,例:2015-10-09T08:15:40.843Z'
        },
        {
          'id': '33',
          'parent': '22',
          'name': '0-0-0',
          'sort': '0',
          'create_time': '创建时间,例:2015-10-09T08:15:40.843Z'
        },
        {
          'id': '44',
          'parent': '11',
          'name': '0-1',
          'sort': '1',
          'create_time': '创建时间,例:2015-10-09T08:15:40.843Z'
        }
      ]
    },
    changed (selectedTreeIndex, data) {
      console.log(selectedTreeIndex)
      console.log(data)
      this.selectedTreeIndex = selectedTreeIndex
    },

    onEditName () {
      this.editing = true
    },

    resetTreeIndex (lists) {
      var result = []
      // TODO
      return result
    },

    computedTreeIndex (list) {
      var result = ''
      // TODO
      return result
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
  .organization-box
    width 100%
    height 400px
    overflow hidden
    position relative
    padding-left 210px
    box-sizing border-box
    border 1px solid default-border-color
    .tree-box
      width 211px
      height 100%
      position absolute
      left 0
      top 0
      overflow auto
      box-sizing border-box
      border-right 1px solid default-border-color
      .tree-container
        width 100%
        height auto
        box-sizing border-box
        padding 10px
      .btn-group-box
        font-size 0
        .btn
          font-size 13px
          border-top 0
          border-left 0
          width 35px
          height 32px
          box-sizing border-box
          &:last-child
            border-right 0
    .detail-box
      width 100%
      height 100%
      overflow auto
      box-sizing border-box
      padding 15px
</style>
