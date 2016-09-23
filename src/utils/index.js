import _ from 'lodash'
// 每天毫秒数
const MICRO_SECONDS_PER_DAY = 3600 * 1000 * 24
/**
 * 返回某天开始间隔 n 天开始与结束时间
 * @param  {Number} offset 起始点距离现在的偏移天数
 * @param  {Number} n      间隔天数
 * @return {Object}
 *   {
 *     start: '2015-12-06',
 *     end: '2015-12-13'
 *   }
 */
export const createDayRange = (offset, n) => {
  let today = new Date()
  let endDate = new Date(today.getTime() - MICRO_SECONDS_PER_DAY * offset)
  let startDate = new Date(today.getTime() - MICRO_SECONDS_PER_DAY * (offset + n - 1))

  const getDateInfo = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }

  return {
    start: getDateInfo(startDate),
    end: getDateInfo(endDate)
  }
}

// 2016-07-23
const dateRe = /(\d{4})(-)(\d{1,2})(-)(\d{1,2})/

const transToDate = (str) => {
  let res = dateRe.exec(str)
  if (res) {
    return new Date(parseInt(res[1]), parseInt(res[3]) - 1, parseInt(res[5]))
  }
  return null
}
/**
 * [自动补全数据 将时间转成date格式]
 * @param  {Array} data     [数组数据]
 * @param  {Number} duration [取值长度]
 * @return {Array}          [修改后的数据]
 */
export const beautify = (data, range) => {
  // 将day字段数据转成date格式
  var minDay = Number.POSITIVE_INFINITY // 最小时间
  for (let i = 0; i < data.length; i++) {
    data[i].day = transToDate(data[i].day)
    if (minDay > data[i].day.getTime()) {
      minDay = data[i].day.getTime()
    }
  }

  // 将开始时间转成date格式
  let start = transToDate(range.start)
  let end = transToDate(range.end)

  let temp = []
  for (let i = start.getTime(); i <= end.getTime(); i = i + MICRO_SECONDS_PER_DAY) {
    let finded = false
    for (let j = 0; j < data.length; j++) {
      if (data[j].day.getTime() === i) {
        temp.push(data[j])
        finded = true
        break
      }
    }
    if (!finded) { // 自动补0
      let clone = _.clone(data[0])
      for (let key in clone) {
        clone[key] = 0
      }
      clone.day = new Date(i)
      temp.push(clone)
    }
  }
  return temp
}

// 计算数组某字段百分比
export const numToPercent = (arr, field) => {
  var total = 0
  arr.forEach((item) => {
    total += item[field]
  })

  return arr.map((item) => {
    var temp = _.clone(item)
    temp.percent = item[field] / total
    return temp
  })
}

/**
 * 返回一年前的时间
 * @param  {Date} cur [时间]
 * @return {Date} [去年今日时间]
 */
export const getLastYearDate = (cur) => {
  let year = cur.getFullYear()
  let month = cur.getMonth()
  let date = cur.getDate()
  let hours = cur.getHours()
  let minutes = cur.getMinutes()
  let seconds = cur.getSeconds()
  return new Date(year - 1, month, date, hours, minutes, seconds)
}

/**
 * 安全的类型判断
 * @param {Any} obj 需判断类型的对象
 * @return {String}
 */
export const type = (obj) => {
  let map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  if (obj instanceof window.Element) {
    return 'element'
  }
  return map[Object.prototype.toString.call(obj)]
}

/**
 * 判断返回值是否为空(包括空格字符串)
 * @author shengzhi
 * @param  {Any} val 目标值
 * @return {Boolean}
 */
export const isEmpty = (val) => {
  if (val === undefined || val === null) return true

  switch (type(val)) {
    case 'string':
      return !val.trim()
    case 'array':
      return !val.length
    case 'object':
      return !Object.keys(val).length
    default:
      return false
  }
}
