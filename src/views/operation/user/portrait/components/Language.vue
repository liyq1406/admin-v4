<template>
  <div class="row">
    <div class="col-12">
      <chart :options="languageOptions" :loading="loadingData" height="400px"></chart>
    </div>
    <div class="col-11 col-offset-1 data-table-wrap">
      <percent-table :headers="headers" :tables="tables" @theader-percent="sort"></percent-table>
    </div>
  </div>
</template>

<script>
import Chart from 'components/Chart/index'
import PercentTable from 'components/PercentTable'
import api from 'api'
import _ from 'lodash'

export default {
  name: 'portrait-model',

  components: {
    Chart,
    PercentTable
  },

  data () {
    return {
      loadingData: false,
      headers: [
        {
          key: 'language',
          title: '语言'
        },
        {
          key: 'value',
          title: '数量'
        },
        {
          key: 'percent',
          title: '占比',
          sortType: -1
        }
      ],
      languages: []
    }
  },

  computed: {
    tables () {
      var result = []
      var total = 0
      this.languages.forEach((item) => {
        total += item.value - 0
      })
      this.languages.forEach((item) => {
        let percent = item.value / total
        percent = item.value / total * 100
        percent = percent.toFixed(1) + '%'
        var table = {
          language: item.name,
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
    languageOptions () {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          y: 20,
          data: _.map(this.languages, 'name')
        },
        series: [{
          name: '数量',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: this.languages,
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
      api.statistics.getUserLanguage().then((res) => {
        // 以下为虚拟数据，勿删
        // 虚拟数据开始
        // res.data = [{
        //   language: 'English',
        //   total: 50
        // }, {
        //   language: 'Chinese',
        //   total: 30
        // }, {
        //   language: 'Germany',
        //   total: 30
        // }]
        // 虚拟数据结束

        var result = []
        res.data.forEach((item) => {
          let obj = {
            name: item.language,
            value: item.total
          }
          result.push(obj)
        })
        this.languages = result
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
