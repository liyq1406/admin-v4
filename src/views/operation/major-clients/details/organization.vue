<template>
  <div class="panel">
    <div class="organization-box">
      <div class="tree-box">
        <div class="btn-group-box">
          <!-- 添加兄弟接点 -->
          <button class="btn btn-ghost btn-sm"
          :disabled="!btnCanUse.add"
          :class="{'disabled': !btnCanUse.add}"
          @click.stop="onAddBrother">
            <!-- <i class="fa fa-share"></i> -->1
          </button>

          <!-- 添加子节点 -->
          <button class="btn btn-ghost btn-sm"
          :disabled="!btnCanUse.addChild"
          :class="{'disabled': !btnCanUse.addChild}"
          @click.stop="onAddChild">
            <!-- <i class="fa fa-share"></i> -->2
          </button>

          <!-- 删除 -->
          <button class="btn btn-ghost btn-sm"
          :disabled="!btnCanUse.delete"
          :class="{'disabled': !btnCanUse.delete}">
            <i class="fa fa-trash-o"></i>
          </button>

          <!-- 上移 -->
          <button class="btn btn-ghost btn-sm"
          :disabled="!btnCanUse.up"
          :class="{'disabled': !btnCanUse.up}">
            <i class="fa fa-long-arrow-up"></i>
          </button>

          <!-- 下移 -->
          <button class="btn btn-ghost btn-sm"
          :disabled="!btnCanUse.down"
          :class="{'disabled': !btnCanUse.down}">
            <i class="fa fa-long-arrow-down"></i>
          </button>

          <!-- 编辑 -->
          <button class="btn btn-ghost btn-sm"
          :disabled="!btnCanUse.edit"
          :class="{'disabled': !btnCanUse.edit}"
          @click.stop="onEditName">
            <i class="fa fa-edit"></i>
          </button>
        </div>
        <div class="tree-container">
          <tree1 :data="organizationTree" @changed="changed"></tree1>
          <div class="loading-box" v-show="loading">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
        </div>
      </div>
      <div class="detail-box">222</div>
    </div>
    <modal :show.sync="showModal" @close="onCloseEditModal">
      <h3 slot="header">组织名称</h3>
      <div slot="body" class="form">
        <validator name="validation">
          <form autocomplete="off" novalidate @submit.stop.prevent="onComfirm">
            <div class="form-row row">
              <label class="form-control col-6">组织名称:</label>
              <div class="controls col-18">
                <div v-placeholder="'组织名称'" class="input-text-wrap">
                  <input v-model="modal.name" type="text" name="modal.name" v-validate:name="{required: true}"  lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.name.touched && $validation.name.required">请输入组织名称</span>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
              <button @click.prevent.stop="onCloseEditModal" class="btn btn-default">{{ $t("common.cancel") }}</button>
            </div>
          </form>
        </validator>
      </div>
    </modal>
  </div>
</template>

