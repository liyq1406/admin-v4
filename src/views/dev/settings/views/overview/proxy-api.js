import config from './config'
import _ from 'lodash'

function _genKey (productId) {
  let keyObj = _.clone(config.defaultKey)
  keyObj.module_id = productId
  let res = ''
  for (let i in keyObj) {
    if (keyObj[i]) {
      res = res + keyObj[i] + '_'
    }
  }
  return res.substr(0, res.length - 1)
}
/**
 * [设置自定义产品概览配置]
 * @param {[String]} productId [产品ID]
 * @param {[Object]} params    [格式如上value值定义]
 */
function setCustomOverviewConfig (productId, params) {
  let key = _genKey(productId)
  let value = JSON.stringify(params)
  console.log(key)
  console.log(value)
}

/**
 * [获取自定义产品概览配置]
 * @param  {[type]} productId [description]
 * @return {[type]}           [description]
 */
function getCustomOverviewConfig (productId) {
  let key = _genKey(productId)
  console.log(key)
}

export default {
  setCustomOverviewConfig,
  getCustomOverviewConfig
}
