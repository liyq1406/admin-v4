import config from './config'
import api from 'api'

var ProductConfigPool = {} // 产品配置信息缓存
/**
 * [设置自定义产品概览配置]
 * @param {[String]} productId [产品ID]
 * @param {[Object]} params    [格式如上value值定义]
 */
function setCustomOverviewConfig (productId, params) {
  return new Promise((resolve, reject) => {
    let key = config.genKey(productId)
    let value = JSON.stringify(params)
    api.customization.setCorpCustomization({ [key]: value }).then((res) => {
      if (res.status === 200) {
        if (ProductConfigPool[key]) {
          ProductConfigPool[key].expired = true
        }
      }
      resolve(res)
    }).catch((res) => {
      reject(res)
    })
  })
}

/**
 * [获取自定义产品概览配置]
 * @param  {[type]} productId [description]
 * @return {[type]}           [description]
 */
function getCustomOverviewConfig (productId) {
  return new Promise((resolve, reject) => {
    let key = config.genKey(productId)
    if (ProductConfigPool[key] && !ProductConfigPool[key].expired) {
      resolve(JSON.parse(ProductConfigPool[key].value))
    } else {
      api.customization.getCorpCustomization(key).then((res) => {
        if (res.status === 200) {
          if (res.data[key]) {
            ProductConfigPool[key] = {
              expired: false,
              value: res.data[key]
            }
            resolve(JSON.parse(ProductConfigPool[key].value))
          }
          resolve()
        }
      }).catch((res) => {
        reject(res)
      })
    }
  })
}

export default {
  setCustomOverviewConfig,
  getCustomOverviewConfig
}
