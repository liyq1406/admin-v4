<template>
  <section class="main-wrap">
    <div class="main">
      <div class="breadcrumb"><a v-link="{path: '/device-params' }"><i class="fa fa-arrow-circle-left"></i>{{ $t('device.management') }}</a></div>
      <div class="panel">
        <div class="panel-hd">
          <h2>{{ $t('device.params') }}</h2>
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
  import Tab from '../../components/Tab'
  import { globalMixins } from '../../mixins'
  import api from '../../api'
  import { setParamsCurrentProduct } from '../../store/actions/products'

  export default {
    name: 'Params',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'tab': Tab
    },

    vuex: {
      actions: {
        setParamsCurrentProduct
      }
    },

    data () {
      return {
        secondaryNav: []
      }
    },

    route: {
      data (transition) {
        return {
          secondaryNav: [{
            label: this.$t('sub_nav.product.basic_info'),
            link: { path: `/device-params/${this.$route.params.product_id}/${this.$route.params.device_id}/${this.$route.params.mac}/basic-info` }
          }, {
            label: this.$t('sub_nav.product.data_monitoring'),
            link: { path: `/device-params/${this.$route.params.product_id}/${this.$route.params.device_id}/${this.$route.params.mac}/data-monitoring` }
          }, {
            label: this.$t('sub_nav.product.fault_records'),
            link: { path: `/device-params/${this.$route.params.product_id}/${this.$route.params.device_id}/${this.$route.params.mac}/fault-records` }
          }]
        }
      }
    },

    methods: {
      // 获取当前产品
      getProduct () {
        api.product.getProduct(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            this.setParamsCurrentProduct(res.data)
          }
        }).catch((res) => {
          this.handleError(res)
        })
      }
    }
  }
</script>
