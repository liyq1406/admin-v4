<template lang="jade">
label.image-uploader-item
  img(v-if="image.length", :src="image")
  input(type="file", v-el:image-file)
  i.fa.fa-plus(v-if="!image.length")
  span.txt(v-if="!image.length") 添加图片
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
    };
  },

  ready () {
    // console.log(this.$els['aaBb0'].files[0]);
    console.log(this.$els['imageFile']);
  },

  methods: {
    upload () {

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
