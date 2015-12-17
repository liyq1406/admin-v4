var api = require('./api');
// var productsStore = require('./stores/products');

var configRouter = function (router) {
  router.map({
    // 404
    '*': {
      component: require('./views/not-found.vue')
    },

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

    // 找回密码
    '/fetch-password': {
      component: require('./views/fetch-password.vue')
    },

    // 重设密码
    '/reset-password': {
      component: require('./views/reset-password.vue')
    },

    // 激活成员邀请
    '/member-activate/:email': {
      component: require('./views/member-activate.vue')
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

  router.beforeEach(function (transition) {
    var today = new Date();
    console.log(transition.to.path);
    //if (transition.to.path === '/login' || transition.to.path === '/register') {
    if (['/login', '/register', '/fetch-password', '/reset-password'].indexOf(transition.to.path) >= 0 || transition.to.path.indexOf('/member-activate') >= 0) {
      router.app.access = false;
      transition.next();
    } else {
      if (localStorage.getItem('accessToken') !== null && localStorage.getItem('expireAt') > today.getTime()) {
        router.app.access = true;
        api.corp.refreshToken(this).then(function () {
          api.product.getProducts().then(function (data) {
            if (__DEBUG__) {
              // console.log(data);
            }
            router.app.products = data;
          });

          var mamber_id = localStorage.getItem('member_id');
          api.corp.getMember(mamber_id).then(function (data) {//输入当前页面的帐号id ，返回账户详情
            if(__DEBUG__) {
              //console.log(data);
            }
            router.app.this_user = data;
          });


        });
        transition.next();
      } else {
        router.go({path: '/login'});
      }
    }
  });

};

module.exports = configRouter;
