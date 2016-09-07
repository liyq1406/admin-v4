<template>
  <div class="with-loading">
    <content-form form-type="edit"></content-form>
  </div>
</template>

<script>
import ContentForm from './components/ContentForm'
import { globalMixins } from 'src/mixins'

export default {
  name: 'EditContent',

  mixins: [globalMixins],

  components: {
    ContentForm
  }
}
</script>
