<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>菜谱管理</h2>
    </div>
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <button @click.prevent.stop="isShowType = true" class="btn btn-primary"><i class="fa fa-plus"></i>添加菜谱</button>
          </div>
        </div>
        <x-table :headers="columns" :rows="recipeList" :page="page" :loading="loadingData" @page-count-update="onPageCountUpdate" @current-page-change="onCurrentPageChange" @tbody-name="onNameClick" :simple-page="true">
          <div class="filter-bar" slot="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box
                  :key="query"
                  :active="searching"
                  :placeholder="$t('ui.ingredient.placeholders.search_condi')"
                  @cancel="getRecipes(true)"
                  @search-activate="toggleSearching"
                  @search-deactivate="toggleSearching"
                  @search="handleSearch"
                  @press-enter="getRecipes(true)">
                  <button slot="search-button" @click="getRecipes(true)" class="btn">{{ $t('common.search') }}</button>
                </search-box>
              </div>
            </div>
            <div class="filter-group">
              <div class="filter-group-item">
                <x-select size="small" width="90px" placeholder="请选择类别" :label="category.label">
                  <span slot="label">分类：</span>
                  <select v-model="category" @change="getRecipes">
                    <option v-for="opt in categoryOptions" :value="opt">{{ opt.label }}</option>
                  </select>
                </x-select>
              </div>
              <div class="filter-group-item">
                <x-select size="small" width="90px" placeholder="请选择来源" :label="source.label">
                  <span slot="label">来源：</span>
                  <select v-model="source" @change="getRecipes">
                    <option v-for="opt in sourceOptions" :value="opt">{{ opt.label }}</option>
                  </select>
                </x-select>
              </div>
              <div class="filter-group-item">
                <x-select size="small" width="90px" placeholder="请选择状态" :label="status.label">
                  <span slot="label">状态：</span>
                  <select v-model="status" @change="getRecipes">
                    <option v-for="opt in statusOptions" :value="opt">{{ opt.label }}</option>
                  </select>
                </x-select>
              </div>
              <div class="filter-group-item">
                <x-select size="small" width="90px" placeholder="请选择类型" :label="type.label">
                  <span slot="label">类型：</span>
                  <select v-model="type" @change="getRecipes">
                    <option v-for="opt in typeOptions" :value="opt">{{ opt.label }}</option>
                  </select>
                </x-select>
              </div>
            </div>
          </div>
        </x-table>
      </div>
    </div>
    <modal :show.sync="isShowType">
      <h3 slot="header">请选择菜谱类型</h3>
      <div slot="body" class="form">
        <div class="form-row row">
          <!-- <x-select size="small" width="120px" placeholder="请选择类型" :label="selectedType.label">
            <span slot="label">类型：</span>
            <select v-model="selectedType">
              <option v-for="opt in menuTypeOptions" :value="opt">{{ opt.label }}</option>
            </select>
          </x-select> -->
          <label class="form-control col-6">菜谱类型:</label>
          <div class="radio-group col-18">
            <label v-for="opt in menuTypeOptions" class="radio">
              <input type="radio" v-model="selectedType" name="currType" :value="opt" number required/>{{ opt.label }}
            </label>
          </div>
        </div>
        <div class="form-actions">
          <button @click.prevent.stop="jumpAdd" class="btn btn-primary">确定</button>
          <button @click.prevent.stop="cancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import api from 'api'
import * as config from 'consts/config'
import formatDate from 'filters/format-date'
import { pluginMixins } from '../../mixins'

