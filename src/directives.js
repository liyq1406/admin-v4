// input/textarea占位符
export var placeholder = {
  bind () {
    var vModel
    var handlePlaceholder = () => {
      if (this.input.value.length === 0) {
        this.placeholder.style.display = 'inline'
      } else {
        this.placeholder.style.display = 'none'
      }
    }

    this.placeholder = document.createElement('span')
    this.placeholder.className = 'placeholder'
    this.el.appendChild(this.placeholder)

    this.input = this.el.getElementsByClassName('input-text')[0]
    vModel = this.input.getAttribute('v-model') || this.input.getAttribute('name')

    if (vModel) {
      this.vm.$watch(vModel, (value, oldValue) => {
        if (value === undefined || value.length === 0) {
          this.placeholder.style.display = 'inline'
        } else {
          this.placeholder.style.display = 'none'
        }
      }, { immediate: true })
    }

    this.input.addEventListener('input', () => {
      handlePlaceholder.apply(this)
    })

    this.placeholder.addEventListener('click', () => {
      this.input.focus()
    })

    this.input.addEventListener('blur', () => {
      handlePlaceholder.apply(this)
    })

    handlePlaceholder.apply(this)
  },

  update (value) {
    this.placeholder.innerText = value
  }
}

// 动画数字
export var animatedNumber = {
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
      this.el.innerHTML = this.end
      if (Math.abs(this.end) < Math.abs(val)) {
        window.requestAnimationFrame(loop)
      }
    }
    window.requestAnimationFrame(loop)
  }
}

// 提示
export var tooltip = {
  bind () {
    var inTrigger = false
    var inPopup = false
    this.popup = document.createElement('div')
    this.popup.classList.add('x-tooltip', 'x-tooltip-top', 'hidden')
    document.getElementsByTagName('body')[0].appendChild(this.popup)

    // 显示提示框
    var showPopup = () => {
      this.popup.classList.remove('hidden')
      this.vm.$nextTick(() => {
        var x = this.el.getBoundingClientRect().left + document.documentElement.scrollLeft
        var y = this.el.getBoundingClientRect().top + document.documentElement.scrollTop

        // TODO 这里的12是硬编码，莫名其妙的差了12像数
        this.popup.style.left = `${x - (this.el.clientWidth + this.popup.clientWidth) / 2 + 12}px`
        this.popup.style.top = `${y - this.popup.clientHeight - 10}px`
      })
    }

    // 隐藏提示框
    var hidePopup = () => {
      this.popup.classList.add('hidden')
    }

    // 监听事件
    this.el.addEventListener('mouseover', (e) => {
      inTrigger = true
      showPopup()
    })

    this.el.addEventListener('mouseout', (e) => {
      inTrigger = false
      window.setTimeout(() => {
        if (!inPopup) {
          hidePopup()
        }
      }, 200)
    })

    this.popup.addEventListener('mouseover', (e) => {
      inPopup = true
    })

    this.popup.addEventListener('mouseout', (e) => {
      inPopup = false
      window.setTimeout(() => {
        if (!inTrigger) {
          hidePopup()
        }
      }, 200)
    })
  },

  update (val) {
    this.popup.innerHTML = val
  }
}

export var stretch = {
  bind () {
    var self = this

    var getComputedStyle = function (obj, attr) {
      if (obj.currentStyle) {
        return obj.currentStyle[attr]
      } else {
        return window.getComputedStyle(obj, false)[attr]
      }
    }

    window.onload = function () {
      self.$maxHeight = parseInt(getComputedStyle(self.$wrapDiv, 'height'))

      if (self.$maxHeight > self.$minHeight) {
        self.el.appendChild(self.$bottomBar)
        self.$wrapDiv.style.height = self.$minHeight.toString() + 'px'
      }
    }

    var bindListener = function (a) {
      a.addEventListener('click', function (event) {
        if (!a.status) {
          self.$wrapDiv.style.height = 'auto'
          a.className = 'fa fa-caret-up'
          a.status = 1
        } else {
          self.$wrapDiv.style.height = self.$minHeight.toString() + 'px'
          a.className = 'fa fa-caret-down'
          a.status = 0
        }
      })
      a.addEventListener('mouseover', function (event) {
        this.parentNode.style.backgroundColor = '#E9E9E9'
      })
      a.addEventListener('mouseout', function (event) {
        this.parentNode.style.backgroundColor = '#F2F2F2'
      })
    }
    var domInit = function (el) {
      var wrapDiv = document.createElement('div')
      wrapDiv.style.width = '100%'
      wrapDiv.style.height = 'auto'
      wrapDiv.style.overflow = 'hidden'
      var node = el.firstChild
      while (node) {
        var temp = node.nextSibling
        wrapDiv.appendChild(node)
        node = temp
      }

      el.appendChild(wrapDiv)
      self.$wrapDiv = wrapDiv // 绑定wrap div 元素到指令对象上

      var div = document.createElement('div')
      div.style.width = '100%'
      div.style.height = '11px'
      div.style.backgroundColor = '#F2F2F2'
      div.style.textAlign = 'center'

      var a = document.createElement('a')
      a.className = 'fa fa-caret-down'
      a.style.verticalAlign = 'top'
      a.style.fontSize = '16px'
      a.style.lineHeight = '11px'
      a.style.width = '100%'
      a.style.opacity = '0.6'

      bindListener(a)
      div.appendChild(a)
      self.$bottomBar = div
      // el.appendChild(div)
    }
    domInit(this.el)
  },

  update (value) {
    this.$minHeight = parseInt(value)
  },

  unbind () {
    window.onload = null
  }
}
