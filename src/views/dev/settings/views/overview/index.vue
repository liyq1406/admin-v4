<template>
  <div class="main">
  </div>
</template>

<script>
// import api from 'api'
import RadioButtonGroup from 'components/RadioButtonGroup'
import { globalMixins } from 'src/mixins'

export default {
  name: 'custom-overview',

  mixins: [globalMixins],

  components: {
    RadioButtonGroup
  },

  data () {
    return {
    }
  }
}
</script>

<style lang="stylus">
</style>
