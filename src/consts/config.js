/**
 * 项目基本配置
 * @type {Object}
 */

// 测试服务器地址
const DEFAULT_API_SERVER = 'http://api-test.xlink.cn:8887'
// const DEFAULT_API_SERVER = ''
// 测试图表
// const DEFAULT_API_SERVER = 'http://120.26.244.72:8887'
// 海曼
// const DEFAULT_API_SERVER = 'http://ic.heiman.cn:8887'
// 开发者本地
// const DEFAULT_API_SERVER: 'http://localhost:8887',
// 正式地址
// const DEFAULT_API_SERVER = 'https://api2.xlink.cn:443'

// 插件服务器地址
const DEFAULT_PLUGIN_SERVER = 'http://test.plugin.xlink.cn:3000'

export var apiServer = {
  // 默认
  default: process.env.API_SERVER || DEFAULT_API_SERVER,

  // 菜谱
  recipe: `${DEFAULT_PLUGIN_SERVER}/module/recipe`,

  // 延保
  warranty: `${DEFAULT_PLUGIN_SERVER}/module/warranty`
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
  },

  // 允许上传的最大固件文件大小（单位：Mb）
  maxFirmwareFileSize: 8,

  // 允许上传的最大图片文件大小（单位：Mb）
  maxImageFileSize: 2,

  // 高德地图 key
  amapKey: '5f21a013829b628d05551513d352f3f7'
}
