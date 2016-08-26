<template>
  <div class="row">
    <div class="col-12">
      <pie :data="machines" :height="400"></pie>
    </div>
    <div class="col-11 col-offset-1 data-table-wrap">
      <percent-table :headers="headers" :tables="tables" @theader-percent="sort"></percent-table>
    </div>
  </div>
</template>

<script>
import Pie from 'components/g2-charts/Pie'
import PercentTable from 'components/PercentTable'
import api from 'api'

export default {
  name: 'machines',

  components: {
    Pie,
    PercentTable
  },

  data () {
    return {
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
      machines: [
        // {
        //   name: 'iphone 5',
        //   value: 50
        // },
        // {
        //   name: 'iphone 6',
        //   value: 30
        // },
        // {
        //   name: 'iphone 7',
        //   value: 30
        // },
        // {
        //   name: 'iphone 8',
        //   value: 30
        // },
        // {
        //   name: '小米 1',
        //   value: 30
        // },
        // {
        //   name: '小米 2',
        //   value: 30
        // },
        // {
        //   name: '小米 3',
        //   value: 30
        // },
        // {
        //   name: '小米 4',
        //   value: 30
        // },
        // {
        //   name: '小米 5',
        //   value: 30
        // },
        // {
        //   name: '小米 6',
        //   value: 30
        // }
      ]
    }
  },

  computed: {
    tables () {
      var result = []
      var total = 0
      this.machines.forEach((item) => {
        total += item.value - 0
      })
      this.machines.forEach((item) => {
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
      api.statistics.getUserMachine().then((res) => {
        var result = []
        res.data.forEach((item) => {
          let obj = {
            name: item.machine_name,
            value: item.total
          }
          result.push(obj)
        })
        this.machines = result
      }).catch((res) => {
        this.handleError(res)
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
