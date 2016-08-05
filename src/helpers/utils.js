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

/**
 * [自动补全数据 将时间转成date格式]
 * @param  {Array} data     [数组数据]
 * @param  {Number} duration [取值长度]
 * @return {Array}          [修改后的数据]
 */
export const beautify = (data, duration) => {
  // 将day字段数据转成date格式
  var minDay = Number.POSITIVE_INFINITY // 最小时间
  for (var i = 0; i < data.length; i++) {
    var res = dateRe.exec(data[i].day)
    if (res) {
      data[i].day = new Date(parseInt(res[1]), parseInt(res[3]) - 1, parseInt(res[5]))
    }

    if (minDay > data[i].day.getTime()) {
      minDay = data[i].day.getTime()
    }
  }

  // 如果获取的数据长度小于duration, 获取最小时间用于补齐默认数据
  // if (duration > data.length) {
  //   // 不够数量的数组自动补全
  //   var length = data.length
  //   for (var j = 0; j < duration - length; j++) {
  //     var item = _.clone(data[0])
  //     for (var m in item) {
  //       item[m] = 0
  //     }
  //     item.day = new Date(minDay - 3600 * 1000 * 24 * (j + 1))
  //     data.push(item)
  //   }
  // }
  return data
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
 * 返回值是否为空(包括空格字符串)
 * @author shengzhi
 * @param  {Any} val 目标值
 * @return {Boolean}
 */
export const isEmpty = (val) => {
  if (val === undefined || val === null) return true
  let type = Object.prototype.toString.call(val).slice(8, -1)

  switch (type) {
    case 'String':
      return !val.trim()
    case 'Array':
      return !val.length
    case 'Object':
      return !Object.keys(val).length
    default:
      return false
  }
}
