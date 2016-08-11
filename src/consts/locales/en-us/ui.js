/**
 * 英文翻译文件
 * @return {Object}
 */

export default {
  // 主导航
  main_nav: {
    dashboard: {
      label: '首页'
    },
    dev: {
      label: '开发平台'
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
          subs: {
            add: '新建推送',
            list: '推送历史'
          }
        },
        warranty: {
          subs: {
            overview: '概览',
            extended_warranties: '延保工单',
            repair: '维修工单',
            accounts: '网点管理',
            heat: '热力分布'
          }
        },
        helpdesk: {
          subs: {
            overview: '概览',
            issues: '消息列表'
          }
        },
        dealer: {
          subs: {
            list: '经销商列表'
          }
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
        users: {
          label: '用户管理',
          subs: {
            overview: '概览',
            list: '用户列表',
            major_clients: '大客户管理',
            settings: '用户设置',
            portrait: '人群画像',
            analysis: '用户行为分析'
          }
        },
        device_map: {
          label: '设备地图'
        },
        firmwares: {
          label: '固件管理',
          subs: {
            overview: '概览',
            versions: '版本管理',
            upgrade: '固件升级'
          }
        },
        statistic: {
          label: '统计分析',
          subs: {
            products: '产品统计',
            users: '用户统计'
          }
        },
        settings: {
          label: '系统设置',
          subs: {
            auth: '授权管理',
            members: '成员管理',
            account: '账号信息',
            mail_templates: '邮件模板'
          }
        },
        diet: '饮食管理',
        add_product: '添加产品',
        add_plugin: '添加插件'
      }
    }
  },

  // 头部导航
  nav_head: {
    home: '首页',
    platform: '平台介绍',
    solutions: '解决方案',
    developer: '开发者',
    cases: '客户案例',
    documents: '开发文档'
  },

  // 用户菜单
  user_menu: {
    account: '帐号信息',
    quit: '退出'
  },

  // 二级导航
  // subs: {
  //   product: {
  //     overview: '概览',
  //     devices: '设备管理',
  //     datapoints: '数据端点',
  //     alerts: '通知与告警',
  //     upgrade: '固件升级',
  //     wechat: '微信授权',
  //     dataforward: '数据转发',
  //     basic_info: '基本信息',
  //     data_monitoring: '数据监控',
  //     fault_records: '故障记录'
  //   },
  //   data: {
  //     tables: '数据表'
  //   },
  //   firmware: {
  //     overview: '概览',
  //     management: '版本管理',
  //     upgrade: '固件升级'
  //   },
  //   alert: {
  //     overview: '概览',
  //     setting: '规则设置'
  //   },
  //   link: {
  //     devices_link: '设备联动',
  //     nest_link: 'nest联动',
  //     echo: 'echo'
  //   },
  //   broadcast: {
  //     add: '新建推送',
  //     history: '推送历史'
  //   },
  //   dealer: {
  //     list: '经销商列表'
  //   },
  //   helpdesk: {
  //     overview: '概览',
  //     issues: '反馈列表',
  //     tags: '标签管理'
  //   },
  //   settings: {
  //     auth: '授权管理',
  //     members: '成员管理',
  //     account: '帐号信息',
  //     mail_templates: '邮件模板'
  //   },
  //   plugins: {
  //     extensions: '扩展插件',
  //     customize: '自定义插件'
  //   }
  // },

  // 表单验证
  validation: {
    required: '{field} is required',
    format: '{field} format error',
    numberic: 'Please insert a number',
    max: '{0} cannot be more than {1}',
    min: '{0} cannot be less than {1}',
    maxlength: '{0} cannot be more than {1} characters',
    minlength: '{0} cannot be less than {1} characters',
    equal: '{0} must be equal to {1}'
  },

  upload: {
    file_size_msg: '文件大小不能大于{max}MB',
    type_tips: '不是文本文件不能上传',
    read_err: '文件读取失败。',
    success_msg: '设备导入成功!',
    compatiblity: '您的浏览器过于低级，不支持 HTML5 上传'
  },

  auth: {
    // 登录
    login: 'Log In',
    register: 'Register',
    remember: 'Remember Me',
    forget: 'Forgot Password?',
    email_phone: 'Email/Phone',
    password: 'Password',
    login_submit: 'Login',
    login_submiting: 'Login In Progress…',
    // 注册
    account_tips: 'Please enter your account information:',
    basic_tips: 'Please enter your basic information:',
    confirm_password: 'Please confirm your password again',
    confirm_password_tips: 'Passwords different.',
    type_tips: 'Please select Application type',
    register_submit: 'Submit',
    register_success: 'Register Succeed',
    register_success_msg: 'An activation email had sent to you, please check your email.',
    // 找回密码
    by_phone: 'Reset Password via Mobile Phone',
    by_mail: 'Reset Password via Email',
    by_mail_tips: 'Please enter your Email Address, we will send password reset URL via Email.',
    by_mail_success_msg: 'Succeed, please check your email to continue the process.',
    fetch: 'Reset Password',
    by_phone_tips: 'Please enter your registration Mobile Number, click send button, and fill in the Verification code into the placeholder.',
    by_phone_success: 'Reset success',
    by_phone_success_msg: 'Your password has successfully reset, please re-login。',
    insert_code: 'Please enter the verification code.',
    verifycode: 'SMS Verification Code',
    get_code: 'Retrieve SMS Verification Code',
    wating: 'Retrieve it again after {seconds} seconds',
    phone_msg: 'Please enter the correct Mobile Number',
    // 激活帐号
    activate_success: 'Activation Success',
    activate_success_msg: 'You account has successfully activated.',
    activate_fail: 'Activation Failed.',
    activate_fail_msg: 'Activation Code Expired',
    // 成员邀请激活
    member_activate: 'Activate Member',
    member_activate_tips: 'Please enter your Username, Password, Mobile Phone Number and Verification Code. Please click ',
    // 修改密码
    reset: 'Reset Password',
    reset_success: 'Reset Success.',
    reset_success_msg: 'Your Password had successfully reset, please re-login. ',
    reset_fail: 'Reset Fail.',
    // 表单项
    fields: {
      account: 'Account',
      password: 'Password',
      confirm_password: 'Confirm Password',
      email: 'Email',
      name: 'Name',
      phone: 'Mobile Phone Number',
      company: 'Company Name'
    }
  },

  // 概览
  dashboard: {
    platform: '管理台',
    statistic: {
      total: '总设备量',
      activated: '激活数',
      online: '当前在线',
      user: '用户数'
    },
    guide: '快速指南',
    documents: '文档'
  },

  // 告警服务
  alert: {
    counts: '告警数量',
    service: '告警服务',
    statistic: {
      device: '告警设备',
      message: '告警消息',
      unread: '未读消息',
      add_today: '今日新增'
    },
    info: '告警信息',
    info_list: {
      product_name: '产品名称',
      alert_name: '告警名称',
      content: '告警内容',
      tags: '标签',
      type: '消息类型',
      notify_type: '通知类型',
      alert_value: '告警状态值',
      from: '消息发送者',
      to: '消息接受者',
      create_date: '上报时间',
      is_read: '是否已读'
    }
  },

  // 产品
  product: {
    add_product: '添加产品',
    placeholders: {
      name: '请输入产品名称',
      desc: '请输入产品描述'
    },
    fields: {
      name: '产品名称',
      desc: '产品描述',
      link_type: '设备类型',
      is_registerable: '允许用户注册设备',
      is_release: '发布产品'
    }
  },

  // 产品概述
  overview: {
    desc: '产品描述',
    pid: '产品PID',
    key: '产品密钥',
    show_key: '查看密钥',
    add_device: '添加设备',
    import_devices: '导入设备',
    trends: '趋势',
    regions: '设备分布',
    active_devices: '活跃设备',
    activated_devices: '激活设备',
    statistic: {
      online: '当前在线',
      activated: '激活数',
      total: '设备数'
    },
    // 编辑产品表单
    editForm: {
      header: '编辑产品',
      del: '删除产品'
    },
    // 添加设备浮层
    addForm: {
      mac: 'MAC地址',
      mac_placeholder: '请输入MAC地址',
      search_condi: '请输入查询内容'
    }
  },

  // 设备
  device: {
    id: '设备ID',
    management: '设备管理',
    details: '设备详情',
    params: '设备参数',
    is_active: '是否激活',
    active_date: '激活时间',
    is_online: '在线状态',
    firmware_version: '固件版本',
    active: '已激活',
    not_active: '未激活',
    datapoint: '数据端点',
    current_value: '当前值',
    no_datapoint: '暂无端点信息',
    log: '设备日志'
  },

  // 设备列表
  device_list: {
    active: '是',
    not_active: '未激活',
    online: '在线',
    offline: '下线'
  },

  // 数据端点
  datapoint: {
    add_datapoint: '添加数据端点',
    edit_datapoint: '编辑数据端点',
    del_datapoint: '删除数据端点',
    placeholders: {
      index: '数据端点索引不能重复',
      name: '英文、数字或下划线',
      min: '最小值',
      max: '最大值',
      symbol: '例如：℃',
      description: '请填写数据端点描述'
    },
    fields: {
      index: '索引',
      name: '端点ID',
      type: '数据类型',
      range: '取值范围',
      min: '最小值',
      max: '最大值',
      symbol: '单位符号',
      description: '描述'
    }
  },
  // 安卓版本信息配置
  version: {
    placeholders: {
      url: '请填写安卓APK文件的下载路径',
      version: '请填写最新APK的版本号(整数)',
      illustration: 'APK的说明信息',
      md5: '文件md5校验值'
    }
  },
  // 数据转发
  dataforward: {
    add_dataforward: '添加设备规则',
    edit_dataforward: '编辑设备规则',
    del_dataforward: '删除设备规则',
    fields: {
      id: '规则ID',
      destination: {
        url: '数据目的地',
        type: '数据分发类型',
        token: '分发url访问所需凭证'
      },
      data_type: '支持转发数据的类型'
    }
  },

  // 告警规则
  rule: {
    add_rule: '添加规则',
    edit_rule: '编辑规则',
    del_rule: '删除告警规则',
    condition: '告警条件',
    placeholders: {
      name: '请输入规则名称',
      content: '请输入告警内容'
    },
    fields: {
      name: '规则名称',
      type: '告警类型',
      content: '告警内容',
      inform_type: '通知类型',
      tags: '标签',
      notify_type: '通知方式',
      scope: '可见范围'
    }
  },

  // 固件版本
  firmware: {
    add_firmware: '添加固件版本',
    edit_firmware: '编辑固件版本',
    del_firmware: '删除固件版本',
    firmware_list: '版本列表',
    file: '固件文件',
    upload: '上传固件文件',
    uploading: '文件上传中，请稍等...',
    placeholders: {
      mod: '请输入固件型号',
      version: '请输入固件版本号',
      description: '请输入版本说明'
    },
    fields: {
      mod: '固件型号',
      version: '固件版本号',
      description: '版本说明',
      create_date: '添加日期',
      is_release: '发布固件'
    }
  },

  // 任务
  task: {
    create_task: '创建自动升级任务',
    task_list: '升级任务列表',
    select_from_version: '请选择起始版本号',
    select_target_version: '请选择目标版本号',
    placeholders: {
      name: '升级任务名称',
      description: '请输入描述'
    },
    stop: '停止',
    start: '启动',
    fields: {
      order: '序号',
      name: '任务名称',
      description: '描述',
      from_version: '起始版本',
      target_version: '目标版本',
      upgrade_count: '已升级设备'
    }
  },

  // 微信授权
  wechat: {
    product_id: 'product_id',
    auth_key: 'auth_key',
    close_strategy: 'close_strategy',
    conn_strategy: 'conn_strategy',
    crypt_method: 'crypt_method',
    auth_ver: 'auth_ver',
    manu_mac_pos: 'manu_mac_pos',
    ser_mac_pos: 'ser_mac_pos',
    connect_protocol: 'connect_protocol'
  },

  // 应用管理
  app: {
    create_app: '添加应用',
    edit_app: '编辑应用',
    del_app: '删除应用',
    inform: '消息通知',
    apn_file: 'APN授权文件',
    uploading: '文件上传中，请稍等...',
    upload: '上传P12文件',
    is_release: '正式发布APN密钥文件',
    placeholders: {
      name: '请输入应用名称',
      url: '请输入应用URL',
      apn_license_pwd: '请输入授权文件的密码',
      wechat_id: '请输入微信公众号ID',
      wechat_app_id: '请输入微信公众号APPID',
      wechat_app_secret: '请输入微信公众号APPSecret',
      wechat_key: '请输入43位微信秘钥',
      app_url: '请输入云智易APP接收微信消息URL'
    },
    fields: {
      id: '应用ID',
      name: '应用名称',
      type: '应用类型',
      url: '应用URL',
      create_time: '创建时间',
      apn_enable: '启用苹果APN服务',
      apn_license_pwd: '文件密码',
      wechat_id: '微信公众号ID',
      wechat_app_id: 'APPID',
      wechat_app_secret: 'APPSecret',
      wechat_encrypt: '消息加解密方式',
      wechat_key: '微信秘钥',
      app_url: 'APPUrl'
    }
  },

  // 数据表
  table: {
    create_table: '新建数据表',
    edit_table: '修改数据表',
    del_table: '删除数据表',
    add_field: '添加字段',
    table_msg: '请输入表名!',
    field_msg: '请输入字段名!',
    details: '数据表详情',
    placeholders: {
      name: '请输入表名'
    },
    fields: {
      name: '表名',
      type: '数据表类型',
      permission: '访问权限',
      field: '字段'
    }
  },

  // 数据表记录
  table_record: {
    details: '数据详情',
    value: '字段值',
    fields: {
      create: '创建时间',
      update: '更新时间',
      creator: '创建者'
    }
  },

  // 授权管理
  auth_management: {
    intro: '创建Accesskey,Access Key ID 为公钥,Access Key Secret 为私钥 用于数据接口访问的系统认证.相关文档http://www.xlink.cn/developer.html "用户身份集成接口"开发文档中第三方身份集成等接口。'
  },

  // 成员管理
  member: {
    search_palceholder: '请输入姓名',
    search_label: '查找成员',
    member_list: '成员列表',
    add_member: '添加成员',
    del_msg: '确定要删除此成员吗？',
    alert_settings: '通知与告警',
    placeholders: {
      name: '请输入姓名',
      email: '请输入成员邮箱'
    },
    fields: {
      name: '姓名',
      password: '密码',
      phone: '手机',
      email: '邮箱',
      create_time: '创建时间',
      last_auth_time: '最后登录',
      role: '角色',
      is_notice: '接受通知',
      is_alert: '接受告警'
    }
  },

  // 企业信息
  corp: {
    fields: {
      company: '企业名称',
      id: '企业ID',
      type: '应用类型',
      name: '联系人',
      email: '联系邮箱',
      phone: '联系电话',
      create_time: '创建时间'
    }
  },

  // 账号信息
  account: {
    personal: '个人信息',
    corp: '企业信息',
    edit_member: '编辑用户信息',
    password_msg: '密码修改成功',
    placeholders: {
      old_password: '旧密码',
      new_password: '新密码'
    },
    fields: {
      old_password: '旧密码',
      new_password: '新密码'
    }
  },
  // 经销商列表
  dealer: {
    placeholders: {
      code: '请输入合法的邮箱',
      password: '请输入6-16位字符密码',
      name: '请输入经销商名称',
      contact: '请输入联系人名称',
      phone: '请输入手机号码',
      address: '请输入联系地址',
      area: '如：华南地区',
      target: '请输入年销售目标'
    },
    fields: {
      username: '账号',
      password: '密码',
      name: '经销商名称',
      linkman: '联系人',
      phone: '手机号码',
      address: '地址',
      area: '负责区域',
      belong_to: '从属于',
      sale_target: '销售目标',
      reach_target: '销售是否达标',
      status: '状态',
      create_time: '创建时间'
    },
    sale: {
      name: '客户名称',
      phone: '手机号码',
      type: '客户类型',
      address: '详细地址',
      floor_num: '场所层数',
      floor_area: '每层面积',
      place_area: '场所总面积',
      lay_floor: '机器放置层数',
      permanent_population: '常驻人数'
    }
  },

  // 统计分析
  statistic: {
    trends: '趋势',
    regions: '区域分布',
    district: '地区',
    percentage: '占比',
    products: {
      total: '总设备量',
      activated: '激活设备',
      online: '当前在线',
      active: '活跃设备',
      active_tips: '指日活跃设备',
      sum: '设备量'
    },
    users: {
      total: '用户总数',
      newbie_period: '{period}天新增用户',
      newbie: '新增用户',
      active: '活跃用户',
      registered: '注册用户',
      online: '当前在线',
      sum: '用户数'
    }
  },

  // 邮件模板
  mail_templates: {
    general: '通用设置',
    activate_template: '激活邮件模板',
    reset_template: '重置密码邮件模板',
    check_pending: '待审核',
    check_reject: '审核不通过',
    check_pass: '审核通过',
    placeholders: {
      sender: '如：noreply',
      address: '请输入邮件发送域名'
    },
    fields: {
      sender: '发件者',
      address: '邮件域名',
      subject: '邮件标题',
      content: '邮件内容'
    },
    messages: {
      illegal_sender: '请输入合法的发件者',
      creation_fail: '邮件模板创建失败',
      update_fail: '邮件模板修改失败'
    }
  },

  user: {
    list: '用户列表',
    details: '用户详情',
    setting: '用户设置',
    search_user: '查找用户',
    devices_bound: '绑定设备列表',
    no_devices_bound: '该用户未绑定任何设备',
    ban_user: '停用该用户',
    product_name: '产品名称',
    device_mac: '设备mac',
    device_status: '设备状态',
    device_authorize_code: '认证码',
    status: {
      normal: '正常',
      banned: '停用',
      activate: '激活',
      deactivate: '未激活'
    },
    fields: {
      id: '用户ID',
      corp_id: '企业ID',
      nick_name: '昵称',
      phone: '手机号码',
      account: '帐号',
      create_date: '创建时间',
      active_date: '激活时间',
      authorize_code: '用户认证码',
      region_id: '所在区域ID',
      is_vaild: '激活状态',
      source: '用户来源',
      status: '状态'
    }
  },

  ingredient: {
    del: '删除该食材',
    placeholders: {
      name: '请填写食材标题',
      instructions: '请填写食材描述',
      search_condi: '请填写查询条件'
    },
    fields: {
      name: '标题',
      images: '成品图',
      classification: '类别',
      instructions: '摘要',
      push_rules: '推送'
    }
  },

  recipe: {
    del: '删除该菜谱',
    placeholders: {
      name: '请填写菜谱标题',
      instructions: '请填写菜谱描述',
      tips: '请填写菜谱备注',
      search_condi: '请填写查询条件'
    },
    fields: {
      name: '标题',
      images: '成品图',
      classification: '类别',
      instructions: '摘要',
      tips: '备注'
    }
  },

  // 天际账号管理
  account_manage: {
    search_condi: '网点名称'
  },

  // 用户反馈
  helpdesk: {
    statistic: {
      pending: '待处理',
      avg: '平均处理时间率',
      add: '{period}天新增'
    }
  },

  // 标签管理
  tags: {
    fields: {
      name: '名称'
    }
  },

  warranty: {
    fields: {
      name: '网点',
      director: '负责人',
      phone: '联系号码',
      email: '邮箱地址',
      address: '详细地址'
    }
  }
}
