import _ from 'lodash'
/**
 * 返回前 n 天开始与结束时间
 * @param  {Number} n 天数
 * @return {Object}
 *   {
 *     start: '2015-12-06',
 *     end: '2015-12-13'
 *   }
 */
export const createDayRange = (n) => {
  var curTime = new Date()
  var startTime = new Date(curTime.getTime() - 3600 * 1000 * 24 * n)

  var startDay = startTime.getFullYear().toString() + '-' + (startTime.getMonth() + 1).toString() + '-' + startTime.getDate().toString()
  var endDay = curTime.getFullYear().toString() + '-' + (curTime.getMonth() + 1).toString() + '-' + curTime.getDate().toString()

  return {
    start: startDay,
    end: endDay
  }
}

// 2016-07-23
const dateRe = /(\d{4})(-)(\d{1,2})(-)(\d{1,2})/

/**
 * [自动补全数据 将时间转成date格式]
 * @param  {[type]} data     [数组数据]
 * @param  {[type]} duration [取值长度]
 * @return {[type]}          [修改后的数据]
 */
export const beautify = (data, duration) => {
  // 将day字段数据转成date格式
  var minDay = Number.POSITIVE_INFINITY // 最小时间
  for (var i = 0; i < data.length; i++) {
    var res = dateRe.exec(data[i].day)
    if (res) {
      data[i].day = new Date(parseInt(res[1]), parseInt(res[3]), parseInt(res[5]))
    }

    if (minDay > data[i].day.getTime()) {
      minDay = data[i].day.getTime()
    }
  }

  // 如果获取的数据长度小于duration, 获取最小时间用于补齐默认数据
  if (duration > data.length) {
    // 不够数量的数组自动补全
    var length = data.length
    for (var j = 0; j < duration - length; j++) {
      var item = _.clone(data[0])
      for (var m in item) {
        item[m] = 0
      }
      item.day = new Date(minDay - 3600 * 1000 * 24 * (j + 1))
      data.push(item)
    }
  }
  return data
}