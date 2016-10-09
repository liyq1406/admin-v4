<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>菜单管理</h2>
    </div>
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <a class="btn btn-primary" v-link="{path: 'menu/add'}"><i class="fa fa-plus"></i>添加菜单</a>
          </div>
        </div>
        <x-table :headers="columns" :tables="menuList" :page="page" :loading="loadingData" @page-count-update="onPageCountUpdate" @current-page-change="onCurrentPageChange" @tbody-name="onNameClick" :simple-page="true">
          <div class="filter-bar" slot="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" placeholder="请输入关键字" @cancel="getMenus(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getMenus(true)">
                  <button slot="search-button" @click="getMenus(true)" class="btn">{{ $t('common.search') }}</button>
                </search-box>
              </div>
            </div>
            <h3>菜单列表</h3>
          </div>
        </x-table>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
// import * as config from 'consts/config'
import Select from 'components/Select'
import SearchBox from 'components/SearchBox'
import Table from 'components/Table'
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../../mixins'
import { formatDate } from 'filters/format-date'

export default {
  name: 'MenuList',

  mixins: [globalMixins, pluginMixins],

  vuex: {
    getters: {
      currentMember: ({ system }) => system.currentMember
    }
  },

  components: {
    SearchBox,
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
      key: '',
      loadingData: false,
      menus: [],
      total: 0,
      countPerPage: 10,
      currentPage: 1,
      query: '',
      searching: false
    }
  },

  computed: {
    // 菜单列表
    menuList () {
      let result = []
      this.menus.forEach((item) => {
        result.push({
          name: `<a class="hl-red">${item.name}</a>`,
          creator: item.creator,
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

    // 菜单查询条件
    queryCondition () {
      var condition = {
        filter: ['name', 'creator', 'create_time', 'pageviews', 'status'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        query: {},
        order: {
          create_time: -1
        }
      }

      if (this.query.length > 0) {
        condition.query['label'] = {$regex: this.query, $options: 'i'}
      }

      return condition
    }
  },

  route: {
    data () {
      this.getMenus()
    }
  },

  methods: {
    /**
     * 处理标题点击
     * @author shengzhi
     * @param {Object} menu 目标菜单
     */
    onNameClick (menu) {
      this.$route.router.go({path: `${menu.origin._id}/edit`, append: true})
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
      this.getMenus()
    },

    /**
     * 获取标签列表
     */
    getMenus (reset) {
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      if (reset) {
        this.currentPage = 1
      }
      this.loadingData = true
      api.recipes.getMenus(appId, token, this.queryCondition).then((res) => {
        if (res.status === 200) {
          // 虚拟数据开始----------------------------
          // res.data.list = [{
          //   _id: '适合早餐的10道美食',
          //   name: '下午茶',
          //   pageviews: 123,
          //   create_time: '2015-06-11T12:09:11Z',
          //   creator: '1207d2acabb5a801',
          //   status: 0
          // }, {
          //   _id: 'asdasdfasda',
          //   name: '懒人妙招，5分钟可以完成的菜品有哪些',
          //   pageviews: 123,
          //   create_time: '2015-06-11T12:09:11Z',
          //   creator: '1207d2acabb5a801',
          //   status: 0
          // }]
          // res.data.count = 2
          // 虚拟数据结束----------------------------

          // 菜单列表
          this.menus = res.data.list
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
     * 搜索
     * @author shengzhi
     */
    handleSearch () {
      if (this.query.length === 0) {
        this.getMenus()
      }
    },

    /**
     * 切换搜索
     * @author shengzhi
     */
    toggleSearching () {
      this.searching = !this.searching
    },

    /**
     * 取消搜索
     * @author shengzhi
     */
    cancelSearching () {
      this.getMenus()
    }
  }
}
</script>
