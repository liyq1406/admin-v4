<template>
  <div class="main home">
    <div class="part1 ">
      <!-- 大屏幕 -->
      <jumbotron></jumbotron>
    </div>
    <div class="part2 mt30">
      <div class="develop-box">
        <!-- 开发指南 -->
        <Guide></Guide>
      </div>
      <div class="notice-box">
        <notice></notice>
      </div>
    </div>
  </div>
</template>

<script>
  import Jumbotron from './components/Jumbotron'
  import Guide from './components/Guide'
  import Notice from './components/Notice'
  import Footer from 'components/Footer'

  export default {
    name: 'home',

    layout: 'admin',

    // mixins: [globalMixins, pluginFactoryMixin],

    // vuex: {
    //   actions: {
    //     createPlugin,
    //     updatePlugin,
    //     removePlugin
    //   }
    // },

    components: {
      Jumbotron,
      Guide,
      Notice,
      'x-footer': Footer
    },

    ready () {
      this.$http.get('/static/platform_info.json').then((res) => {
        console.log(res)
      })
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../assets/stylus/common'

  .home
    width 100%
    padding 20px 15px
    box-sizing border-box
    .part2
      width 100%
      position relative
      padding-right 330px
      box-sizing border-box
      .develop-box
        width 100%
        min-height 430px
      .notice-box
        position absolute
        right 0
        top 0
        width 310px
        height 400px
</style>
