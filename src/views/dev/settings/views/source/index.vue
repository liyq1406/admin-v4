<template>
  <div class="main">
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <a class="btn btn-primary" v-link="{path: '/dev/settings/views/source/add'}"><i class="fa fa-plus"></i>添加数据源</a>
          </div>
        </div>
        <x-table :headers="headers" :rows="rows" @tbody-title="editRule">
        </x-table>
      </div>
    </div>
  </div>
</template>

<script>
import formatDate from 'filters/format-date'
import api from 'api'

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
          key: 'show_type',
          title: '显示类型'
        },
        {
          key: 'data_type',
          title: '数据类型'
        },
        {
          key: 'create_time',
          title: '创建时间'
        }
      ]
    }
  },

  computed: {
    rows () {
      let res = []
      this.list.forEach((item) => {
        let product = _.find(this.products, (prod) => {
          return prod.id === item.product_id
        })
        let dataType
        if (item.data_from === 1) {
          dataType = '产品统计规则'
        } else if (item.data_from === 2) {
          dataType = '设备统计规则'
        } else {
          dataType = '数据端点'
        }
        res.push({
          title: '<a class="hl-red">' + (item.title || ' - ') + '</a>',
          product: product ? product.name : '',
          show_type: item.show_type === 1 ? '指标' : '图表',
          data_type: dataType,
          create_time: formatDate(item.id, true), // id 为时间戳
          id: item.id || 0
        })
      })

      res.sort((a, b) => {
        return b.id - a.id
      })
      return res
    }
  },

  watch: {
  },

  route: {
    data () {
      this.getList()
    }
  },

  methods: {
    getList () {
      api.custom.dataSource.get().then((res) => {
        if (res) {
          this.list = res
        } else {
          this.list = []
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    editRule (rule) {
      this.$route.router.go({path: 'source/edit/' + rule.id})
    }
  }
}
</script>
<style lang='stylus'>
</style>
