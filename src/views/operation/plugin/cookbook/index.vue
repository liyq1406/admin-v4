<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>新版云菜谱</h2>
        </div>
        <div class="panel-bd">
          <tab :nav="secondaryNav"></tab>
        </div>
      </div>
      <router-view transition="view" transition-mode="out-in" class="view"></router-view>
    </div>
  </section>
</template>

<script>
  import Tab from 'components/Tab'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'Recipe',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'tab': Tab
    },

    data () {
      return {
        secondaryNav: []
      }
    },

    route: {
      data () {
        return {
          secondaryNav: [{
            label: '菜谱列表',
            link: { path: '/plugins/cookbook/' + this.$route.params.app_id + '/recipes' }
          }, {
            label: '类别管理',
            link: { path: '/plugins/cookbook/' + this.$route.params.app_id + '/categories' }
          }, {
            label: '食材管理',
            link: { path: '/plugins/cookbook/' + this.$route.params.app_id + '/ingredients' }
          }, {
            label: '标签管理',
            link: { path: '/plugins/cookbook/' + this.$route.params.app_id + '/tags' }
          }]
        }
      }
    }
  }
</script>
