import api from 'api'

export var productSummaryMixin = {
  methods: {
    /**
     * 获取产品统计信息
     */
    getProductSummary () {
      api.statistics.getProductSummary(this.$route.params.id).then((res) => {
        if (res.status === 200) {
          this.statistic.devices.activated.total = res.data.activated
          this.statistic.devices.sum.total = res.data.total
          this.statistic.devices.online.total = res.data.online
          this.statistic.devices.sum.change = res.data.today_add_device || 0
          this.statistic.devices.activated.change = res.data.today_activated_device || 0
          this.statistic.users.total = res.data.total_user
          this.statistic.users.change = res.data.today_add_user || 0
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
