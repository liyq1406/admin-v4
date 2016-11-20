<template>
  <div class="panel dealer">
    <div class="panel-bd">
      <div class="action-bar">
        <div class="action-group" style="display:inline-block">
          <a v-link="'/operation/major-clients/' + $route.params.id + '/account/add'">
            <button class="btn btn-primary" :disabled="tips" :class="{'disabled': tips}"><i class="fa fa-plus"></i>添加账户</button>
          </a>
        </div>
      </div>
      <x-table :headers="headers" :tables="tables" :loading="loadingData" :page="page">

        <div class="filter-bar" slot="filter-bar">
          <div class="filter-group fl">
            <h3>账户列表</h3>
          </div>

          <div class="filter-group fr">
            <div class="filter-group-item">
              <button class="btn btn-ghost btn-sm" @click.stop="onExportBtnClick" :class="{'disabled': exporting}" :disabled="exporting"><i class="fa fa-share"></i></button>
            </div>
            <div class="filter-group-item">
              <search-box :key.sync="key" :active="searching" :placeholder="$t('common.placeholder.search')" @cancel="getData(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getData(true)">
                <x-select width="100px" :label="queryType.label" size="small">
                  <select v-model="queryType">
                    <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                  </select>
                </x-select>
                <button slot="search-button" @click.prevent="getData(true)" class="btn"><i class="fa fa-search"></i></button>
              </search-box>
            </div>
          </div>
        </div>
      </x-table>

    </div>
  </div>
</template>

<script>
  // import locales from 'consts/locales/index'
  // import api from 'api'
  // import formatDate from 'filters/format-date'

  export default {
    name: 'DealerList',

    mixins: [],

    components: {
    },

    data () {
      return {
        // 正在加载
        loadingData: false,
        // 正在导出
        exporting: false,
        // 正在搜索
        searching: false,

        queryTypeOptions: [
          // { label: '名称', value: 'name' },
          // { label: '帐号', value: 'email' },
          // { label: '联系人', value: 'contacter' }
        ],

        queryType: {
          label: '名称',
          value: 'name'
        },

        total: 0,
        countPerPage: 10,
        currentPage: 1,
        key: '',

        organizationUsers: [],
        headers: [
          {
            key: 'name',
            title: '客户名称'
          },
          {
            key: 'account',
            title: '账户名'
          },
          {
            key: 'password',
            title: '密码'
          },
          {
            key: 'contacter',
            title: '联系人'
          },
          {
            key: 'contact_way',
            title: '联系方式'
          },
          {
            key: 'organization',
            title: '所属组织'
          },
          {
            key: 'organization_level',
            title: '所属组织'
          },
          {
            key: 'state',
            title: '状态'
          },
          {
            key: 'last_login',
            title: '最后登陆'
          }
        ]
      }
    },

    computed: {
      tables () {
        var result = []
        return result
      },
      page () {
        return {
          total: this.total,
          countPerPage: this.countPerPage,
          currentPage: this.currentPage
        }
      },
      // 基本筛选条件
      baseCondition () {
        let condition = {
          filter: [],
          query: {},
          order: {
            // create_time: 'desc'
          }
        }

        if (this.key.length > 0) {
          condition.query[this.queryType.value] = {$in: [this.key]}
        }

        return condition
      },

      // 列表查询条件
      queryCondition () {
        let condition = _.cloneDeep(this.baseCondition)

        condition.limit = this.countPerPage
        condition.offset = (this.currentPage - 1) * this.countPerPage

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
      /**
       * 获取列表
       */
      getData (reset) {
        if (reset === true) {
          this.currentPage = 1
        }
        console.log('获取列表')
      },
      /**
       * 处理导出 CSV 按钮点击
       */
      onExportBtnClick () {
        console.log('导出')
      },

      // 切换搜索
      toggleSearching () {
        this.searching = !this.searching
      },

      // 搜索
      handleSearch () {
        if (this.key.length === 0) {
          this.getData(true)
        }
      },
      pageCountChange (countPerPage) {
        this.countPerPage = countPerPage
        this.getData()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../../assets/stylus/common'

  .form
    max-width 640px

  .select-group
    .x-select
      display inline-block
</style>
