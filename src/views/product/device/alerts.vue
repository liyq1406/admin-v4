<template>
  <div class="panel">
    <div class="panel-bd">告警信息</div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'

export default {
  name: 'Alerts',

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
