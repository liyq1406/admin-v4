module.exports = {
  'zh-cn': {
    // 侧栏导航
    nav_aside: {
      dashboard: '概览',
      products: '产品管理',
      apps: '应用管理',
      alerts: '告警服务',
      data: '数据管理',
      users: '用户管理',
      statistic: '统计分析',
      settings: '系统设置',
      diet: '饮食管理',
      add_product: '添加产品'
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
    sub_nav: {
      product: {
        overview: '概览',
        devices: '设备管理',
        datapoints: '数据端点',
        alerts: '通知与告警',
        upgrade: '固件升级',
        wechat: '微信导入',
        dataforward: '设备数据转发'
      },
      data: {
        tables: '数据表'
      },
      settings: {
        auth: '授权管理',
        members: '成员管理',
        account: '帐号信息',
        mail_templates: '邮件模板'
      }
    },

    // 公用
    common: {
      no_data: '暂无数据',
      statistic: {
        online: '当前在线',
        activated: '激活数',
        total: ' 所有'
      },
      ok: '确定',
      cancel: '取消',
      edit: '编辑',
      add: '添加',
      del: '删除',
      save: '保存',
      company: '广州云湾信息技术有限公司',
      name: '名称',
      recent: '最近',
      action: '操作',
      refresh: '刷新',
      data_loading: '数据加载中...',
      no_records: '暂无数据记录',
      read: '已读',
      unread: '未读',
      details: '查看',
      handling: '处理中...',
      high: '高',
      low: '低',
      yes: '是',
      no: '否',
      enable: '启用',
      disabled: '禁用',
      search: '搜索',
      total_results: '共有<span>{count}</span>条结果',
      display: '显示',
      status: '状态',
      online: '上线',
      offline: '下线',
      not_set: '未设置',
      wechat: '微信'
    },

    // 图表地区
    regions: [
      { label: '全球', value: 'world'},
      { label: '国内', value: 'china' }
    ],

    // 图表类型
    mapType: [
      'china',
      // 23个省
      '广东', '青海', '四川', '海南', '陕西',
      '甘肃', '云南', '湖南', '湖北', '黑龙江',
      '贵州', '山东', '江西', '河南', '河北',
      '山西', '安徽', '福建', '浙江', '江苏',
      '吉林', '辽宁', '台湾',
      // 5个自治区
      '新疆', '广西', '宁夏', '内蒙古', '西藏',
      // 4个直辖市
      '北京', '天津', '上海', '重庆',
      // 2个特别行政区
      '香港', '澳门'
    ],

    // 账号类型
    accountTypes: ['消费电子（含穿戴设备/娱乐产品等）', '智能家居', '智能安防', '商用/工控设备', '其它'],

    // 告警类型
    alertTypes: ['通知类型', '告警类型'],

    // 通知类型
    infoTypes: ['通知与预警'],

    periods: [
      { label: '7天', value: 7 },
      { label: '30天', value: 30 },
      { label: '90天', value: 90 }
    ],

    // 设备类型
    deviceTypes: ['WiFi设备', 'Zigbee网关', '蓝牙设备', '蓝牙Mesh设备'],

    visibilityOptions: [
      { label: '全部', value: 'all' },
      { label: '在线', value: 'online' },
      { label: '激活', value: 'active' },
      { label: '未激活', value: 'inactive' }
    ],

    // 表单验证
    validation: {
      required: '{field}为必填项',
      format: '{field}格式有误',
      numberic: '请填写数字格式',
      maxlength: '{0}不能多于{1}位',
      minlength: '{0}不能少于{1}位'
    },

    // 错误信息
    errors: {
      '4001001': '请求数据字段验证不通过',
      '4001002': '请求数据必须字段不可为空',
      '4001003': '手机验证码不存在',
      '4001004': '手机验证码错误',
      '4001005': '注册的手机号已存在',
      '4001006': '注册的邮箱已存在',
      '4001007': '密码错误',
      '4001008': '帐号不合法',
      '4001009': '企业成员状态不合法',
      '4001010': '刷新token不合法',
      '4001011': '未知成员角色类型',
      '4001012': '只有管理员才能邀请',
      '4001013': '不可修改其他成员信息',
      '4001014': '不能删除本人',
      '4001015': '未知的产品连接类型',
      '4001016': '已发布的产品不可删除',
      '4001017': '固件版本已存在',
      '4001018': '数据端点未知数据类型',
      '4001019': '数据端点索引已存在',
      '4001020': '已发布的数据端点不可删除',
      '4001021': '该产品下设备MAC地址已存在',
      '4001022': '不能删除已激活的设备',
      '4001023': '扩展属性Key为预留字段',
      '4001024': '设备扩展属性超过上限',
      '4001025': '新增已存在的扩展属性',
      '4001026': '更新不存在的扩展属性',
      '4001027': '属性字段名不合法',
      '4001028': '邮件验证码不存在',
      '4001029': '邮件验证码错误',
      '4001030': '用户状态不合法',
      '4001031': '用户手机尚未认证',
      '4001032': '用户邮箱尚未认证',
      '4001033': '用户已经订阅设备',
      '4001034': '用户没有订阅该设备',
      '4001035': '自动升级任务名称已存在',
      '4001036': '升级任务状态未知',
      '4001037': '已有相同的起始版本升级任务',
      '4001038': '设备激活失败',
      '4001039': '设备认证失败',
      // '4001040': '订阅设备认证码错误',
      '4001041': '订阅设备认证码错误',
      '4001042': '授权名称已存在',
      '4001043': '该告警规则名称已存在',
      // '4001044': '请求数据字段验证不通过',
      '4001045': '数据表名称已存在',
      '4001046': '产品固件文件超过大小限制',
      '4001047': 'APN密钥文件超过大小限制',
      '4001048': 'APP的APN功能未启用',
      '4001049': '产品未允许用户注册设备',
      '4001050': '该类型的邮件模板已存在',
      '4001051': '邮件模板正文内容参数缺失',
      '4031001': '禁止访问',
      '4031002': '禁止访问，需要Access-Token',
      '4031003': '无效的Access-Token',
      '4031004': '需要企业的调用权限',
      '4031005': '需要企业管理员权限',
      '4031006': '需要数据操作权限',
      '4031007': '禁止访问私有数据',
      '4031008': '分享已经被取消',
      '4031009': '分享已经接受',
      '4031010': '用户没有订阅设备，不能执行操作',
      '4041001': 'URL找不到',
      '4041002': '企业成员帐号不存在',
      '4041003': '企业成员不存在',
      '4041004': '激活的成员邮箱不存在',
      '4041005': '产品信息不存在',
      '4041006': '产品固件不存在',
      '4041007': '数据端点不存在',
      '4041008': '设备不存在',
      '4041009': '设备扩展属性不存在',
      '4041010': '企业不存在',
      '4041011': '用户不存在',
      '4041012': '用户扩展属性不存在',
      '4041013': '升级任务不存在',
      '4041014': '第三方身份授权不存在',
      '4041015': '告警规则不存在',
      '4041016': '数据表不存在',
      '4041017': '数据不存在',
      '4041018': '分享资源不存在',
      '4041019': '企业邮箱不存在',
      '4041020': 'APP不存在',
      '4041021': '产品转发规则不存在',
      '4041022': '邮件模板不存在',
      '5031001': '服务端发生异常'
    },

    upload: {
      type_tips: '不是文本文件不能上传',
      read_err: '文件读取失败。',
      success_msg: '设备导入成功!',
      compatiblity: '您的浏览器过于低级，不支持 HTML5 上传'
    },

    // 权限相关
    auth: {
      // 登录
      login: '登录帐号',
      register: '注册帐号',
      remember: '记住密码',
      forget: '忘记密码?',
      email_phone: '邮箱/手机号',
      password: '密码',
      login_submit: '登录',
      login_submiting: '登录中...',
      // 注册
      account_tips: '请输入您的帐号信息：',
      basic_tips: '请输入您的基本信息：',
      confirm_password: '请再一次输入密码',
      confirm_password_tips: '两次密码输入不一致',
      type_tips: '请选择应用类型',
      register_submit: '注册',
      register_success: '注册成功',
      register_success_msg: '系统已经发了一封激活邮件到您的邮箱，请查阅。',
      // 找回密码
      by_phone: '手机找回',
      by_mail: '邮箱找回',
      by_mail_tips: '请输入您的注册邮箱，我们会将重设密码的链接发到您的邮箱中。',
      by_mail_success_msg: '一封找回密码的邮件已发送到您的邮箱，请查收',
      fetch: '找回密码',
      by_phone_tips: '请输入您的注册手机，点击发送验证码，将手机收到的验证码填到下面的输入框中。',
      by_phone_success: '修改成功',
      by_phone_success_msg: '您的密码已重置成功，请重新登录。',
      insert_code: '请输入右图验证码',
      verifycode: '短信验证码',
      get_code: '获取短信验证码',
      wating: '{seconds}秒后重新获取',
      phone_msg: '请填写正确的手机号',
      // 激活帐号
      activate_success: '激活成功',
      activate_success_msg: '您的帐号已成功激活。',
      activate_fail: '激活失败',
      activate_fail_msg: '该邮件验证码已失效。',
      // 成员邀请激活
      member_activate: '成员邀请激活',
      member_activate_tips: '请输入您的姓名、登录密码、注册手机，点击发送验证码，将手机收到的验证码填到下面的输入框中。',
      // 修改密码
      reset: '修改密码',
      reset_success: '修改成功',
      reset_success_msg: '您的密码已重置成功，请重新登录。',
      reset_fail: '修改失败',
      // 表单项
      fields: {
        account: '登录帐号',
        password: '密码',
        confirm_password: '再次输入密码',
        email: '电子邮箱',
        name: '姓名',
        phone: '手机号码',
        company: '公司名称'
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
        mac_placeholder: '请输入MAC地址'
      }
    },

    // 设备
    device: {
      id: '设备ID',
      management: '设备管理',
      details: '设备详情',
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
      types: ['布尔类型', '单字节', '16位短整型', '32位整型', '浮点', '字符串'],
      placeholders: {
        index: '数据端点索引不能重复',
        name: '英文、数字或下划线',
        symbol: '例如：℃',
        description: '请填写数据端点描述'
      },
      fields: {
        index: '索引',
        name: '端点ID',
        type: '数据类型',
        symbol: '单位符号',
        description: '描述'
      }
    },
    // 设备数据转发
    dataforward: {
      add_dataforward: '添加设备规则',
      edit_dataforward: '编辑设备规则',
      del_dataforward: '删除设备规则',
      datetype_forwards: ['设备上线', '设备下线', '设备激活', 'Pipe包', '设备同步包', '用户上线', '用户下线'],
      destination_types: ['转发到外部url', '转发到内部插件处理单元'],
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
      types: ['数据端点', '设备状态'],
      compare_types: ['等于', '大于', '小于'],
      inform_types: ['通知类型', '告警类型'],
      notify_types: ['短信', '邮箱', '应用内推送', 'APN推送'],
      scope_types: ['企业可见', '用户可见', '全部可见'],
      candidate_tags: ['严重', '轻微', '通知'],
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
        is_release: '是否发布'
      }
    },

    // 任务
    task: {
      create_task: '创建自动升级任务',
      task_list: '升级任务列表',
      select_from_version: '请选择起始版本号',
      select_target_version: '请选择目标版本号',
      file_size_msg: '文件大小不能大于1MB',
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
      // APP 类型
      types: [
        { label: 'iOS', disabled: false },
        { label: 'Android', disabled: false },
        { label: 'Web', disabled: true },
        { label: '微信', disabled: false }
      ],
      encrypt_types: [
        { label: '明文模式', info: '明文模式下，不使用消息体加解密功能，安全系数较低' },
        { label: '兼容模式', info: '兼容模式下，明文、密文将共存，方便开发者调试和维护' },
        { label: '安全模式（推荐）', info: '安全模式下，消息包为纯密文，需要开发者加密和解密，安全系数高' }
      ],
      placeholders: {
        name: '请输入应用名称',
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
      types: ['用户公开表', '用户私有表', '应用数据表'],
      table_msg: '请输入表名!',
      field_msg: '请输入字段名!',
      details: '数据表详情',
      field_types: [
        { label: '字符串', value: 'string' },
        { label: '32位整形数字', value: 'int' },
        { label: '布尔类型', value: 'boolean' },
        { label: '浮点类型', value: 'float' },
        { label: '日期类型', value: 'date' }
      ],
      // 数据表权限类型
      permission_types: [
        { label: '添加', value: 'create' },
        { label: '获取', value: 'get' },
        { label: '查找', value: 'find' },
        { label: '修改', value: 'update' },
        { label: '删除', value: 'delete' }
      ],
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
      types: ['管理员', '普通会员'],
      status_types: ['待激活', '正常', '已停用'],
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
      languages: [
        { label: '中文(简体)', value: 'zh-cn' },
        { label: '英语(美国)', value: 'en-us' }
      ],
      placeholders: {
        sender: '如：noreply'
      },
      fields: {
        sender: '发件者',
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
        banned: '停用'
      },
      fields: {
        id: '用户ID',
        corp_id: '企业ID',
        nick_name: '昵称',
        phone: '手机号码',
        account: '帐号',
        create_time: '创建时间',
        authorize_code: '用户认证码',
        region_id: '所在区域ID',
        source: '用户来源',
        status: '状态'
      }
    },

    ingredient: {
      del: '删除该食材',
      placeholders: {
        name: '请填写食材标题',
        instructions: '请填写食材描述',
        search: '请输入关键字进行查询'
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
        tips: '请填写菜谱备注'
      },
      fields: {
        name: '标题',
        images: '成品图',
        classification: '类别',
        instructions: '摘要',
        tips: '备注'
      }
    }
  },

  'en-us': {
    // 侧栏导航
    nav_aside: {
      dashboard: '概览',
      products: '产品管理',
      apps: '应用管理',
      alerts: '告警服务',
      data: '数据管理',
      users: '用户管理',
      statistic: '统计分析',
      settings: '系统设置',
      diet: '饮食管理',
      add_product: '添加产品'
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
    sub_nav: {
      product: {
        overview: '概览',
        devices: '设备管理',
        datapoints: '数据端点',
        alerts: '通知与告警',
        upgrade: '固件升级',
        wechat: '微信导入',
        dataforward: '设备数据转发'
      },
      data: {
        tables: '数据表'
      },
      settings: {
        auth: '授权管理',
        members: '成员管理',
        account: '帐号信息',
        mail_templates: '邮件模板'
      }
    },

    // 公用
    common: {
      no_data: '暂无数据',
      statistic: {
        online: '当前在线',
        activated: '激活数',
        total: ' 所有'
      },
      ok: 'OK',
      cancel: 'Cancel',
      edit: 'Edit',
      add: '添加',
      del: '删除',
      save: 'Save',
      company: 'xlink.cn All rights reserved',
      name: '名称',
      recent: '最近',
      action: '操作',
      refresh: '刷新',
      data_loading: '数据加载中...',
      no_records: '暂无数据记录',
      read: '已读',
      unread: '未读',
      details: '查看',
      handling: '处理中...',
      high: '高',
      low: '低',
      yes: '是',
      no: '否',
      enable: '启用',
      disabled: '禁用',
      search: '搜索',
      total_results: '共有<span>{count}</span>条结果',
      display: '显示',
      status: '状态',
      online: '上线',
      offline: '下线',
      not_set: '未设置',
      wechat: '微信'
    },

    // 图表地区
    regions: [
      { label: '全球', value: 'world'},
      { label: '国内', value: 'china' }
    ],

    // 图表类型
    mapType: [
      'china',
      // 23个省
      '广东', '青海', '四川', '海南', '陕西',
      '甘肃', '云南', '湖南', '湖北', '黑龙江',
      '贵州', '山东', '江西', '河南', '河北',
      '山西', '安徽', '福建', '浙江', '江苏',
      '吉林', '辽宁', '台湾',
      // 5个自治区
      '新疆', '广西', '宁夏', '内蒙古', '西藏',
      // 4个直辖市
      '北京', '天津', '上海', '重庆',
      // 2个特别行政区
      '香港', '澳门'
    ],

    // 账号类型
    accountTypes: ['Consumer electronics (including wearable device / entertainment products, etc.)', 'Smart Home', 'Smart Security', 'Commercial / industrial equipment', 'Others'],

    // 告警类型
    alertTypes: ['通知类型', '告警类型'],

    // 通知类型
    infoTypes: ['通知与预警'],

    periods: [
      { label: '7天', value: 7 },
      { label: '30天', value: 30 },
      { label: '90天', value: 90 }
    ],

    // 设备类型
    deviceTypes: ['WiFi设备', 'Zigbee网关', '蓝牙设备', '蓝牙Mesh设备'],

    visibilityOptions: [
      { label: '全部', value: 'all' },
      { label: '在线', value: 'online' },
      { label: '激活', value: 'active' },
      { label: '未激活', value: 'inactive' }
    ],

    // 表单验证
    validation: {
      required: '{field} is required',
      format: '{field} format error',
      numberic: 'Please insert a number',
      maxlength: '{0} cannot be more than {1} characters',
      minlength: '{0} cannot be less than {1} characters'
    },

    // 错误信息
    errors: {
      '4001001': '请求数据字段验证不通过',
      '4001002': '请求数据必须字段不可为空',
      '4001003': '手机验证码不存在',
      '4001004': '手机验证码错误',
      '4001005': '注册的手机号已存在',
      '4001006': '注册的邮箱已存在',
      '4001007': '密码错误',
      '4001008': '帐号不合法',
      '4001009': '企业成员状态不合法',
      '4001010': '刷新token不合法',
      '4001011': '未知成员角色类型',
      '4001012': '只有管理员才能邀请',
      '4001013': '不可修改其他成员信息',
      '4001014': '不能删除本人',
      '4001015': '未知的产品连接类型',
      '4001016': '已发布的产品不可删除',
      '4001017': '固件版本已存在',
      '4001018': '数据端点未知数据类型',
      '4001019': '数据端点索引已存在',
      '4001020': '已发布的数据端点不可删除',
      '4001021': '该产品下设备MAC地址已存在',
      '4001022': '不能删除已激活的设备',
      '4001023': '扩展属性Key为预留字段',
      '4001024': '设备扩展属性超过上限',
      '4001025': '新增已存在的扩展属性',
      '4001026': '更新不存在的扩展属性',
      '4001027': '属性字段名不合法',
      '4001028': '邮件验证码不存在',
      '4001029': '邮件验证码错误',
      '4001030': '用户状态不合法',
      '4001031': '用户手机尚未认证',
      '4001032': '用户邮箱尚未认证',
      '4001033': '用户已经订阅设备',
      '4001034': '用户没有订阅该设备',
      '4001035': '自动升级任务名称已存在',
      '4001036': '升级任务状态未知',
      '4001037': '已有相同的起始版本升级任务',
      '4001038': '设备激活失败',
      '4001039': '设备认证失败',
      // '4001040': '订阅设备认证码错误',
      '4001041': '订阅设备认证码错误',
      '4001042': '授权名称已存在',
      '4001043': '该告警规则名称已存在',
      // '4001044': '请求数据字段验证不通过',
      '4001045': '数据表名称已存在',
      '4001046': '产品固件文件超过大小限制',
      '4001047': 'APN密钥文件超过大小限制',
      '4001048': 'APP的APN功能未启用',
      '4001049': '产品未允许用户注册设备',
      '4001050': '该类型的邮件模板已存在',
      '4001051': '邮件模板正文内容参数缺失',
      '4031001': '禁止访问',
      '4031002': '禁止访问，需要Access-Token',
      '4031003': '无效的Access-Token',
      '4031004': '需要企业的调用权限',
      '4031005': '需要企业管理员权限',
      '4031006': '需要数据操作权限',
      '4031007': '禁止访问私有数据',
      '4031008': '分享已经被取消',
      '4031009': '分享已经接受',
      '4031010': '用户没有订阅设备，不能执行操作',
      '4041001': 'URL找不到',
      '4041002': '企业成员帐号不存在',
      '4041003': '企业成员不存在',
      '4041004': '激活的成员邮箱不存在',
      '4041005': '产品信息不存在',
      '4041006': '产品固件不存在',
      '4041007': '数据端点不存在',
      '4041008': '设备不存在',
      '4041009': '设备扩展属性不存在',
      '4041010': '企业不存在',
      '4041011': '用户不存在',
      '4041012': '用户扩展属性不存在',
      '4041013': '升级任务不存在',
      '4041014': '第三方身份授权不存在',
      '4041015': '告警规则不存在',
      '4041016': '数据表不存在',
      '4041017': '数据不存在',
      '4041018': '分享资源不存在',
      '4041019': '企业邮箱不存在',
      '4041020': 'APP不存在',
      '4041021': '产品转发规则不存在',
      '4041022': '邮件模板不存在',
      '5031001': '服务端发生异常'
    },

    upload: {
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
      by_phone: 'Via Mobile Phone',
      by_mail: 'Via Email',
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
        mac_placeholder: '请输入MAC地址'
      }
    },

    // 设备
    device: {
      id: '设备ID',
      management: '设备管理',
      details: '设备详情',
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
      types: ['布尔类型', '单字节', '16位短整型', '32位整型', '浮点', '字符串'],
      placeholders: {
        index: '数据端点索引不能重复',
        name: '英文、数字或下划线',
        symbol: '例如：℃',
        description: '请填写数据端点描述'
      },
      fields: {
        index: '索引',
        name: '端点ID',
        type: '数据类型',
        symbol: '单位符号',
        description: '描述'
      }
    },
    // 设备数据转发
    dataforward: {
      add_dataforward: '添加设备规则',
      edit_dataforward: '编辑设备规则',
      del_dataforward: '删除设备规则',
      types: ['布尔类型', '单字节', '16位短整型', '32位整型', '浮点', '字符串'],
      placeholders: {
        id: '请输入ID',
        symbol: '例如：℃',
        description: '请填写数据端点描述'
      },
      fields: {
        id: '规则ID',
        destination: {
          url: '数据目的地',
          type: '数据分发类型',
          token: '分发url访问所需凭证'
        }
      }
    },

    // 告警规则
    rule: {
      add_rule: '添加规则',
      edit_rule: '编辑规则',
      del_rule: '删除告警规则',
      condition: '告警条件',
      types: ['数据端点', '设备状态'],
      compare_types: ['等于', '大于', '小于'],
      inform_types: ['通知类型', '告警类型'],
      notify_types: ['短信', '邮箱', '应用内推送', 'APN推送'],
      scope_types: ['企业可见', '用户可见', '全部可见'],
      candidate_tags: ['严重', '轻微', '通知'],
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
        is_release: '是否发布'
      }
    },

    // 任务
    task: {
      create_task: '创建自动升级任务',
      task_list: '升级任务列表',
      select_from_version: '请选择起始版本号',
      select_target_version: '请选择目标版本号',
      file_size_msg: '文件大小不能大于1MB',
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
      // APP 类型
      types: [
        { label: 'iOS', disabled: false },
        { label: 'Android', disabled: false },
        { label: 'Web', disabled: true },
        { label: '微信', disabled: false }
      ],
      encrypt_types: [
        { label: '明文模式', info: '明文模式下，不使用消息体加解密功能，安全系数较低' },
        { label: '兼容模式', info: '兼容模式下，明文、密文将共存，方便开发者调试和维护' },
        { label: '安全模式（推荐）', info: '安全模式下，消息包为纯密文，需要开发者加密和解密，安全系数高' }
      ],
      placeholders: {
        name: '请输入应用名称',
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
      types: ['用户公开表', '用户私有表', '应用数据表'],
      table_msg: '请输入表名!',
      field_msg: '请输入字段名!',
      details: '数据表详情',
      field_types: [
        { label: '字符串', value: 'string' },
        { label: '32位整形数字', value: 'int' },
        { label: '布尔类型', value: 'boolean' },
        { label: '浮点类型', value: 'float' },
        { label: '日期类型', value: 'date' }
      ],
      // 数据表权限类型
      permission_types: [
        { label: '添加', value: 'create' },
        { label: '获取', value: 'get' },
        { label: '查找', value: 'find' },
        { label: '修改', value: 'update' },
        { label: '删除', value: 'delete' }
      ],
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
      types: ['管理员', '普通会员'],
      status_types: ['待激活', '正常', '已停用'],
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
      languages: [
        { label: '中文(简体)', value: 'zh-cn' },
        { label: '英语(美国)', value: 'en-us' }
      ],
      placeholders: {
        sender: '如：noreply'
      },
      fields: {
        sender: '发件者',
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
        banned: '停用'
      },
      fields: {
        id: '用户ID',
        corp_id: '企业ID',
        nick_name: '昵称',
        phone: '手机号码',
        account: '帐号',
        create_time: '创建时间',
        authorize_code: '用户认证码',
        region_id: '所在区域ID',
        source: '用户来源',
        status: '状态'
      }
    },

    ingredient: {
      del: '删除该食材',
      placeholders: {
        name: '请填写食材标题',
        instructions: '请填写食材描述'
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
        tips: '请填写菜谱备注'
      },
      fields: {
        name: '标题',
        images: '成品图',
        classification: '类别',
        instructions: '摘要',
        tips: '备注'
      }
    }
  }
};
