<template>
  <div class="with-loading">
    <content-form form-type="add"></content-form>
  </div>
</template>

<script>
import ContentForm from './components/ContentForm'
export default {
  name: 'AddContent',
  components: {
    ContentForm
  }
}
</script>
