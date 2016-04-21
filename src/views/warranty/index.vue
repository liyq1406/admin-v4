<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>延保管理</h2>
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
    name: 'Params',

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
      data (transition) {
        return {
          secondaryNav: [{
            label: '延保工单',
            link: { path: '/warranty/work-orders/extended-warranties' }
          }, {
            label: '维修工单',
            link: { path: '/warranty/work-orders/repair' }
          }, {
            label: '网点管理',
            link: { path: '/warranty/accounts' }
          }]
        }
      }
    },

    methods: {
    }

  }
</script>
