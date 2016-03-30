import api from './api';

/**
 * 判断路由是否为非管理界面页面
 * @param  {String}  path 路由
 * @return {Boolean}
 */
let isInAuthPage = function (path) {
  return ['/login', '/register', '/fetch-password', '/fetch-password-bymail'].indexOf(path) >= 0 || path.indexOf('/member-activate') >= 0 || path.indexOf('/email-activate') >= 0 || path.indexOf('/password-reset') >= 0 || path.indexOf('/user-email-activate') >= 0 || path.indexOf('/user-password-reset') >= 0;
};

let configRouter = (router) => {

  /**
   * 路由地址映射
   * 注：使用`require.ensure`并作同一块名称声明的路由最终会打包在同一文件中
   *
   * 比如注册与登录这两个路由：
   *
   * // 注册
   * '/register': {
   *   component: function (resolve) {
   *     require.ensure([], function (require) {
   *       resolve(require('./views/register.vue'));
   *     }, 'auth');
   *   }
   * },
   *
   * // 登录
   * '/login': {
   *   component: function (resolve) {
   *     require.ensure([], function (require) {
   *       resolve(require('./views/login.vue'));
   *     }, 'auth');
   *   }
   * },
   *
   * 最终会打包在 `auth.js` 这个文件中
   */
  router.map({
    // 404
    '*': {
      component: require('./views/not-found.vue')
    },

    // 禁止访问
    '/forbidden': {
      component: require('./views/forbidden.vue')
    },

    // 注册
    '/register': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/register.vue'));
        }, 'auth');
      }
    },

    // 登录
    '/login': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/login.vue'));
        }, 'auth');
      }
    },

    // 手机找回密码
    '/fetch-password': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/fetch-password.vue'));
        }, 'auth');
      }
    },

    // 邮箱找回密码
    '/fetch-password-bymail': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/fetch-password-bymail.vue'));
        }, 'auth');
      }
    },

    // 重设密码
    '/password-reset/:email/:verifycode': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/password-reset.vue'));
        }, 'auth');
      }
    },

    // 激活企业成员邀请
    '/member-activate/:email': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/member-activate.vue'));
        }, 'auth');
      }
    },

    // 企业成员邮箱激活
    '/email-activate/:email/:verifycode': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/email-activate.vue'));
        }, 'auth');
      }
    },

    // 普通用户重设密码
    '/user-password-reset/:corp_id/:email/:verifycode': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/user-password-reset.vue'));
        }, 'auth');
      }
    },

    // 普通用户邮箱激活
    '/user-email-activate/:corp_id/:email/:verifycode': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/user-email-activate.vue'));
        }, 'auth');
      }
    },

    // 概览
    '/dashboard': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/dashboard.vue'));
        }, 'dashboard');
      }
    },

    // 产品管理
    '/product/create': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/product/create.vue'));
        }, 'product');
      }
    },
    // 产品详情
    '/products/:id': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/product/index.vue'));
        }, 'product');
      },
      name: 'products',
      subRoutes: {
        // 概览
        'overview': {
          component: function (resolve) {
            require.ensure(['echarts'], function (require) {
              resolve(require('./views/product/overview.vue'));
            }, 'product');
          }
        },
        // 设备管理
        'devices': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/product/device/list.vue'));
            }, 'product');
          }
        },
        // 数据端点
        'data-point': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/product/data-point.vue'));
            }, 'product');
          }
        },
        // 通知与告警
        'alert': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/product/alert.vue'));
            }, 'product');
          }
        },
        // 设备互联
        'interconnection': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/product/interconnection.vue'));
            }, 'product');
          }
        },
        // 固件升级
        'upgrade': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/product/upgrade.vue'));
            }, 'product');
          }
        },
        // 微信导入
        'wechat': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/product/wechat.vue'));
            }, 'product');
          }
        },
        // 设备数据转发
        'data-forward': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/product/data-forward.vue'));
            }, 'product');
          }
        },
        // 虚拟设备
        'virtual-device': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/product/virtual-device.vue'));
            }, 'product');
          }
        },
        // 默认子路由
        '/': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/product/overview.vue'));
            }, 'product');
          }
        }
      }
    },
    // 设备详情
    '/products/:product_id/devices/:device_id': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/product/device/details.vue'));
        }, 'product');
      }
    },

    // 应用管理
    '/apps': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/app/index.vue'));
        }, 'apps');
      }
    },
    // 微信应用查看
    '/apps/wechat/:id': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/app/wechat/index.vue'));
        }, 'apps');
      },
      subRoutes: {
        // 修改
        'update': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/app/wechat/update.vue'));
            }, 'data');
          }
        },
        'manage': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/app/wechat/manage.vue'));
            }, 'data');
          }
        }
      }
    },

    // 告警服务
    '/alerts': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/alert/index.vue'));
        }, 'alert');
      }
    },

    // 数据管理
    '/data': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/data/index.vue'));
        }, 'data');
      },
      subRoutes: {
        // 数据表
        'tables': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/data/tables.vue'));
            }, 'data');
          }
        }/* ,
        // api
        'api': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/data/api.vue'));
            }, 'data');
          }
        }
        */
      }
    },
    /*
    // 数据管理介绍
    '/data/intro': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/data/intro.vue'));
        }, 'data');
      }
    },
    */
    // 数据表详情
    '/data/tables/:name': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/data/details.vue'));
        }, 'data');
      }
    },

    // 用户管理
    '/users': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/user/index.vue'));
        }, 'data');
      },
      subRoutes: {
        // 用户列表
        'list': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/user/list.vue'));
            }, 'data');
          }
        },
        // 用户设置
        'usersetting': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/user/usersetting.vue'));
            }, 'data');
          }
        }
      }
    },

    // 用户详情
    '/user/:id': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/user/details.vue'));
        }, 'user');
      }
    },

    // 统计分析
    '/statistic': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/statistic/index.vue'));
        }, 'statistic');
      },
      subRoutes: {
        // 产品统计
        'products': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/statistic/products.vue'));
            }, 'statistic');
          }
        },
        // 用户统计
        'users': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/statistic/users.vue'));
            }, 'statistic');
          }
        }
      }
    },

    // 系统设置
    '/settings': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/settings/index.vue'));
        }, 'settings');
      },
      subRoutes: {
        // 授权管理
        'auth': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/settings/auth.vue'));
            }, 'settings');
          }
          // subRoutes: {
          //   // 旧版V1
          //   // 'oldlist': {
          //   //   component: function (resolve) {
          //   //     require.ensure([], function (require) {
          //   //       resolve(require('./views/settings/oldlist.vue'));
          //   //     }, 'settings');
          //   //   }
          //   // },
          //   // 新版
          //   'auth': {
          //     component: function (resolve) {
          //       require.ensure([], function (require) {
          //         resolve(require('./views/settings/auth.vue'));
          //       }, 'settings');
          //     }
          //   }
          // }
        },
        // 成员管理
        'members': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/settings/members.vue'));
            }, 'settings');
          }
        },
        // 帐号信息
        'account': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/settings/account.vue'));
            }, 'settings');
          }
        },
        // 邮件模板
        'mail-templates': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/settings/mail-templates.vue'));
            }, 'settings');
          }
        }
      }
    },

    // 饮食管理
    '/diet': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/diet/index.vue'));
        }, 'diet');
      },
      subRoutes: {
        // 菜谱管理
        'recipe': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/diet/recipe/index.vue'));
            }, 'diet');
          }
        },
        // 食材管理
        'ingredient': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/diet/ingredient/index.vue'));
            }, 'diet');
          }
        }
      }
    },
    '/diet/ingredient/add': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/diet/ingredient/add.vue'));
        }, 'diet');
      }
    },
    '/diet/ingredient/:id/edit': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/diet/ingredient/edit.vue'));
        }, 'diet');
      }
    },
    '/diet/recipe/add': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/diet/recipe/add.vue'));
        }, 'diet');
      }
    },
    '/diet/recipe/:id/edit': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/diet/recipe/edit.vue'));
        }, 'diet');
      }
    }
  });

  // 重定向
  router.redirect({
    '/': '/dashboard',
    '/products/:id': '/products/:id/overview',
    '/data': '/data/tables',
    '/statistic': '/statistic/products',
    '/settings': '/settings/auth',
    '/users': '/users/list',
    '/diet': '/diet/recipe',
    '/apps/wechat/:id': '/apps/wechat/:id/update'
  });

  // 路由切换开始时执行
  router.beforeEach(function (transition) {
    var today = new Date().getTime();

    if (localStorage.accessToken) { // token存在
      if (today > localStorage.expireAt) { // token 过期
        if (isInAuthPage(transition.to.path)) {
          router.app.access = false;
        } else {
          localStorage.removeItem('accessToken');
          alert('页面连接已过期，请重新登录');
          router.go({path: '/login'});
          router.app.access = false;
          location.reload();
        }
        transition.next();
      } else { // token 没过期
        if (isInAuthPage(transition.to.path)) { // 切换到身份验证页面
          router.app.access = false;
        } else { // 切换到非身份验证页面
          router.app.access = true;
          api.corp.refreshToken(this).then(function () {
            // 获取产品列表
            api.product.getProducts().then(function (data) {
              if (__DEBUG__) {
                // console.log(data);
              }
              router.app.products = data;
            });

            // 获取当前用户信息
            var member_id = localStorage.getItem('member_id');
            api.corp.getMember(member_id).then(function (data) {
              if (__DEBUG__) {
                // console.log(data);
              }
              router.app.currUser = data;
            });
          });
        }
        transition.next();
      }
    } else { // token 不存在
      if (isInAuthPage(transition.to.path)) {
        router.app.access = false;
      } else {
        router.go({path: '/login'});
        router.app.access = false;
        // location.reload();
      }
      transition.next();
    }
  });

};

module.exports = configRouter;
