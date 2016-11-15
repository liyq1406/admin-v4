<template>
  <validator name="validation">
    <form autocomplete="off" novalidate>
      <div class="form-row row">
        <label class="form-control col-6">设备指令:</label>
        <div class="controls col-18">
          <div class="input-text-wrap">
            <textarea v-model="cloneModal.value" name="cloneModal" type="text" class="input-text" v-validate:ins="{required: true, format: 'trim'}" ></textarea>
          </div>
          <div class="form-tips form-tips-error">
            <span v-if="$validation.ins.touched && $validation.ins.required">请输入设备指令</span>
            <span v-if="$validation.ins.touched && $validation.ins.format">指令名称不允许前后带空格</span>
          </div>
        </div>
      </div>
      <div class="form-actions">
        <label class="del-check">
          <input type="checkbox" name="del" v-model="delChecked"/> 删除该菜谱的智能烹饪功能
        </label>
        <button @click.prevent.stop="handleSubmit(cloneModal)" class="btn btn-primary">确定</button>
        <button @click.prevent.stop="cancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
      </div>
    </form>
  </validator>
</template>

<script>
import { pluginMixins } from '../../../mixins'

export default {
  name: 'InsForm',

  layout: 'admin',

  mixins: [pluginMixins],

  props: {
    model: {
      type: Object,
      default: {}
    }
  },

  data () {
    return {
      delChecked: false,
      cloneModal: {}
      // orignModel: {
      //   type: ''
      // }
    }
  },
  computed: {},

  ready () {
    // this.orignModel.type = this.menu.type
    this.$resetValidation()
    this.init()
  },

  methods: {
    // 初始化
    init () {
      this.cloneModal = _.clone(this.model)
      // console.log('cloneMenu:' + JSON.stringify(this.cloneMenu))
    },
    handleSubmit (cloneModal) {
      if (this.$validation.invalid) {
        return this.$validate(true)
      }
      this.model = this.cloneModal
      if (this.delChecked === false) {
        this.$emit('submit', this.model)
        this.$resetValidation()
      } else if (this.delChecked === true) {
        this.$emit('delete', this.model)
        this.$resetValidation()
      }
    },
    cancel () {
      this.$emit('close')
      this.$resetValidation()
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../../../../../assets/stylus/common'
</style>
