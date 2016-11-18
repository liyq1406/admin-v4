<template>
  <div class="panel">
    <div class="organization-box">
      <div class="tree-box" id="tree-box">
        <div class="btn-group-box">
          <!-- 添加兄弟接点 -->
          <button class="btn btn-ghost btn-sm"
          :disabled="!btnCanUse.add"
          :class="{'disabled': !btnCanUse.add}"
          @click.stop="onAddBrother">
            <!-- <i class="fa fa-share"></i> -->同
          </button>

          <!-- 添加子节点 -->
          <button class="btn btn-ghost btn-sm"
          :disabled="!btnCanUse.addChild"
          :class="{'disabled': !btnCanUse.addChild}"
          @click.stop="onAddChild">
            <!-- <i class="fa fa-share"></i> -->子
          </button>

          <!-- 删除 -->
          <button class="btn btn-ghost btn-sm"
          :disabled="!btnCanUse.delete"
          :class="{'disabled': !btnCanUse.delete}"
          @click.stop="deleteOrganization">
            <i class="fa fa-trash-o"></i>
          </button>

          <!-- 上移 -->
          <button class="btn btn-ghost btn-sm"
          :disabled="!btnCanUse.up"
          :class="{'disabled': !btnCanUse.up}"
          @click.stop="upOrganization">
            <i class="fa fa-long-arrow-up"></i>
          </button>

          <!-- 下移 -->
          <button class="btn btn-ghost btn-sm"
          :disabled="!btnCanUse.down"
          :class="{'disabled': !btnCanUse.down}"
          @click.stop="downOrganization">
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
          <tree1 :data="organizationTree" :selected-tree-index="selectedTreeIndex" @changed="changed"></tree1>
          <div class="loading-box" v-show="loading">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
        </div>
      </div>
      <div class="detail-box">
        <div class="title-box">
          <span class="title">{{ showedList.name }}</span>
          <span class="level" v-show="showedList.id === '0'">一级组织</span>
        </div>
        <div class="content-box">
          <div class="row">
            <span class="label">上级组织: </span>
            <span class="value">{{ showedList.parent }}</span>
          </div>
          <div class="row">
            <span class="label">旗下组织: </span>
            <span class="value">5个</span>
          </div>
          <div class="row">
            <span class="label">账户数: </span>
            <span class="value">1个</span>
          </div>
        </div>
      </div>
    </div>
    <modal :show.sync="showModal" @close="onCloseEditModal">
      <h3 slot="header">组织名称</h3>
      <div slot="body" class="form">
        <validator name="validation">
          <form autocomplete="off" novalidate>
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
              <button @click.stop.prevent="onComfirm" type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
              <button @click.prevent.stop="onCloseEditModal" class="btn btn-default">{{ $t("common.cancel") }}</button>
            </div>
          </form>
        </validator>
      </div>
    </modal>
  </div>
</template>

