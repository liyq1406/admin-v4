<template>
  <div class="main">
    <alert-trends></alert-trends>
    <alert-table></alert-table>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import AlertTable from './alert-table'
import AlertTrends from './alert-trends'

export default {
  name: 'Alert',

  // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
  mixins: [globalMixins],

  components: {
    AlertTable,
    AlertTrends
  },

  data () {
    return {
    }
  },

  computed: {
  },

  route: {
  },

  methods: {
  }
}
</script>
