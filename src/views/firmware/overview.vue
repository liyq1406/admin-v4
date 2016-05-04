<template>
  <div>
    <div class="panel">
      <div class="panel-bd">
        11111
      </div>
    </div>
  </div>
</template>

<script>
  // import Vue from 'vue'
  // import locales from '../../consts/locales/index'
  // import api from '../../api'
  import Modal from '../../components/Modal'
  import store from '../../store/index'
  import { createPlugin, updatePlugin, removePlugin } from '../../store/actions/plugins'
  // import _ from 'lodash'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'Applications',

    layout: 'admin',

    mixins: [globalMixins],

    store,

    vuex: {
      getters: {
        plugins: ({ plugins }) => plugins.all
      },
      actions: {
        createPlugin,
        updatePlugin,
        removePlugin
      }
    },

    components: {
      'modal': Modal
    },

    data () {
      return {
      }
    },

    route: {
      data () {

      }
    },

    filters: {

    },

    methods: {

    }
  }
</script>

<style lang="stylus">
  @import '../../assets/stylus/common'

</style>
