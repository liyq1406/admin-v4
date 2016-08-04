import api from 'api'
import {createDayRange, beautify} from 'helpers/utils'
// import _ from 'lodash'

export function getTrend (duration) {
  var range
  if (Array.isArray(duration)) {
    range = createDayRange(duration[0], duration[1])
  } else {
    range = createDayRange(0, duration)
  }
  return new Promise((resolve, reject) => {
    api.statistics.getUserTrend(range.start, range.end).then((res) => {
      if (res.status === 200 && res.data.length > 0) {
        var ret = beautify(res.data, duration)
        var acRet = [] // 活跃用户
        var toRet = [] // 累计用户
        var addRet = [] // 新增用户
        ret.forEach((item) => { // 过滤字段
          let acTemp = {}
          let toTemp = {}
          let addTemp = {}
          addTemp.day = toTemp.day = acTemp.day = item.day

          acTemp.count = item.active || 0
          toTemp.count = item.total || 0
          addTemp.count = item.add || 0
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

// 获取产品分布
export function getUserRegion () {
  return new Promise((resolve, reject) => {
    api.statistics.getUserRegion().then((res) => {
      if (res.status === 200) {
        resolve(res.data['中国'])
      }
    }).catch((res) => {
      reject(res)
    })
  })
}

export function gettTotalUser () {
  return new Promise((resolve, reject) => {
    api.statistics.getSummary().then((res) => {
      if (res.status === 200) {
        resolve({
          total: res.data.user.total || 0,
          add: res.data.user.today_add
        })
      }
    }).catch((res) => {
      reject(res)
    })
  })
}