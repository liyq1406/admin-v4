/**
 * 项目基本配置
 * @type {Object}
 */
let protocol = process.env.NODE_ENV !== 'production' ? 'https:' : window.location.protocol
// 测试服务器地址
// const DEFAULT_API_SERVER = 'http://api-test.xlink.cn:8887'
// 测试demo服务器地址 add by guohao 2016/8/28
// const DEFAULT_API_SERVER = 'http://api-demo.xlink.cn'
// 天际
// const DEFAULT_API_SERVER = 'https://dev-man.360tj.com:8016'
// 测试图表
// const DEFAULT_API_SERVER = 'http://120.26.244.72:8887'
// 海曼
// const DEFAULT_API_SERVER = 'http://ic.heiman.cn:8887'
// 开发者本地
// const DEFAULT_API_SERVER: 'http://localhost:8887',
// 正式地址
// const DEFAULT_API_SERVER = `${protocol}//api2.xlink.cn:443`
// Demo
// const DEFAULT_API_SERVER = `${protocol}//api-demo.xlink.cn`
// 灰
const DEFAULT_API_SERVER = `${protocol}//api-grey.xlink.cn`

// 插件服务器地址
// const DEFAULT_PLUGIN_SERVER = 'http://test.plugin.xlink.cn:3000'
// Demo插件服务器灰度地址
// const DEFAULT_PLUGIN_SERVER = `${protocol}//api-demo.xlink.cn`
// 插件服务器灰度地址
const DEFAULT_PLUGIN_SERVER = `${protocol}//api-grey.xlink.cn`
// 测试 demo服务器地址 add by guohao 2016/8/28
// const DEFAULT_PLUGIN_SERVER = 'http://demo.plugin.xlink.cn'
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
  dealer: `${DEFAULT_PLUGIN_SERVER}/module/distributer`,

  // 环境数据
  airquality: `${DEFAULT_PLUGIN_SERVER}/module/airQuality`,

  // 云菜谱
  recipes: `${DEFAULT_PLUGIN_SERVER}/module/recipes`,

  // 内容管理
  content: `${DEFAULT_PLUGIN_SERVER}/module/contents`,

  // 运营位管理
  operate: `${DEFAULT_PLUGIN_SERVER}/module/operatePosition`
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

// 经销商级别分隔符
export const DEALER_SCOPE_SEPERATOR = '.'

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
      alias: 'linkage', // 智能互联
      icon: 'exchange',
      subs: [{
        alias: 'settings',
        url: '/linkage/settings'
      }, {
        alias: 'google',
        url: '/linkage/google'
      }, {
        alias: 'amazon',
        url: '/linkage/amazon'
      }, {
        alias: 'ifttt',
        url: '/linkage/ifttt'
      }, {
        alias: 'ezviz',
        url: '/linkage/ezviz'
      }]
    }, {
      alias: 'firmware', // 固件管理
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
    }, {
      alias: 'data', // 数据服务
      icon: 'database',
      subs: [{
        alias: 'tables',
        url: '/data/tables'
      }, {
        alias: 'snapshots',
        url: '/data/snapshots'
      }, {
        alias: 'forward',
        url: '/data/forward'
      }]
    // 暂时隐藏
    // }, {
    //   alias: 'shopping', // 在线购买
    //   icon: 'shopping-cart',
    //   subs: [{
    //     alias: 'cart',
    //     url: '/shopping/cart'
    //   }, {
    //     alias: 'orders',
    //     url: '/shopping/orders'
    //   }]
    }, {
      alias: 'settings', // 系统设置
      icon: 'cog',
      subs: [{
        alias: 'users',
        url: '/settings/users'
      }, {
        alias: 'mail_templates',
        url: '/settings/mail-templates'
      }]
    }]
  },
  operation: {
    alias: 'operation',
    url: '/operation',
    subs: [{
      alias: 'overview',
      icon: 'home',
      url: 'overview'
    }, {
      alias: 'alerts', // 告警服务
      icon: 'bell',
      subs: [{
        alias: 'record',
        url: '/alerts/record'
      }, {
        alias: 'analysis',
        url: '/alerts/analysis'
      // }, {
      //   alias: 'heat',
      //   url: '/alerts/heat'
      }]
    }, {
      alias: 'users', // 用户管理
      icon: 'users',
      subs: [{
        alias: 'overview',
        url: '/users/overview'
      }, {
        alias: 'list',
        url: '/users/list'
      }, {
        alias: 'major_clients',
        url: '/users/major-clients'
      }, {
        alias: 'portrait',
        url: '/users/portrait'
      // 暂时隐藏
      // }, {
      //   alias: 'analysis',
      //   url: '/users/analysis'
      }]
    }]
  }
}
