<template>
  <div class="main">
    <div class="main-title">
      <h2>菜谱管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav" class="no-split-line"></breadcrumb>
    <tab :nav="secondaryNav"></tab>

    <!-- Start: 路由视图 -->
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
    <!-- End: 路由视图 -->
  </div>
</template>

<script>
import api from 'api'
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../../../mixins'
import Breadcrumb from 'components/Breadcrumb'
import Tab from 'components/Tab'

export default {
  name: 'EditRecipe',

  layout: 'admin',

  mixins: [globalMixins, pluginMixins],

  components: {
    Breadcrumb,
    Tab
  },

  data () {
    let recipeRoot = `/operation/plugins/recipes/${this.$route.params.app_id}/recipes`
    let recipeId = this.$route.params.id
    return {
      breadcrumbNav: [{
        label: '菜谱管理',
        link: recipeRoot
      }, {
        label: '编辑菜谱'
      }],
      secondaryNav: [{
        label: '基本信息',
        link: { path: `${recipeRoot}/${recipeId}/edit/basic-info` }
        // link: { path: 'basic-info' }
      }, {
        label: '烹饪设置',
        link: { path: `${recipeRoot}/${recipeId}/edit/devices` }
      }]
      // nav: ['基本信息', '烹饪设置'],
      // curr: 0
    }
  },

  methods: {
    /**
     * 删除菜谱
     */
    deleteRecipe () {
      if (!window.confirm('确定要删除该菜谱吗？')) return

      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      api.recipes.delRecipes(appId, this.$route.params.id, token).then((res) => {
        if (res.status === 200) {
          this.showNotice({
            type: 'success',
            content: '菜谱删除成功'
          })
          this.$route.router.go({path: `/operation/plugins/recipes/${this.$route.params.app_id}/recipes`})
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../../../assets/stylus/common'

.tips-null
  text-align center
  border 1px solid default-border-color

// 选项卡
.tab
  margin 5px 0
  padding 0 15px
  border-bottom 1px solid default-border-color

  ul
    reset-list()
    font-size 0

  li
    display inline-block
    font-size 13px

    a
      display block
      padding 0 20px
      line-height 28px
      color gray

      &:hover
        text-decoration none
        color gray-darker

      &.active
        height 28px
        background-color #fff
        border 1px solid default-border-color
        border-bottom none!important
        position relative
        bottom -1px
        font-weight bold
</style>