<script>
  // import api from 'api'
  // 添加兄弟组织
  const ADDBROTHER = 1
  // 添加子组织
  const ADDCHILD = 2
  // 编辑组织
  const EDIT = 3

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
        editing: false,
        // 正在加载标志位
        loading: false,
        // 显示编辑浮层标志位
        showModal: false,

        modalType: ADDBROTHER,
        // 编辑浮层
        modal: {
          name: ''
        }
      }
    },

    computed: {
      // 计算属性 组织信息列表 传入组件的数据
      organizationTree () {
        if (!this.resetSortLists.length) return []
        var result = []
        this.resetSortLists.forEach((item) => {
          var list = _.clone(item)
          list.label = item.name
          list.open = true
          list.treeIndex = (item.id === this.majorClientId) ? '0' : ''
          result.push(list)
        })
        result = this.resetTreeIndex(result)
        return result
      },

      // 当前大客户id
      majorClientId () {
        return this.$route.params.id
      },

      // 按爹分组的列表
      groupLists () {
        const PARENTID = 'main'
        var srotLists = _.clone(this.organizationData)
        if (!srotLists.length) return {}
        var listsObj = {}
        srotLists.forEach((item) => {
          listsObj[item.parent || PARENTID] = listsObj[item.parent || PARENTID] || []
          listsObj[item.parent || PARENTID].push(item)
        })
        for (var key in listsObj) {
          if (listsObj.hasOwnProperty(key)) {
            // 每一小组排序
            listsObj[key].sort((a, b) => {
              return a.sort - b.sort
            })
            // 每一小组重置索引
            listsObj[key].forEach((item, index) => {
              item.sort = index
            })
          }
        }
        return listsObj
      },

      /**
       * 重置sort值后的列表
       */
      resetSortLists () {
        var result = []
        var groupLists = _.clone(this.groupLists)
        for (var key in groupLists) {
          if (groupLists.hasOwnProperty(key)) {
            result = result.concat(groupLists[key])
          }
        }
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
      },

      selectedList () {
        var result = {}
        this.organizationTree.forEach((item) => {
          if (item.treeIndex === this.selectedTreeIndex) {
            result = item
          }
        })
        return result
      },

      // 请求条件
      queryCondition () {
        var condition = {
          // limit: this.countPerPage,
          offset: 0
        }
        return condition
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
      // 获取数据
      getData () {
        // api.heavyBuyer.getOrganizationList(this.majorClientId, this.condition).then((res) => {
        //   console.log(res)
        // })
        this.organizationData = [
          {
            'id': '11',
            // 'parent': '',
            'name': '0',
            'sort': '3',
            'create_time': '创建时间,例:2015-10-09T08:15:40.843Z'
          },
          {
            'id': '33',
            'parent': '22',
            'name': '0-0-0',
            'sort': '5',
            'create_time': '创建时间,例:2015-10-09T08:15:40.843Z'
          },
          {
            'id': '22',
            'parent': '11',
            'name': '0-0',
            'sort': '1',
            'create_time': '创建时间,例:2015-10-09T08:15:40.843Z'
          },
          {
            'id': '44',
            'parent': '11',
            'name': '0-1',
            'sort': '5',
            'create_time': '创建时间,例:2015-10-09T08:15:40.843Z'
          }
        ]
      },

      onComfirm () {
        console.log('确定提交')
      },

      onCloseEditModal () {
        this.showModal = false
        this.modal.name = ''
      },

      /**
       * 组件内数据变化
       */
      changed (selectedTreeIndex, data) {
        console.log(selectedTreeIndex)
        console.log(data)
        this.selectedTreeIndex = selectedTreeIndex
      },

      onAddBrother () {
        this.showModal = true
        this.modalType = ADDBROTHER
        this.modal.name = ''
      },

      onAddChild () {
        this.showModal = true
        this.modalType = ADDCHILD
        this.modal.name = ''
      },

      /**
       * 重命名按钮
       */
      onEditName () {
        this.showModal = true
        this.modalType = EDIT
        this.modal.name = this.selectedList.name
      },

      /**
       * 重置树索引
       */
      resetTreeIndex (lists) {
        if (!lists.length) return []
        var result = _.clone(lists)
        // 求出当前没有索引的数组
        var noIndexLists = result.filter((item1) => {
          return !item1.treeIndex
        })
        // 这里是函数的结束条件
        if (!noIndexLists.length) {
          return result
        }

        /**
         *  为某一级添加索引
         */

        // 本次调用是否有收获标志位  如果一直没有变为true 则报错
        var gain = false
        noIndexLists.forEach((item2, index2) => {
          var parentId = item2.parent
          var parent = {}
          if (parentId) {
            result.forEach((item3, index3) => {
              if (item3.id === parentId) {
                parent = item3
              }
            })
          }
          if (parent.treeIndex) {
            item2.treeIndex = parent.treeIndex + '-' + item2.sort
            gain = true
          }
        })
        if (gain) {
          // 递归调用
          return this.resetTreeIndex(result)
        } else {
          console.error('数据有问题, 有数据找不到爹!请检查服务器返回数据')
          return []
        }
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
    .loading-box
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      background rgba(0,0,0,0.1)
      z-index 1
      text-align center
      font-size 20px
      line-height 300px
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
