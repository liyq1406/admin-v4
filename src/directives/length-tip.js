/**
 * 弹出提示
 * @author guohao
 * 使用方法：
 *   <textarea v-length-tip="{max: 250, model: model}"></textarea>
 *   max 表示max lenght
 *   model 表示v-model对应的变量
 */
export var lengthTip = {
  bind () {
    var self = this
    var domInit = function (el) {
      let wrapDiv = document.createElement('div')
      let contentSpan = document.createElement('span')
      contentSpan.style.color = '#999999'
      wrapDiv.appendChild(contentSpan)
      let nextNode = el.nextSibling
      let parentNode = el.parentNode
      parentNode.insertBefore(wrapDiv, nextNode)
      self.$contentSpan = contentSpan

      el.addEventListener('input', (e) => {
        let len = e.target.value.length
        self.$contentSpan.innerHTML = len + '/' + self.$maxLength
      })
    }
    domInit(this.el)
  },

  update (val) {
    this.$maxLength = val.max
    let len = 0
    if (val.model) {
      len = val.model.length || 0
    }

    this.$contentSpan.innerHTML = len + '/' + val.max
  },

  unbind () {
  }
}
