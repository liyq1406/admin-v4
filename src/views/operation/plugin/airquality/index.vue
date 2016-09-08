<template>
  <div class="main">
    <div class="main-title">
      <h2>环境数据</h2>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <x-table :headers="headers" :tables="tables" :loading="loadingData" :page="page" @theader-update-time="sortBySomeKey" @page-count-update="pageCountUpdate" @current-page-change="currentPageChange">
          <div class="filter-bar" slot="filter-bar">
            <div class="filter-group">
              <div class="filter-group-item">
                <span class="label">{{ $t('common.display') }}：</span>
                <!-- <x-select width="90px" size="small" :label="selectedOption.label">
                  <span slot="label">{{ $t('common.display') }}：</span>
                  <select v-model="selectedOption" @change="">
                    <option v-for="option in options" :value="option">{{ option.label }}</option>
                  </select>
                </x-select> -->
              </div>
              <div class="filter-group-item">
                <date-time-range-picker @timechange="timechange"></date-time-range-picker>
              </div>
              <div class="filter-group-item">
                <area-select :province.sync="area.province" :city.sync="area.city" :show-district="false" @province-change="getList" @city-change="getList" select-size="small"></area-select>
              </div>
            </div>
            <div class="filter-group fr">

            </div>
          </div>
        </x-table>
      </div>
    </div>

  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import * as config from 'consts/config'
import Table from 'components/Table'
import SearchBox from 'components/SearchBox'
import Select from 'components/Select'
import DateTimeRangePicker from 'components/DateTimeRangePicker'
import AreaSelect from 'components/AreaSelect'
import { formatDate } from 'src/filters'

import api from 'api'

export default {
  name: 'airquality',

  mixins: [globalMixins],

  components: {
    'x-select': Select,
    'x-table': Table,
    SearchBox,
    DateTimeRangePicker,
    AreaSelect
  },

  vuex: {
    getters: {
      products: ({ products }) => products.released
    }
  },

  data () {
    return {
      // 总数
      total: 0,
      // 每页数量
      countPerPage: config.COUNT_PER_PAGE,
      // 当前页
      currentPage: 1,
      // 正在加载数据
      loadingData: false,
      selectedOption: { label: '全部', value: 'all' },
      options: [
        { label: '全部', value: 'all' },
        { label: 'AQI', value: 'aqi' },
        { label: 'co', value: 'co' },
        { label: 'co', value: 'no2' }
      ],
      area: {
        province: {},
        city: {}
      },
      time: {
        startDate: new Date((+new Date()) - 7 * 1000 * 60 * 60 * 24),
        endDate: new Date()
      },
      headers: [
        {
          key: 'update_time',
          title: '时间',
          sortType: -1
        },
        {
          key: 'location',
          title: '地点'
        },
        {
          key: 'pm25',
          title: '室外pm2.5',
          class: 'tac'
        },
        {
          key: 'pm10',
          title: 'pm10',
          class: 'tac'
        },
        {
          key: 'pm25',
          title: 'pm25',
          class: 'tac'
        },
        {
          key: 'so2',
          title: 'so2',
          class: 'tac'
        },
        {
          key: 'no2',
          title: 'no2',
          class: 'tac'
        },
        {
          key: 'co',
          title: 'co',
          class: 'tac'
        },
        {
          key: 'o3',
          title: 'o3',
          class: 'tac'
        }
      ],
      dataList: [
        // {
        //   _id: '123',
        //   update_time: '2016-08-30T08:00:00.000Z',
        //   aqi: 'aqi',
        //   co: 'co',
        //   no2: 'no2',
        //   o3: 'o3',
        //   pm10: 'pm10',
        //   pm25: 'pm25',
        //   so2: 'so2',
        //   location: {
        //     country: 'CN',
        //     id: 'TUZHQFX485K9',
        //     name: '亚东',
        //     position: '亚东,日喀则,西藏,中国'
        //   }
        // }
      ]
    }
  },

  computed: {
    // 分页信息
    page () {
      return {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
    },

    // 查询条件
    // TODO 加了日期就获取不到数据 国辉
    queryCondition () {
      var condition = {
        // filter: ['id', 'account', 'nickname', 'email', 'phone', 'phone/email', 'create_date', 'source', 'status', 'phone_valid', 'email_valid'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {},
        query: {
          'update_time': {
            $gte: {
              '@date': this.time.startDate
            },
            $lte: {
              '@date': this.time.endDate
            }
          }
        }
      }

      this.headers.map((item) => {
        if (item.sortType) {
          condition.order[item.key] = (item.sortType === 1 ? '1' : '-1')
        }
      })

      if (this.queryAreaStr) {
        condition.query['location.position'] = {
          $regex: this.queryAreaStr,
          $options: 'i'
        }
      }

      return condition
    },

    queryAreaStr () {
      let result = ''
      if (this.area.province.proID) {
        result = this.area.province.name
      }
      if (this.area.city.proID) {
        result = this.area.city.name
      }
      result = result.substr(0, 2)
      return result
    },
    tables () {
      var result = []
      this.dataList.forEach((item) => {
        var table = {
          _id: item._id,
          update_time: formatDate(item.update_time),
          aqi: item.aqi,
          co: item.co,
          no2: item.no2,
          o3: item.o3,
          pm10: item.pm10,
          pm25: item.pm25,
          so2: item.so2,
          location: item.location.position,
          prototype: item
        }
        result.push(table)
      })
      return result
    }
  },

  route: {
    data () {
      this.getList()
    }
  },

  methods: {
    getList () {
      this.loadingData = true
      api.airquality.getAirQualitys(this.$route.params.app_id, this.queryCondition).then((res) => {
        console.log(res.data)
        this.dataList = res.data.list
        this.total = res.data.count
        this.loadingData = false
      }).catch((res) => {
        this.loadingData = false
        this.handleError(res)
      })
    },

    timechange (startDate, endDate) {
      let time = {
        startDate: startDate,
        endDate: endDate
      }
      this.time = time
      this.getList()
    },
    /**
     * 每页显示的数量改变
     * 国辉
     * @param  {[type]} count 每页显示数量
     * @return {[type]}       [description]
     */
    pageCountUpdate (count) {
      this.countPerPage = count
      this.getList()
    },
    /**
     * 当前页码改变
     * 国辉
     * @param  {[type]} number [description]
     * @return {[type]}        [description]
     */
    currentPageChange (number) {
      this.currentPage = number
      this.getList()
    },
    /**
     * 按某个属性排序
     * 国辉
     * @param  {[type]} table [description]
     * @return {[type]}       [description]
     */
    sortBySomeKey (header, index) {
      if (header.sortType === 1) {
        header.sortType = -1
      } else {
        header.sortType = 1
      }
      this.headers.$set(index, header)
      this.getList()
    }
  }
}
</script>

<style lang="stylus">
  .filter-group-item
    .label
      line-height 28px
</style>
