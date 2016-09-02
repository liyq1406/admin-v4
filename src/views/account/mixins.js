import _ from 'lodash'

export const editPasswordMixin = {
  data () {
    return {
      isShowModal: false, // 是否显示浮层
      editing: false,
      confirmPassword: '',
      MEMBER_TYPES: {
        '1': '管理员',
        '2': '运营人员',
        '3': '开发人员'
      },
      model: {}
    }
  },

  methods: {
    /**
     * 修改密码
     * @author shengzhi
     */
    editPwd () {
      this.isShowModal = true
      this.confirmPassword = ''
      this.model = _.clone(this.originModel)
    },

    /**
     * 取消修改密码
     * @author shengzhi
     */
    onEditPwdCancel () {
      this.editing = false
      this.isShowModal = false
      this.$nextTick(() => {
        this.$resetValidation()
      })
    }
  }
}
