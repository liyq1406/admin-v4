<template>
  <div class="main">
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <a class="btn btn-primary" v-link="{path: '/dev/data/statistics-rule/device/add'}"><i class="fa fa-plus"></i>添加统计规则</a>
          </div>
        </div>
        <x-table :headers="headers" :rows="rows" @tbody-id="editRule">
          <div class="filter-bar" slot="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box
                  :key="query"
                  :active="searching"
                  :placeholder="$t('common.placeholder.search')"
                  @cancel=""
                  @search-activate="toggleSearching"
                  @search-deactivate="toggleSearching"
                  @search="handleSearch"
                  @press-enter="">
                  <button slot="search-button" @click="getMembers(true)" class="btn"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
          </div>
        </x-table>
      </div>
    </div>
  </div>
</template>

<script>
import * as config from 'consts/config'
import formatDate from 'filters/format-date'
import api from 'api'

export default {
  name: 'statictis-rule',
  components: {
  },

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  data () {
    return {
      query: '',
      searching: false,
      selectedProduct: {
        label: '全部',
        value: 0
      },
      rules: [],
      countPerPage: config.COUNT_PER_PAGE,
      currentPage: 1,
      total: 0,
      statisticsRules: [],
      headers: [
        {
          key: 'id',
          title: '规则ID'
        },
        {
          key: 'name',
          title: '规则名称'
        },
        {
          key: 'snapshot_name',
          title: '快照名称'
        },
        {
          key: 'description',
          title: '描述'
        },
        {
          key: 'create_time',
          title: '创建时间'
        },
        {
          key: 'autor',
          title: '创建者'
        },
        {
          key: 'status',
          title: '状态'
        }
      ]
    }
  },

  route: {
    data () {
      if (this.products && this.products.length) {
        this.getStatisticRules()
      }
    }
  },

  computed: {
    srQueryCondition () {
      let params = {
        offset: 0,
        limit: 10000, // 取所有规则
        product_id: [],
        type: 1
      }
      if (this.products && this.products.length) {
        this.products.forEach((item) => {
          params.product_id.push(item.id)
        })
      }
      return params
    },
    // 下拉选项
    rows () {
      let res = []
      let tempRules = _.clone(this.statisticsRules)
      if (this.query) {
        tempRules = _.filter(tempRules, (item) => {
          return item.name.indexOf(this.query) > -1 || item.snapshot_name.indexOf(this.query) > -1 || item.describe.indexOf(this.query) > -1
        })
      }
      tempRules.forEach((item) => {
        let status = ''
        if (item.status === 1) {
          status = '<span class="hl-green">启用</span>'
        } else {
          status = '<span class="hl-gray">停用</span>'
        }
        res.push({
          id: '<a class="hl-red">' + (item.id || ' - ') + '</a>',
          name: item.name,
          snapshot_name: item.snapshot_name,
          description: item.describe,
          create_time: formatDate(item.create_time),
          autor: item.creator,
          status: status,
          timeOrigin: item.create_time,
          idOrigin: item.id
        })
      })

      res.sort((a, b) => {
        return new Date(b.timeOrigin) - new Date(a.timeOrigin)
      })
      return res
    }
  },

  watch: {
    products () {
      if (this.products && this.products.length) {
        this.getStatisticRules()
      }
    }
  },

  methods: {
    setQuery (query) {
      this.query = query
    },

    handleSearch (val) {
      this.query = val
      if (this.query.length === 0) {
      }
    },

    toggleSearching () {
      this.searching = !this.searching
    },

    cancelSearching () {
      this.setQuery('')
    },
    /**
     * 获取统计快照规则
     * @author guohao
     */
    getStatisticRules () {
      api.snapshot.getAllStatisticRules(this.srQueryCondition).then((res) => {
        if (res.status === 200 && res.data.list && res.data.list.length) {
          res.data.list.sort((a, b) => {
            a = +new Date(a.create_time)
            b = +new Date(b.create_time)
            return a - b
          })
          this.statisticsRules = res.data.list
        } else {
          this.statisticsRules = []
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    editRule (rule) {
      this.$route.router.go({path: 'device/edit/' + rule.idOrigin})
    }
  }
}
</script>
<style lang='stylus'>
</style>
