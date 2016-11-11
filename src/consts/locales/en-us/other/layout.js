/**
 * 布局类翻译信息
 * @return {Object}
 */

export default {
  // 平台相关
  platform: {
    name: 'Xlink IoT Platform'
  },

  // 主导航
  main_nav: {
    dashboard: {
      label: 'Index'
    },
    dev: {
      label: 'Development',
      // 侧栏导航
      subs: {
        home: {
          label: 'Index'
        },
        products: {
          subs: {
            info: 'Information',
            debug: 'Debug',
            virtual_devices: 'Virtual Device ',
            alert: 'Alert Settings',
            data_point: 'Data Point',
            data_forward: 'Data Interface',
            authorize: 'Authorization'
          }
        },
        add_product: 'Add Product',
        authorize: {
          label: 'Device Authorization',
          subs: {
            list: 'Authorization Record'
          }
        },
        apps: {
          label: 'APP Management',
          subs: {
            index: 'APP Management'
          }
        },
        market: {
          label: 'APP Market',
          subs: {
            index: 'APP Market'
          }
        },
        data: {
          label: 'Data Service',
          subs: {
            tables: 'Data Table',
            snapshots: 'Device Snapshot',
            statistics_rule: 'Statistic',
            forward: 'Data Forward'
          }
        },
        firmware: {
          label: 'OTA',
          subs: {
            list: 'Task List',
            manage: 'Versions',
            add: 'New Task',
            update: 'Upload New Firmware'
          }
        },
        linkage: {
          label: 'Interconnection',
          subs: {
            settings: 'Settings',
            amazon: 'Amazon echo',
            google: 'Google nest',
            philips: 'Philips hue',
            ezviz: 'Ezviz',
            ifttt: 'IFTTT'
          }
        },
        shopping: {
          label: 'Purchase Online',
          subs: {
            cart: 'Purchase Online',
            orders: 'Purchase Records'
          }
        },
        settings: {
          label: ' Settings',
          subs: {
            users: 'User',
            email: 'Email',
            message: 'SMS',
            views: 'Customize'
          }
        }
      }
    },
    operation: {
      label: 'Operation',
      // 侧栏导航
      subs: {
        overview: {
          label: 'Overview'
        },
        products: {
          subs: {
            overview: 'Overview',
            devices: 'Devices',
            alerts: 'Alert',
            device_map: 'Device Map',
            distributing: 'Thermal Distribution',
            analysis: 'Analysis'
          }
        },
        ios: {
          subs: {
            settings: 'APP Configuration'
          }
        },
        android: {
          subs: {
            version: 'Version Information',
            settings: 'APP Configuration'
          }
        },
        web: {
          subs: {
            settings: 'APP Configuration'
          }
        },
        wechat: {
          subs: {
            settings: 'APP Configuration'
          }
        },
        broadcast: {
          label: 'Message Push',
          subs: {
            add: 'Add Push',
            list: 'Push History'
          }
        },
        warranty: {
          label: 'Smart Maintenance',
          subs: {
            overview: 'Overview',
            extended_warranties: 'Failure',
            repair: 'Repair List',
            accounts: 'Net Management',
            heat: 'Thermal Distribution',
            settings: 'Setting'
          }
        },
        helpdesk: {
          label: 'Feedback',
          subs: {
            overview: 'Overview',
            issues: 'Message List',
            settings: 'Setting'
          }
        },
        splashwnd: {
          label: 'APP Splash Screen',
          subs: {
            list: 'APP Startup Setting'
          }
        },
        dealer: {
          label: 'Dealers Management',
          subs: {
            list: 'Dealers List'
          }
        },
        recipes: {
          label: 'Cloud Recipe',
          subs: {
            recipes: 'Recipes',
            menus: 'Menus',
            categories: 'Categories',
            tags: 'Tags'
          }
        },
        content: {
          label: 'Content Management',
          subs: {
            articles: 'Articles',
            tags: 'Tags'
          }
        },
        alerts: {
          label: 'Alert Service',
          subs: {
            record: 'Record',
            analysis: 'Analysis',
            heat: 'Thermal Distribution'
          }
        },
        linkage: {
          label: 'Device Interconnection',
          subs: {
            devices: 'Device Interconnection',
            nest: 'Nest Interconnection',
            echo: 'Echo'
          }
        },
        data: {
          label: 'Data Management',
          subs: {
            tables: 'Data Table',
            snapshot: 'Device Snapshot'
          }
        },
        snapshots: {
          label: 'Snapshot Analysis'
        },
        users: {
          label: 'User Management',
          subs: {
            overview: 'Overview',
            list: 'User List',
            major_clients: 'VIP Management',
            portrait: 'Portrait',
            analysis: 'User Performance Analysis'
          }
        },
        settings: {
          label: 'Settings',
          subs: {
            offline_data: 'Offline Data'
          }
        }
      }
    }
  },

  // 我的帐号
  my_account: 'My Account',

  // 用户菜单
  account_menu: {
    account: 'Account',
    members: 'Member',
    authorize: 'Authorization',
    security: 'Audit',
    corp: 'Enterprise',
    quit: 'Logout'
  },

  // 提示信息
  messages: {
    quit: 'You have logout',
    no_permission: 'No Permission'
  },

  // 等级
  levels: {
    not_authorized: 'Unauthorized',
    authorized: 'Authorized'
  },

  // 顶栏
  view_demo: 'Demo',
  demo_tips: 'Know how to use the Operation Platform? View demo now!',
  service_tips: ' More service please <a class="link-contact" href="http://www.xlink.cn/about.html" target="_blank"> contact our business team </a>',
  display_no_more: 'No more display.'
}
