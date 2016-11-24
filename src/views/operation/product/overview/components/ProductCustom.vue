<template>
  <div class="panel mt20 mb20">
    <div class="panel-hd panel-hd-full bordered">
      <h2>{{ title }}</h2>
    </div>
    <div class="row">
      <div :class="[firstcol]">
        <chart :options="fisrtModelOptions"></chart>
      </div>
      <div v-if="secondConfig.id" :class="[secondcol]">
        <chart :options="secondModelOptions"></chart>
      </div>
      <div v-if="thirdConfig.id" :class="[thirdcol]">
        <chart :options="thirdModelOptions"></chart>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'components/Chart/index'
import echartOptions from './echart-options'
import api from 'api'

export default {
  name: 'ProductModel',
  components: {
    Chart
  },

  props: {
    title: {
      type: String,
      default: '自定义图表'
    },
    /**
     * dataSource 格式如下
     * [{
     *   index: 1,
     *   id: ''
     * }..]
     */
    dataSource: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      inited: false,
      noNameCount: 0,
      dataSourceList: [],
      firstConfig: {},
      secondConfig: {},
      thirdConfig: {}
    }
  },

  computed: {
    firstcol () {
      if (this.firstConfig.chart === 1) {
        return 'col-8'
      }
      if (this.firstConfig.chart > 1 && !this.secondConfig.chart) {
        return 'col-24'
      }
      if (this.firstConfig.chart > 1 && this.secondConfig.chart > 1) {
        return 'col-12'
      }
      if (this.firstConfig.chart > 1 && this.secondConfig.chart === 1) {
        return 'col-16'
      }
      return 'col-8'
    },
    secondcol () {
      if (this.firstConfig.chart === 1 && this.secondConfig.chart === 1) {
        return 'col-8'
      }
      if (this.firstConfig.chart === 1 && this.secondConfig.chart > 1) {
        return 'col-16'
      }
      if (this.firstConfig.chart > 1 && this.secondConfig.chart === 1) {
        return 'col-8'
      }
      if (this.firstConfig.chart > 1 && this.secondConfig.chart > 1) {
        return 'col-12'
      }
      return 'col-8'
    },
    thirdcol () {
      if (this.firstConfig.chart === 1 && this.secondConfig.chart === 1) {
        return 'col-8'
      }
      return ''
    },
    fisrtModelOptions () {
      return echartOptions.pie
    },
    secondModelOptions () {
      return echartOptions.pie
    },
    thirdModelOptions () {
      return echartOptions.pie
    }
  },

  watch: {
    dataSource () {
      this.searchDataSourceConfig()
    }
  },

  ready () {
    this.searchDataSourceConfig()
    this.getDataSourceList()
  },

  methods: {
    searchDataSourceConfig () {
      if (!this.dataSource || !this.dataSource.length || !this.dataSourceList.length) {
        return
      }
      this.dataSource.forEach((item) => {
        let finded = _.find(this.dataSourceList, (ds) => {
          return ds.id === item.id
        })
        if (finded) {
          if (item.index === 1) {
            this.firstConfig = finded
          }
          if (item.index === 2) {
            this.secondConfig = finded
          }
          if (item.index === 3) {
            this.thirdConfig = finded
            this.getStatictisValue(finded)
          }
        }
      })
    },
    getDataSourceList () {
      api.custom.dataSource.get().then((res) => {
        if (res) {
          this.dataSourceList = res
          this.searchDataSourceConfig()
        } else {
          this.dataSourceList = []
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
