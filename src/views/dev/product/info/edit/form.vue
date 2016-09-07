<template>
  <div class="panel">
    <div class="panel-bd">
      132
    </div>
  </div>
</template>

<script>
  // import api from 'api'
  // import * as config from 'consts/config'
  import Select from 'components/Select'
  // import _ from 'lodash'
  // import { globalMixins } from 'src/mixins'

  export default {
    name: 'edit-product',

    // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
    // mixins: [globalMixins, productSummaryMixin, setCurrProductMixin],

    components: {
      'x-select': Select
    }
  }
</script>

/*<style lang="stylus" scoped>

.statistic-group
  border-top 1px solid default-border-color
</style>*/
