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
  header: 'CUSTOM_OVERVIEW', // 标识本条记录的用途
  version: '1.0.0', // 协议版本
  role: ROLES.corp,
  user_id: '', // 如果role为user时, 需要传入
  module: MODULES.operation_product, // 模块
  module_id: '' // 如果模块有多个, 需要传入模块ID
}

let defaultValue = {
  quatas: {
    1: { // 指标1
      dataFrom: DATAFROM.preset,
      name: '授权数',
      preset: PRESET.devices_count // 数据来源为绑定数据项
      // datapoint: { // 数据来源为数据端点
      //   statistics_rule_id: '', // 统计规则ID
      //   datapoint_index: 0, // 数据端点的索引值
      //   statistics_type: STATISTICS_TYPES.max, // 1,2,3,4分别表示最大值，最小值，平均，求和
      //   period: PERIODS.one,
      //   custom_time: { // 当period为自定义时间时添加
      //     start: 0, // 时间戳
      //     end: 0 // 时间戳
      //   }
      // }
    },
    2: {
      dataFrom: DATAFROM.preset,
      name: '激活数',
      preset: PRESET.devices_active
    }, // 指标2
    3: {
      dataFrom: DATAFROM.preset,
      name: '设备在线数',
      preset: PRESET.devices_online
    }, // 指标3
    4: {
      dataFrom: DATAFROM.preset,
      name: '用户数',
      preset: PRESET.users_count
    } // 指标4
  },
  trend: true,
  active: true,
  distribution: true
}

export default {
  defaultValue,
  defaultKey,
  PERIODS,
  STATISTICS_TYPES,
  PRESET,
  DATAFROM
}
