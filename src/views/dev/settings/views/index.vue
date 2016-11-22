<template>
  <div class="main device-details">
    <div class="main-title">
      <h2>视图自定义</h2>
    </div>
    <tab :nav="secondaryNav"></tab>
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
  </div>
</template>

<script>
export default {
  name: 'views',
  components: {
  },

  data () {
    return {
      secondaryNav: [{
        label: '字段设置',
        link: { path: '/dev/settings/views/field' }
      }, {
        label: '自定义产品概览',
        link: { path: '/dev/settings/views/overview' }
      }, {
        label: '自定义数据源',
        link: { path: '/dev/settings/views/source' }
      }]
    }
  },

  computed: {}
}
</script>

<style lang="stylus">
.quotas-detail
  border 1px solid #DA4E37
  position relative
  .content
    padding 15px 20px 0px
  .arrow
    position absolute
    left 265px
    top -9px
    width 18px
    height 18px
    background #DA4E37
    transform rotate(45deg)
  .arrow-cover
    position absolute
    width 100%
    top 0
    left 0
    z-index 1
    height 15px
    background white
  .arrow-left-1
    left 30px
  .arrow-left-2
    left 105px
  .arrow-left-3
    left 185px
  .arrow-left-4
    left 265px
</style>
