<template lang="jade">
div.image-uploader-item
  label
    img(v-if="image.length", :src="image")
    input(type="file", v-el:image-file, name="imageFile", @change.prevent="upload($event)")
    i.fa.fa-plus(v-if="!image.length")
    span.txt(v-if="!image.length") 添加图片
  i.fa.fa-times(v-if="image.length", @click.stop.prevent="removeImage")
</template>

<script>
import api from '../api';

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
    };
  },

  methods: {
    // 上传图片文件
    upload (event) {
      var self = this;
      var file = this.$els['imageFile'].files[0];
      var input = event.target;

      if (file && file.size > 1024 * 1024) {
        alert(self.$t('task.file_size_msg'));
        return;
      }

      if (window.File && window.FileReader && window.FileList && window.Blob) {
        var reader = new FileReader();
        reader.onerror = function (evt) {
          alert(self.$t('upload.read_err'));
        };
        // 读取完成
        reader.onloadend = function (evt) {
          if (evt.target.readyState === FileReader.DONE) {
            if (!self.uploading) {
              self.uploading = true;
              api.corp.refreshToken().then(function () {
                api.upload.image(evt.target.result).then(function (data) {
                  self.image = data.url;
                  input.value = '';
                  self.uploading = false;
                }).catch(function (error) {
                  self.handleError(error);
                  self.uploading = false;
                });
              });
            }
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        alert(self.$t('upload.compatiblity'));
      }
    },

    removeImage () {
      this.image = '';
    }
  }
};
</script>

<style lang="stylus">
@import '../assets/stylus/common'

.image-uploader
  clearfix()

.image-uploader-item
  position relative
  float left
  size 160px 120px
  border 1px solid #DEDEDE
  color gray-light
  cursor pointer
  margin 0 10px 10px 0

  label
  img
    display block
    size 100%

  label
    cursor pointer

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
    absolute right 10px top 10px
    font-size 20px
    size 24px
    line-height 24px
    background rgba(0, 0, 0, .3)
    color #FFF
    text-align center
    z-index 100
</style>
