/**
 * 判断路由是否为非管理界面页面
 * @param  {String}  path 路由
 * @return {Boolean}
 */
let isAccessAuthPage = (path) => {
  return ['/login', '/register', '/register-with-verifycode', '/fetch-password', '/fetch-password-bymail'].indexOf(path) >= 0 || path.indexOf('/member-activate') >= 0 || path.indexOf('/email-activate') >= 0 || path.indexOf('/password-reset') >= 0 || path.indexOf('/user-email-activate') >= 0 || path.indexOf('/user-password-reset') >= 0
}

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

    // 应用管理
    '/apps': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/app/index'))
        }, 'admin')
      },
      subRoutes: {
        // 扩展插件
        'extend': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/app/extend'))
            }, 'admin')
          }
        },
        // 自定义插件
        'user_defined': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/app/application'))
            }, 'admin')
          }
        }
      }
    },
    // 微信应用查看
    '/apps/wechat/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/app/wechat/index'))
        }, 'admin')
      },
      subRoutes: {
        // 修改
        'update': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/app/wechat/update'))
            }, 'admin')
          }
        }
      }
    },

    // 告警服务
    '/alerts': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/alert/index'))
        }, 'admin')
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
        }
      }
    },

    // 数据表详情
    '/data/tables/:name': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/data/details'))
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
        'update': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/firmware/update'))
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
    '/diet': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/diet/index'))
        }, 'admin')
      },
      subRoutes: {
        // 菜谱管理
        'recipe': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/diet/recipe/index'))
            }, 'admin')
          }
        },
        // 食材管理
        'ingredient': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/diet/ingredient/index'))
            }, 'admin')
          }
        }
      }
    },
    '/diet/ingredient/add': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/diet/ingredient/add'))
        }, 'admin')
      }
    },
    '/diet/ingredient/:id/edit': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/diet/ingredient/edit'))
        }, 'admin')
      }
    },
    '/diet/recipe/add': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/diet/recipe/add'))
        }, 'admin')
      }
    },
    '/diet/recipe/:id/edit': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/diet/recipe/edit'))
        }, 'admin')
      }
    },

    // 维保系统-工单管理
    '/warranty': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/warranty/index'))
        }, 'admin')
      },
      subRoutes: {
        // 延保工单列表
        'work-orders/extended-warranties': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/warranty/work-order/extended-warranty/list'))
            }, 'admin')
          }
        },
        // 维修工单列表
        'work-orders/repair': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/warranty/work-order/repair/list'))
            }, 'admin')
          }
        },
        // 网点管理
        'accounts': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/warranty/account/list'))
            }, 'admin')
          }
        }
      }
    },
    // 维保系统-延保工单详情
    '/warranty/work-orders/extended-warranties/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/warranty/work-order/extended-warranty/details'))
        }, 'admin')
      }
    },
    // 维保系统-维修工单详情
    '/warranty/work-orders/repair/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/warranty/work-order/repair/details'))
        }, 'admin')
      }
    },
    // 网点详情
    '/warranty/accounts/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/warranty/account/details'))
        }, 'admin')
      }
    },
    // 网点-客服详情
    '/warranty/accounts/:account_id/staffs/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/warranty/account/staff-details'))
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
    '/diet': '/diet/recipe',
    '/warranty': '/warranty/work-orders/extended-warranties',
    '/apps/wechat/:id': '/apps/wechat/:id/update',
    '/apps': '/apps/extend',
    '/firmware': '/firmware/overview'
  })

  router.beforeEach((transition) => {
    if (!window.localStorage.getItem('accessToken')) {
      if (!isAccessAuthPage(transition.to.path)) {
        router.replace('/login')
      }
    }
    transition.next()
  })
}

export default configRouter
