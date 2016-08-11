<template>
  <div>
  </div>
</template>
<script>
  // import api from 'src/api'
  import Select from 'components/Select'
  import SearchBox from 'components/SearchBox'
  // import locales from 'consts/locales/index'
  import Pager from 'components/Pager'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'Alert',

    mixins: [globalMixins],

    components: {
      'v-select': Select,
      SearchBox,
      Pager
    },

    data () {
      return {
      }
    },
    filters: {
    },
    ready () {
    },
    methods: {
    }
  }
</script>
<style lang='stylus' scoped>
@import '../../../../assets/stylus/common'
</style>
