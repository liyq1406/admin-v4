<template>
  <div class="with-loading">
    <content-form form-type="edit"></content-form>
  </div>
</template>

<script>
import ContentForm from './components/ContentForm'
export default {
  name: 'EditContent',
  components: {
    ContentForm
  }
}
</script>
