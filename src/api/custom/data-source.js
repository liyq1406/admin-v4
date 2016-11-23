import config from 'consts/custom-config/data-source'
import api from 'api'
import _ from 'lodash'

var pool = {
  data: null,
  expired: false
} // 产品配置信息缓存
/**
 * [设置自定义产品概览配置]
 * @param {[String]} productId [产品ID]
 * @param {[Object]} params    [格式如上value值定义]
 */
function add (params) {
  params.id = +new Date() // 使用时间戳作为记录id
  return new Promise((resolve, reject) => {
    get().then((res) => {
      let value
      if (!res) { // 首次添加
        value = JSON.stringify([params])
      } else if (Array.isArray(res)) {
        let temp = _.clone(res)
        temp.push(params)
        value = JSON.stringify(temp)
      } else {
        reject()
      }
      let key = config.genKey()
      api.customization.setCorpCustomization({ [key]: value }).then((res) => {
        if (res.status === 200) {
          if (pool.data) {
            pool.expired = true
          }
        }
        resolve(res)
      }).catch((res) => {
        reject(res)
      })
    }).catch((res) => {
      reject(res)
    })
  })
}

/**
 * [修改自定义数据源]
 * @param {[String]} productId [产品ID]
 * @param {[Object]} params    [格式如上value值定义]
 */
function put (id, params) {
  return new Promise((resolve, reject) => {
    get().then((res) => {
      if (Array.isArray(res)) {
        let temp = _.clone(res)
        let deled = _.filter(temp, (item) => {
          return item.id !== parseInt(id)
        })
        params.id = parseInt(id)
        deled.push(params)
        let value = JSON.stringify(deled)
        let key = config.genKey()
        api.customization.setCorpCustomization({ [key]: value }).then((res) => {
          if (res.status === 200) {
            if (pool.data) {
              pool.expired = true
            }
          }
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      } else {  // 没有记录
        reject()
      }
    }).catch((res) => {
      reject(res)
    })
  })
}

/**
 * [删除自定义数据源]
 * @param {[String]} productId [产品ID]
 * @param {[Object]} params    [格式如上value值定义]
 */
function del (id) {
  return new Promise((resolve, reject) => {
    get().then((res) => {
      if (Array.isArray(res)) {
        let temp = _.clone(res)
        let deled = _.filter(temp, (item) => {
          return item.id !== parseInt(id)
        })
        let value = JSON.stringify(deled)
        let key = config.genKey()
        api.customization.setCorpCustomization({ [key]: value }).then((res) => {
          if (res.status === 200) {
            if (pool.data) {
              pool.expired = true
            }
          }
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      } else {  // 没有记录
        reject()
      }
    }).catch((res) => {
      reject(res)
    })
  })
}

/**
 * [获取自定义数据源列表]
 * @param  {[type]} productId [description]
 * @return {[type]}           [description]
 */
function get () {
  return new Promise((resolve, reject) => {
    let key = config.genKey()
    if (pool.data && !pool.expired) {
      resolve(JSON.parse(pool.data))
    } else {
      api.customization.getCorpCustomization(key).then((res) => {
        if (res.status === 200) {
          if (res.data[key]) {
            pool.data = res.data[key]
            pool.expired = false
            resolve(JSON.parse(pool.data))
          } else {
            resolve()
          }
        }
      }).catch((res) => {
        reject(res)
      })
    }
  })
}

export default {
  add,
  get,
  put,
  del
}
