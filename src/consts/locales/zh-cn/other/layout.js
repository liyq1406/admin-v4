/**
 * 布局类翻译信息
 * @return {Object}
 */

export default {
  // 平台相关
  platform: {
    name: '云智易物联云平台企业管理台'
  },

  // 主导航
  main_nav: {
    dashboard: {
      label: '首页'
    },
    dev: {
      label: '开发平台',
      // 侧栏导航
      subs: {
        home: {
          label: '首页'
        },
        products: {
          subs: {
            info: '产品信息',
            debug: '设备调试',
            virtual_devices: '虚拟设备',
            alert: '告警设置',
            data_point: '数据端点',
            data_forward: '数据接口',
            authorize: '授权管理'
          }
        },
        add_product: '添加产品',
        authorize: {
          label: '设备授权',
          subs: {
            list: '授权记录'
          }
        },
        apps: {
          label: '应用管理',
          subs: {
            index: '应用管理'
          }
        },
        market: {
          label: '应用市场',
          subs: {
            index: '应用市场'
          }
        },
        data: {
          label: '数据服务',
          subs: {
            tables: '数据表',
            snapshots: '数据快照',
            statistics_rule: '统计规则',
            forward: '数据转发'
          }
        },
        firmware: {
          label: '固件管理',
          subs: {
            list: '升级列表',
            manage: '版本管理',
            add: '新建任务',
            update: '上传新固件'
          }
        },
        linkage: {
          label: '智能互联',
          subs: {
            settings: '互联设置',
            amazon: 'Amazon echo',
            google: 'Google nest',
            philips: 'Philips hue',
            ezviz: '萤石',
            ifttt: 'IFTTT'
          }
        },
        shopping: {
          label: '在线购买',
          subs: {
            cart: '在线购买',
            orders: '购买记录'
          }
        },
        settings: {
          label: '设置',
          subs: {
            users: '用户设置',
            email: '邮件设置',
            message: '短信设置',
            views: '视图自定义'
          }
        }
      }
    },
    operation: {
      label: '运营平台',
      // 侧栏导航
      subs: {
        overview: {
          label: '概览'
        },
        products: {
          subs: {
            overview: '概览',
            devices: '设备管理',
            alerts: '告警信息',
            device_map: '设备地图',
            distributing: '热力分布',
            analysis: '产品分析'
          }
        },
        ios: {
          subs: {
            settings: '应用配置'
          }
        },
        android: {
          subs: {
            version: '版本信息',
            settings: '应用配置'
          }
        },
        web: {
          subs: {
            settings: '应用配置'
          }
        },
        wechat: {
          subs: {
            settings: '应用配置'
          }
        },
        broadcast: {
          label: '消息推送',
          subs: {
            add: '新建推送',
            list: '推送历史'
          }
        },
        warranty: {
          label: '智能维保',
          subs: {
            overview: '概览',
            extended_warranties: '故障事件',
            repair: '维修列表',
            accounts: '网点管理',
            heat: '热力分布',
            settings: '设置'
          }
        },
        splashwnd: {
          label: 'APP闪屏',
          subs: {
            list: 'APP启动页设置'
          }
        },
        helpdesk: {
          label: '用户反馈',
          subs: {
            overview: '概览',
            issues: '消息列表',
            settings: '设置'
          }
        },
        dealer: {
          label: '经销商管理',
          subs: {
            list: '经销商列表'
          }
        },
        recipes: {
          label: '云菜谱',
          subs: {
            recipes: '菜谱管理',
            menus: '菜单管理',
            categories: '类别管理',
            tags: '标签管理'
          }
        },
        content: {
          label: '内容管理',
          subs: {
            articles: '文章管理',
            tags: '标签管理'
          }
        },
        operateposition: {
          label: '运营位管理'
        },
        airquality: {
          label: '环境数据'
        },
        alerts: {
          label: '告警服务',
          subs: {
            record: '告警记录',
            analysis: '告警分析',
            heat: '热力分布'
          }
        },
        linkage: {
          label: '设备互联',
          subs: {
            devices: '设备联动',
            nest: 'nest联动',
            echo: 'echo'
          }
        },
        data: {
          label: '数据管理',
          subs: {
            tables: '数据表',
            snapshot: '设备快照'
          }
        },
        snapshots: {
          label: '快照分析'
        },
        users: {
          label: '用户管理',
          subs: {
            overview: '概览',
            list: '用户列表',
            major_clients: '大客户管理',
            portrait: '人群画像',
            analysis: '用户行为分析'
          }
        },
        major_clients: {
          label: '大客户管理',
          subs: {
            list: '大客户管理'
          }
        },
        settings: {
          label: '设置',
          subs: {
            offline_data: '离线数据'
          }
        }
      }
    }
  },

  // 我的帐号
  my_account: '我的账户',

  // 用户菜单
  account_menu: {
    account: '帐号信息',
    members: '成员管理',
    authorize: '授权管理',
    security: '安全审计',
    corp: '企业信息',
    quit: '退出'
  },

  // 提示信息
  messages: {
    quit: '您已退出登录',
    no_permission: '暂无使用权限'
  },

  // 等级
  levels: {
    not_authorized: '未认证',
    authorized: '已认证'
  },

  // 顶栏
  view_demo: '查看demo',
  demo_tips: '查看demo立即体验运营平台',
  service_tips: '更多服务请<a class="link-contact" href="http://www.xlink.cn/about.html" target="_blank">联系商务</a>获得支持',
  display_no_more: '不再显示'
}
