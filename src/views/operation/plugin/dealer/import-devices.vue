<template>
  <div class="main">
    <div class="main-title">
      <h2>经销商管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel">
      <div class="panel-bd">
        <div class="filter-bar">
          <div class="filter-group fr">
            <div class="filter-group-item">
              <search-box :key.sync="key" :active="searching" :placeholder="$t('ui.overview.addForm.search_condi')" @cancel="getDealer(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getDealer(true)">
                <x-select width="100px" :label="queryType.label" size="small">
                  <select v-model="queryType">
                    <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                  </select>
                </x-select>
                <button slot="search-button" @click.prevent="getDealer(true)" class="btn"><i class="fa fa-search"></i></button>
              </search-box>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import { pluginMixins } from '../mixins'
  import api from 'api'
  import Select from 'components/Select'
  import SearchBox from 'components/SearchBox'
  import Table from 'components/Table'
  import Breadcrumb from 'components/Breadcrumb'

  export default {
    name: 'AddBroadcast',

    mixins: [globalMixins, pluginMixins],

    components: {
      'x-table': Table,
      'x-select': Select,
      SearchBox,
      Breadcrumb
    },

    data () {
      return {
        queryTypeOptions: [
          { label: '名称', value: 'name' },
          { label: '帐号', value: 'email' },
          { label: '联系人', value: 'contacter' }
        ],
        queryType: {
          label: '名称',
          value: 'name'
        },
        total: 0,
        countPerPage: 10,
        currentPage: 1,
        key: '',
        breadcrumbNav: [{
          label: '全部',
          link: `/operation/plugins/dealer/${this.$route.params.app_id}/list`
        }, {
          label: '经销商详情'
        }, {
          label: '添加设备'
        }]
      }
    },

    computed: {
      queryCondition () {
        var condition = {
          filter: ['id', 'name', 'email', 'phone', 'address', 'status', 'dealer_code', 'upper_dealer_code', 'region', 'contacter', 'sale_goal', 'saled_amount', 'create_time'],
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          query: {}
        }
        if (this.key.length > 0) {
          condition.query[this.queryType.value] = {$in: [this.key]}
        }
        return condition
      }
    },
    ready () {
      this.getDealer()
    },

    methods: {
      // 获取经销商列表
      getDealer (reset) {
        if (reset === true) {
          this.currentPage = 1
        }
        this.loadingData = true
        api.dealer.list(this.queryCondition).then((res) => {
          if (res.status === 200) {
            this.dealers = res.data.list
            this.total = res.data.count
            this.loadingData = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },
      // 切换搜索
      toggleSearching () {
        this.searching = !this.searching
      },
      // 搜索
      handleSearch () {
        if (this.key.length === 0) {
          this.getDealer(true)
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
