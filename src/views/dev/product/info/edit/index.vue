<template>
  <div class="main device-details">
    <div class="main-title">
      <h2>产品设置</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <tab :nav="secondaryNav"></tab>
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
  </div>
</template>

<script>
import Breadcrumb from 'components/Breadcrumb'
import Tab from 'components/Tab'
import { globalMixins } from 'src/mixins'

export default {
  name: 'edit',

  mixins: [globalMixins],

  components: {
    Tab,
    Breadcrumb
  },

  data () {
    return {
      secondaryNav: [],
      breadcrumbNav: [{
        label: '产品信息',
        link: `/dev/products/${this.$route.params.id}/info`
      }, {
        label: '产品设置'
      }]
    }
  },

  computed: {},

  route: {
    data (transition) {
      let deviceDetailRoot = `/dev/products/${this.$route.params.id}/info/edit`
      return {
        secondaryNav: [{
          label: '产品信息',
          link: { path: `${deviceDetailRoot}/form` }
        }, {
          label: '产品字段',
          link: { path: `${deviceDetailRoot}/field` }
        }, {
          label: '产品二维码',
          link: { path: `${deviceDetailRoot}/qrcode` }
        }]
      }
    }
  }
}
</script>

<style lang="stylus">
  .main .x-breadcrumb
    border-bottom 0
</style>
