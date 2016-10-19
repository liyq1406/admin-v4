/**
 * 日期格式化
 * @param {Any} date 目标日期字符串
 * @param {String} format 日期输出格式
 * @param {Boolean} isLocal 是否本地时间
 * @return {String}
 */
var formatDate = (date, format, isLocal) => {
  // 不传任何参数
  if (typeof date === 'undefined' || date === '') {
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
  let milliseconds = date.getMilliseconds()

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
    .replace(/SSS/g, ('' + milliseconds).slice(0, 3))
}

export default formatDate
