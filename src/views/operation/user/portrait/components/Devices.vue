<template>
  <div class="row">
    <div class="col-12">
      <chart :options="deviceOptions" :loading="loadingData" height="400px"></chart>
    </div>
    <div class="col-11 col-offset-1 data-table-wrap">
      <percent-table :headers="headers" :rows="rows" @theader-percent="sort"></percent-table>
    </div>
  </div>
</template>

<script>
import Chart from 'components/chart/index'
import api from 'api'

export default {
  name: 'Devices',

  components: {
    Chart
  },

  data () {
    return {
      headers: [
        {
          key: 'name',
          title: this.$t('operation.user.portrait.device.type')
        },
        {
          key: 'value',
          title: this.$t('common.count')
        },
        {
          key: 'percent',
          title: this.$t('common.percent'),
          sortType: -1
        }
      ],
      devices: []
    }
  },

  computed: {
    rows () {
      var result = []
      var total = 0
      this.devices.forEach((item) => {
        total += item.value - 0
      })
      this.devices.forEach((item) => {
        let percent = item.value / total
        percent = item.value / total * 100
        percent = percent.toFixed(1) + '%'
        var table = {
          name: item.name,
          value: item.value,
          percent: percent,
          prototype: item
        }
        result.push(table)
      })
      result.sort((a, b) => {
        return (a.value - b.value) * this.headers[this.headers.length - 1].sortType
      })
      return result
    },

    // 图表配置
    deviceOptions () {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          y: 20,
          data: _.map(this.devices, 'name')
        },
        series: [{
          name: this.$t('common.count'),
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: this.devices,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
    }
  },
  ready () {
    this.getData()
  },

  methods: {
    /**
     * 获取数据
     * @return {[type]} [description]
     */
    getData () {
      this.loadingData = true
      api.statistics.getUserMachine().then((res) => {
        // 以下为虚拟数据，勿删
        // 虚拟数据开始
        // res.data = [{
        //   machine_name: 'iPhone 5',
        //   total: 50
        // }, {
        //   machine_name: 'iPhone 6',
        //   total: 30
        // }, {
        //   machine_name: 'iPhone 7',
        //   total: 30
        // }]
        // 虚拟数据结束

        var result = []
        res.data.forEach((item) => {
          let obj = {
            name: item.machine_name,
            value: item.total
          }
          result.push(obj)
        })
        this.devices = result
        this.loadingData = false
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },
    // 排序
    sort (header) {
      this.headers.forEach((item) => {
        if (item.key === 'percent') {
          item.sortType = header.sortType * -1
        }
      })
    }
  }
}
</script>
