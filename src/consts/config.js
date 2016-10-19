/**
 * 项目基本配置
 * @type {Object}
 */
let protocol = process.env.NODE_ENV !== 'production' ? 'https:' : window.location.protocol

let apiServer = ({
  api2: { // 正式环境
    api: `${protocol}//api2.xlink.cn`,
    // plugin: `${protocol}//plugin-api.xlink.cn:3000`
    plugin: 'http://plugin-api.xlink.cn:3000'
  },
  test: { // 测试服务器
    api: 'http://api-test.xlink.cn:8887',
    plugin: 'http://test.plugin.xlink.cn:3000'
  },
  grey: { // 灰度服务器
    api: `${protocol}//api-grey.xlink.cn`,
    plugin: `${protocol}//api-grey.xlink.cn`
  },
  demo: { // Demo
    api: `${protocol}//api-demo.xlink.cn`,
    plugin: `${protocol}//api-demo.xlink.cn`
  },
  console: { // console
    api: 'http://127.0.0.1:8887',
    plugin: 'http://test.plugin.xlink.cn:3000'
  },
  bull: { // 公牛
    api: `${protocol}//139.224.7.17`,
    plugin: `${protocol}//test.plugin.xlink.cn:3002`
  },
  tianji: { // 天际
    api: `${protocol}//dev-man.360tj.com:8016`,
    plugin: `${protocol}://dev-man.360tj.com:8016`
  }
})[process.env.API_SERVER || 'test']

export const API_SERVER = {
  // 默认
  default: apiServer.api,

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

// 高德地图 key
export const AMAP_KEY = '5f21a013829b628d05551513d352f3f7'

// 允许上传的最大固件文件大小（单位：Mb）
export const MAX_FIRMWARE_FILE_SIZE = 8

// 允许上传的最大图片文件大小（单位：Mb）
export const MAX_IMAGE_FILE_SIZE = 2

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
      unfold: true, // 展开子级菜单
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
    }, {
      alias: 'data', // 数据服务
      unfold: true, // 展开子级菜单
      icon: 'database',
      subs: [{
        alias: 'tables',
        url: '/data/tables'
      }, {
        alias: 'snapshots',
        url: '/data/snapshots'
      }, {
        alias: 'statistics-rule',
        url: '/data/statistics-rule'
      }, {
        alias: 'forward',
        url: '/data/forward'
      }]
    // 暂时隐藏
    // }, {
    //   alias: 'shopping', // 在线购买
    //   unfold: true, // 展开子级菜单
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
      unfold: true, // 展开子级菜单
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
      unfold: true, // 展开子级菜单
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
      unfold: true, // 展开子级菜单
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
