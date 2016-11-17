<template>
  <div class="preview-panel">
    <div class="preview-panel-wrap">
      <div class="preview-panel-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PreviewPanel'
}
</script>

<style lang="stylus">
.preview-panel
  height 568px
  overflow hidden
  box-sizing border-box

.preview-panel-wrap
  width 355px
  height 100%
  overflow-y auto

.preview-panel-content
  width 320px
  box-sizing border-box
  position relative
</style>
