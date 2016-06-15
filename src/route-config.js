/**
 * 判断路由是否为非管理界面页面
 * @param  {String}  path 路由
 * @return {Boolean}
 */
let isAccessAuthPage = (path) => {
  return ['/login', '/register', '/register-with-verifycode', '/fetch-password', '/fetch-password-bymail'].indexOf(path) >= 0 || path.indexOf('/member-activate') >= 0 || path.indexOf('/email-activate') >= 0 || path.indexOf('/password-reset') >= 0 || path.indexOf('/user-email-activate') >= 0 || path.indexOf('/user-password-reset') >= 0
}

// function throttle (method) {
//   clearTimeout(method.tId)
//   method.tId = setTimeout(() => {
//     method.next()
//   }, 200)
// }

let configRouter = (router) => {
  /**
   * 路由地址映射
   * 注：使用`require.ensure`并作同一块名称声明的路由最终会打包在同一文件中
   *
   * 比如注册与登录这两个路由：
   *
   * // 注册
   * '/register': {
   *   component (resolve) {
   *     require.ensure([], (require) => {
   *       resolve(require('./views/register'))
   *     }, 'auth')
   *   }
   * },
   *
   * // 登录
   * '/login': {
   *   component (resolve) {
   *     require.ensure([], (require) => {
   *       resolve(require('./views/login'))
   *     }, 'auth')
   *   }
   * },
   *
   * 最终会打包在 `auth.js` 这个文件中
   */
  router.map({
    // 404
    '*': {
      component: require('./views/not-found')
    },

    // 禁止访问
    '/forbidden': {
      component: require('./views/forbidden')
    },

    // 注册
    '/register': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/register'))
        }, 'register')
      }
    },

    // 注册
    '/register-with-verifycode': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/register-with-verifycode'))
        }, 'register-with-verifycode')
      }
    },

    // 登录
    '/login': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/login'))
        }, 'login')
      }
    },

    // 手机找回密码
    '/fetch-password': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/fetch-password'))
        }, 'fetch-password')
      }
    },

    // 邮箱找回密码
    '/fetch-password-bymail': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/fetch-password-bymail'))
        }, 'fetch-password-bymail')
      }
    },

    // 重设密码
    '/password-reset/:email/:verifycode': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/password-reset'))
        }, 'password-reset')
      }
    },

    // 激活企业成员邀请
    '/member-activate/:email': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/member-activate'))
        }, 'member-activate')
      }
    },

    // 企业成员邮箱激活
    '/email-activate/:email/:verifycode': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/email-activate'))
        }, 'email-activate')
      }
    },

    // 普通用户重设密码
    '/user-password-reset/:corp_id/:email/:verifycode': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/user-password-reset'))
        }, 'user-password-reset')
      }
    },

    // 普通用户邮箱激活
    '/user-email-activate/:corp_id/:email/:verifycode': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/user-email-activate'))
        }, 'user-email-activat')
      }
    },

    // 概览
    '/dashboard': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/dashboard'))
        }, 'admin')
      }
    },

    // 产品管理
    '/product/create': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/product/create'))
        }, 'admin')
      }
    },
    // 产品详情
    '/products/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/product/index'))
        }, 'admin')
      },
      name: 'products',
      subRoutes: {
        // 概览
        'overview': {
          component (resolve) {
            require.ensure(['echarts'], (require) => {
              resolve(require('./views/product/overview'))
            }, 'admin')
          }
        },
        // 设备管理
        'devices': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/device/list'))
            }, 'admin')
          }
        },
        // 数据端点
        'data-point': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/data-point'))
            }, 'admin')
          }
        },
        // 通知与告警
        'alert': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/alert'))
            }, 'admin')
          }
        },
        // 固件升级
        'upgrade': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/upgrade'))
            }, 'admin')
          }
        },
        // 微信导入
        'wechat': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/wechat'))
            }, 'admin')
          }
        },
        // 数据转发
        'data-forward': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/data-forward'))
            }, 'admin')
          }
        }
      }
    },
    // 上下线记录
    '/products/:product_id/records': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/product/device/records'))
        }, 'admin')
      }
    },
    // 设备详情
    '/products/:product_id/devices/:device_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/product/device/details'))
        }, 'admin')
      }
    },

    // 插件管理
    '/plugins': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/index'))
        }, 'admin')
      },
      subRoutes: {
        // 扩展插件
        'extensions': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/plugin/extensions'))
            }, 'admin')
          }
        },
        // 自定义插件
        'customize': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/plugin/customize'))
            }, 'admin')
          }
        }
      }
    },
    // iOS应用
    '/plugins/ios/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/ios/index'))
        }, 'admin')
      },
      subRoutes: {
        // 配置
        'settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/plugin/ios/settings'))
            }, 'admin')
          }
        }
      }
    },
    // 安卓应用
    '/plugins/android/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/android/index'))
        }, 'admin')
      },
      subRoutes: {
        // 配置
        'settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/plugin/android/settings'))
            }, 'admin')
          }
        },
        // 版本
        'version': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/plugin/android/version'))
            }, 'admin')
          }
        }
      }
    },
    // 微信应用
    '/plugins/wechat/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/wechat/index'))
        }, 'admin')
      },
      subRoutes: {
        // 配置
        'settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/plugin/wechat/settings'))
            }, 'admin')
          }
        }
      }
    },

    // web应用
    '/plugins/web/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/web/index'))
        }, 'admin')
      },
      subRoutes: {
        // 配置
        'settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/plugin/web/settings'))
            }, 'admin')
          }
        }
      }
    },

    // 消息推送
    '/plugins/broadcast/:app_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/broadcast/index'))
        }, 'admin')
      },
      subRoutes: {
        // 新建推送
        'add': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/plugin/broadcast/add'))
            }, 'admin')
          }
        },
        // 推送历史
        'history': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/plugin/broadcast/history'))
            }, 'admin')
          }
        }
      }
    },
    // 禁止访问
    '/plugins/broadcast/:app_id/forbidden': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/broadcast/forbidden'))
        }, 'admin')
      }
    },
    // 推送详情
    '/plugins/broadcast/:app_id/history/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/broadcast/details'))
        }, 'admin')
      }
    },
    // 编辑推送
    '/plugins/broadcast/:app_id/history/:id/update': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/broadcast/update'))
        }, 'admin')
      }
    },

    // Google nest
    '/plugins/nest/:app_id/forbidden': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/nest/forbidden'))
        }, 'admin')
      }
    },

    // 用户反馈
    '/plugins/helpdesk/:app_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/helpdesk/index'))
        }, 'admin')
      },
      subRoutes: {
        // 概览
        'overview': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/plugin/helpdesk/overview'))
            }, 'admin')
          }
        },
        // 反馈列表
        'issues': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/plugin/helpdesk/issues'))
            }, 'admin')
          }
        },
        // 标签管理
        'tags': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/plugin/helpdesk/tags'))
            }, 'admin')
          }
        }
      }
    },
    '/plugins/helpdesk/:app_id/issues/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/helpdesk/issue-details'))
        }, 'admin')
      }
    },
    // 禁止访问
    '/plugins/helpdesk/:app_id/forbidden': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/helpdesk/forbidden'))
        }, 'admin')
      }
    },

    // 经销商管理
    '/plugins/dealer/:app_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/dealer/index'))
        }, 'admin')
      },
      subRoutes: {
        // 经销商列表
        'list': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/plugin/dealer/list'))
            }, 'admin')
          }
        }
      }
    },
    // 经销商详情
    '/plugins/dealer/:app_id/list/:dealer_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/dealer/dealer-detail'))
        }, 'admin')
      }
    },
    // 销售详情
    '/plugins/dealer/:app_id/list/:dealer_id/detail/:sale_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/dealer/detail'))
        }, 'admin')
      }
    },
    // 禁止访问
    '/plugins/dealer/:app_id/forbidden': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/dealer/forbidden'))
        }, 'admin')
      }
    },

    // 支付网关
    '/plugins/xpay/:app_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/xpay/index'))
        }, 'admin')
      }
    },
    // 禁止访问
    '/plugins/xpay/:app_id/forbidden': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/xpay/forbidden'))
        }, 'admin')
      }
    },

    // 告警服务
    '/alerts': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/alert/index'))
        }, 'admin')
      },
      subRoutes: {
        // 概览
        'overview': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/alert/overview'))
            }, 'admin')
          }
        },
        // 规则设置
        'setting': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/alert/setting'))
            }, 'admin')
          }
        }
      }
    },
    // 设备互联
    '/linkage': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/linkage/index'))
        }, 'admin')
      },
      subRoutes: {
        // 设备联动
        'devices': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/linkage/devices'))
            }, 'admin')
          }
        },
        // 规则设置
        'nest': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/linkage/nest'))
            }, 'admin')
          }
        },
        // echo
        'echo': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/linkage/echo'))
            }, 'admin')
          }
        }
      }
    },

    // 数据管理
    '/data': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/data/index'))
        }, 'admin')
      },
      subRoutes: {
        // 数据表
        'tables': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/data/tables'))
            }, 'admin')
          }
        },
        // 数据快照
        'snapshot': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/data/snapshot'))
            }, 'admin')
          }
        }
      }
    },

    // 数据表详情
    '/data/tables/:product_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/data/details'))
        }, 'admin')
      }
    },

    // 数据快照详情
    '/data/snapshot/:product_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/data/snapshotDetails'))
        }, 'admin')
      }
    },

    // 用户管理
    '/users': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/user/index'))
        }, 'admin')
      },
      subRoutes: {
        // 用户列表
        'list': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/user/list'))
            }, 'admin')
          }
        },
        // 用户设置
        'settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/user/settings'))
            }, 'admin')
          }
        }
      }
    },

    // 用户详情
    '/user/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/user/details'))
        }, 'admin')
      }
    },

    // 设备地图
    '/device-map': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/device-map/index'))
        }, 'admin')
      }
    },

    // 固件管理
    '/firmware': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/firmware/index'))
        }, 'admin')
      },
      subRoutes: {
        // 概览
        'overview': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/firmware/overview'))
            }, 'admin')
          }
        },
        // 版本管理
        'management': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/firmware/management'))
            }, 'admin')
          }
        },
        // 固件升级
        'upgrade': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/firmware/upgrade'))
            }, 'admin')
          }
        }
      }
    },

    // 统计分析
    '/statistic': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/statistic/index'))
        }, 'admin')
      },
      subRoutes: {
        // 产品统计
        'products': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/statistic/products'))
            }, 'admin')
          }
        },
        // 用户统计
        'users': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/statistic/users'))
            }, 'admin')
          }
        }
      }
    },

    // 系统设置
    '/settings': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/settings/index'))
        }, 'admin')
      },
      subRoutes: {
        // 授权管理
        'auth': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/settings/auth'))
            }, 'admin')
          }
        },
        // 成员管理
        'members': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/settings/members'))
            }, 'admin')
          }
        },
        // 帐号信息
        'account': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/settings/account'))
            }, 'admin')
          }
        },
        // 邮件模板
        'mail-templates': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/settings/mail-templates'))
            }, 'admin')
          }
        }
      }
    },

    // 饮食管理
    '/plugins/recipe/:app_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/recipe/index'))
        }, 'admin')
      },
      subRoutes: {
        // 菜谱管理
        'list': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/plugin/recipe/recipe/index'))
            }, 'admin')
          }
        },
        // 食材管理
        'ingredient': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/plugin/recipe/ingredient/index'))
            }, 'admin')
          }
        }
      }
    },
    // 禁止访问
    '/plugins/recipe/:app_id/forbidden': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/recipe/forbidden'))
        }, 'admin')
      }
    },
    '/plugins/recipe/:app_id/ingredient/add': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/recipe/ingredient/add'))
        }, 'admin')
      }
    },
    '/plugins/recipe/:app_id/ingredient/:id/edit': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/recipe/ingredient/edit'))
        }, 'admin')
      }
    },
    '/plugins/recipe/:app_id/add': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/recipe/recipe/add'))
        }, 'admin')
      }
    },
    '/plugins/recipe/:app_id/:id/edit': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/recipe/recipe/edit'))
        }, 'admin')
      }
    },

    // 维保系统-工单管理
    '/plugins/warranty/:app_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/warranty/index'))
        }, 'admin')
      },
      subRoutes: {
        // 延保工单列表
        'work-orders/extended-warranties': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/plugin/warranty/work-order/extended-warranty/list'))
            }, 'admin')
          }
        },
        // 维修工单列表
        'work-orders/repair': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/plugin/warranty/work-order/repair/list'))
            }, 'admin')
          }
        },
        // 网点管理
        'accounts': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/plugin/warranty/account/list'))
            }, 'admin')
          }
        }
      }
    },
    // 禁止访问
    '/plugins/warranty/:app_id/forbidden': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/warranty/forbidden'))
        }, 'admin')
      }
    },
    // 维保系统-延保工单详情
    '/plugins/warranty/:app_id/work-orders/extended-warranties/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/warranty/work-order/extended-warranty/details'))
        }, 'admin')
      }
    },
    // 维保系统-维修工单详情
    '/plugins/warranty/:app_id/work-orders/repair/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/warranty/work-order/repair/details'))
        }, 'admin')
      }
    },
    // 网点详情
    '/plugins/warranty/:app_id/accounts/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/warranty/account/details'))
        }, 'admin')
      }
    },
    // 网点-客服详情
    '/plugins/warranty/:app_id/accounts/:account_id/staffs/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/plugin/warranty/account/staff-details'))
        }, 'admin')
      }
    },
    // 设备参数
    '/device-params': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/device-params/index'))
        }, 'admin')
      }
    },
    // 设备参数详情
    '/device-params/:product_id/:device_id/:mac': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/device-params/details'))
        }, 'admin')
      },
      subRoutes: {
        // 基本信息
        'basic-info': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/device-params/basic-info'))
            }, 'admin')
          }
        },
        // 数据监控
        'data-monitoring': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/device-params/data-monitoring'))
            }, 'admin')
          }
        },
        // 故障记录
        'fault-records': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/device-params/fault-records'))
            }, 'admin')
          }
        }
      }
    }
  })

  // 重定向
  router.redirect({
    '/': '/login',
    '/products/:id': '/products/:id/overview',
    '/device-params/:product_id/:device_id/:mac': '/device-params/:product_id/:device_id/:mac/basic-info',
    '/data': '/data/tables',
    '/statistic': '/statistic/products',
    '/settings': '/settings/auth',
    '/users': '/users/list',
    '/plugins/ios/:id': '/plugins/ios/:id/settings',
    '/plugins/android/:id': '/plugins/android/:id/settings',
    '/plugins/wechat/:id': '/plugins/wechat/:id/settings',
    // '/plugins/recipe/:app_id': '/plugins/recipe/:app_id/forbidden',
    // '/plugins/warranty/:app_id': '/plugins/warranty/:app_id/forbidden',
    '/plugins/broadcast/:app_id': '/plugins/broadcast/:app_id/forbidden',
    // '/plugins/helpdesk/:app_id': '/plugins/helpdesk/:app_id/forbidden',
    '/plugins/xpay/:app_id': '/plugins/xpay/:app_id/forbidden',
    '/plugins/nest/:app_id': '/linkage/nest/',
    '/plugins/helpdesk/:app_id': '/plugins/helpdesk/:app_id/overview',
    '/plugins/dealer/:app_id': '/plugins/dealer/:app_id/forbidden',
    '/plugins/recipe/:app_id': '/plugins/recipe/:app_id/list',
    '/plugins/warranty/:app_id': '/plugins/warranty/:app_id/work-orders/extended-warranties',
    // '/plugins/broadcast/:app_id': '/plugins/broadcast/:app_id/add',
    // '/plugins/nest/:app_id': '/plugins/nest/:app_id/forbidden',
    // '/plugins/dealer/:app_id': '/plugins/dealer/:app_id/list',
    '/plugins': '/plugins/extensions',
    '/firmware': '/firmware/overview',
    '/alerts': '/alerts/overview',
    '/linkage': '/linkage/devices'
  })

  router.beforeEach((transition) => {
    if (!window.localStorage.getItem('accessToken')) {
      if (!isAccessAuthPage(transition.to.path)) {
        router.replace('/login')
      }
    }
    // throttle(transition)
    transition.next()
  })
}

export default configRouter
