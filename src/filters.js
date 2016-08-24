/**
 * 日期格式化
 * @param  {String} value 目标日期字符串
 * @return {String}
 */
export function formatDate (date) {
  if (typeof date !== 'undefined' && date.length > 0) {
    date = date.replace(/T/, ' ').replace(/Z/, '')
    return date.replace(/\.\d+$/, '')
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

/**
 * 日期格式化 yyyy-mm-dd
 * @param  {String} value 目标日期字符串
 *         {Boolean} correct 修正偏差
 * @return {String}
 */
export function uniformDate (date, correct) {
  var formatDate = null
  if (date instanceof Date) {
    formatDate = date
  } else if (date && date.length > 0) {
    formatDate = new Date(date)
  } else {
    return date
  }

  if (correct instanceof Boolean && correct) {
    formatDate = new Date(formatDate.getTime() - 3600 * 8 * 1000)
  }

  var year = formatDate.getFullYear().toString()
  var month = formatDate.getMonth() + 1 > 9 ? (formatDate.getMonth() + 1).toString() : '0' + (formatDate.getMonth() + 1).toString()
  var dates = formatDate.getDate() > 9 ? formatDate.getDate().toString() : '0' + formatDate.getDate().toString()
  return year + '-' + month + '-' + dates
}

/**
 * 日期格式化 hh:mm:ss
 * @param  {String} value 目标日期字符串
 *         {Boolean} correct 修正偏差
 * @return {String}
 */
export function uniformTime (date, correct) {
  var formatDate = null
  if (date instanceof Date) {
    formatDate = date
  } else if (date && date.length > 0) {
    formatDate = new Date(date)
  } else {
    return date
  }

  if (correct instanceof Boolean && correct) {
    formatDate = new Date(formatDate.getTime() - 3600 * 8 * 1000)
  }

  var hours = formatDate.getHours() > 9 ? formatDate.getHours().toString() : '0' + formatDate.getHours().toString()
  var minutes = formatDate.getMinutes() > 9 ? formatDate.getMinutes().toString() : '0' + formatDate.getMinutes().toString()
  var seconds = formatDate.getSeconds() > 9 ? formatDate.getSeconds().toString() : '0' + formatDate.getSeconds().toString()
  return hours + ':' + minutes + ':' + seconds
}

/**
 * 日期格式化 hh:mm
 * @param  {String} value 目标日期字符串
 *         {Boolean} correct 修正偏差
 * @return {String}
 */
export function uniformMinuteTime (date, correct) {
  var formatDate = null
  if (date instanceof Date) {
    formatDate = date
  } else if (date && date.length > 0) {
    formatDate = new Date(date)
  } else {
    return date
  }

  if (correct) {
    formatDate = new Date(formatDate.getTime() - 3600 * 8 * 1000)
  }

  var hours = formatDate.getHours() > 9 ? formatDate.getHours().toString() : '0' + formatDate.getHours().toString()
  var minutes = formatDate.getMinutes() > 9 ? formatDate.getMinutes().toString() : '0' + formatDate.getMinutes().toString()
  return hours + ':' + minutes
}

/**
 * 处理浮点数,保留2位小数
 * @param  {Float} value 浮点数
 * @return {String}
 */
// TODO: 改成保留 N 位小数，函数名称改成 toDecimal #guohao
export function toDecimal2 (value) {
  var f = parseFloat(value)
  if (isNaN(f)) {
    return ''
  }
  f = Math.round(f * 100) / 100
  var s = f.toString()
  var rs = s.indexOf('.')
  if (rs < 0) {
    rs = s.length
    s = s + '.'
  }
  for (var i = s.length; i <= rs + 2; i++) {
    s = s + '0'
  }

  return s
}

/**
 * 百分比表示浮点数,保留2位小数： 例 0.0201 => 2.01%
 * @param  {Float} value 浮点数
 * @return {String}
 */
// TODO: 函数名称改成 toPercent #guohao
export function toPercentDecimal2 (value) {
  var f = parseFloat(value)
  if (isNaN(f)) {
    return ''
  }

  return toDecimal2(f * 100) + '%'
}
