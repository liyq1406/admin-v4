<template>
  <div class="c-range-box">
    <div class="label-box">
      <slot name="label"></slot>
    </div>
    <div class="line" :style="'height:' + lineHeight" @mouseUp="select">
      <div class="selected-background"></div>
    </div>
    <div class="circle" :style="'width:' + circleR + ';height:' + circleR + ';left:' + left + 'px;-webkit-transition:left ease ' +(transition?'0.2':'0')+ 's'"></div>
    <div class="no-control-mask" v-show="disabled"></div>
  </div>
</template>

<script>
  module.exports = {
    /**
     * 暴露的方法：内容改变
     * @param  {[type]} 'changed'  方法名
     * @param  {[type]} this.value 值
     * @param  {[type]} precent    百分比
     */
     // this.$emit('changed', this.value, precent)

    props: {
      // 最小值
      'min': {
        type: Number,
        default: 0
      },
      // 最大值
      'max': {
        type: Number,
        default: 100
      },
      // 默认值
      'value': {
        type: Number,
        default: 75
      },
      // 高度
      'lineHeight': {
        type: String,
        default: '3px'
      },
      // 宽度
      // 'width': {
      //   type: String,
      //   default: '160px'
      // },
      // 背景色数组
      'lineBackgroundColors': {
        type: Array,
        default () {
          return ['#fbd154', '#fff3c0', '#fff', '#ddebff', '#000']
        }
      },
      // 是否实时上报数据value 设置为false的时候 当变化完成才上报value 设置为true的时候 回调changed会被频繁调用
      'realTime': {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        left: 0,
        // lineHeight: '0.2rem',
        circleR: '20px',
        transition: false
      }
    },
    watch: {
      value () {
        if (this.realTime) {
          this.emit()
        } else {
          clearTimeout(this.tid)
          this.tid = setTimeout(() => {
            this.emit()
          }, 200)
        }
      }
    },
    ready () {
      this.init()
    },
    methods: {
      select (ev) {
        var self = this
        var line = ev.target
        var _circle = line.nextElementSibling
        var _circleR = _circle.offsetWidth / 2
        var maxLeft = line.clientWidth - _circleR * 2
        console.log(ev.clientX)
        var left = ev.clientX - self.getPosition(line).left - _circleR
        if (left < 0) {
          left = 0
        } else if (left > maxLeft) {
          left = maxLeft
        }
        this.transition = true
        setTimeout(() => {
          this.transition = false
        }, 0)
        // console.log(_circle.style.WebkitTransition)
        self.left = left
        self.computedValue(maxLeft)
      },
      /**
       * 组件初始化
       * @return {[type]} [description]
       */
      init () {
        var self = this
        var parentDom = this.$el
        var linedom = parentDom.children[1]
        var circledom = parentDom.children[2]
        var parentWidth = parentDom.clientWidth
        var maxLeft = parentWidth - circledom.clientWidth
        var _circleR = circledom.offsetWidth / 2
        var linePosition = this.getPosition(linedom)
        console.log(linePosition)
        self.left = maxLeft * ((self.value - self.min) / (self.max - self.min))
        var dx
        self.down = false
        circledom.addEventListener('mousedown', function (ev) {
          console.log('down')
          self.down = true
          dx = self.left
          ev.preventDefault()
        }, false)
        circledom.addEventListener('mousemove', function (ev) {
          if (self.down) {
            var offsetLeft = ev.x - linePosition.left - _circleR / 2
            console.log(offsetLeft)
            console.log(maxLeft)
            if (offsetLeft <= maxLeft && offsetLeft >= 0) {
              self.left = offsetLeft
            } else if (offsetLeft >= maxLeft) {
              self.left = maxLeft
            } else if (offsetLeft <= 0) {
              self.left = 0
            }
            // self.computedValue(maxLeft)
          }
          // var offx = dx + ev.x
          // if (offx <= maxLeft && offx >= 0) {
          //   self.left = offx
          // } else if (offx >= maxLeft) {
          //   self.left = maxLeft
          // } else if (offx <= 0) {
          //   self.left = 0
          // }
          // self.computedValue(maxLeft)
        }, false)
        circledom.addEventListener('mouseup', function (ev) {
          console.log('Up')
          self.down = false
          dx += ev.x
        }, false)
        circledom.addEventListener('mouseout', function (ev) {
          self.down = false
        }, false)
      },
      /**
       * 计算当前dom在页面中相对屏幕的位置
       * @param  {[type]} node [description]
       * @return {[type]}      [description]
       */
      getPosition (node) {
        var left = node.offsetLeft
        var top = node.offsetTop
        var parent = node.offsetParent
        while (parent) {
          left += parent.offsetLeft
          top += parent.offsetTop
          parent = parent.offsetParent
        }
        return {left: left, top: top}
      },
      /**
       * 重新计算当前的value值 并且dispatch出去
       * @param  {[type]} maxLeft [description]
       * @return {[type]}         [description]
       */
      computedValue (maxLeft) {
        this.value = this.min + this.left / maxLeft * (this.max - this.min)
      },
      emit () {
        var precent = (this.value - this.min) / (this.max - this.min)
        this.$emit('changed', this.value, precent)
      }
    }
  }
</script>
<style lang="stylus">

  .c-range-box
    width 100%
    height 100%
    position relative
    .line
      height 4px
      width 100%
      background #c7c7c7
      position absolute
      top 50%
      transform translate3d(0,-50%,0)
      cursor pointer
      .selected-background
        background #6699cc
    .circle
      background #fff
      border 1px solid #cbcbcb
      position absolute
      top 50%
      border-radius 50%
      transform translate3d(0,-50%,0)
      cursor pointer
    .no-control-mask
      width 100%
      height 100%
      position absolute
      left 0
      top 0
</style>
