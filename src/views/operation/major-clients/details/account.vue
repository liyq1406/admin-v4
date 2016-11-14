<template>
  <div class="panel dealer">
    账户管理
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import api from 'api'
import { isEmpty } from 'utils'
import { DEALER_SCOPE_SEPERATOR } from 'consts/config'

export default {
  name: 'Dealers',

  mixins: [globalMixins],

  vuex: {
    getters: {
      currDevice: ({ products }) => products.currDevice
    }
  },

  data () {
    return {
      dealer: {},
      superior: {},
      loadingData: true
    }
  },

  route: {
    data () {
    }
  },

  watch: {
    currDevice () {
      this.getDealer()
    }
  },

  methods: {
    /**
     * 经销商是否存在
     * @params {Object} 经销商
     * @return {Boolean}
     */
    isDealerExists (dealer) {
      return !isEmpty(dealer)
    },

    /**
     * 获取经销商
     * @author shengzhi
     */
    getDealer () {
      // 模拟数据开始 ------------------------------
      // this.dealer = {
      //   id: 'afao22dda',
      //   name: '广州区二级代理',
      //   email: 'abcd@xlink.cn',
      //   phone: '13800138000',
      //   address: '广州市海珠区',
      //   status: 1,
      //   dealer_code: 'afao22dda',
      //   upper_dealer_code: '1eafadsaad',
      //   create_time: '2016-07-21T10:30:35Z'
      // }
      // this.superior = {
      //   id: '1eafadsaad',
      //   name: '广州区总代理',
      //   email: 'abcd@xlink.cn',
      //   phone: '13800138000',
      //   address: '广州市海珠区',
      //   status: 1,
      //   dealer_code: '1eafadsaad',
      //   upper_dealer_code: '',
      //   create_time: '2016-07-21T10:30:35Z'
      // }
      // 模拟数据结束 ------------------------------

      // this.currDevice是从 store 取的值，这里要等它值取回来了才作下一步操作
      if (isEmpty(this.currDevice) || !this.currDevice.dealer_scope) {
        this.loadingData = false
        return
      }

      // 经销商 code
      let codes = this.currDevice.dealer_scope.split(DEALER_SCOPE_SEPERATOR)

      // 获取经销商
      api.dealer.get(codes[codes.length - 1]).then((res) => {
        this.loadingData = false
        if (res.status === 200) {
          this.dealer = res.data
        }
      }).catch((res) => {
        this.loadingData = false
        // this.handleError(res)
      })

      // 上级经销商
      if (codes.length > 1) {
        api.dealer.get(codes[codes.length - 2]).then((res) => {
          if (res.status === 200) {
            this.superior = res.data
          }
        })
      }
    }
  }
}
</script>
<style lang="stylus">
  @import '../../../../assets/stylus/common'

  .dealer
    .info-box
      padding 10px
      box-sizing border-box
      clearfix()
      .dealer-name-box
        font-size 16px
        float left
        color #333
        width 190px
        padding 0 20px 0 10px
        box-sizing border-box
      .dealer-info-box
        font-size 14px
        border-left 1px solid #ccc
        width 500px
        float left
        padding 0 10px
        line-height 30px
        .label
          text-align right
          padding-right 15px
          box-sizing border-box
          color #999
        .info
          color #666
          white-space nowrap
          height 20px
</style>