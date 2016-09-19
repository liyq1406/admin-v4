<template>
  <div class="html-editor">
    <textarea class="editor" name="openContent" class="input-text"></textarea>
    <div class="editor-image">
      <input class="editor-image" name="image" type="file" @change.prevent="upload($event, $index)">
    </div>
  </div>
</template>

<script>
  // TinyMCE 官网地址：https://www.tinymce.com/
  import api from '../api'
  import Vue from 'vue'
  import { globalMixins } from 'src/mixins'
  import tinymce from 'tinymce/tinymce'
  import 'tinymce/themes/modern/theme'
  import * as config from 'consts/config'

  // Plugins
  import 'tinymce/plugins/link/plugin'
  import 'tinymce/plugins/autoresize/plugin'
  import 'tinymce/plugins/image/plugin'
  // import 'tinymce/plugins/code/plugin'
  // import 'tinymce/plugins/preview/plugin'
  // import 'tinymce/plugins/searchreplace/plugin'
  // import 'tinymce/plugins/fullscreen/plugin'
  import 'tinymce/plugins/textcolor/plugin'

  export default {
    name: 'Editor',

    mixins: [globalMixins],

    props: {
      value: {
        type: String,
        default: ''
      }
    },

    data () {
      return {
        editorImageSrc: null
      }
    },

    ready () {
      var self = this
      var editorConfig = {
        selector: '.editor', // 选择器
        menubar: false, // 是否显示菜单栏
        statusbar: false, // 是否显示状态栏
        theme: 'modern', // 主题样式
        skin: 'lightgray', // 皮肤样式
        skin_url: '/static/vendor/tinymce/skins/lightgray', // 皮肤
        toolbar_items_size: 'small', // 工具栏图标大小
        fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt', // 候选字体大小
        plugins: ['link', 'autoresize', 'image', 'textcolor'], // 插件
        // toolbar1: 'undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify', // 工具栏1
        // toolbar2: 'searchreplace | bullist numlist | outdent indent blockquote | link unlink anchor image code | preview fullscreen', // 工具栏2
        toolbar1: 'fontsizeselect | forecolor bold italic underline link image', // 工具栏1
        file_browser_callback: function (fieldName, url, type, win) {
          self.editorImageSrc = win.document.getElementById(fieldName)
          if (type === 'image') {
            document.querySelector('.editor-image').click()
          }
          self.editorImageSrc.readOnly = 'readonly'
        }
      }

      // 翻译
      // 默认为英文，如果是中文环境则导入中文翻译
      if (Vue.config.lang === 'zh-cn') {
        editorConfig.language_url = '/static/vendor/tinymce/langs/zh_CN.js'
      }

      // var tinymce = window.tinymce
      tinymce.init(editorConfig).then((editors) => {
        editors[0].on('change', (e) => {
          this.$dispatch('change', editors[0].getContent())
        })
        this.editor = editors[0]
        if (this.value !== '') {
          this.editor.setContent(this.value)
        }
      })
    },

    destroyed () {
      window.setTimeout(() => {
        tinymce.remove()
      }, 500)
    },
    watch: {
      value () {
        if (this.editor) {
          this.editor.setContent(this.value)
        }
      }
    },
    methods: {
      /**
       * 上传图片
       * @param  {HTMLDOMEvent} event 事件
       * @param  {Number}       index 索引
       */
      upload (event, index) {
        var input = event.target
        var file = input.files[0]

        if (file && file.size > config.MAX_IMAGE_FILE_SIZE * 1024 * 1024) {
          this.showNotice({
            type: 'error',
            content: this.$t('ui.upload.file_size_msg', {max: config.MAX_IMAGE_FILE_SIZE})
          })
          return
        }

        if (window.File && window.FileReader && window.FileList && window.Blob) {
          var reader = new window.FileReader()
          reader.onerror = (evt) => {
            this.showNotice({
              type: 'error',
              content: this.$t('ui.upload.read_err')
            })
          }
          // 读取完成
          reader.onloadend = (evt) => {
            if (evt.target.readyState === window.FileReader.DONE) {
              if (!this.uploading) {
                this.uploading = true
                api.upload.image(evt.target.result).then((res) => {
                  if (res.status === 200) {
                    if (this.editorImageSrc) {
                      this.editorImageSrc.value = res.data.url
                      this.uploading = false
                      this.editorImageSrc.readOnly = ''
                    }
                  }
                }).catch((res) => {
                  this.handleError(res.data.error)
                  this.uploading = false
                  this.editorImageSrc.readOnly = ''
                })
              }
            }
          }
          reader.readAsArrayBuffer(file)
        } else {
          this.showNotice({
            type: 'error',
            content: this.$t('ui.upload.compatiblity')
          })
        }
      }
    }
  }
</script>

<style lang="stylus">
@import '../assets/stylus/common'

.html-editor
  .mce-panel
    border-color default-border-color

.editor-image
  height 0
  overflow hidden
</style>
