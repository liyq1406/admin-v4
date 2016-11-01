<template>
  <div class="device-page">
    123
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
// import api from 'api'

export default {
  name: 'field',

  mixins: [globalMixins],

  vuex: {
    getters: {
      corp: ({ system }) => system.corp
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  ready () {
  },
  methods: {}
}
</script>

<style lang="stylus" scoped>
@import '../../../../../assets/stylus/common'

</style>
