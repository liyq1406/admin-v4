<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="extension-list">
        <ul>
          <li>
            <h3>延保系统</h3>
            <div class="row">
              <div class="col-20">
                <p>Lorem ipsum dolor sit amet,consenctetur adipiscing elit.Aenean euismod bibendum laoreet.Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.</p>
              </div>
              <div class="col-4 tar">
                <switch></switch>
                <!-- <button class="btn btn-primary">{{ $t('common.add') }}</button> -->
                <!-- <span class="btn btn-default">{{ $t('common.added') }}</span> -->
              </div>
            </div>
          </li>
          <li>
            <h3>云菜谱</h3>
            <div class="row">
              <div class="col-20">
                <p>Lorem ipsum dolor sit amet,consenctetur adipiscing elit.Aenean euismod bibendum laoreet.Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.</p>
              </div>
              <div class="col-4 tar">
                <switch></switch>
                <!-- <button class="btn btn-primary">{{ $t('common.add') }}</button> -->
              </div>
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
  import Switch from '../../components/Switch'
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
      'modal': Modal,
      'switch': Switch
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

  .extension-list
    li
      padding 20px 0
      border-bottom 1px solid default-border-color

      &:last-child
        border none

      h3
        font-weight normal
        font-style 16px
        margin 0 0 10px

      p
        margin 0
        color gray
</style>
