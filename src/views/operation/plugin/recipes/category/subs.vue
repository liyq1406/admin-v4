<template>
  <div class="main">
    <div class="main-title">
      <h2>类别管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>

    <div class="panel mt20">
      <div class="panel-hd">
        <div class="actions">
          <button @click="addCategory" class="btn btn-ghost"><i class="fa fa-plus"></i>添加子类别</button>
        </div>
        <h2>{{ parentCategory.name }}</h2>
      </div>
      <div class="panel-bd">
        <x-table :headers="columns" :tables="categoryList" :page="page" :loading="loadingData" @page-count-update="onPageCountUpdate" @current-page-change="onCurrentPageChange" @tbody-operation="editCategory" :simple-page="true"></x-table>
      </div>
    </div>

    <!-- 添加/修改类别浮层-->
    <category-modal :is-show.sync="modal.isShow" :type="modal.type" :category="category" :is-sub="true" @submit-success="onSubmitSuccess"></category-modal>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../../mixins'
import Breadcrumb from 'components/Breadcrumb'
import Table from 'components/Table'
import CategoryModal from './components/CategoryModal'
import api from 'api'
import _ from 'lodash'

export default {
  name: 'SubCategoryList',

  layout: 'admin',

  mixins: [globalMixins, pluginMixins],

  components: {
    Breadcrumb,
    CategoryModal,
    'x-table': Table
  },

  data () {
    return {
      breadcrumbNav: [{
        label: '菜谱类别',
        link: `/operation/plugins/recipes/${this.$route.params.app_id}/categories`
      }, {
        label: '菜谱子类别'
      }],
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
      parentCategory: {},
      subCategories: [],
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
        instructions: ''
      },
      category: {},
      delChecked: false
    }
  },

  route: {
    data () {
      this.getParent()
      this.getSubCategories()
    }
  },

  computed: {
    // 类别列表
    categoryList () {
      let result = []
      this.subCategories.forEach((item) => {
        result.push({
          name: `<a class="hl-red">${item.name}</a>`,
          instructions: item.instructions || '-',
          operation: '<a class="hl-red">编辑</a>',
          prototype: item
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
          parent_id: this.$route.params.parent_id
        },
        order: {
          created_at: -1
        }
      }
      return condition
    }
  },

  methods: {
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
      this.getSubCategories()
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
      this.category = _.clone(category.prototype)
    },

    /**
     * 处理成功提交
     * @author shengzhi
     */
    onSubmitSuccess () {
      this.getSubCategories()
    },

    /**
     * 获取父类信息
     * @author shengzhi
     */
    getParent () {
      let params = {
        filter: ['_id', 'name'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        query: {},
        order: {
          created_at: -1
        }
      }
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      params.query._id = this.$route.params.parent_id
      api.recipes.getCategories(appId, token, params).then((res) => {
        if (res.status === 200) {
          this.parentCategory = res.data.list[0]
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 获取子类列表
     * @author shengzhi
     */
    getSubCategories () {
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token
      this.loadingData = true
      api.recipes.getCategories(appId, token, this.queryCondition).then((res) => {
        if (res.status === 200) {
          this.subCategories = res.data.list
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
