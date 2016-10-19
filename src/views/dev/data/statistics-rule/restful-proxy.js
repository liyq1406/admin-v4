import api from 'api'

function _getStatisticRules (productId, snapshots) {
  return new Promise(function (resolve, reject) {
    snapshots.forEach((snap) => {
      api.snapshot.getStatisticRules(productId, snap.id).then((res) => {
        resolve(res)
      }).catch((res) => {
        reject(res)
      })
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
      _getRules(productId).then((res) => {
        if (res.status === 200 && res.data.list && res.data.list.length) {
          return _getStatisticRules(productId, res.data.list)
        }
      }).then((res) => {
        resolve(res)
      }).catch((res) => {
        reject(res)
      })
    })
  },
  getRules: _getRules
}
