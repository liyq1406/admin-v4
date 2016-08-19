<template>
  <div class="main">
    <div class="main-title bordered">
      <div class="title-wrap">
        <h2>应用中心</h2>
      </div>
    </div>
    <div class="panel no-split-line">
      <!-- <div class="panel-hd bordered">
        <h2>应用中心</h2>
      </div> -->
      <div class="panel-bd">
        123
      </div>

    </div>
  </div>
</template>

<script>
  import api from 'api'
  import { globalMixins } from 'src/mixins'
  import { createPlugin, updatePlugin, removePlugin } from 'store/actions/plugins'
  import { pluginFactoryMixin } from './mixins'
  import _ from 'lodash'

  export default {
    name: 'Data',

    layout: 'admin',

    mixins: [globalMixins, pluginFactoryMixin],

    vuex: {
      actions: {
        createPlugin,
        updatePlugin,
        removePlugin
      }
    },

    components: {},

    data () {
      return {
        loadingData: false,
        apps: []
      }
    },

    route: {
      data () {
        this.getApps()
      }
    },

    methods: {
      // 获取 APP 列表
      getApps () {
        this.loadingData = true
        api.plugin.all().then((res) => {
          console.log(res)
          if (res.status === 200) {
            this.loadingData = false
            this.apps = _.filter(res.data.list, (item) => {
              return item.type !== 10
            })
          }
        })
      }

    }
  }
</script>

<style lang="stylus">
@import '../../../assets/stylus/common'
</style>
