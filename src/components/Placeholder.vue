<template>
  <div class="input-text-wrap">
    <slot></slot>
    <span class="placeholder">{{ text }}</span>
  </div>
</template>

<script>
  export default {
    name: 'Placeholder',

    props: {
      text: {
        type: String,
        default: ''
      }
    }
  }
</script>
