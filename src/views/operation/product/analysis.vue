<template>
  <div class="main">
    <div class="main-title bordered row">
      <div class="col-4">
        <h2>使用分析</h2>
      </div>
      <div class="col-20">
        <div class="filter-bar">
          <div class="filter-group fr">
            <div class="filter-group-item">
              <date-time-range-picker></date-time-range-picker>
            </div>
            <div class="filter-group-item">
              <radio-button-group :items="periods" :value.sync="period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel no-split-line mt20">
      <div class="panel-hd panel-hd-full bordered">
        <h2>产品使用时长</h2>
      </div>
      <div class="panel-bd">
        <interval :data="duration.data" :options="duration.options"></interval>
      </div>
    </div>
    <div class="panel no-split-line">
      <div class="panel-hd panel-hd-full bordered">
        <h2>产品使用次数</h2>
      </div>
      <div class="panel-bd">
        <interval :data="times.data" :options="times.options"></interval>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd panel-hd-full bordered">
        <h2>产品使用时段分布</h2>
      </div>
      <div class="panel-bd">
        <interval :data="userperiod.data" :options="userperiod.options"></interval>
      </div>
    </div>
  </div>
</template>

<script>
// import api from 'api'
import { globalMixins } from 'src/mixins'
import RadioButtonGroup from 'components/RadioButtonGroup'
import DateTimeRangePicker from 'components/DateTimeRangePicker'
import TimeLine from 'components/g2-charts/TimeLine'
import Interval from 'components/g2-charts/Interval'
import Mock from 'mockjs'

export default {
  name: 'Portrait',

  mixins: [globalMixins],

  components: {
    TimeLine,
    DateTimeRangePicker,
    RadioButtonGroup,
    Interval
  },

  data () {
    return {
      duration: {
        options: {},
        data: []
      },
      times: {
        options: {},
        data: []
      },
      userperiod: {
        options: {},
        data: []
      },
      period: 7,
      periods: [
        {
          value: 1,
          label: '24h'
        },
        {
          value: 7,
          label: '7天'
        },
        {
          value: 30,
          label: '30天'
        }
      ]
    }
  },

  ready () {
    var durationOptions = {
      stack: true,
      props: {
        height: 300,
        plotCfg: {
          margin: [40, 20, 80, 60]
        }
      },
      defs: {
        'duration': {
          type: 'cat',
          alias: '时间'
        },
        'count': {
          alias: '数量',
          min: 0
        }
      },
      position: 'duration*count',
      color: 'duration'
    }
    this.duration.data = Mock.mock({
      'list|9': [{
        'duration|+1': ['1小时以内', '2-3小时', '3-4小时', '5-6小时', '7-8小时', '9-10小时', '10-11小时', '11-12小时', '12-13小时'],
        'count|100-2200': 9
      }]
    }).list
    this.duration.options = durationOptions

    var timesOptions = {
      stack: true,
      props: {
        height: 300,
        plotCfg: {
          margin: [40, 20, 80, 60]
        }
      },
      defs: {
        'times': {
          type: 'cat',
          alias: ''
        },
        'count': {
          alias: '数量',
          min: 0
        }
      },
      position: 'times*count',
      color: 'times'
    }
    this.times.data = Mock.mock({
      'list|9': [{
        'times|+1': ['1', '2-10', '10-20', '20-50', '50-70', '70-100', '100-150', '150-200', '200-300'],
        'count|100-12200': 9
      }]
    }).list
    this.times.options = timesOptions

    var userperiodOptions = {
      stack: true,
      props: {
        height: 300,
        plotCfg: {
          margin: [40, 20, 80, 60]
        }
      },
      defs: {
        'userperiod': {
          type: 'cat',
          alias: ''
        },
        'count': {
          alias: '数量',
          min: 0
        }
      },
      position: 'userperiod*count',
      color: 'userperiod'
    }
    this.userperiod.data = Mock.mock({
      'list|9': [{
        'userperiod|+1': ['0-1', '2-3', '4-5', '6-7', '8-9', '10-11', '12-13', '14-15', '16-17'],
        'count|100-12200': 9
      }]
    }).list
    this.userperiod.options = userperiodOptions
  },

  methods: {
  }
}
</script>
