<template>
  <section class="main-wrap diet">
    <div class="main">
      <div class="breadcrumb"><a v-link="{path: '/plugins/recipe/' + $route.params.app_id}"><i class="fa fa-arrow-circle-left"></i>菜谱管理</a></div>
      <div class="panel">
        <div class="panel-hd">
          <h2>添加菜谱</h2>
        </div>
        <div class="panel-bd">
          <recipe-form></recipe-form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import { pluginMixins } from '../../mixins'
  import RecipeForm from './components/RecipeForm'

  export default {
    name: 'AddRecipe',

    layout: 'admin',

    mixins: [globalMixins, pluginMixins],

    components: {
      RecipeForm
    }
  }
</script>
