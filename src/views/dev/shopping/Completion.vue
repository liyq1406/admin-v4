<template>
  <div class="panel">
    <alert :cols="5" type="success" title="支付成功">
      <p>您的订单已成功支付</p>
    </alert>
  </div>
</template>

<script>
export default {
  name: 'Completion',
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
