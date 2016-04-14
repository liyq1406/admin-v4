<template>
  <div class="panel">
    <div class="panel-bd">
      维修工单列表
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
