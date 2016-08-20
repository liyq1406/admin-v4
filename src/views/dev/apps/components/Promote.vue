<template>
  <div class="promote">
    <pre>{{app | json}}</pre>
    <div class="btn-box mt20">
      <button class="btn btn-primary w100">添加升级任务</button>
    </div>
  </div>
</template>

<script>
  // import api from 'api'
  // import Select from 'components/Select'
  import { globalMixins } from 'src/mixins'
  import { createPlugin, updatePlugin, removePlugin } from 'store/actions/plugins'
  import { pluginFactoryMixin } from '../mixins'
  import Modal from 'components/Modal'
  // import _ from 'lodash'

  export default {
    name: 'promote',

    layout: 'admin',

    mixins: [globalMixins, pluginFactoryMixin],

    vuex: {
      actions: {
        createPlugin,
        updatePlugin,
        removePlugin
      }
    },

    components: {
      Modal
    },

    props: {
      app: {
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

    methods: {

    }
  }
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
</style>
