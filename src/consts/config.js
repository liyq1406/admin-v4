/**
 * 项目基本配置
 * @type {Object}
 */

// 测试服务器地址
const DEFAULT_API_SERVER = 'http://api-test.xlink.cn:8887'
// 测试图表
// const DEFAULT_API_SERVER = 'http://120.26.244.72:8887'
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
  recipe: `${PLUGIN_SERVER}/39352b6f8d224064832bcec9b96958d1`,

  // 延保
  warranty: 'http://test.plugin.xlink.cn:3000/module/warranty'
}

export default {
  // 表格每页记录数
  pageCount: 10,

  // 验证码
  verifycode: {
    // 刷新等待间隔(单位:秒)
    duration: 90
  },

  notice: {
    // 通知存活时长，默认(2000毫秒)
    duration: 2000
  }
}
