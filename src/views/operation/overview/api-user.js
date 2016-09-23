import api from 'api'
import {createDayRange, beautify} from 'utils'
// import _ from 'lodash'

export function getTrend (duration) {
  var range
  if (Array.isArray(duration)) {
    range = createDayRange(duration[0], duration[1])
  } else {
    range = createDayRange(1, duration)
  }
  return new Promise((resolve, reject) => {
    api.statistics.getUserTrend(range.start, range.end).then((res) => {
      if (res.status === 200 && res.data.length > 0) {
        var ret = beautify(res.data, range)
        var acRet = [] // 活跃用户
        var toRet = [] // 累计用户
        var addRet = [] // 新增用户
        ret.forEach((item) => { // 过滤字段
          let acTemp = {}
          let toTemp = {}
          let addTemp = {}
          addTemp.date = toTemp.date = acTemp.date = item.day

          acTemp.val = item.active || 0
          toTemp.val = item.total || 0
          addTemp.val = item.add || 0
          acRet.push(acTemp)
          toRet.push(toTemp)
          addRet.push(addTemp)
        })
        resolve({
          active: acRet,
          total: toRet,
          add: addRet
        })
      }
    }).catch((res) => {
      reject(res)
    })
  })
}
