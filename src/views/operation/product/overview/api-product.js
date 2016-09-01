import api from 'api'
import {createDayRange, beautify} from 'utils'

function getTrend (productId, duration) {
  var range
  if (Array.isArray(duration)) {
    range = createDayRange(duration[0], duration[1])
  } else {
    range = createDayRange(0, duration)
  }

  return new Promise((resolve, reject) => {
    api.statistics.getProductTrend(productId, range.start, range.end).then((res) => {
      if (res.status === 200 && res.data.length > 0) {
        resolve(beautify(res.data, duration))
      }
    }).catch((res) => {
      reject(res)
    })
  })
}

// 获取激活设备数量
export function getActivatedTrend (productId, duration) {
  return new Promise((resolve, reject) => {
    getTrend(productId, duration).then((res) => {
      var acRet = []
      var toRet = []
      res.forEach((item) => { // 过滤字段
        let acTemp = {}
        let toTemp = {}
        acTemp.day = item.day
        toTemp.day = item.day
        acTemp.count = item.activated || 0
        toTemp.count = item.total_activated || 0
        acRet.push(acTemp)
        toRet.push(toTemp)
      })
      resolve({
        activated: acRet,
        total: toRet
      })
    }).catch((res) => {
      reject(res)
    })
  })
}

// 获取活跃设备数量
export function getActiveTrend (productId, duration) {
  return new Promise((resolve, reject) => {
    getTrend(productId, duration).then((res) => {
      var acRet = []
      var addRet = []
      res.forEach((item) => { // 过滤字段
        let acTemp = {}
        let addTemp = {}
        acTemp.day = item.day
        acTemp.count = item.active
        addTemp.activated = item.activated
        addTemp.add = item.add

        acRet.push(acTemp)
        addRet.push(addTemp)
      })
      resolve({
        active: acRet,
        add: addRet
      })
    }).catch((res) => {
      reject(res)
    })
  })
}

// 获取产品分布
export function getProductRegion (pruductId) {
  return new Promise((resolve, reject) => {
    api.statistics.getProductRegion(pruductId).then((res) => {
      if (res.status === 200) {
        resolve(res.data['中国'])
      }
    }).catch((res) => {
      reject(res)
    })
  })
}
