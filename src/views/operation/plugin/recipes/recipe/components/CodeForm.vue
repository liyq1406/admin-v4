<template>
  <validator name="validation">
    <form autocomplete="off" novalidate>
      <div class="form-row row">
        <label class="form-control col-6">参数名称:</label>
        <div class="controls col-18">
          <div class="input-text-wrap">
            <input v-model="cloneMenu.name" name="cloneMenu.type" type="text" class="input-text" v-validate:name="{required: true, maxlength: 20, format: 'trim'}">
          </div>
          <div class="form-tips form-tips-error">
            <span v-if="$validation.name.touched && $validation.name.required">请输入参数名称</span>
            <span v-if="$validation.name.modified && $validation.name.maxlength">参数名称不能超过20位</span>
            <span v-if="$validation.name.touched && $validation.name.format">参数名称不允许前后带空格</span>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <label class="form-control col-6">参数ID:</label>
        <div class="controls col-18">
          <div class="input-text-wrap">
            <input v-model="cloneMenu.param_id" name="cloneMenu.param_id" type="text" class="input-text" v-validate:id="{required: true, maxlength: 20, format: 'trim'}">
          </div>
          <div class="form-tips form-tips-error">
            <span v-if="$validation.id.touched && $validation.id.required">请输入参数ID</span>
            <span v-if="$validation.id.modified && $validation.id.maxlength">参数ID不能超过20位</span>
            <span v-if="$validation.id.touched && $validation.id.format">参数ID不允许前后带空格</span>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <label class="form-control col-6">参数信息:</label>
        <div class="controls col-18">
          <div class="input-text-wrap">
            <input v-model="cloneMenu.desc" name="cloneMenu.name" type="text" class="input-text" v-validate:desc="{required: true, maxlength: 20, format: 'trim'}">
          </div>
          <div class="form-tips form-tips-error">
            <span v-if="$validation.desc.touched && $validation.desc.required">请输入参数信息</span>
            <span v-if="$validation.desc.modified && $validation.desc.maxlength">参数信息不能超过20位</span>
            <span v-if="$validation.desc.touched && $validation.desc.format">参数信息不允许前后带空格</span>
          </div>
        </div>
      </div>
      <div class="form-actions">
        <label v-if="type==='edit'" class="del-check">
          <input type="checkbox" name="del" v-model="delChecked"/> 删除此参数
        </label>
        <button @click.prevent.stop="handleSubmit(cloneMenu)" class="btn btn-primary">确定</button>
        <button @click.prevent.stop="cancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
      </div>
    </form>
  </validator>
</template>

<script>
import Modal from 'components/Modal'
import _ from 'lodash'
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../../../mixins'

export default {
  name: 'MenuForm',

  layout: 'admin',

  mixins: [globalMixins, pluginMixins],

  components: {
    'modal': Modal
  },

  props: {
    type: {
      type: String,
      default: 'add'
    },
    menu: {
      type: Object,
      default: {}
    }
  },

  data () {
    return {
      delChecked: false,
      cloneMenu: {}
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
  route () {
    this.$resetValidation()
  },

  methods: {
    // 初始化
    init () {
      this.cloneMenu = _.clone(this.menu)
    },
    handleSubmit (cloneMenu) {
      if (this.$validation.invalid) {
        return
      }
      this.menu = this.cloneMenu
      if (this.delChecked === false) {
        this.$emit('submit', this.menu)
        this.$resetValidation()
      } else if (this.delChecked === true) {
        this.$emit('delete', this.menu)
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
