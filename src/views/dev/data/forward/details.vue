<template>
  <div class="main">
    <div class="main-title">
      <h2>数据转发</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="forward-details with-loading">
      <div class="icon-loading" v-show="loadingData">
        <i class="fa fa-refresh fa-spin"></i>
      </div>
      <div class="container">
        <div class="list row" v-for="li in list">
          <label class="label col-3 tal">{{li.label}}:</label>
          <div class="content col-14 col-offset-1">
            <span>{{li.content}}</span>
          </div>
        </div>
        <div class="list row mt20">
          <a class="btn btn-primary col-offset-4 w100 tac" v-link="{'path': '/dev/data/forward/edit/' + $route.params.productId + '/' + $route.params.forwardId }">编辑规则</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from 'components/Breadcrumb'
  import { globalMixins } from 'src/mixins'
  import Vue from 'vue'
  import locales from 'consts/locales/index'
  import api from 'api'

  export default {
    name: 'TableDetails',

    mixins: [globalMixins],

    vuex: {
      getters: {
        products: ({ products }) => products.all
      }
    },

    components: {
      Breadcrumb
    },

    data () {
      return {
        breadcrumbNav: [{
          label: '数据转发',
          link: '/dev/data/forward'
        }, {
          label: '转发规则'
        }],
        loadingData: false,
        dataForwardType: locales[Vue.config.lang].data.DATA_FORWARD_TYPES,
        dataDestination: locales[Vue.config.lang].data.DATA_DESTINATIONS,
        rule: {
          data_type: [],
          destination: {
            type: '',
            url: '',
            token: ''
          }
        }
      }
    },

    computed: {
      /**
       * 当前产品
       * @return {[type]} [description]
       */
      selectedProduct () {
        var result = {}
        this.products.forEach((item) => {
          if (item.id === this.$route.params.productId) {
            result = item
          }
        })
        return result
      },
      /**
       * 列表
       * @return {[type]} [description]
       */
      list () {
        // data_type: [],
        // destination: {
        //   type: '',
        //   url: '',
        //   token: ''
        // }
        let result = [
          {
            label: '产品',
            content: this.selectedProduct.name
          },
          {
            label: '快照规则',
            content: this.rule.data_type.map((item) => this.dataForwardType[item]).join(' ')
          },
          {
            label: '分发类型',
            content: this.dataDestination[this.rule.destination.type]
          },
          {
            label: '数据分发目的地',
            content: this.rule.destination.url
          },
          {
            label: 'token',
            content: this.rule.destination.token
          }
        ]
        return result
      }
    },

    route: {
      data () {
        this.getRule()
      }
    },

    ready () {
    },
    methods: {
      getRule () {
        this.loadingData = true
        let params = {
          query: {
            id: {
              $in: this.$route.params.forwardId
            }
          }
        }
        api.dataForward.getRule(this.$route.params.productId, params).then((res) => {
          if (res.status === 200) {
            let rule = res.data.list[0]
            this.rule = {
              data_type: [].concat(rule.data_type),
              destination: {
                type: rule.destination.type,
                url: rule.destination.url,
                token: rule.destination.token
              }
            }
            this.loadingData = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      }
    }
  }
</script>

<style lang="stylus">
  .forward-details
    width 100%
    height 100%
    .container
      padding 20px
      box-sizing border-box
      .list
        height 45px
        line-height 45px
        overflow hidden
        .content
          height 100%
          border-bottom 1px dashed #ddd
          box-sizing border-box
</style>
