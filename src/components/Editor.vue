<template>
  <div class="html-editor">
    <textarea v-model="value" name="openContent" class="input-text"></textarea>
  </div>
</template>

<script>
  import Vue from 'vue'
  import tinymce from 'tinymce/tinymce'
  import 'tinymce/themes/modern/theme'

  // Plugins
  import 'tinymce/plugins/link/plugin'
  import 'tinymce/plugins/autoresize/plugin'
  import 'tinymce/plugins/image/plugin'
  import 'tinymce/plugins/code/plugin'
  import 'tinymce/plugins/preview/plugin'
  import 'tinymce/plugins/searchreplace/plugin'
  import 'tinymce/plugins/fullscreen/plugin'

  export default {
    name: 'Editor',

    props: {
      value: {
        type: String
      }
    },

    ready () {
      var editorConfig = {
        selector: 'textarea', // 选择器
        menubar: false, // 是否显示菜单栏
        theme: 'modern', // 主题样式
        // skin: 'lightgray',
        skin_url: '/static/vendor/tinymce/skins/lightgray', // 皮肤
        toolbar_items_size: 'small', // 工具栏图标大小
        plugins: ['paste', 'link', 'autoresize', 'fullscreen', 'image', 'code', 'preview', 'searchreplace'], // 插件
        toolbar1: 'undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify', // 工具栏1
        toolbar2: 'searchreplace | bullist numlist | outdent indent blockquote | link unlink anchor image code | preview fullscreen' // 工具栏2
      }

      // 翻译
      // 默认为英文，如果是中文环境则导入中文翻译
      if (Vue.config.lang === 'zh-cn') {
        editorConfig.language_url = '/static/vendor/tinymce/langs/zh_CN.js'
      }

      tinymce.init(editorConfig)
    },

    destroyed () {
      tinymce.remove()
    }
  }
</script>

<style lang="stylus">
</style>
