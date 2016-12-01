/**
 * 智能维保翻译信息
 * @return {Object}
 */

export default {
  product: '产品',

  // 维保记录
  repair: {
    main_title: '维保记录',
    add: '添加工单',
    search_placeholder: '输入工单编号',
    status_options: {
      received: '已接单',
      processing: '处理中',
      failed: '处理失败',
      finished: '完成'
    },
    query_types: {
      pending: '待处理',
      processing: '维修中',
      finished: '维修完成'
    },
    summary: {
      all: '待维修数',
      processing: '正在维修中',
      today: '今日维修数',
      week: '7日维修数'
    },
    columns: {
      id: '工单编号',
      create_date: '创建时间',
      person: '维修人员',
      content: '维修内容',
      state: '状态'
    }
  },

  // 维保记录表单
  repair_form: {
    add_title: '添加工单',
    edit_title: '修改工单',
    select_product: '选择产品',
    no_product: '暂无产品，请先添加产品',
    no_type: '暂无维修类型，请先添加标签',
    branch_select: '网点选择',
    no_branch: '暂无网点，请先添加网点',
    staff: '处理人员',
    no_staff: '暂无客服，请先添加客服',
    del_confirm: '确认删除该维修工单吗?',
    fields: {
      sn: '设备SN',
      type: '维修类型',
      instructions: '维修内容',
      remark: '维修说明',
      image: '维修照片'
    },
    placeholders: {
      sn: '请输入设备序列号',
      instructions: '请输入维修内容',
      remark: '请输入维修说明'
    }
  },

  // 维修详情
  repair_details: {
    main_title: '维修详情',
    history: '维修历史',
    no_image: '暂无图片',
    device: '维修设备',
    lasting: '持续时长',
    manage_time: '处理时间',
    fees: '维修费用',
    account: '用户帐号',
    comment: '用户评价'
  },

  // 故障事件
  failure: {
    main_title: '故障事件',
    summary: {
      all: '事件总数',
      unfinished: '待处理数',
      today: '今日事件',
      week: '近7天事件数'
    },
    unexpired: '未到期',
    expired: '已到期',
    columns: {
      device_id: '设备ID',
      event_id: '事件ID',
      description: '描述',
      tag: '标签',
      report_time: '上报时间',
      state: '状态'
    },
    pending: '待处理',
    extended_warranty: '已延保'
  },

  branch: {
    main_title: '网点管理',
    add: '添加网点',
    edit: '编辑网点',
    details: '查看详情',
    fields: {
      order: '序号',
      name: '网点名称',
      director: '负责人',
      phone: '联系电话',
      create_time: '创建日期',
      location: '所在地区',
      email: '邮箱地址',
      address: '详细地址'
    }
  },

  // 网点详情
  branch_details: {
    main_title: '网点详情',
    add_staff: '添加客服',
    del: '删除网点'
  },

  // 客服
  staff: {
    add: '添加客服',
    fields: {
      name: '姓名',
      last_login: '最后一次登陆'
    }
  },

  // 客服详情
  staff_details: {
    main_title: '客服详情',
    edit: '编辑客服',
    del: '删除客服'
  },

  // 设置
  settings: {
    main_title: '设置',
    tips: '提示：管理智能维保的问题类别。备注：每行设定一个问题类型，输入框为空时即默认为全部问题类型。'
  }
}
