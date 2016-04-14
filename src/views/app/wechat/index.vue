<template>
  <section class="main-wrap">
    <div class="main">
      <div class="breadcrumb"><a v-link="{path: '../../'}" class="fa fa-arrow-circle-left">返回应用列表</a></div>
      <div class="panel">
        <div class="panel-hd">
          <h2>{{ '微信应用查看' }}</h2>
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
  import Tab from '../../../components/Tab'
  import { globalMixins } from '../../../mixins'
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
        var appId = this.$route.params.id
        return {
          secondaryNav: [{
            label: '修改应用',
            link: { path: '/apps/wechat/' + appId + '/update' }
          }]
        }
      }
    }
  }
</script>
