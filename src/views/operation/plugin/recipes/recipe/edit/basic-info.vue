<template>
  <div class="recipe-basic">
    <recipe-form type="edit"></recipe-form>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../../../mixins'
import RecipeForm from '../components/RecipeForm'

export default {
  name: 'EditRecipe',

  layout: 'admin',

  mixins: [globalMixins, pluginMixins],

  components: {
    RecipeForm
  }
}
</script>
