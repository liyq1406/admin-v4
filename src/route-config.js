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
        }, 'auth')
      }
    },

    // 注册
    '/register-with-verifycode': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/register-with-verifycode'))
        }, 'auth')
      }
    },

    // 登录
    '/login': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/login'))
        }, 'auth')
      }
    },

    // 手机找回密码
    '/fetch-password': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/fetch-password'))
        }, 'auth')
      }
    },

    // 邮箱找回密码
    '/fetch-password-bymail': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/fetch-password-bymail'))
        }, 'auth')
      }
    },

    // 重设密码
    '/password-reset/:email/:verifycode': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/password-reset'))
        }, 'auth')
      }
    },

    // 激活企业成员邀请
    '/member-activate/:email': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/member-activate'))
        }, 'auth')
      }
    },

    // 企业成员邮箱激活
    '/email-activate/:email/:verifycode': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/email-activate'))
        }, 'auth')
      }
    },

    // 普通用户重设密码
    '/user-password-reset/:corp_id/:email/:verifycode': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/user-password-reset'))
        }, 'auth')
      }
    },

    // 普通用户邮箱激活
    '/user-email-activat/:corp_id/:email/:verifycode': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/user-email-activate'))
        }, 'auth')
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
        }, 'product')
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
            }, 'product')
          }
        },
        // 数据端点
        'data-point': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/data-point'))
            }, 'product')
          }
        },
        // 通知与告警
        'alert': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/alert'))
            }, 'product')
          }
        },
        // 设备互联
        'interconnection': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/interconnection'))
            }, 'product')
          }
        },
        // 固件升级
        'upgrade': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/upgrade'))
            }, 'product')
          }
        },
        // 微信导入
        'wechat': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/wechat'))
            }, 'product')
          }
        },
        // 数据转发
        'data-forward': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/data-forward'))
            }, 'product')
          }
        },
        // 虚拟设备
        'virtual-device': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/virtual-device'))
            }, 'product')
          }
        },
        // 默认子路由
        '/': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/overview'))
            }, 'product')
          }
        }
      }
    },
    // 设备详情
    '/products/:product_id/devices/:device_id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/product/device/details'))
        }, 'product')
      }
    },
    // 设备参数
    '/products/:product_id/devices/:device_id/params': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/product/device/params/index'))
        }, 'params')
      },
      subRoutes: {
        // 基本信息
        'basic-info': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/device/params/basic-info'))
            }, 'params')
          }
        },
        // 数据监控
        'data-monitoring': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/device/params/data-monitoring'))
            }, 'params')
          }
        },
        // 故障记录
        'fault-records': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/product/device/params/fault-records'))
            }, 'params')
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
            }, 'data')
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
        }, 'data')
      },
      subRoutes: {
        // 用户列表
        'list': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/user/list'))
            }, 'data')
          }
        },
        // 用户设置
        'usersetting': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/user/usersetting'))
            }, 'data')
          }
        }
      }
    },

    // 用户详情
    '/user/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/user/details'))
        }, 'user')
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
        }, 'diet')
      }
    },
    '/diet/ingredient/:id/edit': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/diet/ingredient/edit'))
        }, 'diet')
      }
    },
    '/diet/recipe/add': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/diet/recipe/add'))
        }, 'diet')
      }
    },
    '/diet/recipe/:id/edit': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/diet/recipe/edit'))
        }, 'diet')
      }
    },

    // 维保系统-工单管理
    '/warranty/work-orders': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/warranty/work-order/index'))
        }, 'warranty')
      },
      subRoutes: {
        // 延保工单列表
        'extended-warranties': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/warranty/work-order/extended-warranty/list'))
            }, 'warranty')
          }
        },
        // 维修工单列表
        'repair': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/warranty/work-order/repair/list'))
            }, 'warranty')
          }
        }
      }
    },
    // 维保系统-延保工单详情
    '/warranty/work-orders/extended-warranties/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/warranty/work-order/extended-warranty/details'))
        }, 'warranty')
      }
    },
    // 维保系统-维修工单详情
    '/warranty/work-orders/repair/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/warranty/work-order/repair/details'))
        }, 'warranty')
      }
    },
    // 维保系统-帐号列表
    '/warranty/accounts': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/warranty/account/list'))
        }, 'warranty')
      }
    },
    // 维保系统-帐号详情
    '/warranty/accounts/:id': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/warranty/account/details'))
        }, 'warranty')
      }
    },
    // 维保系统-客服详情
    '/warranty/accounts/:account_id/staffs/:id': {
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
    '/products/:product_id/devices/:device_id/params': '/products/:product_id/devices/:device_id/params/basic-info',
    '/data': '/data/tables',
    '/statistic': '/statistic/products',
    '/settings': '/settings/auth',
    '/users': '/users/list',
    '/diet': '/diet/recipe',
    '/warranty/work-orders': '/warranty/work-orders/extended-warranties',
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
