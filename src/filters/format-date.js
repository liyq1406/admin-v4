/**
 * 日期格式化
 * @param {Any} date 目标日期字符串
 * @param {String} format 日期输出格式
 * @param {Boolean} isLocal 是否本地时间
 * @return {String}
 */
export function formatDate (date, format, isLocal) {
  // 不传任何参数
  if (typeof date === 'undefined' || date === null || date === '') {
    return '-'
  }

  date = new Date(date)

  // date 参数不合法（不能转为Date类型）
  if (!date.getFullYear) {
    return '-'
  }

  const DEFAULT_FORMAT = 'yyyy-MM-dd hh:mm:ss'

  if (typeof format === 'undefined') {
    format = DEFAULT_FORMAT
  } else if (typeof format === 'boolean') {
    isLocal = format
    format = DEFAULT_FORMAT
  }

  // 默认为格林威治时间，如果传入本地时间，须手动设置 isLocal为 true
  if (!isLocal) {
    date = new Date(date.getTime() - 3600 * 8 * 1000)
  }

  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()

  var zeroPrefix = (num) => {
    return ('0' + num).slice(-2)
  }

  return format
    .replace(/yyyy/g, year)
    .replace(/MM/g, zeroPrefix(month))
    .replace(/dd/g, zeroPrefix(day))
    .replace(/yy/g, year)
    .replace(/d/g, day)
    .replace(/hh/g, zeroPrefix(hours))
    .replace(/mm/g, zeroPrefix(minutes))
    .replace(/ss/g, zeroPrefix(seconds))
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
    formatDate = new Date(Date.parse(date))
  } else {
    return date
  }

  if (typeof correct === 'boolean' && correct) {
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

  if (typeof correct === 'boolean' && correct) {
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
