import api from 'api'

function _getStatisticRules (productId, snapshotId) {
  return new Promise(function (resolve, reject) {
    api.snapshot.getStatisticRules(productId, snapshotId).then((res) => {
      resolve(res)
    }).catch((res) => {
      reject(res)
    })
  })
}

function _getRules (productId) {
  return new Promise(function (resolve, reject) {
    api.snapshot.getRules(productId).then((res) => {
      resolve(res)
    }).catch((res) => {
      reject(res)
    })
  })
}

/**
 * 获取快照统计规则
 * @param  {String} productId 产品ID
 * @return {Promise}
 */
export default {
  getStatisticRules (productId) {
    return new Promise(function (resolve, reject) {
      console.log(productId)
      _getRules(productId).then((res) => {
        if (res.status === 200 && res.data.list && res.data.list.length) {
          res.data.list.forEach((item) => {
            _getStatisticRules(productId, item.id).then((res) => { // 根据快照规则ID
              resolve(res)
            }).catch((res) => {
              reject(res)
            })
          })
        }
      }).catch((res) => {
        reject(res)
      })
    })
  }
}
