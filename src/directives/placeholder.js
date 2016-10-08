/**
 * input/textarea占位符
 * @author shengzhi
 * 使用方法：
 *   <div v-placeholder="'请输入帐号'" class="input-text-wrap">
 *     <input class="input-text" >
 *   </div>
 */
// NOTE 不能在 v-for 循环中使用
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
