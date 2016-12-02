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
        <x-table :headers="columns" :rows="menuList" :page="page" :loading="loadingData" @page-count-update="onPageCountUpdate" @current-page-change="onCurrentPageChange" @tbody-name="onNameClick" :simple-page="true">
          <div class="filter-bar" slot="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" placeholder="请输入关键字" @cancel="getMenus(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getMenus(true)">
                  <button slot="search-button" @click="getMenus(true)" class="btn">{{ $t('common.search') }}</button>
                </search-box>
              </div>
            </div>

            <div class="filter-group fl">

              <span class="mr20">菜单列表</span>

              <span class="">{{ $t('operation.product.device.alert.time') }}: </span>
              <x-select width="98px" size="small" :label="rangeOption.label">
                <select v-model="rangeOption" @change="onRangeOptionChange">
                  <option v-for="option in timeRangeOptions" :value="option">{{ option.label }}</option>
                </select>
              </x-select>
              <date-time-range-picker v-if="rangeOption.value === 'specified'" @timechange="onTimeChange" :start-offset="365" :show-time="false"></date-time-range-picker>

            </div>

          </div>
        </x-table>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import locales from 'consts/locales/index'
import formatDate from 'filters/format-date'
import api from 'api'
// import * as config from 'consts/config'
import { pluginMixins } from '../../mixins'

export default {
  name: 'MenuList',

  mixins: [pluginMixins],

  vuex: {
    getters: {
      currentMember: ({ system }) => system.currentMember
    }
  },

  components: {
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
      searching: false,
      rangeOption: {
        label: this.$t('common.any'),
        value: 'any'
      },
      timeRangeOptions: locales[Vue.config.lang].data.TIME_RANGE_OPTIONS,
      startTime: new Date(new Date() - 365 * 1000 * 60 * 60 * 24),
      endTime: new Date()
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
        filter: ['_id', 'name', 'creator', 'create_time', 'pageviews', 'status'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        query: {},
        order: {
          create_time: -1
        }
      }

      if (this.rangeOption.value === 'specified') {
        condition.query['create_time'] = {
          '$gte': formatDate(this.startTime, 'yyyy-MM-ddT00:00:00.000Z', true),
          '$lte': formatDate(this.endTime, 'yyyy-MM-ddT23:59:59.999Z', true)
        }
      }

      if (this.query.length > 0) {
        condition.query['name'] = {$regex: this.query, $options: 'i'}
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
    },

    /**
     * 处理时间区段改变
     */
    onRangeOptionChange () {
      if (this.rangeOption.value === 'any') {
        this.getMenus(true)
      }
    },

    /**
     * 时间范围改变
     * @param  {[type]} startDate [description]
     * @param  {[type]} endDate   [description]
     * @return {[type]}           [description]
     */
    onTimeChange (start, end) {
      this.startTime = start
      this.endTime = end
      this.getMenus(true)
    }
  }
}
</script>
