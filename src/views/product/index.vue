<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2 v-text="product.name"></h2>
        </div>
        <div class="panel-bd">
          <tab :nav="secondaryNav"></tab>
        </div>
      </div>
      <router-view transition="view" transition-mode="out-in" @edit-product-name="getProduct" class="view"></router-view>
    </div>
  </section>
</template>

<script>
  import Tab from '../../components/Tab'
  import api from '../../api'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'Products',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'tab': Tab
    },

    data () {
      return {
        product: {
          name: '',
          description: '',
          id: ''
        },
        secondaryNav: []
      }
    },

    route: {
      data (transition) {
        this.getProduct()

        return {
          secondaryNav: [{
            label: this.$t('sub_nav.product.overview'),
            link: { path: '/products/' + this.$route.params.id + '/overview' }
          }, {
            label: this.$t('sub_nav.product.devices'),
            link: { path: '/products/' + this.$route.params.id + '/devices' }
          }, {
            label: this.$t('sub_nav.product.datapoints'),
            link: { path: '/products/' + this.$route.params.id + '/data-point' }
          }, {
            label: this.$t('sub_nav.product.alerts'),
            link: { path: '/products/' + this.$route.params.id + '/alert' }
          // }, {
            // label: '设备互联',
            // link: { path: '/products/' + this.$route.params.id + '/interconnection' }
          }, {
            label: this.$t('sub_nav.product.upgrade'),
            link: { path: '/products/' + this.$route.params.id + '/upgrade' }
          // }, {
            // label: '虚拟设备',
            // link: { path: '/products/' + this.$route.params.id + '/virtual-device' }
          // }, {
            // label: this.$t('sub_nav.product.wechat'),
            // link: { path: '/products/' + this.$route.params.id + '/wechat' }
          }, {
            label: this.$t('sub_nav.product.dataforward'),
            link: { path: '/products/' + this.$route.params.id + '/data-forward' }
          }, {
            label: this.$t('sub_nav.product.wechat'),
            link: { path: '/products/' + this.$route.params.id + '/wechat' }
          }]
        }
      }
    },

    methods: {
      getProduct () {
        api.product.getProduct(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            this.product = res.data
          }
        })
      }
    }

  }
</script>
