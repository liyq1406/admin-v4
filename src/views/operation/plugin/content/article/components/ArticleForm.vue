<template>
  <div class="form with-loading">
    <div class="icon-loading" v-show="loadingData">
      <i class="fa fa-refresh fa-spin"></i>
    </div>
    <validator name="validation">
      <form autocomplete="off" novalidate @submit.prevent="onArticleSubmit">
        <div class="form-row row">
          <label class="form-control col-4"><i class="hl-red">*</i> 文章标题:</label>
          <div class="controls col-20">
            <div v-placeholder="'请输入标题'" class="input-text-wrap">
              <input v-model="model.name" name="model.name" type="text" v-validate:name="{required: true, maxlength: 50, format: 'trim'}" lazy class="input-text"/>
            </div>
            <div class="form-tips form-tips-error">
              <span v-if="$validation.name.touched && $validation.name.required">{{ $t('common.validation.required', {field: '标题'}) }}</span>
              <span v-if="$validation.name.modified && $validation.name.maxlength">{{ $t('common.validation.maxlength', ['标题', 50]) }}</span>
              <span v-if="$validation.name.touched && $validation.name.format">标题不允许前后带空格</span>
            </div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-4">封面图片:</label>
          <div class="controls col-20">
            <div class="img-box">
              <image-uploader :images="images" @modified="onModifiedImages(images)"></image-uploader>
            </div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-4"><i class="hl-red">*</i> 正文:</label>
          <div class="controls col-20">
            <editor :input-content="model.text" @input="onInput"></editor>
            <input type="text" v-model="outputContent" name="outputContent" v-validate:text="{required: true}" class="hidden">
            <div class="form-tips form-tips-error">
              <span v-if="$validation.text.touched && $validation.text.required">{{ $t('common.validation.required', {field: '正文'}) }}</span>
            </div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-4">标签:</label>
          <div class="controls col-20">
            <tag-input :value.sync="tag" :input-disabled="true" :candidate="candidateTags" :editing.sync="editingTag" @adding-tag="show = true"></tag-input>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-4"><i class="hl-red">*</i> 状态:</label>
          <div class="controls col-20">
            <div class="radio-group">
              <label class="radio">
                <input type="radio" v-model="model.status" name="model.status" :value="1"/>已发布
              </label>
              <label class="radio">
                <input type="radio" v-model="model.status" name="model.status" :value="0"/>待审核
              </label>
            </div>
          </div>
        </div>
        <div class="form-actions row">
          <div class="col-offset-4">
            <button class="btn btn-primary btn-lg" :disabled="submitting || deleting" :class="{'disabled':submitting}" v-text="submitting ? $t('common.handling') : $t('common.ok')"></button>
            <button class="btn btn-ghost btn-lg" @click.prevent.stop="previewArticle">预览</button>
            <button @click.stop.prevent="deleteArticle" class="btn btn-ghost btn-lg" :disabled="submitting || deleting" :class="{'disabled':deleting}" v-if="type==='edit'" v-text="deleting ? $t('common.handling') : $t('common.del')"></button>
          </div>
        </div>
      </form>
    </validator>
  </div>
</template>

<script>
import api from 'api'
import Editor from 'components/form/editor/Editor'
import ImageUploader from 'components/ImageUploader'
import TagInput from 'components/TagInput'
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../../../mixins'

export default {
  name: 'ArticleForm',

  mixins: [globalMixins, pluginMixins],

  props: {
    type: {
      type: String,
      default: 'add'
    }
  },

  components: {
    Editor,
    ImageUploader,
    TagInput
  },

  vuex: {
    getters: {
      currentMember: ({ system }) => system.currentMember
    }
  },

  data () {
    return {
      outputContent: '',
      model: {
        name: '',
        text: '',
        status: 0
      },
      images: [''],
      submitting: false,
      deleting: false,
      loadingData: false,
      tag: '',
      candidateTags: [],
      editingTag: false,
      show: false,
      loadingTags: false
    }
  },

  computed: {
    // 表单参数
    formParams () {
      var params = {
        name: this.model.name,
        text: this.outputContent,
        cover: this.images,
        status: parseInt(this.model.status),
        label: _.compact(this.tag.split(',')),
        creator: this.currentMember.name
      }
      return params
    }
  },

  ready () {
    // 获取标签列表
    this.getTags()

    // 如果是编辑表单
    if (this.type === 'edit') {
      var condition = {
        filter: [],
        limit: 1,
        offset: 0,
        query: {
          _id: this.$route.params.id
        }
      }

      this.loadingData = true
      api.content.getArticleList(this.$route.params.app_id, condition).then((res) => {
        if (res.status === 200) {
          var data = res.data.list[0] ? res.data.list[0] : {}
          this.model = data
          this.images = data.cover || ['']
          this.tag = data.label ? data.label.join(',') : ''
          this.loadingData = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    }
  },

  methods: {
    /**
     * 处理内容改变
     * @author shengzhi
     * @param {String} content 编辑器内容
     */
    onInput (content) {
      if (typeof content === 'string') {
        this.outputContent = content
      }
    },

    /**
     * 提交表单
     * @author shengzhi
     */
    onArticleSubmit () {
      if (this.submitting) return

      if (this.$validation.invalid) {
        this.$validate(true)
        return
      }

      // 不选取内容不允许提交
      let images = _.compact(this.images)
      if (!images.length) {
        this.showError('请添加图片')
        return
      }

      let process
      let noticeCont = ({
        add: '文章添加成功！',
        edit: '文章修改成功！'
      })[this.type]

      this.submitting = true
      if (this.type === 'add') {
        process = api.content.addArticle(this.$route.params.app_id, this.formParams)
      } else {
        process = api.content.updateArticle(this.$route.params.app_id, this.$route.params.id, this.formParams)
      }
      process.then((res) => {
        if (res.status === 200) {
          this.showNotice({
            type: 'success',
            content: noticeCont
          })
          this.$route.router.go(`/operation/plugins/content/${this.$route.params.app_id}/articles`)
        }
      }).catch((res) => {
        this.submitting = false
        this.handleError(res)
      })
    },

    /**
     * 选择图片
     * @param  {[type]} images [description]
     * @return {[type]}        [description]
     */
    onModifiedImages (images) {
      this.images = images
    },

    /**
     * 删除文章
     */
    deleteArticle () {
      if (!window.confirm('确定要删除该篇文章吗？')) return

      this.deleting = true
      api.content.delArticle(this.$route.params.app_id, this.$route.params.id).then((res) => {
        if (res.status === 200) {
          this.showNotice({
            type: 'success',
            content: '文章删除成功'
          })
          this.$route.router.go({path: `/operation/plugins/content/${this.$route.params.app_id}`})
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 预览文章
     * @author shengzhi
     */
    previewArticle () {},

    /**
     * 获取标签
     */
    getTags () {
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token
      let condition = {
        limit: 200,
        query: {}
      }

      this.loadingTags = true
      api.content.getTags(appId, token, condition).then((res) => {
        if (res.status === 200) {
          this.candidateTags = res.data.list.map((item) => {
            return item.label
          })
          this.loadingTags = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingTags = false
      })
    }
  }
}
</script>

<style lang="stylus">
.form
  max-width 800px
</style>
