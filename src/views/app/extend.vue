<template>
  <div>
    <div class="panel">
      <div class="panel-bd">
        <ul class="extendUl">
          <li>
            <div class="extendArea">
              <p class="extendName">云菜谱</p>
              <p class="extendDescribe">Lorem ipsum dolor sit amet,consenctetur adipiscing elit.Aenean euismod bibendum laoreet.Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.</p>
              <button class="addBtn btn btn-primary">ADD</button>
            </div>
          </li>
          <li>
            <div class="extendArea">
              <p class="extendName">Google nest互联</p>
              <p class="extendDescribe">Lorem ipsum dolor sit amet,consenctetur adipiscing elit.Aenean euismod bibendum laoreet.Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.</p>
              <button class="addBtn btn btn-primary">ADD</button>
            </div>
          </li>
        </ul>
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
  .extendUl
    margin 10px 0 20px 0
    li
      border-bottom 1px solid #CCCCCC
      position relative
  .extendName
    font-size 18px
  .extendDescribe
    margin 0 90px 20px 0
  .addBtn
    position absolute
    top 30px
    right 20px
</style>
