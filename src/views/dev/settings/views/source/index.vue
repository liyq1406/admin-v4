<template>
  <div class="main">
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <a class="btn btn-primary" v-link="{path: '/dev/settings/views/source/add'}"><i class="fa fa-plus"></i>添加数据源</a>
          </div>
        </div>
        <x-table :headers="headers" :tables="tables" @tbody-title="editRule">
        </x-table>
      </div>
    </div>
  </div>
</template>

<script>
import formatDate from 'filters/format-date'

export default {
  name: 'data-source-list',
  components: {
  },

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  data () {
    return {
      list: [],
      headers: [
        {
          key: 'title',
          title: '标题'
        },
        {
          key: 'product',
          title: '所属产品'
        },
        {
          key: 'chart_type',
          title: '图表类型'
        },
        {
          key: 'duration',
          title: '统计时间'
        },
        {
          key: 'statistics_type',
          title: '统计维度'
        },
        {
          key: 'create_time',
          title: '创建时间'
        }
      ]
    }
  },

  route: {
    data () {
    }
  },

  computed: {
    tables () {
      let res = []
      this.list.forEach((item) => {
        res.push({
          title: '<a class="hl-red">' + (item.title || ' - ') + '</a>',
          chart_type: item.chart_type,
          duration: item.duration,
          create_time: formatDate(item.create_time),
          statistics_type: item.statistics_type,
          product: item.productId
        })
      })

      res.sort((a, b) => {
        return new Date(b.timeOrigin) - new Date(a.timeOrigin)
      })
      return res
    }
  },

  watch: {
    products () {
      if (this.products && this.products.length) {
      }
    }
  },

  methods: {
    editRule (rule) {
      this.$route.router.go({path: 'edit/1'})
    }
  }
}
</script>
<style lang='stylus'>
</style>
