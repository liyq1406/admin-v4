<template>
  <validator name="validation">
    <form autocomplete="off" novalidate>
      <div class="form-row row">
        <label class="form-control col-6">菜单名称:</label>
        <div class="controls col-18">
          <div class="input-text-wrap">
            <input v-model="menu.type" name="menu.type" type="text" class="input-text" v-validate:chimenu="{required: true, maxlength: 20, format: 'trim'}" >
          </div>
          <div class="form-tips form-tips-error">
            <span v-if="$validation.chimenu.touched && $validation.chimenu.required">请输入菜单名称</span>
            <span v-if="$validation.chimenu.modified && $validation.chimenu.maxlength">菜单名称不能超过20位</span>
            <span v-if="$validation.chimenu.touched && $validation.chimenu.format">菜单名称不允许前后带空格</span>
          </div>
        </div>
      </div>
      <div class="form-actions">
        <label v-if="type==='edit'" class="del-check">
          <input type="checkbox" name="del" v-model="delChecked"/> 删除此菜单
        </label>
        <button @click.prevent.stop="handleSubmit(menu)" class="btn btn-primary">确定</button>
        <button @click.prevent.stop="cancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
      </div>
    </form>
  </validator>
</template>

<script>
import Modal from 'components/Modal'
// import _ from 'lodash'
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
      delChecked: false
      // orignModel: {
      //   type: ''
      // }
    }
  },
  computed: {},

  ready () {
    // this.orignModel.type = this.menu.type
    this.$resetValidation()
  },

  methods: {
    handleSubmit (menu) {
      if (this.$validation.invalid) {
        return
      }
      if (this.delChecked === false) {
        this.$emit('submit', menu)
        this.$resetValidation()
      } else if (this.delChecked === true) {
        this.$emit('delete', menu)
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
