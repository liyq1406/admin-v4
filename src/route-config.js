var api = require('./api');

var isInAuthPage = function (path) {
  return ['/login', '/register', '/fetch-password', '/fetch-password-bymail'].indexOf(path) >= 0 || path.indexOf('/member-activate') >= 0 || path.indexOf('/email-activate') >= 0 || path.indexOf('/password-reset') >= 0 || path.indexOf('/user-email-activate') >= 0 || path.indexOf('/user-password-reset') >= 0;
};

var configRouter = function (router) {
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

    // 重设密码
    '/user-password-reset/:corp_id/:email/:verifycode': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/user-password-reset.vue'));
        }, 'auth');
      }
    },

    // 激活成员邀请
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

    // 用户邮箱激活
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
    '/products/:id': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/product/index.vue'));
        }, 'product');
      },
      name: 'products',
      subRoutes: {
        'overview': {
          component: function (resolve) {
            require.ensure(['echarts'], function (require) {
              resolve(require('./views/product/overview.vue'));
            }, 'product');
          }
        },
        'devices': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/product/device/list.vue'));
            }, 'product');
          }
        },
        'data-point': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/product/data-point.vue'));
            }, 'product');
          }
        },
        'alert': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/product/alert.vue'));
            }, 'product');
          }
        },
        'interconnection': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/product/interconnection.vue'));
            }, 'product');
          }
        },
        'upgrade': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/product/upgrade.vue'));
            }, 'product');
          }
        },
        'virtual-device': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/product/virtual-device.vue'));
            }, 'product');
          }
        },
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
        'tables': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/data/tables.vue'));
            }, 'data');
          }
        },
        'api': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/data/api.vue'));
            }, 'data');
          }
        }
      }
    },
    '/data/intro': {
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('./views/data/intro.vue'));
        }, 'data');
      }
    },
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
          resolve(require('./views/user/list.vue'));
        }, 'user');
      }
    },
    '/users/:id': {
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
        'products': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/statistic/products.vue'));
            }, 'statistic');
          }
        },
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
        'auth': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/settings/auth.vue'));
            }, 'settings');
          }
        },
        'members': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/settings/members.vue'));
            }, 'settings');
          }
        },
        'account': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/settings/account.vue'));
            }, 'settings');
          }
        },
        'mail-templates': {
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('./views/settings/mail-templates.vue'));
            }, 'settings');
          }
        }
      }
    }
  });

  // 重定向
  router.redirect({
    '/': '/dashboard',
    '/products/:id': '/products/:id/overview',
    '/data': '/data/tables',
    '/statistic': '/statistic/products',
    '/settings': '/settings/auth'
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
