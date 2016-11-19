<template>
  <div class="x-qrcode"></div>
</template>

<script>
import QRCode from 'qrcode2'

export default {
  name: 'Qrcode',

  props: {
    // 要转换的文本
    text: {
      type: String,
      required: true
    },

    // 宽度
    width: {
      type: Number,
      default: 256
    },

    // 高度
    height: {
      type: Number,
      default: 256
    },

    // 前景色
    foreground: {
      type: String,
      default: '#000000'
    },

    // 背景色
    background: {
      type: String,
      default: '#FFFFFF'
    },

    // 容错级别 [L|M|Q|H]
    level: {
      type: String,
      default: 'H'
    }
  },

  data () {
    return {
      qrcode: null
    }
  },

  watch: {
    text () {
      if (this.qrcode) {
        this.qrcode.makeCode(this.text)
      }
    }
  },

  ready () {
    this.qrcode = new QRCode(this.$el, {
      text: this.text,
      width: this.width,
      height: this.height,
      colorDark: this.foreground,
      colorLight: this.background,
      correctLevel: QRCode.CorrectLevel[this.level]
    })
  }
}
</script>

<style lang="css">
</style>
