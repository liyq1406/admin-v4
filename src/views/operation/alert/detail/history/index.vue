<template>
  <div class="main">
    <alert-trends :device="device"></alert-trends>
    <alert-table :device="device"></alert-table>
  </div>
</template>

<script>
import AlertTable from './alert-table'
import AlertTrends from './alert-trends'
import api from 'api'

export default {
  name: 'Alert',

  // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
  components: {
    AlertTable,
    AlertTrends
  },

  data () {
    return {
      currentProduct: {},
      info: {}
    }
  },

  computed: {
    device () {
      return {
        id: this.info.from,
        product_id: this.info.product_id
      }
    }
  },

  route: {
    data () {
      this.getInfo()
    }
  },

  methods: {
    // 获取告警详情@author weijie
    getInfo () {
      var params = {
        offset: 0,
        limit: 1,
        query: {
          // _id: this.$route.params.id
          id: {
            $in: [this.$route.params.id]
          }
        }
      }
      api.alert.getAlerts(params).then((res) => {
        if (res.status === 200) {
          // console.log(res.data.list)
          // this.alerts = res.data.list
          this.info = res.data.list[0]
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>
