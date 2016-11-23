const VERSION = '1.0.1'
const MODULES = {
  operation_product: 'OPERATION_PRODUCT',
  data_source: 'DATA_SOURCE'
}

const ROLES = {
  user: 'USER', // 用户个性配置
  corp: 'CORP' // 企业级配置
}

const SHOWTYPES = { // 显示方式
  data: 1, // 指标
  chart: 2 // 图表
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

const DATAFROMS = {
  rule: 1, // 统计规则
  datapoint: 2 // 数据端点
}

const CHARTS = {
  pie: 1, // 饼图
  bar: 2, // 柱状图
  line: 3 // 折线图
}

let key = {
  header: 'CUSTOM_OVERVIEW', // 标识本条记录的用途
  version: VERSION, // 协议版本
  role: ROLES.corp,
  user_id: '', // 如果role为user时, 需要传入
  module: MODULES.data_source, // 模块
  module_id: '' // 如果模块有多个, 需要传入模块ID
}

/** 自定义value数据结构定义
let value = [{
  id: '', // 记录id, 唯一
  product_id: // 产品id, 产品名
  title: '', // 标题
  show_type: 1, // 显示方式 见SHOWTYPES
  chart: 1, // 图表类型 见CHARTS
  pie_classify: [{ // 饼图分类信息
    min: 0,
    max: 0
  }, ...],
  data_from: 1, // 数据配置 见DATAFROMS
  rule_id: '', // 统计规则id
  dp_index: 0, // 数据端点index
  rule_type: 1, // 计算规则 见STATISTICS_TYPES
  fineness: 1, // 时间粒度 见统计规则粒度定义
  period: 1, // 见PERIODS
  custom_time: {
    start: 0, // 时间戳
    end: 0 // 时间戳
  }
}, ...]
*/
function genKey () {
  let keyObj = _.clone(key)
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
  PERIODS,
  STATISTICS_TYPES,
  DATAFROMS,
  SHOWTYPES,
  CHARTS
}
