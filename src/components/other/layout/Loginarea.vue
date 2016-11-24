<template>
  <header class="auth-header">
    <div class="logo-auth">
      <i :style="logoStyle"></i>
    </div>
  </header>
  <slot></slot>
</template>

<script>
export default {
  name: 'Login-area',

  props: {
    // 配置
    config: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  data () {
    return {
    }
  },

  watch: {
  },

  computed: {
    logoStyle () {
      let result = {
        backgroundColor: '#C82433',
        backgroundImage: 'url(static/images/logo_auth.png)'
      }
      if (this.config && this.config.logo_url) {
        result.backgroundImage = 'url(' + this.config.logo_url + ')'
      }
      // if (this.$route && window.location.href.indexOf('heavy-buyer-login') >= 0) {
      //   result.backgroundColor = '#FFF'
      //   result.backgroundImage = 'url(/static/images/topband.png)'
      // }
      return result
    }
  },
  ready () {
  },

  methods: {
  }
}
</script>

<style lang="stylus">
// 配置
@import '../../../assets/stylus/base'
.auth-header
  position relative
  text-align center
  // Logo
  .logo-auth
    i
      display inline-block
      size 200px 100px
      /*background red url('assets/images/logo_auth.png') no-repeat*/
      background-repeat no-repeat
      background-size 200px 100px
      border-radius 0 0 10px 10px
</style>
