<template>
  <modal :show.sync="isShow" width="480px">
    <h3 slot="header">{{ modalTitle }}</h3>
    <div slot="body" class="form">
      <validator name="validation">
        <form novalidate @submit.prevent="onSubmit">
          <div class="form-row row">
            <label class="form-control col-6">名称:</label>
            <div class="controls col-18">
              <div class="input-text-wrap required-sign">
                <input v-model="category.name" type="text" v-validate:name="['required']" class="input-text"/>
              </div>
              <div class="form-tips form-tips-error">
                <span v-if="$validation.name.touched && $validation.name.required">{{ $t('ui.validation.required', {field: $t('ui.recipe.fields.name')}) }}</span>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">描述:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <textarea v-model="category.instructions" type="text" lazy class="input-text"></textarea>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <label v-if="type === 'edit'" class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/> 删除此类别
            </label>
            <button type="submit" :disabled="submiting" :class="{'disabled':submiting}" v-text="submiting ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            <button @click.prevent.stop="onCancel" class="btn btn-default" v-if="type==='edit'">{{ $t("common.cancel") }}</button>
          </div>
        </form>
      </validator>
    </div>
  </modal>
</template>

<script>
import api from 'api'
import Modal from 'components/Modal'
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../../../mixins'
// import _ from 'lodash'

export default {
  name: 'CategoryModal',

  mixins: [globalMixins, pluginMixins],

  vuex: {
    getters: {
      currentMember: ({ system }) => system.currentMember
    }
  },

  props: {
    // 是否显示
    isShow: {
      twoWay: true,
      type: Boolean,
      default: false
    },

    // 是否子类别
    isSub: {
      type: Boolean,
      default: false
    },

    // 类型 ['add' | 'edit']
    type: {
      type: String,
      default: 'add'
    },

    // 分类
    category: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  components: {
    Modal
  },

  data () {
    return {
      delChecked: false, // 是否删除
      submiting: false // 正在提交？
    }
  },

  computed: {
    // 表单标题
    modalTitle () {
      let title = ['类别']

      if (this.isSub) {
        title.unshift('子')
      }

      title.unshift(({
        add: '添加',
        edit: '编辑'
      })[this.type])

      return title.join('')
    }
  },

  methods: {
    /**
     * 取消表单提交
     * @author shengzhi
     */
    onCancel () {
      this.isShow = false
      this.delChecked = false
      this.$resetValidation()
    },

    /**
     * 处理表单提交
     * @author shengzhi
     */
    onSubmit () {
      if (this.submiting) return

      if (this.$validation.invalid) {
        this.$validate(true)
        return
      }

      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      this.submiting = true
      let params = {
        name: this.category.name,
        instructions: this.category.instructions
      }
      let process

      if (this.isSub) {
        params.parent_id = this.$route.params.parent_id
      } else {
        params.parent_id = 0
      }

      if (this.type === 'add') {
        // 添加
        params.creator = this.currentMember.name
        process = api.recipes.createCategory(appId, token, params)
      } else {
        console.log(1111)
        if (this.delChecked) {
          // 删除
          process = api.recipes.deleteCategory(appId, this.category._id, token)
        } else {
          //  更新
          process = api.recipes.updateCategory(appId, this.category._id, token, params)
        }
      }
      process.then((res) => {
        if (res.status === 200) {
          this.$emit('submit-success')
          this.onCancel()
          this.submiting = false
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>
