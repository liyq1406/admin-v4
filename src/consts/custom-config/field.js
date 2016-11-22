
const MODULES = {
  operation_product: 'OPERATION_PRODUCT'
}

const ROLES = {
  user: 'USER', // 用户个性配置
  corp: 'CORP' // 企业级配置
}

const DATAFROM = { // 数据来源
  datapoint: 1, // 数据端点
  preset: 2 // 绑定预设项
}

const PRESET = {
  devices_count: 1, // 设备总数/设备授权数
  devices_active: 2, // 激活设备总数
  devices_online: 3, // 在线设备数
  users_count: 4, // 用户总数
  users_online: 5 // 用户在线数
}

const STATISTICS_TYPES = {
  max: 1,
  min: 2,
  avg: 3,
  sum: 4
}

const PERIODS = {
  one: 1, // 24小时
  seven: 2, // 7日
  thirty: 3, // 30日
  all: 4, // 至今
  custom: 5 // 自定义
}

let defaultKey = {
  header: 'CUSTOM_FIELD', // 标识本条记录的用途
  version: '1.0.0', // 协议版本
  role: ROLES.corp,
  user_id: '', // 如果role为user时, 需要传入
  module: MODULES.operation_product, // 模块
  module_id: '' // 如果模块有多个, 需要传入模块ID
}

function genKey (productId) {
  let keyObj = _.clone(defaultKey)
  keyObj.module_id = productId
  let res = ''
  for (let i in keyObj) {
    if (keyObj[i]) {
      res = res + keyObj[i] + '_'
    }
  }
  res = res.replace(/\./g, '_')
  return res.substr(0, res.length - 1)
}

export default {
  genKey,
  defaultKey,
  PERIODS,
  STATISTICS_TYPES,
  PRESET,
  DATAFROM
}
