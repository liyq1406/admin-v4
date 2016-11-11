/**
 * 为字符串套上一个标签
 * 如：foo ---> <span class="bar">foo</span>
 * @author shengzhi
 * @param {String} str 原字符串
 * @param {String|Array} classes 类名
 * @param {String} tag 标签名
 * @return {String}
 */
var wrapTag = (str, classes, tag) => {
  if (classes instanceof Array) {
    classes = classes.join(' ')
  }

  if (typeof classes === 'string' && classes !== '') {
    classes = ` class="${classes}"`
  } else {
    classes = ''
  }

  if (typeof tag === 'undefined') {
    tag = 'span'
  }

  return `<${tag}${classes}>${str}</${tag}>`
}

export default wrapTag
