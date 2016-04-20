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
    '/user-email-activat/:corp_id/:email/:verifycode': {
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
        }, 'dashboard')
      }
    },

    // 产品管理
    '/product/create': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/product/create'))
        }, 'product.create')
      }
    },
    // 产品详情
    '/products/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/product/index'))
        }, 'product')
      },
      name: 'products',
      subRoutes: {
        // 概览
        'overview': {
          component (resolve) {
            require.ensure(['echarts'], (require) => {
              resolve(require('./views/product/overview'))
            }, 'product')
          }
        },
        // 设备管理
        'devices': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/device/list'))
            }, 'product.devices')
          }
        },
        // 数据端点
        'data-point': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/data-point'))
            }, 'product.data-point')
          }
        },
        // 通知与告警
        'alert': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/alert'))
            }, 'product.alert')
          }
        },
        // 固件升级
        'upgrade': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/upgrade'))
            }, 'product.upgrade')
          }
        },
        // 微信导入
        'wechat': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/wechat'))
            }, 'product.wechat')
          }
        },
        // 数据转发
        'data-forward': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/data-forward'))
            }, 'product.data-forward')
          }
        }
      }
    },
    // 设备详情
    '/products/:product_id/devices/:device_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/product/device/details'))
        }, 'device.details')
      }
    },
    // 设备参数
    '/products/:product_id/devices/:device_id/:mac/params': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/product/device/params/index'))
        }, 'device.params')
      },
      subRoutes: {
        // 基本信息
        'basic-info': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/device/params/basic-info'))
            }, 'device.params')
          }
        },
        // 数据监控
        'data-monitoring': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/device/params/data-monitoring'))
            }, 'device.params')
          }
        },
        // 故障记录
        'fault-records': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/device/params/fault-records'))
            }, 'device.params')
          }
        }
      }
    },

    // 应用管理
    '/apps': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/app/index'))
        }, 'apps')
      }
    },
    // 微信应用查看
    '/apps/wechat/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/app/wechat/index'))
        }, 'apps')
      },
      subRoutes: {
        // 修改
        'update': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/app/wechat/update'))
            }, 'apps')
          }
        }
      }
    },

    // 告警服务
    '/alerts': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/alert/index'))
        }, 'alert')
      }
    },

    // 数据管理
    '/data': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/data/index'))
        }, 'data')
      },
      subRoutes: {
        // 数据表
        'tables': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/data/tables'))
            }, 'data')
          }
        }
      }
    },

    // 数据表详情
    '/data/tables/:name': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/data/details'))
        }, 'data')
      }
    },

    // 用户管理
    '/users': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/user/index'))
        }, 'user')
      },
      subRoutes: {
        // 用户列表
        'list': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/user/list'))
            }, 'user')
          }
        },
        // 用户设置
        'settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/user/settings'))
            }, 'user.settings')
          }
        }
      }
    },

    // 用户详情
    '/user/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/user/details'))
        }, 'user.details')
      }
    },

    // 统计分析
    '/statistic': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/statistic/index'))
        }, 'statistic')
      },
      subRoutes: {
        // 产品统计
        'products': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/statistic/products'))
            }, 'statistic')
          }
        },
        // 用户统计
        'users': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/statistic/users'))
            }, 'statistic')
          }
        }
      }
    },

    // 系统设置
    '/settings': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/settings/index'))
        }, 'settings')
      },
      subRoutes: {
        // 授权管理
        'auth': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/settings/auth'))
            }, 'settings')
          }
        },
        // 成员管理
        'members': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/settings/members'))
            }, 'settings')
          }
        },
        // 帐号信息
        'account': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/settings/account'))
            }, 'settings')
          }
        },
        // 邮件模板
        'mail-templates': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/settings/mail-templates'))
            }, 'settings')
          }
        }
      }
    },

    // 饮食管理
    '/diet': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/diet/index'))
        }, 'diet')
      },
      subRoutes: {
        // 菜谱管理
        'recipe': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/diet/recipe/index'))
            }, 'diet')
          }
        },
        // 食材管理
        'ingredient': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/diet/ingredient/index'))
            }, 'diet')
          }
        }
      }
    },
    '/diet/ingredient/add': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/diet/ingredient/add'))
        }, 'diet.operations')
      }
    },
    '/diet/ingredient/:id/edit': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/diet/ingredient/edit'))
        }, 'diet.operations')
      }
    },
    '/diet/recipe/add': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/diet/recipe/add'))
        }, 'diet.operations')
      }
    },
    '/diet/recipe/:id/edit': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/diet/recipe/edit'))
        }, 'diet.operations')
      }
    },

    // 维保系统-工单管理
    '/warranty/:appid': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/warranty/index'))
        }, 'warranty')
      },
      subRoutes: {
        // 延保工单列表
        'work-orders/extended-warranties': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/warranty/work-order/extended-warranty/list'))
            }, 'warranty')
          }
        },
        // 维修工单列表
        'work-orders/repair': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/warranty/work-order/repair/list'))
            }, 'warranty')
          }
        },
        // 网点管理
        'accounts': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/warranty/account/list'))
            }, 'warranty')
          }
        }
      }
    },
    // 维保系统-延保工单详情
    '/warranty/:appid/work-orders/extended-warranties/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/warranty/work-order/extended-warranty/details'))
        }, 'warranty')
      }
    },
    // 维保系统-维修工单详情
    '/warranty/:appid/work-orders/repair/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/warranty/work-order/repair/details'))
        }, 'warranty')
      }
    },
    // 维保系统-帐号详情
    '/warranty/:appid/accounts/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/warranty/account/details'))
        }, 'warranty')
      }
    },
    // 维保系统-客服详情
    '/warranty/:appid/accounts/:account_id/staffs/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/warranty/account/staff-details'))
        }, 'warranty')
      }
    }
  })

  // 重定向
  router.redirect({
    '/': '/login',
    '/products/:id': '/products/:id/overview',
    '/products/:product_id/devices/:device_id/:mac/params': '/products/:product_id/devices/:device_id/:mac/params/basic-info',
    '/data': '/data/tables',
    '/statistic': '/statistic/products',
    '/settings': '/settings/auth',
    '/users': '/users/list',
    '/diet': '/diet/recipe',
    '/warranty/:appid': '/warranty/:appid/work-orders/extended-warranties',
    '/apps/wechat/:id': '/apps/wechat/:id/update'
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
