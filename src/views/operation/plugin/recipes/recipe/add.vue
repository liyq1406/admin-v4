<template>
  <div class="main">
    <div class="main-title">
      <h2>菜谱管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel">
      <div class="panel-bd">
        <recipe-form type="add"></recipe-form>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../../mixins'
import Breadcrumb from 'components/Breadcrumb'
import RecipeForm from './components/RecipeForm'

export default {
  name: 'AddRecipe',

  mixins: [globalMixins, pluginMixins],

  components: {
    Breadcrumb,
    RecipeForm
  },

  data () {
    return {
      breadcrumbNav: [{
        label: '菜谱管理',
        link: `/operation/plugins/recipes/${this.$route.params.app_id}/recipes`
      }, {
        label: '添加菜谱'
      }]
    }
  }
}
</script>
