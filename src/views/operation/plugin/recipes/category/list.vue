<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>类别管理</h2>
    </div>
    <div class="panel mt20">
      <div class="panel-hd">
        <div class="actions">
          <button @click="addCategory" class="btn btn-ghost" :disabled="addDisabled" :class="{'disabled':addDisabled}"><i class="fa fa-plus"></i>添加类别</button>
        </div>
        <h2>类别列表</h2>
      </div>
      <div class="panel-bd">
        <x-table :headers="columns" :tables="categoryList" :page="page" :loading="loadingData" @page-count-update="onPageCountUpdate" @current-page-change="onCurrentPageChange" @tbody-name="onNameClick" @tbody-operation="editCategory" :simple-page="true"></x-table>
      </div>
    </div>

    <!-- 添加/修改类别浮层-->
    <category-modal :is-show.sync="modal.isShow" :type="modal.type" :category="category" @submit-success="onSubmitSuccess"></category-modal>
  </div>
</template>

<script>
import api from 'api'
import Table from 'components/Table'
import CategoryModal from './components/CategoryModal'
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../../mixins'

export default {
  name: 'CategoryList',

  layout: 'admin',

  mixins: [globalMixins, pluginMixins],

  components: {
    CategoryModal,
    'x-table': Table
  },

  data () {
    return {
      maxCount: 50,
      columns: [{
        key: 'name',
        title: '名称',
        class: 'wp30'
      }, {
        key: 'instructions',
        title: '摘要'
      }, {
        key: 'operation',
        title: '操作',
        class: 'wp20'
      }],
      categories: [],
      loadingData: false,
      total: 0,
      countPerPage: 10,
      currentPage: 1,
      modal: {
        isShow: false,
        type: 'add'
      },
      addModel: {
        name: '',
        instructions: '',
        parent_id: 0
      },
      category: {},
      delChecked: false
    }
  },

  route: {
    data () {
      this.getCategories()
    }
  },

  computed: {
    // 是否允许添加
    addDisabled () {
      let result = true
      if (this.total < this.maxCount) {
        result = false
      }
      return result
    },

    // 类别列表
    categoryList () {
      let result = []
      this.categories.forEach((item) => {
        result.push({
          name: `<a class="hl-red">${item.name}</a>`,
          instructions: item.instructions || '<span class="hl-gray">描述类别的内容</span>',
          operation: '<a class="hl-red">编辑</a>',
          origin: item
        })
      })
      return result
    },

    // 分页信息
    page () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },

    // 查询条件
    queryCondition () {
      var condition = {
        filter: ['_id', 'name', 'instructions'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        query: {
          parent_id: {
            $in: [0]
          }
        }
      }
      return condition
    }
  },

  methods: {
    /**
     * 处理标题点击
     * @author shengzhi
     * @param {Object} category 目标分类
     */
    onNameClick (category) {
      this.$route.router.go({path: `${category.origin._id}`, append: true})
    },

    /**
     * 处理每页数量更新
     * @author shengzhi
     * @param {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
    },

    /**
     * 处理页码更新
     * @author shengzhi
     * @param {Number} page 页码
     */
    onCurrentPageChange (page) {
      this.currentPage = page
      this.getCategories()
    },

    /**
     * 添加类别
     * @author shengzhi
     */
    addCategory () {
      this.modal = {
        isShow: true,
        type: 'add'
      }
      this.category = _.clone(this.addModel)
    },

    /**
     * 编辑类别
     * @author shengzhi
     * @param {Object} category 类别
     */
    editCategory (category) {
      this.modal = {
        isShow: true,
        type: 'edit'
      }
      this.category = _.clone(category.origin)
    },

    /**
     * 处理成功提交
     * @author shengzhi
     */
    onSubmitSuccess () {
      this.getCategories()
    },

    /**
     * 获取一级类别
     * @author shengzhi
     */
    getCategories () {
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      this.loadingData = true
      api.recipes.getCategories(appId, token, this.queryCondition).then((res) => {
        if (res.status === 200) {
          // 虚拟数据开始----------------------------
          // res.data.list = [{
          //   _id: 'fasfwefe',
          //   name: '菜系',
          //   instructions: '描述类别的内容'
          // }, {
          //   _id: 'asdasdfasda',
          //   name: '肉类',
          //   instructions: '很好吃'
          // }]
          // res.data.count = 2
          // 虚拟数据结束----------------------------

          // 列表
          this.categories = res.data.list
          // 记录数
          this.total = res.data.count
          this.loadingData = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    }
  }
}
</script>
