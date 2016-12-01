/**
 * 智能维保翻译信息
 * @return {Object}
 */

export default {
  product: 'Product',

  // 维保记录
  repair: {
    main_title: 'Maintenance Record',
    add: 'Add Record',
    search_placeholder: 'Input Record Number',
    status_options: {
      received: 'Accepted',
      processing: 'Processing',
      failed: 'Failed',
      finished: 'Finished'
    },
    query_types: {
      pending: 'Pending',
      processing: 'Processing',
      finished: 'Finished'
    },
    summary: {
      all: 'All',
      processing: 'Processing',
      today: '1 Day',
      week: '7 Days'
    },
    columns: {
      id: 'ID',
      create_date: 'Create Date',
      person: 'Engineer',
      content: 'Content',
      state: 'State'
    }
  },

  // 维保记录表单
  repair_form: {
    add_title: 'New Order',
    edit_title: 'Modify',
    select_product: 'Select Product',
    no_product: 'Select product first',
    no_type: 'Add tag first',
    branch_select: 'Select Point',
    no_branch: 'Add Point first',
    staff: 'Staff',
    no_staff: 'Add staff first',
    del_confirm: 'Confirm delete order?',
    fields: {
      sn: 'SN',
      type: 'Type',
      instructions: 'Instructions',
      remark: 'Remark',
      image: 'Image'
    },
    placeholders: {
      sn: 'Input Device SN',
      instructions: 'Input Instructions',
      remark: 'Input Remark'
    }
  },

  // 维修详情
  repair_details: {
    main_title: 'Maintenance Detail',
    history: 'History',
    no_image: 'No Image',
    device: 'Device',
    lasting: 'Lasting',
    manage_time: 'Maintenance Time',
    fees: 'Fees',
    account: 'Account',
    comment: 'Comment'
  },

  // 故障事件
  failure: {
    main_title: 'Malfunction Event',
    summary: {
      all: 'All',
      unfinished: 'Unfinished',
      today: '1 Day',
      week: '7 Days'
    },
    unexpired: 'Unexpired',
    expired: 'Expired',
    columns: {
      device_id: 'Device ID',
      event_id: 'Event ID',
      description: 'Description',
      tag: 'Tag',
      report_time: 'Report Date',
      state: 'State'
    },
    pending: 'Pending',
    extended_warranty: 'Extended Warranty'
  },

  branch: {
    main_title: 'Point Manager',
    add: 'Add Point',
    edit: 'Edit Point',
    details: 'Details',
    fields: {
      order: 'Order',
      name: 'Name',
      director: 'Contactor',
      phone: 'Phone',
      create_time: 'Create Time',
      location: 'Location',
      email: 'Email',
      address: 'Address'
    }
  },

  // 网点详情
  branch_details: {
    main_title: 'Detail',
    add_staff: 'Add Staff',
    del: 'Delete'
  },

  // 客服
  staff: {
    add: 'Add Staff',
    fields: {
      name: 'Name',
      last_login: 'Last Login'
    }
  },

  // 客服详情
  staff_details: {
    main_title: 'Staff',
    edit: 'Edit',
    del: 'Delete'
  },

  // 设置
  settings: {
    main_title: 'Settings',
    tips: 'Tips：Manage the categories for Smart Maintenance. Note: Each line to set a problem categorie, the input box is empty which use all the problem categories.'
  }
}
