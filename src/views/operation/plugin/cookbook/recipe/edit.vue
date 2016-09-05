<template>
  <div class="main">
    <div class="main-title">
      <h2>菜谱管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
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
      }]
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
