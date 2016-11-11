/**
 * 运营平台概览页翻译信息
 * @return {Object}
 */

export default {
  main_title: 'Overview', // 概览
  total: {
    count: 'All Devices', // 设备总数
    tooltip: 'Total device amount' // 企业的设备总量
  },
  activated: {
    count: 'Activated Devices', // 激活数
    tooltip: 'Activated device amount' // 已联网激活的设备数量
  },
  online: {
    count: 'Online Devices', // 在线量
    tooltip: 'Current online device amount' // 当前在线的设备数量
  },
  users: {
    count: 'All Users', // 用户总数
    tooltip: 'Total user amount' // 企业的用户数量
  },
  product_trend: {
    title: 'Product Trend', // 产品趋势
    top: '{period}-day Activate TOP {n}', // 30天激活TOP5
    activated: '{period}-day Activation Amount' // 30天激活量
  },
  product_active: {
    title: 'Product Activation', // 产品活跃度
    not_activated: 'Unactivated Device', // 未激活设备
    activated: 'Activated Device' // 激活设备
  },
  product_dist: {
    title: 'Product Distribution', // 产品分布
    region: 'Region', // 地域
    count: 'Device', // 设备数量
    percent: 'Ratio' // 占比
  },
  user_trend: {
    title: 'User Trend' // 用户趋势
  }
}
