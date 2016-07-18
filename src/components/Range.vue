<template>
  <div class="c-range-box">
    <div class="label-box" :style="'min-height:' + circleD">
      <slot name="label"></slot>
    </div>
    <div class="range-box" :style="'min-height:' + circleD + ';width:' + lineWidth">
      <div class="line" :style="'width:' + lineWidth + ';height:' + lineHeight + ';background:' + lineBackground" @mouseDown="select" @mouseUp="resetPosition">
        <div class="selected-background" :style="'background:' + selectedGroundColor + ';width:' + left + 'px'"></div>
      </div>
      <div class="circle" :style="'width:' + circleD + ';height:' + circleD + ';left:' + left + 'px;' + transitionStyle"></div>
      <div class="no-control-mask" v-show="disabled"></div>
    </div>
  </div>
</template>

<script>
  module.exports = {
    /**
     * 暴露的方法：内容改变（实时上报和非实时上报）
     * @param  {[type]} 'change/changed'  方法名
     * @param  {[type]} this.value 值
     * @param  {[type]} params    其他可能用到的参数
     */
     // this.$emit('change', value, params) // 实时上报
     // this.$emit('changed', value, params) // 非实时上报

    /**
     * 暴露的slot
     * @type label
     */
    // <div name="label">标签：</div>
    props: {
      // 步长
      'step': {
        type: Number,
        default: 1
      },
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
        default: 0
      },
      // 圆球的直径
      'circleD': {
        type: String,
        default: '20px'
      },
      // 宽度
      'lineWidth': {
        type: String,
        default: '160px'
      },
      // 高度
      'lineHeight': {
        type: String,
        default: '3px'
      },
      // 线背景色
      'lineBackground': {
        type: String,
        default: '#c7c7c7'
      },
      // 已选择背景色
      'selectedGroundColor': {
        type: String,
        default () {
          return '#6699cc'
        }
      },
      // 是否可用
      'disabled': {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        left: 0, // 用于存放当前小球的偏移量
        transition: false // 用于标志当前是否使用css3的transition
      }
    },
    computed: {
      transitionStyle () {
        var result = ''
        var prefixs = ['-webkit-', '-moz-', '-ms-', '-o-', '']
        if (this.transition) {
          prefixs.map((prefix) => {
            result += prefix + 'transition: left ease ' + 0.2 + 's;'
          })
        } else {
          prefixs.map((prefix) => {
            result += prefix + 'transition: left ease ' + 0 + 's;'
          })
        }
        return result
      }
    },
    watch: {
      value () {
        this.emit('change')
      }
    },
    ready () {
      if (this.checkData()) {
        this.init()
      }
    },
    methods: {
      /**
       * 检查用户传入的数据是否合法
       * @return {[type]} [description]
       */
      checkData () {
        var result = true
        if (!(this.max > this.min)) {
          result = false
          console.error('组件range出错：最大值max必须比最小值min大！')
        }
        if ((this.max - this.min) % this.step > 0) {
          result = false
          console.error('组件range出错：最大值max和最小值min的差必须是步长step的整数倍！')
        }
        if (this.value < this.min || this.value > this.max) {
          result = false
          console.error('组件range出错：默认值value不能大于最大值max或者小于最小值min！')
        }
        return result
      },
      /**
       * 根据补长重置位置
       */
      resetPosition () {
        var self = this
        var parentDom = this.$el.getElementsByClassName('range-box')[0]
        var circledom = parentDom.children[1]
        var parentWidth = parentDom.clientWidth
        var maxLeft = parentWidth - circledom.clientWidth
        var stepWidth = maxLeft / ((self.max - self.min) / self.step)
        this.transition = true
        setTimeout(() => {
          this.transition = false
        }, 0)
        self.left = Math.round(self.left / stepWidth) * stepWidth
        // if (self.left % stepWidth >= stepWidth / 2) {
        //   console.log('当前数需要前进' + stepWidth * parseInt(self.left / stepWidth) )
        // } else if (self.left % stepWidth < stepWidth / 2) {
        //
        // } else {
        //   console.warn('出错')
        // }
        self.computedValue(maxLeft)
        self.emit('changed')
      },
      /**
       * 点击横线
       * @param  {[type]} ev [description]
       * @return {[type]}    [description]
       */
      select (ev) {
        var self = this
        var line = ev.target
        if (line.className === 'selected-background') {
          line = line.parentElement
        }
        var _circle = line.nextElementSibling
        var _circleR = _circle.offsetWidth / 2
        var maxLeft = line.clientWidth - _circleR * 2
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
      },
      /**
       * 组件初始化
       * @return {[type]} [description]
       */
      init () {
        var self = this
        var parentDom = this.$el.getElementsByClassName('range-box')[0]
        var linedom = parentDom.children[0]
        var circledom = parentDom.children[1]
        var parentWidth = parentDom.clientWidth
        var maxLeft = parentWidth - circledom.clientWidth
        var _circleR = circledom.offsetWidth / 2
        var linePosition = this.getPosition(linedom)
        self.left = maxLeft * ((self.value - self.min) / (self.max - self.min))
        var dx
        self.down = false
        circledom.addEventListener('mousedown', function (ev) {
          var rangeEventBox = document.createElement('div')
          rangeEventBox.className = 'range-event-box'
          document.body.appendChild(rangeEventBox)
          self.down = true
          dx = self.left
          ev.preventDefault()
          rangeEventBox.addEventListener('mousemove', function (ev) {
            if (self.down) {
              var offsetLeft = ev.x - linePosition.left - _circleR / 2
              if (offsetLeft <= maxLeft && offsetLeft >= 0) {
                self.left = offsetLeft
              } else if (offsetLeft >= maxLeft) {
                self.left = maxLeft
              } else if (offsetLeft <= 0) {
                self.left = 0
              }
              self.computedValue(maxLeft)
            }
          }, false)
          rangeEventBox.addEventListener('mouseup', function (ev) {
            self.down = false
            dx += ev.x
            document.body.removeChild(rangeEventBox)
            self.resetPosition()
          }, false)
        }, false)
        circledom.addEventListener('mouseup', function (ev) {
          self.down = false
          self.resetPosition()
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
      emit (name) {
        var precent = (this.value - this.min) / (this.max - this.min)
        var params = {
          max: this.max,
          min: this.min,
          step: this.step,
          precent: precent
        }
        this.$emit(name, this.value, params)
      }
    }
  }
</script>
<style lang="stylus">
  @import '../assets/stylus/common'

  .range-event-box
    width 100%
    height 100%
    position absolute
    top 0
    left 0
    z-index 500
  .c-range-box
    width 100%
    clearfix()
    .label-box
      float left
      padding 1px 0
    .range-box
      width 100%
      float left
      position relative
      padding 1px 0
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
          width 10px
          height 100%
          position absolute
          left 0
          top 0
          transition width ease 0.3s
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
        cursor not-allowed
</style>
