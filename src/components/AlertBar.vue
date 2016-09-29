<template>
  <div class="alert-bar" v-if="msg">{{{ msg }}}</div>
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
  background-color #FCF8E3
  border 1px solid #FAEBCC
  margin 4px 0 0 4px
  padding 0 15px
  color #AD7A3B
  height 36px
  line-height 36px
</style>
