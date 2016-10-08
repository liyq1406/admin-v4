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
