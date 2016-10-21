<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>快照分析</h2>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'Products',

    mixins: [globalMixins],

    vuex: {
      getters: {
        releasedProduct: ({ products }) => products.released
      }
    },

    components: {
      // 'x-select': Select
    },

    data () {
      return {
      }
    },

    route: {
      data () {}
    },

    methods: {
    }
  }
</script>
