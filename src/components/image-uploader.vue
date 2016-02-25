<template lang="jade">
label.image-uploader-item
  img(v-if="image.length", :src="image")
  input(type="file", v-el:image-file, name="imageFile", @change.prevent="upload($event)")
  i.fa.fa-plus(v-if="!image.length")
  span.txt(v-if="!image.length") 添加图片
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
    upload: function (event) {
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

  img
    size 100%

  input[type="file"]
    absolute top -50px
    opacity 0

  .fa
  .txt
    absolute left top 30px
    width 100%
    text-align center

  .fa
    font-size 36px

  .txt
    top 80px
</style>