export default {
  name: 'recipeList',

  mixins: [pluginMixins],

  components: {
  },

  data () {
    return {
      isShowType: false,
      columns: [{
        key: 'name',
        title: '标题',
        class: ''
      }, {
        key: 'creator',
        title: '作者',
        class: 'wp20'
      }, {
        key: 'type',
        title: '菜谱类型',
        class: 'wp20'
      }, {
        key: 'create_time',
        title: '创建时间',
        class: 'wp20'
      }, {
        key: 'pageviews',
        title: '浏览量',
        class: 'wp10'
      }, {
        key: 'status',
        title: '状态',
        class: 'wp10'
      }],
      query: '',
      recipes: [],
      searching: false,
      categories: [],
      category: {label: '全部', value: 'all'},
      sourceOptions: [
        {label: '全部', value: 'all'},
        {label: '官方菜谱', value: 1},
        {label: '用户上传', value: 2}
      ],
      source: {label: '全部', value: 'all'},
      typeOptions: [
        {label: '全部', value: 'all'},
        {label: '普通菜谱', value: 1},
        {label: '智能菜谱', value: 2},
        {label: '本地菜谱', value: 3}
      ],
      menuTypeOptions: [
        {label: '普通菜谱', value: 1},
        {label: '智能菜谱', value: 2},
        {label: '本地菜谱', value: 3}
      ],
      selectedType: {label: '普通菜谱', value: 1},
      type: {label: '全部', value: 'all'},
      statusOptions: [
        {label: '全部', value: 'all'},
        {label: '已发布', value: 1},
        {label: '待审核', value: 0}
      ],
      status: {label: '全部', value: 'all'},
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      loadingData: false
    }
  },

  computed: {
    // 菜谱列表
    recipeList () {
      let result = []
      var types = ['普通菜谱', '智能菜谱', '本地菜谱']
      this.recipes.forEach((item) => {
        result.push({
          name: `<a class="hl-red">${item.name}</a>`,
          creator: item.creator,
          type: '<span>' + types[item.type - 1] + '</span>',
          create_time: formatDate(item.create_time),
          pageviews: item.pageviews || 0,
          status: item.status === 1 ? '<span>已发布</span>' : '<span class="hl-orange">待审核</span>',
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

    /**
     * 菜谱分类选项
     */
    categoryOptions () {
      var result = [{label: '全部', value: 'all'}]
      if (this.categories.length > 0) {
        this.categories.forEach((item) => {
          let obj = {}
          obj.label = item.name
          obj.value = item.name
          result.push(obj)
        })
      }
      return result
    },

    /**
     * 菜谱查询条件
     * @return {Object} 查询条件
     */
    queryCondition () {
      var condition = {
        filter: ['_id', 'name', 'creator', 'create_time', 'pageviews', 'status', 'type'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        query: {},
        order: {
          create_time: -1
        }
      }

      // 搜索框中有关键词
      if (this.query.length > 0) {
        condition.query['name'] = {$regex: this.query, $options: 'i'}
      }

      // 分类
      if (this.category.value !== 'all') {
        condition.query['classification.main.name'] = this.category.value
      }

      // 来源
      if (this.source.value !== 'all') {
        condition.query['source'] = this.source.value
      }

      // 状态
      if (this.status.value !== 'all') {
        condition.query['status'] = this.status.value
      }

      // 类型
      if (this.type.value !== 'all') {
        condition.query['type'] = this.type.value
      }

      return condition
    }
  },

  route: {
    data () {
      // 获取菜谱类别
      this.getCategories()
      // 获取菜谱列表
      this.getRecipes()
    }
  },

  methods: {
    /**
     * 处理标题点击
     * @author shengzhi
     * @param {Object} recipe 目标菜谱
     */
    onNameClick (recipe) {
      var type = recipe.origin.type || 1
      this.$route.router.go({path: `${recipe.origin._id}/edit/${type}/basic-info`, append: true})
    },

    jumpAdd () {
      this.$route.router.go('/operation/plugins/recipes/' + this.$route.params.app_id + '/recipe/add/' + this.selectedType.value)
    },
    cancel () {
      this.isShowType = false
      this.selectedType = {label: '普通菜谱', value: 1}
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
      this.getRecipes()
    },

    /**
     * 获取菜谱列表
     * @author shengzhi
     */
    getRecipes (reset) {
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      if (reset) {
        this.currentPage = 1
      }

      this.loadingData = true
      api.recipes.getRecipes(appId, token, this.queryCondition).then((res) => {
        if (res.status === 200) {
          // 虚拟数据开始----------------------------
          // res.data.list = [{
          //   _id: '1231safsdf',
          //   name: '西红柿鸡蛋汤',
          //   creator: 'Jon',
          //   create_time: '2016-12-07T12:34:54Z',
          //   pageviews: 1203,
          //   status: 1
          // }, {
          //   _id: '1231safsde',
          //   name: '咖喱饭',
          //   creator: 'Jon',
          //   create_time: '2016-12-07T12:34:54Z',
          //   pageviews: 1500,
          //   status: 0
          // }]
          // res.data.count = 2
          // 虚拟数据结束----------------------------

          // 菜谱列表
          this.recipes = res.data.list
          // 记录数
          this.total = res.data.count
          this.loadingData = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    /**
     * 获取分类
     * @author shengzhi
     */
    getCategories () {
      var condition = {
        limit: 200,
        query: {
          parent_id: 0
        }
      }
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      api.recipes.getCategories(appId, token, condition).then((res) => {
        if (res.status === 200) {
          this.categories = res.data.list
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    // 搜索
    handleSearch (val) {
      this.query = val
      if (this.query.length === 0) {
        this.getRecipes()
      }
    },

    // 切换搜索
    toggleSearching () {
      this.searching = !this.searching
    },

    // 取消搜索
    cancelSearching () {
      this.getRecipes()
    },

    /**
     * TODO 删除？
     * 判断是否带有云菜谱
     * @param  {Array}   devices 菜谱设备
     * @return {Boolean}         是否带有云菜谱
     */
    hasCloudRecipe (devices) {
      let flag = false
      devices.map((item) => {
        if (item.autoexec.length) {
          flag = true
        }
      })
      return flag
    }
  }
}
</script>
