/**
 * 内容超出容器高度时显示展开全部内容的横条
 * @author guohao
 */
var stretch = {
  bind () {
    var self = this

    var getComputedStyle = function (obj, attr) {
      return window.getComputedStyle(obj, false)[attr]
    }

    setTimeout(() => {
      self.$maxHeight = parseInt(getComputedStyle(self.$listDiv, 'height'))
      if (self.$maxHeight > self.$minHeight) {
        self.el.appendChild(self.$bottomBar)
      }
    }, 500)

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
      wrapDiv.style.cssText = 'width: 100%; height: auto; overview: hidden;'

      var listDiv = document.createElement('div') // 为了计算el内容高度
      listDiv.style.cssText = 'width: 100%; height: auto; overflow: hidden;'

      var node = el.firstChild
      while (node) {
        var temp = node.nextSibling
        listDiv.appendChild(node)
        node = temp
      }

      el.appendChild(wrapDiv)
      wrapDiv.appendChild(listDiv)
      self.$listDiv = listDiv
      self.$wrapDiv = wrapDiv // 绑定wrap div 元素到指令对象上

      var div = document.createElement('div')
      div.style.cssText = 'width: 100%; height: 11px; background-color: #F2F2F2; text-align: center;'

      var a = document.createElement('a')
      a.className = 'fa fa-caret-down'
      a.style.cssText = 'vertical-align: top; font-size: 16px; line-height 11px; width: 100%; opacity: 0.6;'

      bindListener(a)
      div.appendChild(a)
      self.$bottomBar = div
    }
    domInit(this.el)
  },

  update (value) {
    this.$minHeight = parseInt(value)
    this.$wrapDiv.style.height = this.$minHeight.toString() + 'px'
  },

  unbind () {
  }
}

export default stretch
