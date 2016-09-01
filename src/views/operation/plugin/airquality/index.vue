<template>
  <div class="main">
    <div class="main-title">
      <h2>环境数据</h2>
    </div>

    <x-table :headers="headers">
      <div class="filter-bar" slot="filter-bar">
        <div class="filter-group">
          <div class="filter-group-item">
            <x-select width="90px" size="small" :label="selectedOption.label">
              <span slot="label">{{ $t('common.display') }}：</span>
              <select v-model="selectedOption" @change="">
                <option v-for="option in options" :value="option">{{ option.label }}</option>
              </select>
            </x-select>
          </div>
          <div class="filter-group-item">
            <date-time-range-picker @timechange=""></date-time-range-picker>
          </div>
          <div class="filter-group-item">
            <area-select :province.sync="area.province" :city.sync="area.city" :show-district="false" @province-change="area.type=1" select-size="small"></area-select>
          </div>
        </div>
        <div class="filter-group fr">

        </div>
      </div>
    </x-table>

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
      total: 0,
      countPerPage: config.COUNT_PER_PAGE,
      currentPage: 1,
      period: 7,
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
          title: '室外pm2.5'
        },
        {
          key: 'aqi',
          title: 'AQI'
        }
      ],
      dataList: [
        {
          _id: '123',
          update_time: '2016-08-30T08:00:00.000Z',
          aqi: 'aqi',
          co: 'co',
          no2: 'no2',
          o3: 'o3',
          pm10: 'pm10',
          pm25: 'pm25',
          so2: 'so2',
          location: {
            country: 'CN',
            id: 'TUZHQFX485K9',
            name: '亚东',
            position: '亚东,日喀则,西藏,中国'
          }
        }
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
    queryCondition () {
      let result = {}
      return result
    },

    tables () {
      var result = []
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
        this.loadingData = false
      }).catch((res) => {
        this.loadingData = false
        this.handleError(res)
      })
    }
  }
}
</script>
