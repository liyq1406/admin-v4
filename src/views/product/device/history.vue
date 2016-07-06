<template>
  <div class="panel">
    <div class="panel-bd">历史数据</div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'

export default {
  name: 'History',

  layout: 'admin',

  mixins: [globalMixins],

  data () {
    return {}
  }
}
</script>

<style lang="stylus">
@import '../../../assets/stylus/common'
</style>
