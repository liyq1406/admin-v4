/**
 * 动画数字
 * @author shengzhi
 * 使用方法：
 *   <div v-animated-number="num"></div> // num 为需展示的数字
 */
// FIXME 数字异步传入时不更新 #shengzhi
var animatedNumber = {
  bind () {
    this.end = 0
  },

  update (val) {
    val = val || 0
    const COUNT = 40
    var step = val - this.end
    var distance = step / COUNT
    if (step < 0) {
      if (distance > -1) {
        step = -1
      } else {
        step = Math.floor(distance)
      }
    } else {
      if (distance < 1) {
        step = 1
      } else {
        step = Math.ceil(distance)
      }
    }
    var loop = () => {
      this.end = (Math.abs(this.end + step) < Math.abs(val)) ? (this.end + step) : val
      if (this.el) {
        this.el.innerHTML = this.end
      }
      if (Math.abs(this.end) < Math.abs(val)) {
        window.requestAnimationFrame(loop)
      }
    }
    window.requestAnimationFrame(loop)
  }
}

export default animatedNumber
