/**
 * 项目基本配置
 * @type {Object}
 */

// 测试服务器地址
const DEFAULT_API_SERVER = 'http://api-test.xlink.cn:8887'
// 天际
// const DEFAULT_API_SERVER = 'https://dev-man.360tj.com:8016'
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
// 天际
// const DEFAULT_PLUGIN_SERVER = 'https://dev-man.360tj.com:8016'

export const API_SERVER = {
  // 默认
  default: process.env.API_SERVER || DEFAULT_API_SERVER,

  // 菜谱
  recipe: `${DEFAULT_PLUGIN_SERVER}/module/recipes`,

  // 延保
  warranty: `${DEFAULT_PLUGIN_SERVER}/module/warranty`,

  // 用户反馈
  feedback: `${DEFAULT_PLUGIN_SERVER}/module/feedback`,

  // 经销商管理
  dealer: `${DEFAULT_PLUGIN_SERVER}/module/distributer`
}

// 默认每页记录数
export const COUNT_PER_PAGE = 10

// 高德地图 key
export const AMAP_KEY = '5f21a013829b628d05551513d352f3f7'

// 允许上传的最大固件文件大小（单位：Mb）
export const MAX_FIRMWARE_FILE_SIZE = 8

// 允许上传的最大图片文件大小（单位：Mb）
export const MAX_IMAGE_FILE_SIZE = 8

// 验证码刷新等待间隔(单位:秒)
export const VERIFYCODE_DURATION = 90

// 通知存活时长，默认(2000毫秒)
export const NOTICE_DURATION = 2000
