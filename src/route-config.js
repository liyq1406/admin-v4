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
      component: require('./views/register.vue')
    },

    // 登录
    '/login': {
      component: require('./views/login.vue')
    },

    // 手机找回密码
    '/fetch-password': {
      component: require('./views/fetch-password.vue')
    },

    // 邮箱找回密码
    '/fetch-password-bymail': {
      component: require('./views/fetch-password-bymail.vue')
    },

    // 重设密码
    '/password-reset/:email/:verifycode': {
      component: require('./views/password-reset.vue')
    },

    // 重设密码
    '/user-password-reset/:corp_id/:email/:verifycode': {
      component: require('./views/user-password-reset.vue')
    },

    // 激活成员邀请
    '/member-activate/:email': {
      component: require('./views/member-activate.vue')
    },

    // 企业成员邮箱激活
    '/email-activate/:email/:verifycode': {
      component: require('./views/email-activate.vue')
    },

    // 用户邮箱激活
    '/user-email-activate/:corp_id/:email/:verifycode': {
      component: require('./views/user-email-activate.vue')
    },

    // 概览
    '/dashboard': {
      component: require('./views/dashboard.vue')
    },

    // 产品管理
    '/product/create': {
      component: require('./views/product/create.vue')
    },
    '/products/:id': {
      component: require('./views/product/index.vue'),
      name: 'products',
      subRoutes: {
        'overview': {
          component: require('./views/product/overview.vue')
        },
        'devices': {
          component: require('./views/product/device/list.vue')
        },
        'data-point': {
          component: require('./views/product/data-point.vue')
        },
        'alert': {
          component: require('./views/product/alert.vue')
        },
        'interconnection': {
          component: require('./views/product/interconnection.vue')
        },
        'upgrade': {
          component: require('./views/product/upgrade.vue')
        },
        'virtual-device': {
          component: require('./views/product/virtual-device.vue')
        },
        '/': {
          component: require('./views/product/overview.vue')
        }
      }
    },
    // 设备详情
    '/products/:product_id/devices/:device_id': {
      component: require('./views/product/device/details.vue')
    },

    // 应用管理
    '/apps': {
      component: require('./views/app/index.vue')
    },

    // 告警服务
    '/alerts': {
      component: require('./views/alert/index.vue')
    },

    // 数据管理
    '/data': {
      component: require('./views/data/index.vue'),
      subRoutes: {
        'tables': {
          component: require('./views/data/tables.vue')
        },
        'api': {
          component: require('./views/data/api.vue')
        }
      }
    },
    '/data/intro': {
      component: require('./views/data/intro.vue'),
    },
    '/data/tables/:name': {
      component: require('./views/data/details.vue'),
    },

    // 用户管理
    '/users': {
      component: require('./views/user/list.vue')
    },
    '/users/:id': {
      component: require('./views/user/details.vue')
    },

    // 统计分析
    '/statistic': {
      component: require('./views/statistic/index.vue'),
      subRoutes: {
        'products': {
          component: require('./views/statistic/products.vue')
        },
        'users': {
          component: require('./views/statistic/users.vue')
        }
      }
    },

    // 系统设置
    '/settings': {
      component: require('./views/settings/index.vue'),
      subRoutes: {
        'auth': {
          component: require('./views/settings/auth.vue')
        },
        'members': {
          component: require('./views/settings/members.vue')
        },
        'account': {
          component: require('./views/settings/account.vue')
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

    // token存在
    if (localStorage.accessToken) {
      // token 过期
      if (today > localStorage.expireAt) {
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
      }
      else {
        if (isInAuthPage(transition.to.path)) {
          router.app.access = false;
        } else {
          router.app.access = true;
          api.corp.refreshToken(this).then(function () {
            api.product.getProducts().then(function (data) {
              if (__DEBUG__) {
                // console.log(data);
              }
              router.app.products = data;
            });

            var member_id = localStorage.getItem('member_id');
            api.corp.getMember(member_id).then(function (data) {//输入当前页面的帐号id ，返回帐号详情
              if(__DEBUG__) {
                //console.log(data);
              }
              router.app.this_user = data;
            });
          });
        }
        transition.next();
      }
    }
    // token 不存在
    else {
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
