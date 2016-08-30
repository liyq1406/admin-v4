<template>
  <div class="c-range-box">
    <div class="range-box-container" @click="focusEvent">
      <div class="line" @mouseDown="select">
        <div class="selected-background" :style="selectedBackgroundStyle"></div>
        <div class="min">
          <span class="vertical-line"></span>
          <span class="num">{{min}}</span>
        </div>
        <div class="max">
          <span class="num">{{max}}</span>
          <span class="vertical-line"></span>
        </div>
      </div>
      <div class="slider-box" :style="sliderStype">
        <div class="currentValue">
          <span>{{currentValue}}</span>
        </div>
      </div>
      <div class="no-control-mask" v-show="disabled" @click="onDisabled"></div>
      <input type="text" class="hide-input" @blur="blurEvent" @keydown="keydown">
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
     * @param  {[type]} isUserBehavior    是否是用户行为
     */
     // this.$emit('change', value, params) // 实时上报
     // this.$emit('changed', value, params, isUserBehavior) // 非实时上报
     //
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
        default: function () {
          return this.min
        }
      },
      // 是否可用
      'disabled': {
        type: Boolean,
        default: false
      },
      // 拓展
      expand: {}
    },
    data () {
      return {
        focus: false, // 标志当前组件是否获得焦点
        left: 0, // 用于存放当前小球的偏移量
        transition: false // 用于标志当前是否使用css3的transition
      }
    },
    computed: {
      /**
       * 计算属性 滑块样式
       * @return {[type]} [description]
       */
      sliderStype () {
        let transition = this.transition ? 'left ease 0.2s' : 'left ease 0s'
        var result = {
          width: '10px',
          left: `${this.left}px`,
          backgroundColor: this.focus ? '#b30610' : '#c0252e',
          webkitTransition: transition,
          mozTransition: transition,
          oTransition: transition,
          msTransition: transition,
          transition: transition
        }
        return result
      },

      /**
       * 计算属性 已选择线样式
       * @return {[type]} [description]
       */
      selectedBackgroundStyle () {
        let transition = this.transition ? 'width ease 0.2s' : 'width ease 0s'
        var result = {
          width: `${this.left}px`,
          backgroundColor: this.focus ? '#b30610' : '#c0252e',
          webkitTransition: transition,
          mozTransition: transition,
          oTransition: transition,
          msTransition: transition,
          transition: transition
        }
        return result
      },

      /**
       * 计算属性 当前值
       * @return {[type]} [description]
       */
      currentValue () {
        var result = (parseInt((this.value - 0) * 100) / 100).toString()
        return result
      }
    },
    watch: {
      value () {
        this.init()
        this.emit('change')
      }
    },
    ready () {
      if (this.checkData()) { // 检查传入数据是否正确 正确的话执行初始化
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
          this.value = this.min
        }
        if ((this.max - this.min) % this.step > 0) {
          result = false
          console.error('组件range出错：最大值max和最小值min的差必须是步长step的整数倍！')
        }
        if (this.value < this.min || this.value > this.max) {
          result = false
          console.error('组件range出错：默认值value不能大于最大值max或者小于最小值min！')
          this.value = this.min
        }
        if (!result) {
          this.disabled = true
        }
        return result
      },
      /**
       * 组件初始化
       * @return {[type]} [description]
       */
      init () {
        var self = this
        var parentDom = this.$el.getElementsByClassName('range-box-container')[0]
        var linedom = parentDom.children[0]
        var sliderDom = parentDom.children[1]
        var parentWidth = parentDom.clientWidth
        var maxLeft = parentWidth - sliderDom.clientWidth
        var halfWidth = sliderDom.offsetWidth / 2
        var linePosition = this.getPosition(linedom)
        var dx
        setTimeout(() => {
          this.transition = true
          setTimeout(() => {
            this.transition = false
          }, 50)
          self.left = maxLeft * ((self.value - self.min) / (self.max - self.min))
          self.resetPosition(false)
        }, 200)
        self.down = false
        sliderDom.addEventListener('mousedown', function (ev) {
          var rangeEventBox = document.createElement('div')
          rangeEventBox.className = 'range-event-box'
          document.body.appendChild(rangeEventBox)
          self.down = true
          dx = self.left
          ev.preventDefault()
          self.focusEvent()
          rangeEventBox.addEventListener('mousemove', function (ev) {
            linePosition = self.getPosition(linedom)
            if (self.down) {
              var offsetLeft = ev.x - linePosition.left - halfWidth / 2
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
            self.resetPosition(true)
          }, false)
        }, false)
        sliderDom.addEventListener('mouseup', function (ev) {
          self.down = false
          self.resetPosition(true)
        }, false)
      },
      /**
       * 按照步长变化一步
       * @param  {[type]} type [description]
       * @return {[type]}      [description]
       */
      stepChange (type) {
        var self = this
        var parentDom = this.$el.getElementsByClassName('range-box-container')[0]
        var sliderDom = parentDom.children[1]
        var parentWidth = parentDom.clientWidth
        var maxLeft = parentWidth - sliderDom.clientWidth
        var stepWidth = maxLeft / ((self.max - self.min) / self.step)
        var target = 0
        if (type === 'add') {
          target = self.left + stepWidth
          if (target < maxLeft) {
            self.left = target
          } else {
            self.left = maxLeft
          }
        } else if (type === 'dec') {
          target = self.left - stepWidth
          if (target > 0) {
            self.left = target
          } else {
            self.left = 0
          }
        }
        this.transition = true
        setTimeout(() => {
          this.transition = false
        }, 0)
        self.computedValue(maxLeft)
        self.emit('changed', true)
      },
      /**
       * 监听按钮事件
       * @param  {[type]} ev [description]
       * @return {[type]}    [description]
       */
      keydown (ev) {
        if (ev.keyCode === 37 || ev.keyCode === 40) {
          this.stepChange('dec')
        } else if (ev.keyCode === 38 || ev.keyCode === 39) {
          this.stepChange('add')
        } else {
          ev.preventDefault()
        }
      },
      /**
       * 获得焦点
       * @return {[type]} [description]
       */
      focusEvent () {
        this.focus = true
        var hideInput = this.$el.getElementsByClassName('hide-input')[0]
        hideInput.focus()
      },
      /**
       * 失去焦点回调
       * @return {[type]} [description]
       */
      blurEvent () {
        this.focus = false
      },

      /**
       * 根据步长重置位置
       * @param {Boolean} isUserBeHavior 是否是用户行为
       */
      resetPosition (isUserBeHavior) {
        var self = this
        if (!this.$el) {
          return
        }
        var parentDom = this.$el.getElementsByClassName('range-box-container')[0]
        var sliderDom = parentDom.children[1]
        var parentWidth = parentDom.clientWidth
        var maxLeft = parentWidth - sliderDom.clientWidth
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
        self.emit('changed', isUserBeHavior)
      },
      /**
       * 点击横线
       * @param  {[type]} ev [description]
       * @return {[type]}    [description]
       */
      select (ev) {
        var self = this
        this.transition = true
        var line = ev.target
        if (line.className === 'selected-background') {
          line = line.parentElement
        } else if (line.className !== 'line') {
          return
        }
        var sliderDom = line.nextElementSibling
        var halfWidth = sliderDom.offsetWidth / 2
        var maxLeft = line.clientWidth - halfWidth * 2
        var left = ev.clientX - self.getPosition(line).left - halfWidth
        if (left < 0) {
          left = 0
        } else if (left > maxLeft) {
          left = maxLeft
        }
        setTimeout(() => {
          this.transition = false
        }, 0)
        self.left = left
        self.createTouchMask()
      },
      /**
       * 创建接收事件的蒙层
       * @return {[type]} [description]
       */
      createTouchMask () {
        var self = this
        var rangeEventBox = document.createElement('div')
        rangeEventBox.className = 'range-event-box'
        document.body.appendChild(rangeEventBox)
        rangeEventBox.addEventListener('mouseup', function (ev) {
          document.body.removeChild(rangeEventBox)
          self.resetPosition(true)
          self.focusEvent()
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
       * 重新计算当前的value值 并且emit出去
       * @param  {[type]} maxLeft [description]
       * @return {[type]}         [description]
       */
      computedValue (maxLeft) {
        var value = this.min + this.left / maxLeft * (this.max - this.min)
        value = this.step * Math.round(value / this.step)
        this.value = value
      },

      /**
       * 不可用时候用户操作回调
       * @return {[type]} [description]
       */
      onDisabled () {
        this.$emit('ondisable')
      },
      /**
       * 抛出事件给父组件
       * @param  {[type]}  name           可能是change（实时上报）也可能是changed（变化后上报）
       * @param  {Boolean} isUserBehavior 是否是用户行为
       * @return {[type]}                 [description]
       */
      emit (name, isUserBehavior) {
        // 是否是用户行为 默认为否
        isUserBehavior = isUserBehavior || false
        var percent = (this.value - this.min) / (this.max - this.min)
        var params = {
          // 最大值
          max: this.max,
          // 最小值
          min: this.min,
          // 步长
          step: this.step,
          // 百分比
          percent: percent,
          // 拓展用 从外面传进来 原封不动传出去
          expand: this.expand
        }
        this.$emit(name, this.value, params, isUserBehavior)
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
    /*background rgba(0,0,0,0.5)*/

  .c-range-box
    width 100%
    height 50px
    position relative
    /*clearfix()*/
    /*padding 0 10px*/
    box-sizing border-box
    margin 5px 0
    .range-box-container
      width 100%
      height 100%
      /*background rgba(0,0,0,0.3)*/
      position relative
      .line
        position absolute
        width 100%
        height 10px
        margin-top -5px
        top 50%
        background #d5d5d5
        cursor pointer
        .selected-background
          background #6699cc
          width 10px
          height 100%
          position absolute
          left 0
          top 0
          transition width ease 0.3s
        .min
        .max
          position absolute
          top 100%
          line-height 28px
          height 20px
          font-size 12px
          cursor context-menu
          .vertical-line
            display inline-block
            width 1px
            height 15px
            background #d5d5d5
        .min
          left 0
        .max
          right 0
      .slider-box
        width 10px
        height 24px
        margin-top -12px
        position absolute
        top 50%
        left 0
        background red
        &.focus
          box-shadow 1px 1px 1px rgba(0,0,0,0.2)
        .currentValue
          position absolute
          bottom 110%
          left 50%
          transform translate(-50%)
          background rgba(0,0,0,0.6)
          color #fff
          padding 2px 5px
          font-size 12px
          line-height 15px
    .hide-input
      position absolute
      left 0
      top 0
      z-index -10
      width 100%
      height 100%
      opacity 1
    .no-control-mask
      width 100%
      height 100%
      position absolute
      left 0
      top 0
      cursor not-allowed
</style>
