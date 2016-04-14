<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>统计分析</h2>
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
  import Tab from '../../components/Tab'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'Statistic',

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
            label: '产品统计',
            link: { path: '/statistic/products' }
          }, {
            label: '用户统计',
            link: { path: '/statistic/users' }
          }]
        }
      }
    }
  }
</script>
