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
import Panel from 'components/Panel'
import TimeLine from 'components/g2-charts/TimeLine'
import RadioButtonGroup from 'components/RadioButtonGroup'
import Pie from 'components/g2-charts/Pie'
import { globalMixins } from 'src/mixins'
import {getActiveTrend} from './api-product'
import { uniformDate } from 'src/filters'
import api from 'api'

export default {
  name: 'productline',

  mixins: [globalMixins],

  components: {
    Panel,
    RadioButtonGroup,
    TimeLine,
    Pie
  },

  vuex: {
    getters: {
      products: ({ products }) => products.released
    }
  },

  data () {
    return {
      period: 30,
      activeData: [], // 活跃设备
      // activatedProportion: [] // 激活占比
      total: 0,
      activated: 0
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
    products () {
      if (this.products.length > 0) {
        this.getActiveProductsTrend(this.products, this.period)
      }
    }
  },

  ready () {
    this.getSummary()
  },
  methods: {
    combineRecv (recv) {
      let res = []
      recv.forEach((item) => {
        item.data.forEach((prodData) => {
          let temp = {}
          temp.date = uniformDate(prodData.day)
          temp.val = prodData.count
          temp.name = item.product
          res.push(temp)
        })
      })
      return res
    },
    getActiveProductsTrend (products, duration) {
      var prodLength = products.length
      var recv = {
        active: [],
        add: []
      }
      products.forEach((item) => {
        getActiveTrend(item.id, duration).then((res) => {
          recv.active.push({
            product: item.name.length > 11 ? (item.name.substring(0, 10) + '...') : item.name,
            data: res.active
          })
          recv.add.push({
            product: item.name.length > 11 ? (item.name.substring(0, 10) + '...') : item.name,
            data: res.add
          })

          if (recv.active.length === prodLength) {
            this.activeData = this.combineRecv(recv.active)
          }
          if (recv.add.length === prodLength) {
            // this.countRecv(recv.add)
            // this.trends.products.active.data = this.combineRecv(recv)
          }
        }).catch((res) => {
          this.handleError(res)
        })
      })
    },
    countRecv (recv) {
      var countActivated = 0
      var countAdd = 0
      recv.forEach((item) => {
        item.data.forEach((i) => {
          countActivated += i.activated
          countAdd += i.add
        })
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
      this.getActiveProductsTrend(this.products, this.period)
    },
    getSummary () {
      api.statistics.getSummary().then((res) => {
        if (res.status === 200) {
          this.activated = res.data.total.activated
          this.total = res.data.total.total
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>
