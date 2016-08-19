import api from 'api'
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

    '/account': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/account/index'))
        }, 'admin')
      },
      subRoutes: {
        // 帐户信息
        'info': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/account/info'))
            }, 'admin')
          }
        },
        // 成员管理
        'members': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/account/members'))
            }, 'admin')
          }
        },
        // 成员详情
        'members/:id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/account/members/details'))
            }, 'admin')
          }
        },
        // 授权管理
        'authorize': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/account/authorize'))
            }, 'admin')
          }
        }
      }
    },

    '/dev': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/dev/index'))
        }, 'admin')
      },
      subRoutes: {
        // -------------------------产品开发-------------------------
        // 创建产品
        'products/create': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/product/create'))
            }, 'admin')
          }
        },
        // 产品信息
        'products/:id/info': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/product/info'))
            }, 'admin')
          }
        },
        'products/:id/info/record': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/product/info/add-record'))
            }, 'admin')
          }
        },
        // 导入记录
        'products/:id/info/list/:import_id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/product/info/record-list'))
            }, 'admin')
          }
        },
        // 设备调试
        'products/:id/debug': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/product/debug'))
            }, 'admin')
          }
        },
        // 设备授权
        'products/:id/authorize': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/product/authorize'))
            }, 'admin')
          }
        },
        // 虚拟设备
        'products/:id/virtual-devices': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/product/virtual-devices'))
            }, 'admin')
          }
        },
        // 告警管理
        'products/:id/alert': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/product/alert'))
            }, 'admin')
          }
        },
        // 添加告警规则
        'products/:id/alert/add': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/product/alert/add'))
            }, 'admin')
          }
        },
        // 设置告警规则
        'products/:id/alert/edit/:rule_id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/product/alert/edit'))
            }, 'admin')
          }
        },
        // 数据接口
        'products/:id/data-forward': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/product/data-forward/list'))
            }, 'admin')
          }
        },
        // 添加规则
        'products/:id/data-forward/add': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/product/data-forward/add'))
            }, 'admin')
          }
        },
        // 修改规则
        'products/:id/data-forward/edit': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/product/data-forward/edit'))
            }, 'admin')
          }
        },
        // 设备联动
        'products/:id/linkage': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/product/linkage'))
            }, 'admin')
          }
        },

        // -------------------------设备授权-------------------------
        // 授权记录
        // 'authorize/list': {
        //   component (resolve) {
        //     require.ensure([], (require) => {
        //       resolve(require('./views/dev/authorize/list'))
        //     }, 'admin')
        //   }
        // },
        // -------------------------智能互联-------------------------
        // 微信互联
        'nest/wechat': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/nest/wechat'))
            }, 'admin')
          }
        },
        // 亚马逊互联
        'nest/amazon': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/nest/amazon'))
            }, 'admin')
          }
        },
        // Google互联
        'nest/google': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/nest/google'))
            }, 'admin')
          }
        },
        // philips互联
        'nest/philips': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/nest/philips'))
            }, 'admin')
          }
        },
        // 萤石互联
        'nest/ezviz': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/nest/ezviz'))
            }, 'admin')
          }
        },
        // 设备联动
        'nest/ifttt': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/nest/ifttt'))
            }, 'admin')
          }
        },
        // -------------------------固件管理-------------------------
        // 新建任务
        'firmware/add': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/firmware/add'))
            }, 'admin')
          }
        },
        // 升级列表
        'firmware/list': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/firmware/list'))
            }, 'admin')
          }
        },
        // 版本管理
        'firmware/manage': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/firmware/manage/index'))
            }, 'admin')
          },
          subRoutes: {
            'message': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/dev/firmware/manage/message'))
                }, 'admin')
              }
            },
            'update': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/dev/firmware/manage/update'))
                }, 'admin')
              }
            }
          }
        },
        // 上传新固件
        // 'firmware/update': {
        //   component (resolve) {
        //     require.ensure([], (require) => {
        //       resolve(require('./views/dev/firmware/manage/update'))
        //     }, 'admin')
        //   }
        // },
        // -------------------------应用管理-------------------------
        'apps/index': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/apps'))
            }, 'admin')
          }
          // subRoutes: {
          //   'customize': {
          //     component (resolve) {
          //       require.ensure([], (require) => {
          //         resolve(require('./views/dev/apps/customize'))
          //       }, 'admin')
          //     }
          //   },
          //   'extensions': {
          //     component (resolve) {
          //       require.ensure([], (require) => {
          //         resolve(require('./views/dev/apps/extensions'))
          //       }, 'admin')
          //     }
          //   }
          // }
        },
        // 'apps/upgrade': {
        //   component (resolve) {
        //     require.ensure([], (require) => {
        //       resolve(require('./views/dev/apps/upgrade'))
        //     }, 'admin')
        //   },
        //   subRoutes: {
        //     ':id': {
        //       component (resolve) {
        //         require.ensure([], (require) => {
        //           resolve(require('./views/dev/apps/upgrade-panel'))
        //         }, 'admin')
        //       }
        //     }
        //   }
        // },
        // -------------------------应用市场-------------------------
        // 应用市场
        'market/index': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/market'))
            }, 'admin')
          }
        },
        // -------------------------数据服务-------------------------
        // 数据表
        'data/tables': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/data/tables'))
            }, 'admin')
          }
        },
        // 数据快照
        'data/snapshot': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/data/snapshot'))
            }, 'admin')
          }
        },
        // 数据快照
        'data/snapshot/:product_id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/data/snapshot-details'))
            }, 'admin')
          }
        },
        // -------------------------硬件开发指南----------------------
        // -------------------------应用开发指南----------------------
        // -------------------------产测与工具-----------------------
        // -------------------------设置----------------------------
        // 邮件模板
        'settings/mail-templates': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/settings/mail-templates'))
            }, 'admin')
          }
        },

        // -------------------------在线购买-------------------------
        // 在线购买
        'shopping/cart': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/shopping/index'))
            }, 'admin')
          }
        },
        // 购买记录
        'shopping/orders': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/shopping/orders'))
            }, 'admin')
          }
        }
      }
    },

    '/operation': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/operation/index'))
        }, 'admin')
      },
      subRoutes: {
        // 概览
        '/overview': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/overview'))
            }, 'admin')
          }
        },

        // -------------------------产品管理-------------------------
        // 概览
        'products/:id/overview': {
          component (resolve) {
            require.ensure(['echarts'], (require) => {
              resolve(require('./views/operation/product/overview'))
            }, 'admin')
          }
        },
        // 设备管理
        'products/:id/devices': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/product/device/list'))
            }, 'admin')
          }
        },
        // 数据端点
        'products/:id/data-point': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/product/data-point'))
            }, 'admin')
          }
        },
        // 通知与告警
        'products/:id/alerts': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/product/alert'))
            }, 'admin')
          }
        },
        // 设备地图
        'products/:id/device-map': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/product/device-map'))
            }, 'admin')
          }
        },
        // 热力分布
        'products/:id/distributing': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/product/distributing'))
            }, 'admin')
          }
        },
        // 使用分析
        'products/:id/analysis': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/product/analysis'))
            }, 'admin')
          }
        },
        // // 扩展
        // 'products/:id/addon': {
        //   component (resolve) {
        //     require.ensure([], (require) => {
        //       resolve(require('./views/operation/product/addon'))
        //     }, 'admin')
        //   }
        // },
        // 固件升级
        'products/:id/upgrade': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/product/upgrade'))
            }, 'admin')
          }
        },
        // 微信导入
        'products/:id/wechat': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/product/wechat'))
            }, 'admin')
          }
        },
        // 上下线记录
        'products/:product_id/records': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/product/device/records'))
            }, 'admin')
          }
        },
        // 设备详情
        'products/:product_id/devices/:device_id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/product/device/index'))
            }, 'admin')
          },
          subRoutes: {
            // 设备信息
            'info': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/product/device/info'))
                }, 'admin')
              }
            },
            // 历史数据
            'history': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/product/device/history'))
                }, 'admin')
              }
            },
            // 告警信息
            'alerts': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/product/device/alerts'))
                }, 'admin')
              }
            },
            // 远程诊断
            'diagnose': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/product/device/diagnose'))
                }, 'admin')
              }
            },
            // 用户信息
            'users': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/product/device/users'))
                }, 'admin')
              }
            },
            // 维保记录
            'warranty': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/product/device/warranty'))
                }, 'admin')
              }
            },
            // 经销商
            'dealers': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/product/device/dealers'))
                }, 'admin')
              }
            }
          }
        },

        // 插件管理
        'plugins': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/index'))
            }, 'admin')
          },
          subRoutes: {
            // 扩展插件
            'extensions': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/plugin/extensions'))
                }, 'admin')
              }
            },
            // 自定义插件
            'customize': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/plugin/customize'))
                }, 'admin')
              }
            }
          }
        },
        // iOS应用
        'plugins/ios/:id/settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/ios/settings'))
            }, 'admin')
          }
        },
        // 安卓应用
        'plugins/android/:id/settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/android/settings'))
            }, 'admin')
          }
        },
        'plugins/android/:id/version': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/android/version'))
            }, 'admin')
          }
        },
        // 微信应用
        'plugins/wechat/:id/settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/wechat/settings'))
            }, 'admin')
          }
        },
        // web应用
        'plugins/web/:id/settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/web/settings'))
            }, 'admin')
          }
        },

        'plugins/broadcast/:app_id/add': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/broadcast/form'))
            }, 'admin')
          }
        },
        'plugins/broadcast/:app_id/list': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/broadcast/list'))
            }, 'admin')
          }
        },
        // 推送详情
        'plugins/broadcast/:app_id/list/:id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/broadcast/details'))
            }, 'admin')
          }
        },
        // 编辑推送
        'plugins/broadcast/:app_id/list/:id/update': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/broadcast/form'))
            }, 'admin')
          }
        },
        // 禁止访问
        'plugins/broadcast/:app_id/forbidden': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/broadcast/forbidden'))
            }, 'admin')
          }
        },

        // Google nest
        'plugins/nest/:app_id/forbidden': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/nest/forbidden'))
            }, 'admin')
          }
        },

        // 用户反馈
        'plugins/helpdesk/:app_id/overview': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/helpdesk/overview'))
            }, 'admin')
          }
        },
        'plugins/helpdesk/:app_id/issues': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/helpdesk/issues'))
            }, 'admin')
          },
          subRoutes: {
            ':id': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/plugin/helpdesk/issue-details'))
                }, 'admin')
              }
            }
          }
        },
        // 禁止访问
        'plugins/helpdesk/:app_id/forbidden': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/helpdesk/forbidden'))
            }, 'admin')
          }
        },

        // 经销商管理
        'plugins/dealer/:app_id/list': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/dealer/list'))
            }, 'admin')
          }
        },
        // 添加经销商
        'plugins/dealer/:app_id/add': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/dealer/add'))
            }, 'admin')
          }
        },
        // 编辑经销商
        'plugins/dealer/:app_id/edit/:id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/dealer/add'))
            }, 'admin')
          }
        },
        // 经销商详情
        'plugins/dealer/:app_id/list/:dealer_id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/dealer/details'))
            }, 'admin')
          }
        },
        // 销售详情
        'plugins/dealer/:app_id/list/:dealer_id/sales/:sale_id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/dealer/sale-details'))
            }, 'admin')
          }
        },
        // 禁止访问
        'plugins/dealer/:app_id/forbidden': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/dealer/forbidden'))
            }, 'admin')
          }
        },

        // 支付网关
        'plugins/xpay/:app_id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/xpay/index'))
            }, 'admin')
          }
        },
        // 禁止访问
        'plugins/xpay/:app_id/forbidden': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/xpay/forbidden'))
            }, 'admin')
          }
        },

        // -------------------------告警服务-------------------------
        // 告警记录
        'alerts/record': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/alert/record'))
            }, 'admin')
          }
        },
        'alerts/detail/:id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/alert/detail/index'))
            }, 'admin')
          },
          subRoutes: {
            // 告警历史
            'history': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/alert/detail/history'))
                }, 'admin')
              }
            },
            // 维保记录
            'warranty': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/alert/detail/warranty'))
                }, 'admin')
              }
            }
          }
        },
        // 规则设置
        'alerts/settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/alert/settings'))
            }, 'admin')
          }
        },

        // 告警分析
        'alerts/analysis': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/alert/analysis'))
            }, 'admin')
          }
        },

        // 告警分析详情
        'alerts/analysis/:id/:product_id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/alert/analysis-detail'))
            }, 'admin')
          }
        },

        // 热力分布
        'alerts/heat': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/alert/heat-distribution'))
            }, 'admin')
          }
        },

        // -------------------------用户管理-------------------------
        // 概览
        'users/overview': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/user/overview'))
            }, 'admin')
          }
        },
        // 用户列表
        'users/list': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/user/list'))
            }, 'admin')
          }
        },
        // 大客户管理
        'users/major-clients': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/user/major-clients'))
            }, 'admin')
          }
        },
        // 大客户详情
        'users/major-clients/:id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/user/major-details/index'))
            }, 'admin')
          },
          subRoutes: {
            // 设备列表
            'devices': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/user/major-details/device-list'))
                }, 'admin')
              }
            },
            // 经销商
            'dealers': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/user/major-details/dealers'))
                }, 'admin')
              }
            }
          }
        },
        // 用户设置
        'users/settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/user/settings'))
            }, 'admin')
          }
        },
        // 人群画像
        'users/portrait': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/user/portrait/index'))
            }, 'admin')
          },
          subRoutes: {
            'os': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/user/portrait/os'))
                }, 'admin')
              }
            },
            'model': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/user/portrait/model'))
                }, 'admin')
              }
            }
          }
        },
        // 用户行为分析
        'users/analysis': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/user/analysis'))
            }, 'admin')
          }
        },
        // 用户详情
        'users/details/:id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/user/detail/index'))
            }, 'admin')
          },
          subRoutes: {
            // 设备列表
            'devices': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/user/detail/device-list'))
                }, 'admin')
              }
            },
            // 维保信息
            'warranty': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/user/detail/warranty'))
                }, 'admin')
              }
            },
            // 反馈记录
            'issues': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/user/detail/issues'))
                }, 'admin')
              }
            }
          }
        },

        // -------------------------系统设置-------------------------
        // 授权管理
        'settings/auth': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/settings/auth'))
            }, 'admin')
          }
        },
        // 成员管理
        'settings/members': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/settings/members'))
            }, 'admin')
          }
        },
        // 帐号信息
        'settings/account': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/settings/account'))
            }, 'admin')
          }
        },

        // 饮食管理
        'plugins/recipe/:app_id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/recipe/index'))
            }, 'admin')
          },
          subRoutes: {
            // 菜谱管理
            'list': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/plugin/recipe/recipe/index'))
                }, 'admin')
              }
            },
            // 食材管理
            'ingredient': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/plugin/recipe/ingredient/index'))
                }, 'admin')
              }
            }
          }
        },
        // 禁止访问
        'plugins/recipe/:app_id/forbidden': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/recipe/forbidden'))
            }, 'admin')
          }
        },
        'plugins/recipe/:app_id/ingredient/add': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/recipe/ingredient/add'))
            }, 'admin')
          }
        },
        'plugins/recipe/:app_id/ingredient/:id/edit': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/recipe/ingredient/edit'))
            }, 'admin')
          }
        },
        'plugins/recipe/:app_id/add': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/recipe/recipe/add'))
            }, 'admin')
          }
        },
        'plugins/recipe/:app_id/:id/edit': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/recipe/recipe/edit'))
            }, 'admin')
          }
        },

        // -------------------------智能维保-------------------------
        // 概览
        'plugins/warranty/:app_id/overview': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/warranty/overview'))
            }, 'admin')
          }
        },
        // 延保工单列表
        'plugins/warranty/:app_id/heat': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/warranty/heat-distribution'))
            }, 'admin')
          }
        },
        // 延保工单列表
        'plugins/warranty/:app_id/work-orders/extended-warranties': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/warranty/work-order/extended-warranty/list'))
            }, 'admin')
          }
        },
        // 维修工单列表
        'plugins/warranty/:app_id/work-orders/repair': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/warranty/work-order/repair/list'))
            }, 'admin')
          }
        },
        // 网点管理
        'plugins/warranty/:app_id/accounts': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/warranty/account/list'))
            }, 'admin')
          }
        },
        // 禁止访问
        'plugins/warranty/:app_id/forbidden': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/warranty/forbidden'))
            }, 'admin')
          }
        },
        // 维保系统-延保工单详情
        'plugins/warranty/:app_id/work-orders/extended-warranties/:id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/warranty/work-order/extended-warranty/details'))
            }, 'admin')
          }
        },
        // 维保系统-维修工单详情
        'plugins/warranty/:app_id/work-orders/repair/:id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/warranty/work-order/repair/details'))
            }, 'admin')
          }
        },
        // 网点详情
        'plugins/warranty/:app_id/accounts/:id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/warranty/account/details'))
            }, 'admin')
          }
        },
        // 网点-客服详情
        'plugins/warranty/:app_id/accounts/:account_id/staffs/:id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/warranty/account/staff-details'))
            }, 'admin')
          }
        },

        // 设备参数
        // TODO 废弃？
        'device-params': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/device-params/index'))
            }, 'admin')
          }
        },
        // 设备参数详情
        'device-params/:product_id/:device_id/:mac': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/device-params/details'))
            }, 'admin')
          },
          subRoutes: {
            // 基本信息
            'basic-info': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/device-params/basic-info'))
                }, 'admin')
              }
            },
            // 数据监控
            'data-monitoring': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/device-params/data-monitoring'))
                }, 'admin')
              }
            },
            // 故障记录
            'fault-records': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/device-params/fault-records'))
                }, 'admin')
              }
            }
          }
        }
      }
    }
  })

  // 重定向
  router.redirect({
    '/': '/login',
    '/operation': '/operation/overview',
    '/operation/products/:id': '/operation/products/:id/overview',
    '/operation/products/:product_id/devices/:device_id': '/operation/products/:product_id/devices/:device_id/info',
    '/operation/device-params/:product_id/:device_id/:mac': '/operation/device-params/:product_id/:device_id/:mac/basic-info',
    '/operation/data': '/operation/data/tables',
    '/operation/statistic': '/operation/statistic/products',
    '/operation/settings': '/operation/settings/auth',
    '/operation/users': '/operation/users/overview',
    '/operation/users/details/:id': '/operation/users/details/:id/devices',
    '/operation/users/major-clients/:id': '/operation/users/major-clients/:id/devices',
    '/operation/plugins/android/:id': '/operation/plugins/android/:id/settings',
    // '/operation/plugins/recipe/:app_id': '/operation/plugins/recipe/:app_id/forbidden',
    // '/operation/plugins/warranty/:app_id': '/operation/plugins/warranty/:app_id/forbidden',
    // '/operation/plugins/broadcast/:app_id': '/operation/plugins/broadcast/:app_id/forbidden',
    // '/operation/plugins/helpdesk/:app_id': '/operation/plugins/helpdesk/:app_id/forbidden',
    '/operation/plugins/xpay/:app_id': '/operation/plugins/xpay/:app_id/forbidden',
    // '/operation/plugins/nest/:app_id': '/operation/plugins/nest/:app_id/forbidden',
    // '/operation/plugins/dealer/:app_id': '/operation/plugins/dealer/:app_id/forbidden',
    '/operation/plugins/helpdesk/:app_id': '/operation/plugins/helpdesk/:app_id/overview',
    '/operation/plugins/recipe/:app_id': '/operation/plugins/recipe/:app_id/list',
    '/operation/plugins/warranty/:app_id': '/operation/plugins/warranty/:app_id/work-orders/extended-warranties',
    '/operation/plugins/broadcast/:app_id': '/operation/plugins/broadcast/:app_id/add',
    '/operation/plugins/dealer/:app_id': '/operation/plugins/dealer/:app_id/list',
    '/operation/plugins': '/operation/plugins/extensions',
    '/operation/firmware': '/operation/firmware/overview',
    '/operation/alerts': '/operation/alerts/record',
    '/operation/alerts/detail/:id': '/operation/alerts/detail/:id/history',
    '/operation/users/portrait': '/operation/users/portrait/os'
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

  /**
   * 判断当前页面是否需要apptoken
   * @param  {[type]} (transition [description]
   * @return {[type]}             [description]
   */
  // apptoken过期时间 单位小时 可以输入小数
  const INVALIDTIME = 1 // (小时)
  router.beforeEach((transition) => {
    // 目标路径
    // var path = transition.to.path
    // 当前页面是否需要apptoken的标志位 默认false
    var thisPathNeedAppToken = false
    // 计算当前页面是否需要apptoken的标志位
    if (transition.to.params.app_id) {
      thisPathNeedAppToken = true
    }
    // transition.next()
    if (thisPathNeedAppToken) { // 当前目标路径需要apptoken
      // appToken是否过期标志位
      var appId = transition.to.params.app_id
      var pluginsToken = {}
      if (window.localStorage.pluginsToken) {
        pluginsToken = JSON.parse(window.localStorage.pluginsToken)
      }
      var appTokenInvalidTime = pluginsToken[appId] && pluginsToken[appId].appTokenInvalidTime - 0
      var appTokenValid = appTokenInvalidTime > +new Date()
      if (appTokenValid) { // appToken未过期逻辑
        transition.next()
      } else { // appToken过期
        var params = {
          'app_id': appId
        }
        api.plugin.getAppToKen(params).then((res) => {
          var params = {
            appTokenInvalidTime: +new Date() + (1000 * 60 * 60) * INVALIDTIME,
            token: res.data.access_token,
            app_id: res.data.app_id
          }
          // 重置appToken过期时间
          pluginsToken[appId] = params
          window.localStorage.pluginsToken = JSON.stringify(pluginsToken)
          // window.localStorage[appId + 'AppToken'] = JSON.stringify(params)
          transition.next()
        }).catch((err) => {
          router.app.handleError(err)
          if (transition.from.path) { // 判断有无上一个页面 有的话返回上一个页面 没有的话跳回概览页
            router.replace(transition.from.path)
          } else {
            router.replace('/dashboard')
          }
        })
      }
    } else { // 当前目标路径不在数组内 不需要apptoken
      transition.next()
    }
  })
}

export default configRouter
