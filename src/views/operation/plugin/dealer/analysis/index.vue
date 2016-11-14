<template>
  <div class="main">
    <div class="main-title">
      <div class="col-4">
        <h2>{{ $t('operation.dealer.title') }}</h2>
      </div>
    </div>
    <sales-info></sales-info>
    <distributing></distributing>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import Distributing from './components/distributing'
import SalesInfo from './components/sales-info'

export default {
  name: 'analysis',

  // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
  mixins: [globalMixins],

  vuex: {
    getters: {
      currentProduct: ({ products }) => products.curr
    }
  },

  components: {
    Distributing,
    SalesInfo
  },

  data () {
    return {
    }
  },
  methods: {}
}
</script>
