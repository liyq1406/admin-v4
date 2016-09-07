<template>
  <div class="panel">
    <div class="panel-hd panel-hd-full bordered">
      <div class="actions">
        <radio-button-group style="float:right" :items="locales.data.PERIODS" :value.sync="period"  @select="activeSelect"><span slot="label" class="label"></span></radio-button-group>
      </div>
      <h2>产品活跃度</h2>
    </div>
    <div class="row">
      <div class="col-14">
        <time-line :data="activeData"></time-line>
      </div>
      <div class="col-10">
        <pie :data="activatedProportion"></pie>
      </div>
    </div>
  </div>
</template>

<script>
// import Panel from 'components/Panel'
import TimeLine from 'components/g2-charts/TimeLine'
import RadioButtonGroup from 'components/RadioButtonGroup'
import Pie from 'components/g2-charts/Pie'
import { globalMixins } from 'src/mixins'
import {getActiveTrend} from './api-product'
import api from 'api'

export default {
  name: 'productline',

  layouts: ['topbar', 'sidebar'],

  mixins: [globalMixins],

  components: {
    // Panel,
    RadioButtonGroup,
    TimeLine,
    Pie
  },

  vuex: {
    getters: {
      currentProduct: ({ products }) => products.curr
    }
  },

  data () {
    return {
      period: 30,
      activeData: [], // 活跃设备
      // activatedProportion: [] // 激活占比
      activated: 0,
      total: 0
    }
  },

  computed: {
    activatedProportion () {
      if (this.total > 0) {
        return [
          {
            name: '未激活设备',
            value: this.total - this.activated
          },
          {
            name: '激活设备',
            value: this.activated
          }
        ]
      }
    }
  },

  watch: {
    currentProduct () {
      if (this.currentProduct.id) {
        this.getActiveProductsTrend(this.currentProduct, this.period)
        this.getProductProportion(this.currentProduct)
      }
    }
  },

  ready () {
    if (this.currentProduct.id) {
      this.getActiveProductsTrend(this.currentProduct, this.period)
      this.getProductProportion(this.currentProduct)
    }
  },
  methods: {
    combineRecv (recv) {
      let res = []
      recv.forEach((item) => {
        let temp = {}
        temp.date = item.day
        temp.val = item.count
        res.push(temp)
      })
      return res
    },
    getActiveProductsTrend (product, duration) {
      getActiveTrend(product.id, duration).then((res) => {
        this.activeData = this.combineRecv(res.active)
        // this.countRecv(res.add)
      }).catch((res) => {
        this.handleError(res)
      })
    },
    countRecv (res) {
      var countActivated = 0
      var countAdd = 0
      res.forEach((item) => {
        countActivated += item.activated
        countAdd += item.add
      })

      // this.activatedProportion = [
      //   {
      //     name: '未激活设备',
      //     value: Math.abs(countAdd - countActivated)
      //   },
      //   {
      //     name: '激活设备',
      //     value: countActivated
      //   }
      // ]
    },
    activeSelect () {
      this.getActiveProductsTrend(this.currentProduct, this.period)
    },
    getProductProportion (product) {
      api.statistics.getProductSummary(product.id).then((res) => {
        if (res.status === 200) {
          this.activated = res.data.activated
          this.total = res.data.total
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>
