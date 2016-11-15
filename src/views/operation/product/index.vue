<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>{{ currentProduct.name }}</h2>
        </div>
        <div class="panel-bd">
          <tab :nav="secondaryNav"></tab>
        </div>
      </div>
      <router-view transition="view" transition-mode="out-in" class="view"></router-view>
    </div>
  </section>
</template>

<script>
  import api from 'api'
  import { setCurrProduct } from 'store/actions/products'
  export default {
    name: 'Products',
    vuex: {
      getters: {
        currentProduct: ({ products }) => products.curr
      },
      actions: {
        setCurrProduct
      }
    },

    components: {
    },

    data () {
      return {
        secondaryNav: []
      }
    },

    route: {
      data (transition) {
        this.getProduct()

        return {
          secondaryNav: [{
            label: this.$t('ui.subs.product.overview'),
            link: { path: '/products/' + this.$route.params.id + '/overview' }
          }, {
            label: this.$t('ui.subs.product.devices'),
            link: { path: '/products/' + this.$route.params.id + '/devices' }
          }, {
            label: this.$t('ui.subs.product.datapoints'),
            link: { path: '/products/' + this.$route.params.id + '/data-point' }
          }, {
            label: this.$t('ui.subs.product.alerts'),
            link: { path: '/products/' + this.$route.params.id + '/alert' }
          }, {
            label: this.$t('ui.subs.product.upgrade'),
            link: { path: '/products/' + this.$route.params.id + '/upgrade' }
          }, {
            label: this.$t('ui.subs.product.dataforward'),
            link: { path: '/products/' + this.$route.params.id + '/data-forward' }
          }, {
            label: this.$t('ui.subs.product.wechat'),
            link: { path: '/products/' + this.$route.params.id + '/wechat' }
          }]
        }
      }
    },

    methods: {
      getProduct () {
        api.product.getProduct(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            // this.product = res.data
            this.setCurrProduct(res.data)
          }
        })
      }
    }

  }
</script>
