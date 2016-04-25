/**
 * 日期格式化
 * @param  {String} value 目标日期字符串
 * @return {String}
 */
export function formatDate (date) {
  if (typeof date !== 'undefined' && date.length > 0) {
    return date.replace('T', ' ').replace('Z', '')
  } else {
    return date
  }
}

/**
 * 日期格式化
 * @param  {String} value 目标日期字符串
 * @return {String}
 */
export function uniformDate (date) {
  if (typeof date !== 'undefined' && date.length > 0) {
    var formatDate = new Date(date)
    var year = formatDate.getFullYear().toString()
    var month = formatDate.getMonth() + 1 > 9 ? (formatDate.getMonth() + 1).toString : '0' + (formatDate.getMonth() + 1).toString()
    var dates = formatDate.getDate() > 9 ? formatDate.getDate().toString() : '0' + formatDate.getDate().toString()
    var hours = formatDate.getHours() > 9 ? formatDate.getHours().toString() : '0' + formatDate.getHours().toString()
    var minutes = formatDate.getMinutes() > 9 ? formatDate.getMinutes().toString() : '0' + formatDate.getMinutes().toString()
    var seconds = formatDate.getSeconds() > 9 ? formatDate.getSeconds().toString() : '0' + formatDate.getSeconds().toString()
    return year + '-' + month + '-' + dates + ' ' + hours + ':' + minutes + ':' + seconds
  } else {
    return date
  }
}

/**
 * 根据条件过滤选项
 * @param  {Array}  value     过滤前的所有可选项
 * @param  {Array}  selected  已选择的所有项
 * @param  {Object} curr      当前选择的项
 * @param  {String} prop      需要比对的属性
 * @return {Array}            可选的所有项
 */
export function dropSlected (value, selected, curr, prop) {
  return value.filter((cate) => {
    var flag = true
    selected.forEach((item) => {
      // 如果没有传递 prop，就直接比对，否则拿下级的 prop 属性比对
      if (typeof prop === 'undefined') {
        if (cate === item && curr !== item) {
          flag = false
        }
      } else {
        if (cate[prop] === item[prop] && curr[prop] !== item[prop]) {
          flag = false
        }
      }
    })
    return flag
  })
}
