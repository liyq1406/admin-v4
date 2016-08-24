<template>
  <div class="main">
    <div class="main-title">
      <h2>产品信息</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel">
      <div class="panel-hd"></div>
      <div class="panel-bd">
        <div class="filter-bar">
          <div class="filter-group fl">
            <div class="filter-group-item ml10">
              <label>添加时间:</lable> <span>2016-03-19 08:18:08</span>
            </div>
            <div class="filter-group-item ml20">
              <label>操作者:</lable> <span>小孩</span>
            </div>
            <div class="filter-group-item ml20">
              <label>导入数量:</lable> <span>100</span>
            </div>
          </div>
          <div class="filter-group fr">
            <div class="filter-group-item">
              <search-box :key.sync="key">
                <x-select width="80px" :label="queryType.label" size="small">
                  <select v-model="queryType">
                    <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                  </select>
                </x-select>
                <button slot="search-button" @click.prevent="" class="btn btn-primary"><i class="fa fa-search"></i></button>
              </search-box>
            </div>
          </div>
        </div>
        <x-table :headers="headers" :tables="tables" :page="page" :loading="loadingData">
        </x-table>
      </div>
    </div>
  </div>
</template>

<script>
  // import locales from 'consts/locales/index'
  // import _ from 'lodash'
  import Breadcrumb from 'components/Breadcrumb'
  import Select from 'components/Select'
  import { globalMixins } from 'src/mixins'
  import Table from 'components/Table'
  import SearchBox from 'components/SearchBox'

  export default {
    name: 'TableDetails',

    mixins: [globalMixins],

    components: {
      'x-table': Table,
      'x-select': Select,
      Breadcrumb,
      SearchBox
    },

    data () {
      return {
        queryTypeOptions: [
          { label: 'Mac', value: 'mac' },
          { label: '序列号', value: 'sn' },
          { label: '设备ID', value: 'id' }
        ],
        queryType: {
          label: 'Mac',
          value: 'mac'
        },
        key: '',
        breadcrumbNav: [{
          label: '全部',
          link: `/dev/products/${this.$route.params.id}/info`
        }, {
          label: '添加记录'
        }],
        page: {
          total: 20, // 数据总数
          currentPage: 1, // 当前页
          countPerPage: 10 // 每页数量
        },
        tables: [
          {
            code: '<a class="hl-red">查看二维码</a>',
            id: '910289939481819',
            sn: 'aoiodfaow92103kd',
            mac: 'ACCF2356BF52'
          }, {
            code: '<a class="hl-red">查看二维码</a>',
            id: '910289939481819',
            sn: 'aoiodfaow92103kd',
            mac: 'ACCF2356BF52'
          }, {
            code: '<a class="hl-red">查看二维码</a>',
            id: '910289939481819',
            sn: 'aoiodfaow92103kd',
            mac: 'ACCF2356BF52'
          }
        ],
        headers: [
          {
            key: 'mac',
            title: 'Mac',
            class: 'tac'
          },
          {
            key: 'id',
            title: '设备ID',
            class: 'tac'
          },
          {
            key: 'sn',
            title: '序列号（SN)',
            class: 'tac'
          },
          {
            key: 'code',
            title: '二维码',
            class: 'tac'
          }
        ]
      }
    },

    computed: {
    },

    route: {
      data () {
      }
    },

    ready () {
    },
    methods: {
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
.dealer-label
  line-height 32px
.dealer-add-sumit
  margin-right 60px

</style>
