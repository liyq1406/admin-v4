/**
 * 项目基本配置
 * @type {Object}
 */

// 测试服务器地址
const DEFAULT_API_SERVER = 'http://api-test.xlink.cn:8887'
// 海曼
// const DEFAULT_API_SERVER = 'http://ic.heiman.cn:8887'
// 开发者本地
// const DEFAULT_API_SERVER: 'http://localhost:8887',
// 正式地址
// const DEFAULT_API_SERVER = 'https://api2.xlink.cn:443'

// 插件服务器地址
const PLUGIN_SERVER = 'http://plugin.xlink.cn'

export var apiServer = {
  // 默认
  default: process.env.API_SERVER || DEFAULT_API_SERVER,

  // 菜谱
  recipe: `${PLUGIN_SERVER}/39352b6f8d224064832bcec9b96958d1`
}

export default {
  // 刷新验证码等待间隔
  verifycodeDuration: 90,

  // 表格每页记录数
  pageCount: 10
}
