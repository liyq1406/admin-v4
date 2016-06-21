<template>
  <section class="main-wrap diet">
    <div class="main">
      <div class="breadcrumb"><a v-link="{path: '/plugins/recipe/' + $route.params.app_id}"><i class="fa fa-arrow-circle-left"></i>菜谱管理</a></div>
      <div class="panel">
        <div class="panel-hd">
          <h2>编辑菜谱</h2>
        </div>
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
  </section>
</template>

<script>
  import api from 'api'
  import { globalMixins } from 'src/mixins'
  import { pluginMixins } from '../../mixins'
  import RecipeForm from './components/RecipeForm'

  export default {
    name: 'EditRecipe',

    layout: 'admin',

    mixins: [globalMixins, pluginMixins],

    components: {
      RecipeForm
    },

    methods: {
      /**
       * 删除菜谱
       */
      deleteRecipe () {
        var self = this
        var argvs = arguments
        var fn = self.deleteRecipe
        if (window.confirm('确定要删除该菜谱吗？')) {
          this.getAppToKen(this.$route.params.app_id, 'recipe').then((token) => {
            api.diet.deleteRecipe(this.$route.params.app_id, token, this.$route.params.id).then((res) => {
              if (res.status === 200) {
                this.$route.router.go({path: '/plugins/recipe/' + this.$route.params.app_id})
              }
            }).catch((err) => {
              var env = {
                'fn': fn,
                'argvs': argvs,
                'context': self,
                'plugin': 'recipe'
              }
              self.handlePluginError(err, env)
            })
          })
        }
      }
    }
  }
</script>
