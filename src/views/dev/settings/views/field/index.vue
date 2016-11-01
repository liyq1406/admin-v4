<template lang="html">
  <div class="field-page">
    <div class="container">
      <div class="catalog-box">
        <div :class="'catalog-list ' + catalog.key" v-for="catalog in catalogs">
          <span>{{catalog.title}}</span>
        </div>
      </div>
      <div class="content-box">
        <router-view transition="view" transition-mode="out-in" class="view"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
// import api from 'api'

export default {
  name: 'field',

  mixins: [globalMixins],

  vuex: {
    getters: {
      corp: ({ system }) => system.corp
    }
  },
  data () {
    return {
      catalogs: [
        {
          title: '设备字段',
          key: 'device'
        },
        {
          title: '用户字段',
          key: 'user'
        },
        {
          title: '告警字段',
          key: 'alert'
        },
        {
          title: '产品字段',
          key: 'product'
        },
        {
          title: '经销商字段',
          key: 'dealer'
        },
        {
          title: '维保字段',
          key: 'warranty'
        }
      ]
    }
  },
  computed: {
    selectedField () {
      // return this.$route.p
    }
  },
  ready () {
  },
  methods: {}
}
</script>

<style lang="stylus" scoped>
@import '../../../../../assets/stylus/common'

</style>
