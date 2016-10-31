/**
 * 运营平台概览页翻译信息
 * @return {Object}
 */

export default {
  main_title: 'Overview', // 概览
  total: {
    count: 'All Devices', // 设备总数
    tooltip: 'Enterprise Device Amount' // 企业的设备总量
  },
  activated: {
    count: 'Activated Devices', // 激活数
    tooltip: 'Online Activated Device Amount' // 已联网激活的设备数量
  },
  online: {
    count: 'Online Users', // 在线量
    tooltip: 'Currently Online Device Amount' // 当前在线的设备数量
  },
  users: {
    count: 'All Users', // 用户总数
    tooltip: 'Enterprise User Amount' // 企业的用户数量
  },
  product_trend: {
    title: 'Product Trend', // 产品趋势
    top: '{period}-day Activate TOP {n}', // 30天激活TOP5
    activated: '{period}-day Activation Amount' // 30天激活量
  },
  product_active: {
    title: 'Product Activation', // 产品活跃度
    not_activated: 'Unactivated Device Amount', // 未激活设备
    activated: 'Activated Device Amount' // 激活设备
  },
  product_dist: {
    title: 'Product Trend', // 产品分布
    region: 'Region', // 地域
    count: 'Device Amount', // 设备数量
    percent: 'Ratio' // 占比
  },
  user_trend: {
    title: 'User Trend' // 用户趋势
  }
}
