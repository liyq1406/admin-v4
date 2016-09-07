<template>
  <div class="main">
    <div class="main-title">
      <h2>菜谱管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav" class="no-split-line"></breadcrumb>
    <nav class="tab">
      <ul>
        <li v-for="link in nav"><a :class="{'active': $index===curr}" @click.prevent="curr=$index">{{ link }}</a></li>
      </ul>
    </nav>
    <template v-if="curr===0">
      <div class="panel">
        <div class="panel-bd">
          <recipe-form type="edit"></recipe-form>
        </div>
      </div>
      <div class="panel">
        <div class="panel-bd">
          <button @click.prevent="deleteRecipe" class="btn btn-primary btn-lg mt10 mb10">{{ $t('ui.recipe.del') }}</button>
        </div>
      </div>
    </template>
    <template v-if="curr===1">
      <div class="panel mt20">
        <div class="panel-hd">
          <h2>烹饪设备列表</h2>
        </div>
        <div class="panel-bd">
          <div class="data-table with-loading">
            <div class="icon-loading" v-show="loadingData">
              <i class="fa fa-refresh fa-spin"></i>
            </div>
            <table class="table table-stripe table-bordered">
              <thead>
                <tr>
                  <th class="wp20">烹饪设备</th>
                  <th>指令</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>烤箱</td>
                  <td><span class="hl-red">{time:80s,temp:80}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import api from 'api'
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../../mixins'
import Breadcrumb from 'components/Breadcrumb'
import RecipeForm from './components/RecipeForm'

export default {
  name: 'EditRecipe',

  layout: 'admin',

  mixins: [globalMixins, pluginMixins],

  components: {
    Breadcrumb,
    RecipeForm
  },

  data () {
    return {
      breadcrumbNav: [{
        label: '菜谱管理',
        link: `/operation/plugins/cookbook/${this.$route.params.app_id}/recipes`
      }, {
        label: '编辑菜谱'
      }],
      nav: ['基本信息', '烹饪设置'],
      curr: 0
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

      api.cookbook.delCookbook(appId, this.$route.params.id, token).then((res) => {
        if (res.status === 200) {
          this.showNotice({
            type: 'success',
            content: '菜谱删除成功'
          })
          this.$route.router.go({path: `/operation/plugins/cookbook/${this.$route.params.app_id}/recipes`})
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus">
@import '../../../../../assets/stylus/common'

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
