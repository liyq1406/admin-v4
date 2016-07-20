<template>
  <div class="main">
    <div class="main-title">
      <h2>热力分布</h2>
    </div>
    <div class="panel">
      <div class="panel-hd">
          <h2>热力分布</h2>
      </div>
      <div class="panel-bd">
        <div class="data-table">
          <div class="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <button class="btn btn-ghost btn-sm"><i class="fa fa- fa-share-square-o"></i></button>
              </div>
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" @cancel="" placeholder="请输入搜索内容" @search-activate="" @search-deactivate="" @search="" @press-enter="">
                  <button slot="search-button" @click="" class="btn btn-primary"><i class="fa fa-search"></i></button>
                  <label>{{ $t('ui.user.search_user') }}</label>
                </search-box>
              </div>
            </div>
            <h3>明细</h3>
          </div>
          <c-table :headers="headers" :tables="tables" :page="page"></c-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import api from 'api'
import SearchBox from 'components/SearchBox'
import Table from 'components/Table'
import { globalMixins } from 'src/mixins'

export default {
  name: 'Distributing',

  mixins: [globalMixins],

  components: {
    'search-box': SearchBox,
    'c-table': Table
  },

  data () {
    return {
      query: '',
      total: 1321,
      currentPage: 1,
      countPerPage: 5,
      distributes: [
        {
          region: '广东',
          mild: '2918 (3.74%)',
          moderate: '2918 (3.74%)',
          severe: '2918 (3.74%)',
          activated: 6513
        },
        {
          region: '广东',
          mild: '2918 (3.74%)',
          moderate: '2918 (3.74%)',
          severe: '2918 (3.74%)',
          activated: 6513
        }
      ],
      headers: [
        {
          key: 'region',
          title: '地区'
        },
        {
          key: 'mild',
          title: '轻度',
          class: 'tac'
        },
        {
          key: 'moderate',
          title: '中度',
          class: 'tac'
        },
        {
          key: 'severe',
          title: '重度',
          class: 'tac'
        },
        {
          key: 'activated',
          title: '激活设备',
          class: 'tac'
        }
      ]
    }
  },

  computed: {
    page () {
      return {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
    },
    tables () {
      var result = []
      this.distributes.map((item) => {
        var distribute = {
          region: item.region,
          mild: item.mild,
          moderate: item.moderate,
          severe: item.severe,
          activated: item.activated,
          prototype: item
        }
        result.push(distribute)
      })
      return result
    }
  },
  ready () {
  },

  methods: {
  }
}
</script>
