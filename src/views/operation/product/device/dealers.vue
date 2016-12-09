<template>
  <div class="panel dealer">
    <div class="panel-bd">
      <div class="tips-null tac" v-if="!loadingData && !isDealerExists(dealer)"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
      <div class="info-box" v-if="!loadingData && isDealerExists(dealer)">
        <div class="dealer-name-box">
          <a class="hl-red" @click="jumpDealer">{{dealer.name}}</a>
        </div>
        <div class="dealer-info-box">
          <div class="row">
            <div class="label col-5">创建时间:</div>
            <!-- <div class="info col-5">{{(dealer.create_time | formatDate) || '--'}}</div> -->
            <div class="info col-5">{{dealer.create_time | formatDate}}</div>
          </div>
          <div class="row">
            <div class="label col-5">联系人:</div>
            <div class="info col-5">{{dealer.contacter || '--'}}</div>
          </div>
          <div class="row">
            <div class="label col-5">手机号:</div>
            <div class="info col-5">{{dealer.phone || '--'}}</div>
          </div>
          <div class="row" v-if="isDealerExists(superior)">
            <div class="label col-5">从属于:</div>
            <div class="info col-5">{{superior.name}}</div>
          </div>
          <div class="row">
            <div class="label col-5">负责区域:</div>
            <div class="info col-5">{{dealer.region || '--'}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
import { isEmpty } from 'utils'
import { DEALER_SCOPE_SEPERATOR } from 'consts/config'

export default {
  name: 'Dealers',
  vuex: {
    getters: {
      currDevice: ({ products }) => products.currDevice,
      plugins: ({ plugins }) => plugins.all
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
      this.getDealer()
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
    jumpDealer () {
      if (!this.dealer.id || !this.plugins || !this.plugins.length) {
        return
      }
      let plugin = _.find(this.plugins, (item) => {
        return item.plugin === 'dealer'
      })
      if (!plugin) {
        return
      }
      this.$route.router.go({path: '/operation/plugins/dealer/' + plugin.id + '/list/' + this.dealer.id + '/devices'})
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
        return
      }

      // 经销商 code
      let codes = this.currDevice.dealer_scope.split(DEALER_SCOPE_SEPERATOR)

      // 获取经销商
      this.loadingData = true
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
