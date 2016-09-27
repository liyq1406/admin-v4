<template>
  <div class="alert-bar" v-if="msg">{{ msg }}</div>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      default: ''
    }
  },

  data () {
    return {}
  }
}
</script>

<style lang="stylus">
.alert-bar
  background-color #FF9750
  color #FFF
  text-align center
  height 36px
  line-height 36px
</style>
