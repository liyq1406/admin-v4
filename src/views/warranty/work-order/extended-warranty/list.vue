<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="status-bar">
        <div class="status">{{{ $t('common.total_results', {count:total}) }}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from '../../../../mixins'

  export default {
    name: 'OrderList',

    layout: 'admin',

    mixins: [globalMixins],

    data () {
      return {}
    },

    methods: {
    }
  }
</script>

<style lang="stylus">
  @import '../../../../assets/stylus/common'
</style>
