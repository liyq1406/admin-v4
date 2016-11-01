/**
 * 布局类翻译信息
 * @return {Object}
 */

export default {
  // 主导航
  main_nav: {
    dashboard: {
      label: 'Index'
    },
    dev: {
      label: 'Development Platform',
      // 侧栏导航
      subs: {
        home: {
          label: 'Index'
        },
        products: {
          subs: {
            info: 'Product Information',
            debug: 'Device Debug',
            virtual_devices: 'Virtual Device ',
            alert: 'Alert Setting',
            data_point: 'Data Point',
            data_forward: 'Data Interface',
            authorize: 'Authorization Management'
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
            snapshots: 'Data Snapshot',
            statistics_rule: 'Statistical Rule',
            forward: 'Data Forward'
          }
        },
        firmware: {
          label: 'Firmware Management',
          subs: {
            list: 'Upgrade List',
            manage: 'Version Management',
            add: 'Add Task',
            update: 'Upload New Firmware'
          }
        },
        linkage: {
          label: 'Smart Interconnection',
          subs: {
            settings: 'Interconnection Setting',
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
          label: ' Setting',
          subs: {
            users: 'User Setting',
            email: 'Email Setting',
            message: 'SMS Setting',
            views: '视图自定义'
          }
        }
      }
    },
    operation: {
      label: 'Operation Platform',
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
        alerts: {
          label: 'Alert Service',
          subs: {
            record: 'Alert Record',
            analysis: 'Alert Analysis',
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
        device_map: {
          label: 'Device Map'
        },
        firmwares: {
          label: 'Firmware Management',
          subs: {
            overview: 'Overview',
            versions: 'Version Management',
            upgrade: 'Firmware Upgrade'
          }
        },
        statistic: {
          label: 'Statistical Ananlysis',
          subs: {
            products: 'Product Statistics',
            users: 'User Statistics'
          }
        },
        settings: {
          label: 'System Setting',
          subs: {
            auth: 'Authorization Management',
            members: 'Member Management',
            account: 'Account Information',
            mail_templates: 'Email Module'
          }
        }
      }
    }
  },

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
  view_demo: 'View Demo',
  demo_tips: 'Know how to use the Operation Platform? View demo now!',
  service_tips: ' More service please <a class="link-contact" href="http://www.xlink.cn/about.html" target="_blank"> contact our business team </a>',
  display_no_more: 'No more display.'
}
