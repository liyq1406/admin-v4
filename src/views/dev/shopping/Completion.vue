<template>
  <div class="panel no-split-line">
    <alert :cols="5" type="success" title="支付成功">
      <p>您的订单已成功支付</p>
    </alert>
  </div>
</template>

<script>
import Alert from 'components/Alert'
import { globalMixins } from 'src/mixins'

export default {
  name: 'Completion',

  mixins: [globalMixins],

  components: {
    Alert
  },

  data () {
    return {
    }
  },

  methods: {
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/stylus/common'
</style>
