<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>购买记录</h2>
    </div>
  </div>
</template>

<script>
import SearchBox from 'components/SearchBox'
import { globalMixins } from 'src/mixins'

export default {
  name: 'Orders',

  mixins: [globalMixins],

  components: {
    SearchBox
  },

  data () {
    return {
    }
  },

  methods: {
  }
}
</script>

<style lang="stylus">
@import '../../../assets/stylus/common'
</style>
