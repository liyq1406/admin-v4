<template lang="html">
  <div class="field-page">
    <div class="container">
      <div class="catalog-box">
        <div :class="'catalog-list ' + catalog.key + (catalog.key === selectedField?' selected': '')" v-for="catalog in catalogs" @click.stop="go(catalog.key)">
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
        }
        // {
        //   title: '告警字段',
        //   key: 'alert'
        // },
        // {
        //   title: '产品字段',
        //   key: 'product'
        // }
        // {
        //   title: '经销商字段',
        //   key: 'dealer'
        // },
        // {
        //   title: '维保字段',
        //   key: 'warranty'
        // }
      ]
    }
  },
  computed: {
    // 当前自定义字段类型
    selectedField () {
      var result = ''
      var path = this.$route.path
      console.log(path)
      result = path.split('/field/')[1]
      result = result.split('?')[0]
      // return this.$route.p
      return result
    }
  },
  ready () {
  },
  methods: {
    go (key) {
      this.$route.router.go(key)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../../assets/stylus/common'

  .field-page
    padding 15px
    box-sizing border-box
    .container
      width 100%
      height 100%
      position relative
      padding-left 230px
      box-sizing border-box
      .catalog-box
        width 230px
        position absolute
        left 0
        top 0
      .content-box
        width 100%
        min-height 500px
        border 1px solid #e8e8e8
        padding 20px
        box-sizing border-box
    .catalog-box .catalog-list
      width 100%
      height 40px
      line-height 40px
      border 1px solid #e8e8e8
      border-right 0
      background #f2f2f2
      margin-bottom 10px
      box-sizing border-box
      padding-left 20px
      position relative
      cursor pointer
      &.selected
        cursor auto
        background #fff
        &:after
          content ''
          display block
          width 3px
          height 100%
          position absolute
          top 0
          right -1px
          background #fff
</style>
