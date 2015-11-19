var configRouter = function (router) {
  router.map({
    // 404
    '*': {
      component: require('./views/not-found.vue')
    },

    '/forbidden': {
      component: require('./views/forbidden.vue')
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
        'data-node': {
          component: require('./views/product/data-node.vue')
        },
        'notice': {
          component: require('./views/product/notice.vue')
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

    // 数据管理
    '/data': {
      component: require('./views/data/index.vue'),
      subRoutes: {
        'list': {
          component: require('./views/data/list.vue')
        },
        'api': {
          component: require('./views/data/api.vue')
        }
      }
    },
    '/data/intro': {
      component: require('./views/data/intro.vue'),
    },

    // 用户管理
    '/users': {
      component: require('./views/user/list.vue')
    },
    '/user/:id': {
      component: require('./views/user/details.vue')
    },

    // 统计分析
    '/statistic': {
      component: require('./views/statistic/index.vue')
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
    '/data': '/data/list',
    '/settings': '/settings/auth'
  });

  router.beforeEach(function (transition) {
    if (transition.to.path === '/forbidden') {
      router.app.authenticating = true;
      window.setTimeout(function () {
        router.app.authenticating = false;
        alert('this route is forbidden by a global before hook');
        transition.abort();
      }, 3000);
    } else {
      transition.next();
    }
  });

};

module.exports = configRouter;