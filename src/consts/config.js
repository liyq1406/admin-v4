/**
 * 项目基本配置
 * @type {Object}
 */

let apiServer = ({
  test: { // 测试服务器
    api: 'http://api-test.xlink.cn:80',
    plugin: 'http://test.plugin.xlink.cn:3000'
  },
  fotile: { // 方太
    api: 'http://cloud.fotile.com',
    plugin: 'http://cloud.fotile.com:3000'
  }
})[process.env.API_SERVER || 'fotile']

export const API_SERVER = {
  // 默认
  default: apiServer.api,
  message: apiServer.message,
  // 菜谱
  recipe: `${apiServer.plugin}/module/recipes`,

  // 延保
  warranty: `${apiServer.plugin}/module/warranty`,

  // 用户反馈
  feedback: `${apiServer.plugin}/module/feedback`,

  // 经销商管理
  dealer: `${apiServer.plugin}/module/distributer`,

  // 环境数据
  airquality: `${apiServer.plugin}/module/airQuality`,

  // 云菜谱
  recipes: `${apiServer.plugin}/module/recipes`,

  // 内容管理
  content: `${apiServer.plugin}/module/contents`,

  // 运营位管理
  operate: `${apiServer.plugin}/module/operatePosition`
}

// 是否显示旧版入口
export const IS_SHOW_OLD_ENTRANCE = true

// 是否 DEMO
export const IS_DEMO = process.env.API_SERVER === 'demo'

// 默认每页记录数
export const COUNT_PER_PAGE = 10

// 百度地图 key
export const BMAP_KEY = 'iqGzDSunIlUeEK1H8rkRfptH'

// 高德地图 key
export const AMAP_KEY = '5f21a013829b628d05551513d352f3f7'

// 允许上传的最大固件文件大小（单位：Mb）
export const MAX_FIRMWARE_FILE_SIZE = 8

// 允许上传的最大图片文件大小（单位：Mb）
export const MAX_IMAGE_FILE_SIZE = 2

// 上传允许最大的大小
export const MAX_UPLOAD_FILE_SIZE = {
  file: 2,
  image: 2,
  firmware: 8
}

// 验证码刷新等待间隔(单位:秒)
export const VERIFYCODE_DURATION = 90

// 通知存活时长，默认(2000毫秒)
export const NOTICE_DURATION = 2000

// 经销商级别分隔符
export const DEALER_SCOPE_SEPERATOR = '.'

// Echarts 图表默认配色
export const CHART_COLORS = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']

export const MAIN_NAV = {
  // dashboard: {
  //   alias: 'dashboard',
  //   url: '/dashboard'
  // },
  dev: {
    alias: 'dev',
    url: '/dev',
    subs: [{
      // action: false,
      icon: 'home',
      url: 'home',
      alias: 'home'
    }, {
      action: true,
      icon: 'plus',
      url: '/products/create'
    }, {
      alias: 'apps', // 应用管理
      icon: 'th',
      url: 'apps/index'
    }, {
      alias: 'market', // 应用市场
      icon: 'shopping-bag',
      url: 'market/index'
    }, {
      alias: 'firmware', // 固件管理
      unfold: true, // 展开子级菜单
      icon: 'file-code-o',
      subs: [{
        alias: 'add',
        url: '/firmware/add'
      }, {
        alias: 'list',
        url: '/firmware/list'
      }, {
        alias: 'manage',
        url: '/firmware/manage'
      }]
    // }, {
    //   alias: 'settings', // 系统设置
    //   unfold: true, // 展开子级菜单
    //   icon: 'cog',
    //   subs: [{
    //     alias: 'users',
    //     url: '/settings/users'
    //   }]
    }]
  },
  operation: {
    alias: 'operation',
    url: '/operation',
    subs: [{
      alias: 'alerts', // 告警服务
      icon: 'bell',
      unfold: true, // 展开子级菜单
      subs: [{
        alias: 'record',
        url: '/alerts/record'
      }]
    }, {
      alias: 'users', // 用户管理
      icon: 'users',
      unfold: true, // 展开子级菜单
      subs: [{
        alias: 'overview',
        url: '/users/overview'
      }, {
        alias: 'list',
        url: '/users/list'
      }]
    }]
  }
}
