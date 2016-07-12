export default {
  component (resolve) {
    require.ensure([], (require) => {
      resolve(require('../views/operation/index'))
    }, 'admin')
  },
  subRoutes: {
    // 产品管理
    'product/create': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/product/create'))
        }, 'admin')
      }
    },

    // 产品详情
    'products/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/product/index'))
        }, 'admin')
      },
      name: 'products',
      subRoutes: {
        // 概览
        'overview': {
          component (resolve) {
            require.ensure(['echarts'], (require) => {
              resolve(require('../views/operation/product/overview'))
            }, 'admin')
          }
        },
        // 设备管理
        'devices': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/product/device/list'))
            }, 'admin')
          }
        },
        // 数据端点
        'data-point': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/product/data-point'))
            }, 'admin')
          }
        },
        // 通知与告警
        'alert': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/product/alert'))
            }, 'admin')
          }
        },
        // 固件升级
        'upgrade': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/product/upgrade'))
            }, 'admin')
          }
        },
        // 微信导入
        'wechat': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/product/wechat'))
            }, 'admin')
          }
        },
        // 数据转发
        'data-forward': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/product/data-forward'))
            }, 'admin')
          }
        }
      }
    },
    // 上下线记录
    'products/:product_id/records': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/product/device/records'))
        }, 'admin')
      }
    },
    // 设备详情
    'products/:product_id/devices/:device_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/product/device/index'))
        }, 'admin')
      },
      subRoutes: {
        // 设备信息
        'info': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/product/device/info'))
            }, 'admin')
          }
        },
        // 历史数据
        'history': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/product/device/history'))
            }, 'admin')
          }
        },
        // 告警信息
        'alerts': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/product/device/alerts'))
            }, 'admin')
          }
        },
        // 用户信息
        'users': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/product/device/users'))
            }, 'admin')
          }
        },
        // 维保记录
        'warranty': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/product/device/warranty'))
            }, 'admin')
          }
        }
      }
    },

    // 插件管理
    'plugins': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/index'))
        }, 'admin')
      },
      subRoutes: {
        // 扩展插件
        'extensions': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/plugin/extensions'))
            }, 'admin')
          }
        },
        // 自定义插件
        'customize': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/plugin/customize'))
            }, 'admin')
          }
        }
      }
    },
    // iOS应用
    'plugins/ios/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/ios/index'))
        }, 'admin')
      },
      subRoutes: {
        // 配置
        'settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/plugin/ios/settings'))
            }, 'admin')
          }
        }
      }
    },
    // 安卓应用
    'plugins/android/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/android/index'))
        }, 'admin')
      },
      subRoutes: {
        // 配置
        'settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/plugin/android/settings'))
            }, 'admin')
          }
        },
        // 版本
        'version': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/plugin/android/version'))
            }, 'admin')
          }
        }
      }
    },
    // 微信应用
    'plugins/wechat/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/wechat/index'))
        }, 'admin')
      },
      subRoutes: {
        // 配置
        'settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/plugin/wechat/settings'))
            }, 'admin')
          }
        }
      }
    },

    // web应用
    'plugins/web/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/web/index'))
        }, 'admin')
      },
      subRoutes: {
        // 配置
        'settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/plugin/web/settings'))
            }, 'admin')
          }
        }
      }
    },

    // 消息推送
    'plugins/broadcast/:app_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/broadcast/index'))
        }, 'admin')
      },
      subRoutes: {
        // 新建推送
        'add': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/plugin/broadcast/add'))
            }, 'admin')
          }
        },
        // 推送历史
        'history': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/plugin/broadcast/history'))
            }, 'admin')
          }
        }
      }
    },
    // 禁止访问
    'plugins/broadcast/:app_id/forbidden': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/broadcast/forbidden'))
        }, 'admin')
      }
    },
    // 推送详情
    'plugins/broadcast/:app_id/history/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/broadcast/details'))
        }, 'admin')
      }
    },
    // 编辑推送
    'plugins/broadcast/:app_id/history/:id/update': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/broadcast/update'))
        }, 'admin')
      }
    },

    // Google nest
    'plugins/nest/:app_id/forbidden': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/nest/forbidden'))
        }, 'admin')
      }
    },

    // 用户反馈
    'plugins/helpdesk/:app_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/helpdesk/index'))
        }, 'admin')
      },
      subRoutes: {
        // 概览
        'overview': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/plugin/helpdesk/overview'))
            }, 'admin')
          }
        },
        // 反馈列表
        'issues': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/plugin/helpdesk/issues'))
            }, 'admin')
          }
        },
        // 标签管理
        'tags': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/plugin/helpdesk/tags'))
            }, 'admin')
          }
        }
      }
    },
    'plugins/helpdesk/:app_id/issues/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/helpdesk/issue-details'))
        }, 'admin')
      }
    },
    // 禁止访问
    'plugins/helpdesk/:app_id/forbidden': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/helpdesk/forbidden'))
        }, 'admin')
      }
    },

    // 经销商管理
    'plugins/dealer/:app_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/dealer/index'))
        }, 'admin')
      },
      subRoutes: {
        // 经销商列表
        'list': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/plugin/dealer/list'))
            }, 'admin')
          }
        }
      }
    },
    // 经销商详情
    'plugins/dealer/:app_id/list/:dealer_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/dealer/dealer-detail'))
        }, 'admin')
      }
    },
    // 销售详情
    'plugins/dealer/:app_id/list/:dealer_id/detail/:sale_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/dealer/detail'))
        }, 'admin')
      }
    },
    // 禁止访问
    'plugins/dealer/:app_id/forbidden': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/dealer/forbidden'))
        }, 'admin')
      }
    },

    // 支付网关
    'plugins/xpay/:app_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/xpay/index'))
        }, 'admin')
      }
    },
    // 禁止访问
    'plugins/xpay/:app_id/forbidden': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/xpay/forbidden'))
        }, 'admin')
      }
    },

    // 告警服务
    'alerts': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/alert/index'))
        }, 'admin')
      },
      subRoutes: {
        // 概览
        'overview': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/alert/overview'))
            }, 'admin')
          }
        },
        // 规则设置
        'setting': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/alert/setting'))
            }, 'admin')
          }
        }
      }
    },
    // 设备互联
    'linkage': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/linkage/index'))
        }, 'admin')
      },
      subRoutes: {
        // 设备联动
        'devices': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/linkage/devices'))
            }, 'admin')
          }
        },
        // 规则设置
        'nest': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/linkage/nest'))
            }, 'admin')
          }
        },
        // echo
        'echo': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/linkage/echo'))
            }, 'admin')
          }
        }
      }
    },

    // 数据管理
    'data': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/data/index'))
        }, 'admin')
      },
      subRoutes: {
        // 数据表
        'tables': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/data/tables'))
            }, 'admin')
          }
        },
        // 数据快照
        'snapshot': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/data/snapshot'))
            }, 'admin')
          }
        }
      }
    },

    // 数据表详情
    'data/tables/:product_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/data/details'))
        }, 'admin')
      }
    },

    // 数据快照详情
    'data/snapshot/:product_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/data/snapshotDetails'))
        }, 'admin')
      }
    },

    // 用户管理
    'users': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/user/index'))
        }, 'admin')
      },
      subRoutes: {
        // 概览
        'overview': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/user/overview'))
            }, 'admin')
          }
        },
        // 用户列表
        'list': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/user/list'))
            }, 'admin')
          }
        },
        // 用户设置
        'settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/user/settings'))
            }, 'admin')
          }
        }
      }
    },

    // 用户详情
    'user/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/user/details'))
        }, 'admin')
      }
    },

    // 设备地图
    'device-map': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/device-map/index'))
        }, 'admin')
      }
    },

    // 固件管理
    'firmware': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/firmware/index'))
        }, 'admin')
      },
      subRoutes: {
        // 概览
        'overview': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/firmware/overview'))
            }, 'admin')
          }
        },
        // 版本管理
        'management': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/firmware/management'))
            }, 'admin')
          }
        },
        // 固件升级
        'upgrade': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/firmware/upgrade'))
            }, 'admin')
          }
        }
      }
    },

    // 统计分析
    'statistic': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/statistic/index'))
        }, 'admin')
      },
      subRoutes: {
        // 产品统计
        'products': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/statistic/products'))
            }, 'admin')
          }
        },
        // 用户统计
        'users': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/statistic/users'))
            }, 'admin')
          }
        }
      }
    },

    // 系统设置
    'settings': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/settings/index'))
        }, 'admin')
      },
      subRoutes: {
        // 授权管理
        'auth': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/settings/auth'))
            }, 'admin')
          }
        },
        // 成员管理
        'members': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/settings/members'))
            }, 'admin')
          }
        },
        // 帐号信息
        'account': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/settings/account'))
            }, 'admin')
          }
        },
        // 邮件模板
        'mail-templates': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/settings/mail-templates'))
            }, 'admin')
          }
        }
      }
    },

    // 饮食管理
    'plugins/recipe/:app_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/recipe/index'))
        }, 'admin')
      },
      subRoutes: {
        // 菜谱管理
        'list': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/plugin/recipe/recipe/index'))
            }, 'admin')
          }
        },
        // 食材管理
        'ingredient': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/plugin/recipe/ingredient/index'))
            }, 'admin')
          }
        }
      }
    },
    // 禁止访问
    'plugins/recipe/:app_id/forbidden': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/recipe/forbidden'))
        }, 'admin')
      }
    },
    'plugins/recipe/:app_id/ingredient/add': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/recipe/ingredient/add'))
        }, 'admin')
      }
    },
    'plugins/recipe/:app_id/ingredient/:id/edit': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/recipe/ingredient/edit'))
        }, 'admin')
      }
    },
    'plugins/recipe/:app_id/add': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/recipe/recipe/add'))
        }, 'admin')
      }
    },
    'plugins/recipe/:app_id/:id/edit': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/recipe/recipe/edit'))
        }, 'admin')
      }
    },

    // 维保系统-工单管理
    'plugins/warranty/:app_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/warranty/index'))
        }, 'admin')
      },
      subRoutes: {
        // 延保工单列表
        'work-orders/extended-warranties': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/plugin/warranty/work-order/extended-warranty/list'))
            }, 'admin')
          }
        },
        // 维修工单列表
        'work-orders/repair': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/plugin/warranty/work-order/repair/list'))
            }, 'admin')
          }
        },
        // 网点管理
        'accounts': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/plugin/warranty/account/list'))
            }, 'admin')
          }
        }
      }
    },
    // 禁止访问
    'plugins/warranty/:app_id/forbidden': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/warranty/forbidden'))
        }, 'admin')
      }
    },
    // 维保系统-延保工单详情
    'plugins/warranty/:app_id/work-orders/extended-warranties/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/warranty/work-order/extended-warranty/details'))
        }, 'admin')
      }
    },
    // 维保系统-维修工单详情
    'plugins/warranty/:app_id/work-orders/repair/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/warranty/work-order/repair/details'))
        }, 'admin')
      }
    },
    // 网点详情
    'plugins/warranty/:app_id/accounts/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/warranty/account/details'))
        }, 'admin')
      }
    },
    // 网点-客服详情
    'plugins/warranty/:app_id/accounts/:account_id/staffs/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/plugin/warranty/account/staff-details'))
        }, 'admin')
      }
    },
    // 设备参数
    'device-params': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/device-params/index'))
        }, 'admin')
      }
    },
    // 设备参数详情
    'device-params/:product_id/:device_id/:mac': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('../views/operation/device-params/details'))
        }, 'admin')
      },
      subRoutes: {
        // 基本信息
        'basic-info': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/device-params/basic-info'))
            }, 'admin')
          }
        },
        // 数据监控
        'data-monitoring': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/device-params/data-monitoring'))
            }, 'admin')
          }
        },
        // 故障记录
        'fault-records': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('../views/operation/device-params/fault-records'))
            }, 'admin')
          }
        }
      }
    }
  }
}
