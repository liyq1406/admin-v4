<template>
  <validator name="validation">
    <form autocomplete="off" novalidate>
      <div class="form-row row">
        <label class="form-control col-6">设备提示:</label>
        <div class="controls col-18">
          <div v-placeholder="'请输入设备提示内容，如：请将食物翻面'"  class="input-text-wrap">
            <textarea v-model="cloneModal.prompt_text" name="cloneModal.prompt_text" type="text" class="input-text" v-validate:tip="{maxlength: 30, format: 'trim'}" ></textarea>
          </div>
          <div class="form-tips form-tips-error">
            <!-- <span v-if="$validation.tip.touched && $validation.tip.required">请输入设备提示</span> -->
            <span v-if="$validation.tip.touched && $validation.tip.format">指令提示不允许前后带空格</span>
            <span v-if="$validation.tip.modified && $validation.tip.maxlength">设备提示不能超过30个字符</span>
          </div>
        </div>
      </div>
      <div class="form-actions">
        <label class="del-check" v-if="type==='edit'">
          <input type="checkbox" name="del" v-model="delChecked"/> 删除提示
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
    type: {
      type: String,
      default: 'add'
    },
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
