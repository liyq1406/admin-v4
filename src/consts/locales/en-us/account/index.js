/**
 * 帐户相关翻译
 * @return {Object}
 */

export default {
  // 账号信息
  info: {
    change_password: 'Update Password',
    edit_account_msg: 'Update Account Information',
    personal: 'Personal Information',
    corp: 'Enterprise Information',
    edit_member: 'Update User Information',
    password_msg: 'Update Password Success',
    placeholders: {
      old_password: 'Old Password',
      new_password: 'New Password'
    },
    fields: {
      old_password: 'Old Password',
      new_password: 'New Password'
    },
    role: 'Role',
    password: 'Password',
    phone: 'Phone NO',
    email: 'Email',
    last_login: 'Last Login Time',
    create_time: 'Creation Time',
    name: 'Name',
    required_name: 'Name is required.'
  },

  // 成员管理
  members: {
    add_member: 'Add Member',
    last_login: 'Last Login Time',
    phone_number: 'Phone NO',
    name: 'Name',
    phone: 'Phone NO',
    email: 'Email',
    name_no_space: 'No space before or after name',
    password: 'Password',
    comfirm_password: 'Confirm Password',
    not_enabled: 'Disabled',
    enabled: 'Enabled',
    not_action: 'Nonactivated',
    not_enabled_account: 'Disabled Account',
    enabled_account: 'Enabled Account',
    delete_member: 'Delete Member',
    change_password: 'Update Password',
    no_permissions: 'No permission to update.',
    change_role: 'Change Role',
    role: 'Role',
    member_data: 'Member Data',
    comfirm_delete: 'Confirm Delete',
    search_palceholder: 'Name, Email, Phone NO',
    search_label: 'Search Member ',
    member_list: 'Member List',
    del_msg: 'Confirm to delete this member?',
    alert_settings: 'Notification and Alert',
    placeholders: {
      name: 'Please input name',
      email: 'Please input member Email'
    },
    fields: {
      name: 'Name',
      password: 'Password',
      phone: 'Phone NO',
      email: 'Email',
      create_time: 'Creation Time',
      last_auth_time: 'Latest login time',
      role: 'Role',
      is_notice: 'Accept Notification',
      is_alert: 'Accept Alert'
    }
  },

  // 授权管理
  authorize: {
    authorize_list: 'Authorization List',
    add_authorize: 'Add Authorization',
    create_time: 'Create time',
    del_authorize: 'Delete Authorization',
    action: 'Operation',
    authorize_name: 'Authorization Name',
    placeholders: {
      name: 'Enter application URL.',
      apn_license_pwd: 'Please enter the password of the authorization file.',
      wechat_id: 'Please enter WeChat Official ID.',
      wechat_app_id: 'Please enter WeChat Official APPID.',
      wechat_app_secret: 'Please enter WeChat Official APP Secret.',
      wechat_key: 'Please enter the 43 characters length WeChat key.',
      app_url: 'Please enter WeChat message receiving URL of Xlink APP.'
    },
    fields: {
      id: 'Application ID',
      name: 'Application Name',
      type: 'Application Type',
      url: 'APP URL',
      create_time: 'Creation Time',
      apn_enable: 'Enable Apple APN Service',
      apn_license_pwd: 'SN Password',
      wechat_id: 'WeChat Office ID',
      wechat_app_id: 'APPID',
      wechat_app_secret: 'APPSecret',
      wechat_encrypt: 'Message Encrytion/Decrytion Mode',
      wechat_key: 'WeChat Key',
      app_url: 'APP Url',
      app_token: 'APP Token'
    }
  },

  // 安全审计
  security: {
    search_member: 'Search Member ',
    log_list: 'Log List',
    member_name: 'Member Name',
    member_id: 'Member ID',
    user_ip: 'User IP',
    log_abstract: 'Log Abstract',
    log_level: 'Level',
    action_type: 'Operation Type',
    action_time: 'Operation Time',
    notice: 'Notice',
    alert: 'Alert',
    error: 'Error',
    placeholder: {
      id: 'Member ID'
    }
  },

  // 企业信息
  corp: {
    corp_id: 'Enterprise ID',
    app_type: 'Application Type',
    contact: 'Contact',
    create_time: 'Creation Time',
    phone: 'Phone NO',
    email: 'Email'
  }
}