<script>
  import api from 'api'
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
        majorClient: {},
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
          list.treeIndex = (item.id === this.majorClientId || item.id - 0 === 0) ? '0' : ''
          list.prototype = item
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
        var srotLists = this.organizationData
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
        var groupLists = this.groupLists
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
        result.addChild = true
        // 如果选中的是第一个 可删除
        if (this.selectedTreeIndex.length === 1) return result
        result.edit = true
        // 如果选中的不是第一个
        result.delete = true
        result.add = true
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
        if (!this.selectedTreeIndex) return result
        this.organizationTree.forEach((item) => {
          if (item.treeIndex === this.selectedTreeIndex) {
            result = item
          }
        })
        return result
      },

      showedList () {
        var result = {}
        if (this.selectedTreeIndex) {
          result = this.selectedList
        } else {
          result = this.currentMajorClient
        }
        return result
      },

      currentMajorClient () {
        var result = {}
        this.organizationTree.forEach((item) => {
          if (item.id === '0') {
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
        this.loading = true
        this.getDetail(this.majorClientId).then((majorClientDetail) => {
          majorClientDetail.id = '0'
          this.majorClient = majorClientDetail
          this.getData()
        })
      }
    },

    ready () {
    },

    methods: {
      getDetail (id) {
        return new Promise((resolve, reject) => {
          var params = {
            filter: ['id', 'name', 'create_time'],
            limit: 1,
            offset: 0,
            query: {
              id: {'$in': [id]}
            }
          }
          api.heavyBuyer.getHeavyBuyer(params).then((res) => {
            if (this.organizationData.length) return
            console.log(res)
            var majorClient = res.data.list[0]
            var majorClientDetail = {
              id: majorClient.id,
              name: majorClient.name,
              sort: 0,
              create_time: majorClient.create_time
            }
            this.loading = false
            resolve(majorClientDetail)
          }).catch((res) => {
            this.loading = false
            this.handleError(res)
          })
        })
      },
      // 获取数据
      getData () {
        this.loading = true
        api.heavyBuyer.getOrganizationList(this.majorClientId, this.queryCondition).then((res) => {
          console.log(res)
          this.organizationData = [this.majorClient].concat(res.data.list)
          this.loading = false
        }).catch((res) => {
          this.loading = false
          this.handleError(res)
        })
        // this.organizationData = [
        //   {
        //     'id': this.majorClientId,
        //     // 'parent': '',
        //     'name': '0',
        //     'sort': '3',
        //     'create_time': '创建时间,例:2015-10-09T08:15:40.843Z'
        //   },
        //   {
        //     'id': '33',
        //     'parent': '22',
        //     'name': '0-0-0',
        //     'sort': '5',
        //     'create_time': '创建时间,例:2015-10-09T08:15:40.843Z'
        //   },
        //   {
        //     'id': '22',
        //     'parent': this.majorClientId,
        //     'name': '0-0',
        //     'sort': '1',
        //     'create_time': '创建时间,例:2015-10-09T08:15:40.843Z'
        //   },
        //   {
        //     'id': '44',
        //     'parent': this.majorClientId,
        //     'name': '0-1',
        //     'sort': '5',
        //     'create_time': '创建时间,例:2015-10-09T08:15:40.843Z'
        //   }
        // ]
      },

      onComfirm () {
        this.editing = true
        switch (this.modalType) {
          case ADDBROTHER:
            console.log('添加兄弟组织')
            this.addBrother()
            break
          case ADDCHILD:
            console.log('添加子组织')
            this.addChild()
            break
          case EDIT:
            console.log('编辑组织')
            this.editOrganization()
            break
          default:
            this.editing = false
            console.error('无法判断当前提交类型')
            break
        }
      },

      /**
       * 添加兄弟组织
       */
      addBrother () {
        console.log('添加兄弟组织')
        var list = {
          name: this.modal.name,
          parent: this.selectedList.parent,
          sort: this.selectedList.sort - 0 + 0.5
        }
        this.organizationData.push(list)
        this.selectedTreeIndex = this.selectedTreeIndex.replace(/\d$/, this.selectedList.sort - 0 + 1)
        var params = list
        var updateParams = this.getBrother(list, 1)
        console.log('要添加的')
        console.log(params)
        var allCallBackCount = 2
        var callBackCount = 0
        api.heavyBuyer.addOrganization(this.majorClientId, params).then((res) => {
          callBackCount++
          if (callBackCount === allCallBackCount) {
            this.getData()
            this.onCloseEditModal()
          }
        }).catch((res) => {
          callBackCount++
          this.handleError(res)
        })
        api.heavyBuyer.updateOrganizations(this.majorClientId, updateParams).then((res) => {
          callBackCount++
          if (callBackCount === allCallBackCount) {
            this.getData()
            this.onCloseEditModal()
          }
        }).catch((res) => {
          callBackCount++
          this.handleError(res)
        })
      },

      /**
       * 添加子组织
       */
      addChild () {
        var list = {
          name: this.modal.name,
          parent: this.selectedList.id,
          sort: this.groupLists[this.selectedList.id] && this.groupLists[this.selectedList.id].length || 0
        }
        this.organizationData.push(list)
        this.selectedTreeIndex += '-' + list.sort
        var params = list
        console.log('要添加的')
        console.log(params)
        api.heavyBuyer.addOrganization(this.majorClientId, params).then((res) => {
          this.onCloseEditModal()
          this.getData()
        }).catch((res) => {
          this.handleError(res)
        })
      },

      /**
       * 修改名字
       */
      editOrganization () {
        var list = {
          id: this.selectedList.id,
          name: this.modal.name,
          parent: this.selectedList.parent,
          sort: this.selectedList.parent
        }
        var params = [list]
        console.log('要修改的')
        console.log(params)
        api.heavyBuyer.updateOrganizations(this.majorClientId, params).then((res) => {
          this.getData()
          this.onCloseEditModal()
        }).catch((res) => {
          this.handleError(res)
        })
      },

      deleteOrganization () {
        var toDeleteIds = []
        var toDeleteLists = []
        var toDeleteList = {}
        this.organizationTree.forEach((item) => {
          if (item.treeIndex === this.selectedTreeIndex) {
            toDeleteList = item
          }
          if (item.treeIndex.indexOf(this.selectedTreeIndex) === 0) {
            toDeleteIds.push(item.id)
            toDeleteLists.push(item)
          }
        })
        console.log(toDeleteIds)
        toDeleteLists.forEach((item) => {
          this.organizationData.$remove(item.prototype)
        })
        this.selectedTreeIndex = ''
        console.log('要删除的')
        console.log(toDeleteList)
        api.heavyBuyer.deleteOrganization(this.majorClientId, toDeleteList.id).then((res) => {
          this.getDate()
        }).catch((res) => {
          this.handleError(res)
        })
      },

      /**
       * 上移
       */
      upOrganization () {
        console.log('上移')
        var toUp = this.selectedList
        var toDown = {}
        this.organizationTree.forEach((item) => {
          if (item.treeIndex === (this.selectedList.treeIndex.replace(/\d$/, this.selectedList.sort - 1))) {
            toDown = item
          }
        })
        this.organizationData.forEach((item, index) => {
          if (item.id === toUp.id) {
            toUp.sort--
            this.organizationData.$set(index, toUp)
          } else if (item.id === toDown.id) {
            toDown.sort++
            this.organizationData.$set(index, toDown)
          }
        })
        this.selectedTreeIndex = this.selectedTreeIndex.replace(/\d$/, toUp.sort)
        var params = [toUp, toDown]
        console.log('要修改的数组')
        console.log(params)
      },

      /**
       * 下移
       */
      downOrganization () {
        console.log('下移')
        var toUp = {}
        var toDown = this.selectedList
        this.organizationTree.forEach((item) => {
          if (item.treeIndex === (this.selectedList.treeIndex.replace(/\d$/, this.selectedList.sort - 0 + 1))) {
            toUp = item
          }
        })
        this.organizationData.forEach((item, index) => {
          if (item.id === toUp.id) {
            toUp.sort--
            this.organizationData.$set(index, toUp)
          } else if (item.id === toDown.id) {
            toDown.sort++
            this.organizationData.$set(index, toDown)
          }
        })
        this.selectedTreeIndex = this.selectedTreeIndex.replace(/\d$/, toDown.sort)
        var params = [toUp, toDown]
        console.log('要修改的数组')
        console.log(params)
      },

      /**
       * 获取当前项的兄弟节点
       */
      getBrother (list, relation) {
        var brothers = this.groupLists[list.parent]
        if (!relation) return brothers
        if (relation > 0) {
          return brothers.filter((item) => {
            return item.sort > list.sort
          })
        } else {
          return brothers.filter((item) => {
            return item.sort < list.sort
          })
        }
      },

      onCloseEditModal () {
        this.$resetValidation()
        this.showModal = false
        this.editing = false
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
      padding 30px
      .title-box
        height 50px
        line-height 50px
        .title
          font-size 30px
        .level
          background #ff6600
          color #FFF
          padding 3px
          margin-left 10px
      .content-box
        margin-top 20px
        .row
          height 40px
          line-height 40px
          .label
            display inline-block
            width 70px
            text-align right
            color #999
          .value
            margin-left 30px
</style>
