<template>
  <div class="main">
    <div class="main-title">
      <h2>大客户管理</h2>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <h2>用户趋势</h2>
      </div>
      <div class="panel-bd">
        <div class="filter-bar filter-bar-head">
          <div class="filter-group fr">
            <div class="filter-group-item">
              <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
            </div>
            <div class="filter-group-item">
              <date-time-range-picker></date-time-range-picker>
            </div>
            <div class="filter-group-item">
              <radio-button-group :items="locales.data.PERIODS" :value.sync="7"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
            </div>
          </div>
        </div>
        <time-line :data="trends" :type="'smooth'"></time-line>
      </div>
    </div>
    <div class="row statistic-group">
      <div class="col-6">
        <statistic :info="majorSummary.monthIncrease" :title="majorSummary.monthIncrease.title" :has-target="true" align="left">
          <div>{{majorSummary.monthIncrease.target.title}}:{{majorSummary.monthIncrease.target.value}} <i class="change-reduse">({{majorSummary.monthIncrease.target.change}})</i></div>
        </statistic>
      </div>
      <div class="col-6">
        <statistic :info="majorSummary.number" :title="majorSummary.number.title" :has-target="true" align="left">
          <div>{{majorSummary.monthIncrease.target.title}}:{{majorSummary.monthIncrease.target.value}} <i class="change-reduse">({{majorSummary.monthIncrease.target.change}})</i></div>
        </statistic>
      </div>
      <div class="col-6">
        <statistic :info="majorSummary.completion" :title="majorSummary.completion.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="majorSummary.percent" :title="majorSummary.percent.title" align="left"></statistic>
      </div>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fl">
              <div class="filter-group-item">
                <v-select label="全部" width='110px' size="small">
                  <span slot="label">显示</span>
                </v-select>
              </div>
            </div>
            <div class="filter-group fr">
              <div class="filter-group-item">
                <button class="btn btn-ghost btn-sm"><i class="fa fa- fa-share-square-o"></i></button>
              </div>
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" @cancel="" :placeholder="$t('ui.user.fields.account')" @search-activate="" @search-deactivate="" @search="" @press-enter="">
                  <button slot="search-button" @click="" class="btn btn-primary"><i class="fa fa-search"></i></button>
                  <label>{{ $t('ui.user.search_user') }}</label>
                </search-box>
              </div>
            </div>
          </div>
          <c-table :headers="headers" :tables="tables" :page="page" ></c-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBox from 'components/SearchBox'
import Select from 'components/Select'
import Table from 'components/Table'
import { globalMixins } from 'src/mixins'
import Statistic from 'components/Statistic'
import RadioButtonGroup from 'components/RadioButtonGroup'
import DateTimeRangePicker from 'components/DateTimeRangePicker'
import TimeLine from 'components/g2-charts/TimeLine'
import Mock from 'mockjs'

export default {
  name: 'MajorClients',

  mixins: [globalMixins],

  components: {
    'search-box': SearchBox,
    'v-select': Select,
    'c-table': Table,
    Statistic,
    RadioButtonGroup,
    DateTimeRangePicker,
    TimeLine
  },

  data () {
    return {
      query: '',
      searching: false,
      total: 0,
      currentPage: 1,
      countPerPage: 10,
      loadingData: false,
      majorSummary: {
        monthIncrease: {
          total: 38,
          change: 21,
          title: '月新增数',
          target: {
            title: '年目标',
            value: 39292,
            change: -245
          }
        },
        number: {
          total: 318,
          title: '年大客户数'
        },
        completion: {
          total: 54,
          unit: '%',
          change: 23,
          title: '年大客户目标完成率'
        },
        percent: {
          total: 38,
          unit: '%',
          change: 24,
          title: '大客户占比'
        }
      },
      trends: null,
      majorClients: [
        {
          name: 'Google',
          create_date: '2016-1-1 19:21:32',
          place: '美国洛杉矶',
          profession: '互联网',
          contact: 'jon',
          contact_information: '158023234',
          expand: '暂未定义'
        },
        {
          name: 'Google',
          create_date: '2016-1-1 19:21:32',
          place: '美国洛杉矶',
          profession: '互联网',
          contact: 'jon',
          contact_information: '158023234',
          expand: '暂未定义'
        }
      ],
      headers: [
        {
          key: 'name',
          title: '名称'
        },
        {
          key: 'create_date',
          title: '创建时间'
        },
        {
          key: 'place',
          title: '地点',
          class: 'tac'
        },
        {
          key: 'profession',
          title: '行业',
          class: 'tac'
        },
        {
          key: 'contact',
          title: '联系人',
          class: 'tac'
        },
        {
          key: 'contact_information',
          title: '联系方式',
          class: 'tac'
        },
        {
          key: 'expand',
          title: '拓展',
          class: 'tac'
        }
      ]
    }
  },
  computed: {
    page () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },
    tables () {
      var result = []
      this.majorClients.map((item) => {
        var majorClient = {
          name: item.name,
          create_date: item.create_date,
          place: item.place,
          profession: item.profession,
          contact: item.contact,
          contact_information: item.contact_information,
          expand: item.expand,
          prototype: item
        }
        result.push(majorClient)
      })
      return result
    }
  },
  ready () {
    this.trends = Mock.mock({
      'list|14': [{
        'date|+1': [
          new Date(2016, 7, 15),
          new Date(2016, 7, 16),
          new Date(2016, 7, 17),
          new Date(2016, 7, 18),
          new Date(2016, 7, 19),
          new Date(2016, 7, 20),
          new Date(2016, 7, 21)
        ],
        'count|+1': [6, 8, 9, 3, 9, 3, 9]
      }]
    }).list
  }
}
</script>
