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
