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
      <x-table :headers="headers" :rows="rows" :loading="loadingData" :page="page" @tbody-account="goEdit">

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
  import api from 'api'
  import formatDate from 'filters/format-date'

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
          { label: '账户名', value: 'username' },
          { label: '联系人', value: 'contacter' },
          { label: '联系方式', value: 'contact_way' }
        ],

        queryType: {
          label: '账户名',
          value: 'username'
        },

        total: 0,
        countPerPage: 10,
        currentPage: 1,
        key: '',
        userList: [],
        organizationUsers: [],
        headers: [
          {
            key: 'account',
            title: '账户名'
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
            key: 'level',
            title: '组织级别'
          },
          {
            key: 'role',
            title: '角色'
          },
          {
            key: 'create_time',
            title: '创建时间'
          }
        ],
        organizations: [],
        majorClient: {}
      }
    },

    computed: {
      rows () {
        var result = []
        this.userList.forEach((item) => {
          let org
          if (item.organization === '0') {
            org = this.majorClient
          } else {
            org = _.find(this.organizations, (orgitem) => {
              return orgitem.id === item.organization
            })
          }
          result.push({
            account: '<a class="hl-red">' + (item.username || '-') + '</a>',
            organization: (org && org.name) || '-',
            role: item.role === 1 ? '管理员' : '普通成员',
            contacter: item.contacter || '-',
            contact_way: item.contact_way || '-',
            create_time: formatDate(item.create_time),
            level: this.computedLevelText(item.level),
            prototype: item
          })
        })
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
          condition.query[this.queryType.value] = {$like: this.key}
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
        this.getOrganization()
        this.getMajorClient()
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
        this.userList = []
        api.heavyBuyer.getOrganizationUsers(this.$route.params.id, this.queryCondition).then((res) => {
          if (res.status === 200 && res.data.list && res.data.list.length) {
            var lists = this.resetLevel(res.data.list)
            this.userList = lists
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },
      goEdit (table) {
        this.$route.router.go('/operation/major-clients/' + this.$route.params.id + '/account/edit/' + table.prototype.id)
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
      },
      getOrganization () {
        api.heavyBuyer.getOrganizationList(this.$route.params.id, {}).then((res) => {
          if (res.status === 200) {
            this.organizations = res.data.list
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },
      getMajorClient () {
        var params = {
          filter: [
            'name'
          ],
          limit: 1,
          query: {
            'id': { $in: [this.$route.params.id] }
          }
        }
        api.heavyBuyer.getHeavyBuyer(params).then((res) => {
          if (res.status === 200) {
            this.majorClient = res.data.list[0]
          }
        }).catch((err) => {
          this.handleError(err)
        })
      },

      computedLevelText (level) {
        var result = ''
        const TEXTS = '一二三四五六七八九十'
        result = TEXTS.split('')[level - 1] + '级组织' || '十级以上'
        return result
      },

      /**
       * 算出等级
       */
      resetLevel (lists) {
        if (!lists.length) return lists
        var result = _.clone(lists)

        var noLevelList = lists.filter((item) => !item.level)
        if (!noLevelList.length) return result

        var gain = false
        noLevelList.forEach((item) => {
          var parentId = item.organization
          var parent = {}
          if (parentId && parentId - 0 !== 0) {
            result.forEach((item2) => {
              if (item2.id === parentId) {
                parent = item2
              }
            })
          }
          if (parent.level) {
            item.level = parent.level + 1
            gain = true
          }
          if (parentId - 0 === 0) {
            item.level = 1
            gain = true
          }
        })
        if (gain) {
          return this.resetLevel(result)
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

  .form
    max-width 640px

  .select-group
    .x-select
      display inline-block
</style>
