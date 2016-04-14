<template>
  <div class="panel">
    <div class="panel-bd">
      基本信息
    </div>
  </div>
</template>

<script>
  import { globalMixins } from '../../../../mixins'

  export default {
    name: 'BasicInfo',

    layout: 'admin',

    mixins: [globalMixins],

    data () {
      return {
      }
    },

    methods: {
    }
  }
</script>

<style lang="stylus">
  @import '../../../../assets/stylus/common'
</style>
