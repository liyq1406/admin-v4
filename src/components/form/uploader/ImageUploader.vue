<template>
  <div class="image-uploader">
    <div class="image-uploader-item" v-for="image in images" track-by="$index" :style="itemStyles">
      <label>
        <img v-if="image.length" :src="image"/>
        <input type="file" @change.prevent="upload($event, $index)"/>
        <i v-if="!image.length" class="fa fa-plus"></i>
        <span v-if="!image.length" class="txt">添加图片</span>
      </label>
      <i v-if="image.length" @click.stop.prevent="removeImage($index)" class="fa fa-times"></i>
    </div>
  </div>
</template>

<script>
  import api from 'api'
  import * as config from 'consts/config'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'ImageUploader',

    mixins: [globalMixins],

    props: {
      images: {
        type: Array,
        default () {
          return []
        }
      },

      imgWidth: {
        type: String,
        default: '160px'
      },

      imgHeight: {
        type: String,
        default: '120px'
      },

      uploadApi: {
        type: Function,
        default: api.upload.image
      }
    },

    data () {
      return {
        uploading: false
      }
    },

    computed: {
      itemStyles () {
        return {
          width: this.imgWidth,
          height: this.imgHeight
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
        console.log(this.uploadApi)
        var input = event.target
        var file = input.files[0]

        // 导入文件类型不合法
        if (!/\.(?:png|jpg|bmp|gif)$/i.test(file.name) || !file.size) {
          this.showNotice({
            type: 'error',
            content: '请上传正确的图片文件'
          })
          return false
        }

        if (file && file.size > config.MAX_IMAGE_FILE_SIZE * 1024 * 1024) {
          this.showNotice({
            type: 'error',
            content: this.$t('common.upload.file_size_msg', {max: config.MAX_IMAGE_FILE_SIZE})
          })
          return
        }

        if (window.File && window.FileReader && window.FileList && window.Blob) {
          var reader = new window.FileReader()
          reader.onerror = (evt) => {
            this.showNotice({
              type: 'error',
              content: this.$t('common.upload.read_err')
            })
          }
          // 读取完成
          reader.onloadend = (evt) => {
            if (evt.target.readyState === window.FileReader.DONE) {
              if (!this.uploading) {
                this.uploading = true
                this.uploadApi(evt.target.result).then((res) => {
                  if (res.status === 200) {
                    this.setImage(index, res.data.url)
                    input.value = ''
                    this.uploading = false
                  }
                }).catch((res) => {
                  this.handleError(res)
                  this.uploading = false
                })
              }
            }
          }
          reader.readAsArrayBuffer(file)
        } else {
          this.showNotice({
            type: 'error',
            content: this.$t('common.upload.compatiblity')
          })
        }
      },

      /**
       * 移除图片
       * @param {Number} index 图片索引
       */
      removeImage (index) {
        this.setImage(index, '')
      },

      /**
       * 设置图片
       * @param {Number} index 图片索引
       * @param {String} image 图片路径
       */
      setImage (index, image) {
        this.images.$set(index, image)
        this.$emit('modified', this.images)
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'

  .image-uploader
    clearfix()

  .image-uploader-item
    position relative
    float left
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
