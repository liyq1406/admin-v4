<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>内容管理</h2>
    </div>
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <a class="btn btn-primary" v-link="{path: 'article/add', append: true}"><i class="fa fa-plus"></i>添加文章</a>
          </div>
        </div>
        <x-table :headers="columns" :tables="articleList" :page="page" :loading="loadingData" @page-count-update="onPageCountUpdate" @current-page-change="onCurrentPageChange" @tbody-name="onNameClick" :simple-page="true">
          <div class="filter-bar" slot="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="query" :placeholder="'请输入' + searchType.label" @cancel="getArticleList(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getArticleList(true)">
                  <v-select width="80px" :label="searchType.label" size="small">
                    <select v-model="searchType">
                      <option v-for="option in searchTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </v-select>
                  <button slot="search-button" class="btn" @click="getArticleList(true)">搜索</button>
                </search-box>
              </div>
            </div>
            <div class="filter-group">
              <div class="filter-group-item">
                <v-select width="100px" :label="queryType.label" size="small">
                  <label slot='label'>状态</label>
                  <select v-model="queryType" @change='getArticleList(true)'>
                    <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                  </select>
                </v-select>
              </div>
            </div>
          </div>
        </x-table>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import SearchBox from 'components/SearchBox'
import Select from 'components/Select'
import Pager from 'components/Pager'
import Table from 'components/Table'
import formatDate from 'filters/format-date'
import api from 'api'

export default {
  name: 'operate-article', // 运营管理-文章

  layout: 'admin',

  mixins: [globalMixins],

  components: {
    SearchBox,
    Pager,
    'v-select': Select,
    'x-table': Table
  },

  data () {
    return {
      columns: [{
        key: 'name',
        title: '标题'
      }, {
        key: 'creator',
        title: '作者',
        class: 'wp15'
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
      articles: [],
      queryTypeOptions: [
        { label: '全部', value: 0 },
        { label: '已发布', value: 1 },
        { label: '待审核', value: 2 }
      ],
      searchTypeOptions: [
        { label: '标题', value: 'name' },
        { label: '作者', value: 'creator' }
      ],
      searchType: {
        label: '标题',
        value: 'name'
      },
      queryType: {
        label: '全部',
        value: 0
      },
      total: 0,
      countPerPage: 10,
      currentPage: 1,
      query: '',
      searching: false,
      loadingData: false
    }
  },

  computed: {
    // 文章列表
    articleList () {
      let result = []
      this.articles.forEach((item) => {
        result.push({
          name: `<a class="hl-red">${item.name}</a>`,
          creator: item.creator,
          create_time: formatDate(item.create_time),
          pageviews: item.pageviews || 0,
          status: item.status === 1 ? '<span>已发布</span>' : '<span class="hl-orange">待审核</span>',
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
        filter: ['_id', 'name', 'creator', 'create_time', 'pageviews', 'status'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {'create_time': -1},
        query: {}
      }

      if (this.query !== '') {
        condition.query[this.searchType.value] = {$regex: this.query, $options: 'i'}
      }

      if (this.queryType.value === 1) {
        condition.query.status = 1
      } else if (this.queryType.value === 2) {
        condition.query.status = 0
      }
      return condition
    }
  },

  route: {
    data () {
      this.getArticleList()
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
      this.getArticleList()
    },

    /**
     * 处理标题点击
     * @author shengzhi
     * @param {Object} article 目标文章
     */
    onNameClick (article) {
      this.$route.router.go({path: `articles/${article.prototype._id}/edit`, append: true})
    },

    delArticle (id) {
      api.content.delArticle(this.$route.params.app_id, id).then((res) => {
        if (res.status === 200) {
          this.getArticleList()
        }
      }).catch((err) => {
        this.handleError(err)
      })
    },

    /**
     * 获取文章列表
     * @author shengzhi
     * @param {Boolean} reset 是否重置页码
     */
    getArticleList (reset) {
      if (reset) {
        this.currentPage = 1
      }
      this.loadingData = true
      api.content.getArticleList(this.$route.params.app_id, this.queryCondition).then((res) => {
        if (res.status === 200) {
          // 虚拟数据开始----------------------------
          // res.data.list = [{
          //   _id: '1231safsdf',
          //   name: '四月水果当季尝',
          //   creator: 'Jon',
          //   create_time: '2016-12-07T12:34:54Z',
          //   pageviews: 1203,
          //   status: 1
          // }, {
          //   _id: '1231safsde',
          //   name: '五一劳动节，享受劳动的乐趣',
          //   creator: 'Jon',
          //   create_time: '2016-12-07T12:34:54Z',
          //   pageviews: 1500,
          //   status: 0
          // }]
          // res.data.count = 2
          // 虚拟数据结束----------------------------
          this.articles = res.data.list
          this.total = res.data.count
          this.loadingData = false
        }
      }).catch((err) => {
        this.handleError(err)
        this.loadingData = false
      })
    },

    // 搜索
    handleSearch () {
      if (this.query.length === 0) {
        this.getArticleList()
      }
    },

    // 切换搜索
    toggleSearching () {
      this.searching = !this.searching
    },

    // 取消搜索
    cancelSearching () {
      this.getArticleList()
    }
  }
}
</script>
