<template>
  <div class="image-uploader-item">
    <label><img v-if="image.length" :src="image"/>
      <input type="file" v-el:image-file="v-el:image-file" name="imageFile" @change.prevent="upload($event)"/><i v-if="!image.length" class="fa fa-plus"></i><span v-if="!image.length" class="txt">添加图片</span>
    </label><i v-if="image.length" @click.stop.prevent="removeImage" class="fa fa-times"></i>
  </div>
</template>

<script>
  import api from '../api'
  import * as config from 'consts/config'

  export default {
    props: {
      image: {
        type: String,
        default: ''
      }
    },

    data () {
      return {
        uploading: false
      }
    },

    methods: {
      // 上传图片文件
      upload (event) {
        var file = this.$els['imageFile'].files[0]
        var input = event.target

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
                    this.image = res.data.url
                    input.value = ''
                    this.uploading = false
                  }
                }).catch((res) => {
                  this.handleError(res.data.error)
                  this.uploading = false
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
      },

      removeImage () {
        this.image = ''
      }
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  .image-uploader
    clearfix()

  .image-uploader-item
    position relative
    float left
    size 160px 120px
    border 1px solid default-border-color
    color gray-light
    cursor pointer
    margin 0 10px 10px 0
    box-sizing border-box

    &:nth-child(3n)
      margin-right 0

    label
    img
      display block
      size 100%

    label
      cursor pointer
      position relative
      overflow hidden

    input[type="file"]
      absolute top -50px
      opacity 0

    .fa-plus
    .txt
      absolute left top 30px
      width 100%
      text-align center

    .fa-plus
      font-size 36px

    .txt
      top 80px

    .fa-times
      absolute right 5px top 5px
      font-size 14px
      size 24px
      line-height 24px
      background rgba(255, 0, 0, .5)
      color #FFF
      text-align center
      z-index 100
</style>
