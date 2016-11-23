import api from 'api'
import getMessageQueue from 'src/utils/mq.js'
import { IS_DEMO } from 'consts/config'

/**
 * 判断路由是否为非管理界面页面
 * @param  {String}  path 路由
 * @return {Boolean}
 */
let isAccessAuthPage = (path) => {
  return ['/login', '/register', '/register-with-verifycode', '/fetch-password', '/fetch-password-bymail'].indexOf(path) >= 0 || path.indexOf('/heavy-buyer-login') >= 0 || path.indexOf('/dealer-login') >= 0 || path.indexOf('/member-activate') >= 0 || path.indexOf('/email-activate') >= 0 || path.indexOf('/password-reset') >= 0 || path.indexOf('/user-email-activate') >= 0 || path.indexOf('/user-password-reset') >= 0
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

    // 带验证码注册（已废弃，页面保留）
    // '/register-with-verifycode': {
    //   component (resolve) {
    //     require.ensure([], (require) => {
    //       resolve(require('./views/register-with-verifycode'))
    //     }, 'register-with-verifycode')
    //   }
    // },

    // 登录
    '/login': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/login'))
        }, 'login')
      }
    },

    // 登录
    '/auto-login': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/auto-login'))
        }, 'admin')
      }
    },

    // 大客户登录
    '/heavy-buyer-login/:heavyBuyerId': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/heavy-buyer-login'))
        }, 'heavy-buyer-login')
      }
    },
    // 经销商登录
    '/dealer-login/:dealerId': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/dealer-login'))
        }, 'dealer-login')
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

    // 帐号
    // ==================================================
    '/account': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/account/index'))
        }, 'account')
      },
      subRoutes: {
        // 帐户信息
        'info': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/account/info'))
            }, 'account')
          }
        },
        // 成员管理
        'members': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/account/members'))
            }, 'account')
          }
        },
        // 成员详情
        'members/:id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/account/members/details'))
            }, 'account')
          }
        },
        // 授权管理
        'authorize': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/account/authorize'))
            }, 'account')
          }
        },
        // 授权管理
        'security': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/account/security'))
            }, 'account')
          }
        },
        // 企业信息
        'corp': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/account/corp'))
            }, 'account')
          }
        }
      }
    },

    // 开发平台
    // ==================================================
    '/dev': {
      component (resolve) {
        require.ensure([], (require) => {
          resolve(require('./views/dev/index'))
        }, 'admin')
      },
      subRoutes: {
        // 首页
        'home': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/home'))
            }, 'admin')
          }
        },
        // -------------------------产品开发-------------------------
        // 添加产品
        'products/create': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/product/create'))
            }, 'admin')
          },
          subRoutes: {
            'guide': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/dev/product/create/guide'))
                }, 'admin')
              }
            },
            'baseinfo': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/dev/product/create/info'))
                }, 'admin')
              }
            },
            ':id/data-points': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/dev/product/create/data-points'))
                }, 'admin')
              }
            },
            ':id/completion': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/dev/product/create/completion'))
                }, 'admin')
              }
            }
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
        // 产品上下线记录
        'products/:id/info/online-offline-records': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/product/info/online-offline-records'))
            }, 'admin')
          }
        },
        // 编辑产品信息
        'products/:id/info/edit': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/product/info/edit/index'))
            }, 'admin')
          },
          subRoutes: {
            'form': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/dev/product/info/edit/form'))
                }, 'admin')
              }
            },
            'field': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/dev/product/info/edit/field'))
                }, 'admin')
              }
            },
            'qrcode': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/dev/product/info/edit/qrcode'))
                }, 'admin')
              }
            }
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
        // 虚拟设备(功能没实现，暂时隐藏 2016-09-20)
        // 'products/:id/virtual-devices': {
        //   component (resolve) {
        //     require.ensure([], (require) => {
        //       resolve(require('./views/dev/product/virtual-devices'))
        //     }, 'admin')
        //   }
        // },
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
        // 数据端点
        'products/:id/data-point': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/product/data-point'))
            }, 'admin')
          }
        },

        // 添加数据端点
        'products/:id/data-point/add/:addIndex': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/product/data-point/form'))
            }, 'admin')
          }
        },

        // 编辑数据端点
        'products/:id/data-point/edit/:dataPointId': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/product/data-point/form'))
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
        // 数据接口
        // 'products/:id/data-forward': {
        //   component (resolve) {
        //     require.ensure([], (require) => {
        //       resolve(require('./views/dev/product/data-forward/list'))
        //     }, 'admin')
        //   }
        // },
        // // 添加规则
        // 'products/:id/data-forward/add': {
        //   component (resolve) {
        //     require.ensure([], (require) => {
        //       resolve(require('./views/dev/product/data-forward/add'))
        //     }, 'admin')
        //   }
        // },
        // // 修改规则
        // 'products/:id/data-forward/edit': {
        //   component (resolve) {
        //     require.ensure([], (require) => {
        //       resolve(require('./views/dev/product/data-forward/edit'))
        //     }, 'admin')
        //   }
        // },

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
        // 设备联动
        'linkage/settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/linkage/settings'))
            }, 'admin')
          }
        },
        // 微信互联（暂时去掉）
        // 'nest/wechat': {
        //   component (resolve) {
        //     require.ensure([], (require) => {
        //       resolve(require('./views/dev/nest/wechat'))
        //     }, 'admin')
        //   }
        // },
        // 亚马逊互联
        'linkage/amazon': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/linkage/amazon'))
            }, 'admin')
          }
        },
        // Google互联
        'linkage/google': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/linkage/google'))
            }, 'admin')
          }
        },
        // philips互联
        'linkage/philips': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/linkage/philips'))
            }, 'admin')
          }
        },
        // 萤石互联
        'linkage/ezviz': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/linkage/ezviz'))
            }, 'admin')
          }
        },
        // 设备联动
        'linkage/ifttt': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/linkage/ifttt'))
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
        // 编辑版本
        'firmware/edit/:product_id/:id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/firmware/manage/edit'))
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
        },

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
              resolve(require('./views/dev/data/table/index'))
            }, 'admin')
          }
        },
        // 数据快照
        'data/snapshots': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/data/snapshot/index'))
            }, 'admin')
          }
        },
        // 数据快照详情
        'data/snapshots/:product_id/:rule_id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/data/snapshot/details'))
            }, 'admin')
          }
        },
        // 添加数据快照
        'data/snapshot/create': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/data/snapshot/create'))
            }, 'admin')
          }
        },
        // 编辑数据快照
        'data/snapshot/edit/:product_id/:rule_id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/data/snapshot/edit'))
            }, 'admin')
          }
        },
        // 统计规则
        'data/statistics-rule': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/data/statistics-rule'))
            }, 'admin')
          },
          subRoutes: {
            // 设备统计规则
            'device': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/dev/data/statistics-rule/device'))
                }, 'admin')
              }
            },
            // 产品规则
            'product': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/dev/data/statistics-rule/product'))
                }, 'admin')
              }
            },
            // 产品规则
            'add-to-field': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/dev/data/statistics-rule/add-to-field'))
                }, 'admin')
              }
            }
          }
        },
        // 添加统计规则
        'data/statistics-rule/device/add': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/data/statistics-rule/device/add'))
            }, 'admin')
          }
        },
        // 修改统计规则
        'data/statistics-rule/device/edit/:rule_id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/data/statistics-rule/device/edit'))
            }, 'admin')
          }
        },
        // 添加统计规则
        'data/statistics-rule/product/add': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/data/statistics-rule/product/add'))
            }, 'admin')
          }
        },
        // 修改统计规则
        'data/statistics-rule/product/edit/:rule_id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/data/statistics-rule/product/edit'))
            }, 'admin')
          }
        },
        // 数据转发
        'data/forward': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/data/forward/index'))
            }, 'admin')
          }
        },
        // 数据转发详情
        'data/forward/:productId/:forwardId': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/data/forward/details'))
            }, 'admin')
          }
        },
        // 添加数据转发
        'data/forward/create': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/data/forward/create'))
            }, 'admin')
          }
        },
        // 编辑数据转发
        'data/forward/edit/:productId/:forwardId': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/data/forward/edit'))
            }, 'admin')
          }
        },
        // -------------------------硬件开发指南----------------------
        // -------------------------应用开发指南----------------------
        // -------------------------产测与工具-----------------------
        // -------------------------设置----------------------------
        // 用户设置
        'settings/users': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/settings/users'))
            }, 'admin')
          }
        },
        // 邮件设置
        'settings/email': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/settings/email'))
            }, 'admin')
          },
          subRoutes: {
            // 自定义邮件模版
            '/customize': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/dev/settings/email/customize'))
                }, 'admin')
              }
            },
            // 云智易邮件模版
            '/template': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/dev/settings/email/template'))
                }, 'admin')
              }
            }
          }
        },

        // 短信设置
        'settings/message': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/settings/message'))
            }, 'admin')
          },
          subRoutes: {
            // 自定义邮件模版
            '/config': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/dev/settings/message/config'))
                }, 'admin')
              }
            },
            // 自定义运营商
            '/custom-carrier': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/dev/settings/message/custom-carrier'))
                }, 'admin')
              }
            }
          }
        },
        // 添加运营商
        'settings/message/add': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/settings/message/add'))
            }, 'admin')
          }
        },
        // 编辑运营商
        'settings/message/edit/:id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/settings/message/edit'))
            }, 'admin')
          }
        },
        // 标签管理
        'settings/tag': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/settings/tag'))
            }, 'admin')
          },
          subRoutes: {
            // 告警标签设置
            '/alert': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/dev/settings/tag/alert'))
                }, 'admin')
              }
            }
          }
        },

        // 新增图表
        'settings/views/source/add': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/settings/views/source/add'))
            }, 'admin')
          }
        },
        'settings/views/source/edit/:id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/settings/views/source/edit'))
            }, 'admin')
          }
        },

        // 视图自定义
        'settings/views': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/dev/settings/views'))
            }, 'admin')
          },
          subRoutes: {
            // 自定义概览
            '/overview': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/dev/settings/views/overview'))
                }, 'admin')
              }
            },
            // 自定义数据源
            '/source': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/dev/settings/views/source'))
                }, 'admin')
              }
            },
            // 自定义字段
            '/field': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/dev/settings/views/field/index'))
                }, 'admin')
              },
              subRoutes: {
                // 设备字段
                '/device': {
                  component (resolve) {
                    require.ensure([], (require) => {
                      resolve(require('./views/dev/settings/views/field/device'))
                    }, 'admin')
                  }
                },
                // 用户字段
                '/user': {
                  component (resolve) {
                    require.ensure([], (require) => {
                      resolve(require('./views/dev/settings/views/field/user'))
                    }, 'admin')
                  }
                },
                // 告警
                '/alert': {
                  component (resolve) {
                    require.ensure([], (require) => {
                      resolve(require('./views/dev/settings/views/field/alert'))
                    }, 'admin')
                  }
                },
                // 产品
                '/product': {
                  component (resolve) {
                    require.ensure([], (require) => {
                      resolve(require('./views/dev/settings/views/field/product'))
                    }, 'admin')
                  }
                },
                // 经销商
                '/dealer': {
                  component (resolve) {
                    require.ensure([], (require) => {
                      resolve(require('./views/dev/settings/views/field/dealer'))
                    }, 'admin')
                  }
                },
                // 维保
                '/warranty': {
                  component (resolve) {
                    require.ensure([], (require) => {
                      resolve(require('./views/dev/settings/views/field/warranty'))
                    }, 'admin')
                  }
                }
              }
            }
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

    // 运营平台
    // ==================================================
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
        // 告警信息
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
        // 产品分析
        'products/:id/analysis': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/product/analysis/index'))
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

        /* ************************* 大客户管理 ********************************/
        // 大客户管理(列表)
        'major-clients': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/major-clients'))
            }, 'admin')
          }
        },

        'major-client/add': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/major-clients/add'))
            }, 'admin')
          }
        },

        'major-client/edit/:id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/major-clients/edit'))
            }, 'admin')
          }
        },

        // 大客户详情
        'major-clients/:id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/major-clients/details/index'))
            }, 'admin')
          },
          subRoutes: {
            // 设备列表
            'device': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/major-clients/details/device'))
                }, 'admin')
              }
            },
            // 账户管理
            'account': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/major-clients/details/account'))
                }, 'admin')
              }
            },

            // 组织架构
            'organization': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/major-clients/details/organization'))
                }, 'admin')
              }
            },
            // 独立配置入口
            'config': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/major-clients/details/config'))
                }, 'admin')
              }
            }
          }
        },
        // 大客户-账户添加
        'major-clients/:id/account/add': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/major-clients/details/account-form'))
            }, 'admin')
          }
        },
        // 大客户-账户编辑
        'major-clients/:id/account/edit/:accountId': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/major-clients/details/account-form'))
            }, 'admin')
          }
        },

        // 快照分析
        'snapshots': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/snapshots'))
            }, 'admin')
          }
        },
        // 离线数据
        'settings/offline-data': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/settings/offline-data'))
            }, 'admin')
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

        // 菜谱管理
        // ------------------------------
        // 菜谱列表
        '/plugins/recipes/:app_id/recipes': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/recipes/recipe/list'))
            }, 'admin')
          }
        },
        // 添加菜谱
        '/plugins/recipes/:app_id/recipe/add/:type_value': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/recipes/recipe/add/add'))
            }, 'admin')
          }
        },
        // 编辑菜谱
        '/plugins/recipes/:app_id/recipes/:id/edit/:type_value': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/recipes/recipe/edit/index'))
            }, 'admin')
          },
          subRoutes: {
            'basic-info': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/plugin/recipes/recipe/edit/basic-info'))
                }, 'admin')
              }
            },
            // 步骤
            'step': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/plugin/recipes/recipe/edit/step'))
                }, 'admin')
              }
            },
            // 参数
            'parameter': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/plugin/recipes/recipe/edit/parameter'))
                }, 'admin')
              }
            },
            'devices': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/plugin/recipes/recipe/edit/devices'))
                }, 'admin')
              }
            }
          }
        },
        // 菜单列表
        '/plugins/recipes/:app_id/menus': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/recipes/menu/list'))
            }, 'admin')
          }
        },
        // 菜单列表
        '/plugins/recipes/:app_id/menu/add': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/recipes/menu/add'))
            }, 'admin')
          }
        },
        // 菜单列表
        '/plugins/recipes/:app_id/menus/:id/edit': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/recipes/menu/edit'))
            }, 'admin')
          }
        },
        // 类别列表
        '/plugins/recipes/:app_id/categories': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/recipes/category/list'))
            }, 'admin')
          }
        },
        // 类别二级列表
        '/plugins/recipes/:app_id/categories/:parent_id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/recipes/category/subs'))
            }, 'admin')
          }
        },
        '/plugins/recipes/:app_id/tags': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/recipes/tag/list'))
            }, 'admin')
          }
        },

        // 内容管理
        // ------------------------------
        // 文章列表
        '/plugins/content/:app_id/articles': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/content/article/index'))
            }, 'admin')
          }
        },
        // 添加文章
        '/plugins/content/:app_id/article/add': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/content/article/add'))
            }, 'admin')
          }
        },
        // 编辑文章
        '/plugins/content/:app_id/articles/:id/edit': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/content/article/edit'))
            }, 'admin')
          }
        },
        // 标签管理
        '/plugins/content/:app_id/tags': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/content/tag/list'))
            }, 'admin')
          }
        },

        // 运营位管理
        // ------------------------------
        // 运营位列表
        '/plugins/operateposition/:app_id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/operate-position/list'))
            }, 'admin')
          }
        },
        // 管理运营位
        '/plugins/operateposition/:app_id/stall/:id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/operate-position/details'))
            }, 'admin')
          }
        },
        // 运营位添加内容
        '/plugins/operateposition/:app_id/stall/:id/add/:contentType': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/operate-position/add'))
            }, 'admin')
          }
        },
        // 运营位编辑内容
        '/plugins/operateposition/:app_id/stall/:id/edit/:contentType/:contentId': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/operate-position/edit'))
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
        'plugins/helpdesk/:app_id/settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/helpdesk/settings'))
            }, 'admin')
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
        // 闪屏管理
        'plugins/splashwnd/:app_id/list': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/splashwnd/list'))
            }, 'admin')
          }
        },
        // 添加闪屏
        'plugins/splashwnd/:app_id/list/:selected_id/add': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/splashwnd/add'))
            }, 'admin')
          }
        },
        // 编辑闪屏
        'plugins/splashwnd/:app_id/list/:selected_id/edit/:id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/splashwnd/edit'))
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
        'plugins/dealer/:app_id/analysis': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/dealer/analysis'))
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
          },
          subRoutes: {
            // 设备
            '/devices': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/plugin/dealer/devices'))
                }, 'admin')
              }
            },
            // 入口配置
            '/config': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/plugin/dealer/config'))
                }, 'admin')
              }
            }
          }
        },
        // 添加销售记录
        'plugins/dealer/:app_id/list/:dealer_id/add': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/dealer/add-sale'))
            }, 'admin')
          }
        },
        // 编辑销售记录
        'plugins/dealer/:app_id/list/:dealer_id/edit/:sale_id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/dealer/add-sale'))
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
        // 经销商导入设备
        'plugins/dealer/:app_id/list/:dealer_id/import_devices': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/dealer/import-devices'))
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
        // 'alerts/heat': {
        //   component (resolve) {
        //     require.ensure([], (require) => {
        //       resolve(require('./views/operation/alert/heat-distribution'))
        //     }, 'admin')
        //   }
        // },

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
        // 人群画像
        'users/portrait': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/user/portrait/index'))
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

        // -------------------------智能维保-------------------------
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
        // 添加维修工单
        'plugins/warranty/:app_id/work-orders/repair/add': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/warranty/work-order/repair/add'))
            }, 'admin')
          }
        },
        // 编辑维修工单
        'plugins/warranty/:app_id/work-orders/repair/edit/:id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/warranty/work-order/repair/edit'))
            }, 'admin')
          }
        },
        // 维保设置
        'plugins/warranty/:app_id/settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/warranty/settings'))
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
        // 环境数据
        'plugins/airquality/:app_id': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/plugin/airquality'))
            }, 'admin')
          }
        },

        // 大客户系统设置
        'heavy-buyer-settings': {
          component (resolve) {
            require.ensure([], (require) => {
              resolve(require('./views/operation/heavy-buyer-settings/index'))
            }, 'admin')
          },
          subRoutes: {
            // 独立入口配置
            'entrance': {
              component (resolve) {
                require.ensure([], (require) => {
                  resolve(require('./views/operation/heavy-buyer-settings/entrance'))
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
    '/dev': '/dev/home',
    '/dev/products/create': '/dev/products/create/guide',
    '/dev/products/:id/info/edit': '/dev/products/:id/info/edit/form',
    '/dev/settings/views/field': '/dev/settings/views/field/device',

    '/operation': '/operation/overview',
    '/operation/products/:id': '/operation/products/:id/overview',
    '/operation/products/:product_id/devices/:device_id': '/operation/products/:product_id/devices/:device_id/info',
    '/operation/users': '/operation/users/overview',
    '/operation/users/details/:id': '/operation/users/details/:id/devices',
    '/operation/users/major-clients/:id': '/operation/users/major-clients/:id/devices',
    '/operation/plugins/android/:id': '/operation/plugins/android/:id/settings',
    '/operation/plugins/recipe/:app_id': '/operation/plugins/recipes/:app_id/recipes',
    // '/operation/plugins/warranty/:app_id': '/operation/plugins/warranty/:app_id/forbidden',
    // '/operation/plugins/broadcast/:app_id': '/operation/plugins/broadcast/:app_id/forbidden',
    // '/operation/plugins/helpdesk/:app_id': '/operation/plugins/helpdesk/:app_id/forbidden',
    '/operation/plugins/xpay/:app_id': '/operation/plugins/xpay/:app_id/forbidden',
    '/operation/plugins/splashwnd/:app_id': '/operation/plugins/splashwnd/:app_id/list',
    // '/operation/plugins/nest/:app_id': '/operation/plugins/nest/:app_id/forbidden',
    // '/operation/plugins/dealer/:app_id': '/operation/plugins/dealer/:app_id/forbidden',
    '/operation/plugins/content/:app_id': '/operation/plugins/content/:app_id/articles',
    '/operation/plugins/helpdesk/:app_id': '/operation/plugins/helpdesk/:app_id/overview',
    '/operation/plugins/recipes/:app_id/recipes/:id/edit/:type_value': '/operation/plugins/recipes/:app_id/recipes/:id/edit/:type_value/basic-info',
    '/operation/plugins/warranty/:app_id': '/operation/plugins/warranty/:app_id/work-orders/repair',
    '/operation/plugins/broadcast/:app_id': '/operation/plugins/broadcast/:app_id/add',
    '/operation/plugins/dealer/:app_id': '/operation/plugins/dealer/:app_id/list',
    '/operation/plugins/dealer/:app_id/list/:dealer_id': '/operation/plugins/dealer/:app_id/list/:dealer_id/devices',
    '/operation/plugins': '/operation/plugins/extensions',
    '/operation/alerts': '/operation/alerts/record',
    '/operation/alerts/detail/:id': '/operation/alerts/detail/:id/history',
    '/dev/firmware/manage': '/dev/firmware/manage/message',
    '/dev/settings/tag': '/dev/settings/tag/alert',
    '/operation/major-clients/:id': '/operation/major-clients/:id/device',
    '/operation/heavy-buyer-settings': '/operation/heavy-buyer-settings/entrance'
  })

  router.beforeEach((transition) => {
    if (!window.localStorage.getItem('accessToken')) {
      if (!isAccessAuthPage(transition.to.path)) {
        if (!IS_DEMO) {
          router.replace('/login')
        }
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
    if (transition.to.params && transition.to.params.app_id) {
      thisPathNeedAppToken = true
    }
    // transition.next()
    if (thisPathNeedAppToken) { // 当前目标路径需要apptoken
      // appToken是否过期标志位
      var appId = transition.to.params && transition.to.params.app_id
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
          var params = {
            appTokenInvalidTime: +new Date(),
            token: '',
            app_id: appId
          }
          // 重置appToken过期时间
          pluginsToken[appId] = params
          window.localStorage.pluginsToken = JSON.stringify(pluginsToken)
          transition.next()
          console.log(err)
          router.app.handleError(err)

          // if (transition.from.path) { // 判断有无上一个页面 有的话返回上一个页面 没有的话跳回概览页
          //   // router.replace(transition.from.path)
          //   transition.next()
          // } else {
          //   router.replace('/dashboard')
          // }
        })
      }
    } else { // 当前目标路径不在数组内 不需要apptoken
      transition.next()
    }
  })

  /**
   * 区分用户身份 确定页面访问权限
   * @param  {[type]} (transition [description]
   * @return {[type]}             [description]
   */
  router.beforeEach((transition) => {
    var reg = {
      2: /^\/operation/,
      3: /^\/dev/
    }
    var identity = {
      2: '运营人员',
      3: '开发人员'
    }
    var memberRole = window.localStorage.getItem('memberRole')
    if ((reg[2].test(transition.to.path) || reg[3].test(transition.to.path)) && (memberRole - 0 === 2 || memberRole - 0 === 3)) {
      if (reg[memberRole].test(transition.to.path)) {
        transition.next()
      } else {
        router.app.showNotice({
          type: 'error',
          content: `您是${identity[memberRole]}，您没有权限访问该页面！`
        })
        if (transition.from.path && reg[memberRole].test(transition.from.path)) {
          router.replace(transition.from.path)
        } else {
          router.replace('/dashboard')
        }
      }
    } else {
      transition.next()
    }
  })

  // 切换路由时清空图表渲染队列
  router.beforeEach((transition) => {
    let mq = getMessageQueue()
    mq.clear()
    transition.next()
  })
}

export default configRouter
