<template>
  <modal :show.sync="isShow" width="480px" @close="onCancel">
    <h3 slot="header">{{ modalTitle }}</h3>
    <div slot="body" class="form">
      <validator name="validation">
        <form novalidate @submit.prevent="onSubmit">
          <div class="form-row row">
            <label class="form-control col-6">名称:</label>
            <div class="controls col-18">
              <div class="input-text-wrap required-sign" v-placeholder="'请填写菜谱类别名称，如“菜系”'">
                <input v-model="category.name" name="category.name" type="text" v-validate:name="{required: true, maxlength: 20, format: 'no-spaces-both-ends'}" class="input-text"/>
              </div>
              <div class="form-tips form-tips-error">
                <span v-if="$validation.name.touched && $validation.name.required">{{ $t('ui.validation.required', {field: $t('ui.recipe.fields.name')}) }}</span>
                <span v-if="$validation.name.modified && $validation.name.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.recipe.fields.name'), 20]) }}</span>
                <span v-if="$validation.name.touched && $validation.name.format">名称不允许前后带空格</span>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">描述:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <textarea v-model="category.instructions" type="text" lazy class="input-text" v-validate:instructions="{maxlength: 40}"></textarea>
              </div>
              <div class="form-tips form-tips-error">
                <span v-if="$validation.instructions.touched && $validation.instructions.maxlength">{{ $t('ui.validation.maxlength', ['描述', 40]) }}</span>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">分类图片:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <image-uploader :images="images" @modified="onModifiedImages(images)"></image-uploader>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <label v-if="type === 'edit'" class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/> 删除此类别
            </label>
            <button type="submit" :disabled="submiting" :class="{'disabled':submiting}" v-text="submiting ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            <button @click.prevent.stop="onCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          </div>
        </form>
      </validator>
    </div>
  </modal>
</template>

<script>
import api from 'api'
import Modal from 'components/Modal'
import ImageUploader from 'components/ImageUploader'
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../../../mixins'
import _ from 'lodash'

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
    ImageUploader,
    Modal
  },

  data () {
    return {
      images: [''], // 分类图片
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

  watch: {
    isShow () {
      if (this.isShow) {
        let images = _.compact(this.category.images)
        this.images = images.length ? images : ['']
      }
    }
  },

  methods: {
    /**
     * 处理图片上传
     * @param  {Array} images 图片路径数组
     */
    onModifiedImages (images, data) {
      images = data
    },

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
        images: _.compact(_.clone(this.images)),
        instructions: this.category.instructions
      }
      let process

      if (this.isSub) { // 子类别
        params.parent_id = this.$route.params.parent_id
      } else {
        params.parent_id = 0
      }

      if (this.type === 'add') {
        // 添加
        params.creator = this.currentMember.name
        process = api.recipes.createCategory(appId, token, params)
      } else {
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
        this.submiting = false
        this.handleError(res)
      })
    }
  }
}
</script>
