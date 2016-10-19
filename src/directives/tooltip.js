/**
 * 弹出提示
 * @author shengzhi
 * 使用方法：
 *   <i class="fa fa-question-circle" v-tooltip="要显示的文本">...</i>
 */
// REVIEW 提示初始化时会有一瞬间的错位 #shengzhi
var tooltip = {
  bind () {
    let inTrigger = false
    let inPopup = false
    this.popup = document.createElement('div')
    this.popup.style.visibility = 'hidden'
    this.popup.style.zIndex = '10100'
    this.popup.classList.add('x-tooltip', 'x-tooltip-top', 'hidden')
    document.body.appendChild(this.popup)

    // 显示提示框
    let showPopup = () => {
      this.popup.classList.remove('hidden')
      var x = this.el.getBoundingClientRect().left + document.documentElement.scrollLeft
      var y = this.el.getBoundingClientRect().top + document.documentElement.scrollTop
      this.show = window.setTimeout(() => {
        this.popup.style.left = `${x + this.el.clientWidth / 2 - this.popup.clientWidth / 2}px`
        this.popup.style.top = `${y - this.popup.clientHeight - 10}px`
        this.popup.style.visibility = 'visible'
      }, 300)
    }

    // 隐藏提示框
    let hidePopup = () => {
      this.popup.style.visibility = 'hidden'
      this.popup.classList.add('hidden')
    }

    // 监听事件
    this.el.addEventListener('mouseover', (e) => {
      inTrigger = true
      showPopup()
    })

    this.el.addEventListener('mouseout', (e) => {
      inTrigger = false
      window.clearTimeout(this.show)
      window.setTimeout(() => {
        if (!inPopup) {
          hidePopup()
        }
      }, 300)
    })

    this.popup.addEventListener('mouseover', (e) => {
      inPopup = true
    })

    this.popup.addEventListener('mouseout', (e) => {
      inPopup = false
      window.clearTimeout(this.show)
      window.setTimeout(() => {
        if (!inTrigger) {
          hidePopup()
        }
      }, 300)
    })
  },

  update (val) {
    this.popup.innerHTML = val
  },

  unbind () {
    document.body.removeChild(this.popup)
  }
}

export default tooltip
