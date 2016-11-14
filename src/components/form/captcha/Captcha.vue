<template>
  <div :style="canvasStyle" @click="generate" class="captcha">
    <canvas :width="width" :height="height" :style="canvasStyle"></canvas>
  </div>
</template>

<script>
  export default {
    name: 'Captcha',

    props: {
      value: {
        type: String,
        twoWay: true,
        default: ''
      },
      width: {
        type: Number,
        default: 100
      },
      height: {
        type: Number,
        default: 40
      }
    },

    data () {
      return {
        canvasStyle: {
          width: this.width + 'px',
          height: this.height + 'px'
        }
      }
    },

    ready () {
      this.canvas = this.$el.getElementsByTagName('canvas')[0]
      this.generate()
    },

    methods: {
      generate () {
        var context = this.canvas.getContext('2d')
        this.genRandomText()

        context.fillStyle = '#DDD'
        context.fillRect(0, 0, this.width, this.height)

        context.font = 'bold 20px "Comic Sans MS", cursive, sans-serif'
        context.textBaseline = 'middle'
        var w = context.measureText(this.value).width
        context.fillStyle = '#333'
        context.fillText(this.value, (this.width - w) / 2, this.height / 2)
      },

      genRandomText () {
        this.value = ''
        var possibleCharacters = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz123456789'
        var length = Math.floor((Math.random() * 3) + 4)
        for (var i = 0; i < length; i++) {
          this.value += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))
        }
      }
    }
  }
</script>

<style lang="stylus">
  .captcha
    overflow hidden
</style>
