/**
 * 帐户相关翻译
 * @return {Object}
 */

export default {
  // 帐号信息
  info: {
    change_password: '修改密码',
    edit_account_msg: '编辑帐号信息',
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
    },
    role: '角色',
    password: '密码',
    phone: '手机',
    email: '邮箱',
    last_login: '最后登录',
    create_time: '创建时间',
    name: '名称',
    required_name: '名称为必填项'
  },

  // 成员管理
  members: {
    add_member: '添加成员',
    last_login: '最后一次登陆',
    phone_number: '手机号码',
    name: '姓名',
    phone: '手机',
    email: '邮箱',
    name_no_space: '名字前后不能包含空格',
    password: '密码',
    comfirm_password: '确认密码',
    not_enabled: '已停用',
    enabled: '已启用',
    not_action: '未激活',
    not_enabled_account: '停用帐号',
    enabled_account: '启用帐号',
    delete_member: '删除成员',
    change_password: '修改密码',
    no_permissions: '无权修改',
    change_role: '修改角色',
    role: '角色',
    member_data: '成员资料',
    comfirm_delete: '确认删除',
    search_palceholder: '姓名、邮箱、手机',
    search_label: '查找成员',
    member_list: '成员列表',
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

  // 授权管理
  authorize: {
    authorize_list: '授权列表',
    add_authorize: '添加授权',
    create_time: '创建时间',
    del_authorize: '删除授权',
    action: '操作',
    authorize_name: '授权名称',
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
      app_url: 'APPUrl',
      app_token: 'APPToken'
    }
  },

  // 安全审计
  security: {
    search_member: '搜索成员',
    log_list: '日志列表',
    member_name: '成员姓名',
    member_id: '成员ID',
    user_ip: '操作者IP',
    log_abstract: '日志摘要',
    log_level: '日志级别',
    action_type: '操作类型',
    action_time: '操作时间',
    notice: '通知',
    alert: '告警',
    error: '错误',
    placeholder: {
      id: '请输入成员ID'
    }
  },

  // 企业信息
  corp: {
    corp_id: '企业ID',
    app_type: '应用类型',
    contact: '联系人',
    create_time: '创建时间',
    phone: '手机',
    email: '邮箱'
  }
}
