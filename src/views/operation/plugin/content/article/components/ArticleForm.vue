<template>
  <div class="form with-loading">
    <div class="icon-loading" v-show="loadingData">
      <i class="fa fa-refresh fa-spin"></i>
    </div>
    <validator name="validation">
      <form novalidate @submit.prevent="onArticleSubmit">
        <div class="form-row row">
          <label class="form-control col-4">文章标题:</label>
          <div class="controls col-20">
            <div v-placeholder="'请输入标题'" class="input-text-wrap">
              <input v-model="model.name" name="model.name" type="text" v-validate:name="{required: true, maxlength: 250}" lazy class="input-text"/>
            </div>
            <div class="form-tips form-tips-error">
              <span v-if="$validation.name.touched && $validation.name.required">{{ $t('ui.validation.required', {field: '标题'}) }}</span>
              <span v-if="$validation.name.modified && $validation.name.maxlength">{{ $t('ui.validation.maxlength', ['标题', 250]) }}</span>
            </div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-4">正文:</label>
          <div class="controls col-20">
            <div class="radio-group mb10">
              <editor @change="onContentChange" :value="model.text"></editor>
            </div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-4">状态:</label>
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
            <button class="btn btn-primary btn-lg" @click.prevent.stop="previewArticle">预览</button>
            <button class="btn btn-primary btn-lg">提交</button>
          </div>
        </div>
      </form>
    </validator>
  </div>
</template>

<script>
import api from 'api'
import Editor from 'components/Editor'
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
    Editor
  },

  vuex: {
    getters: {
      currentMember: ({ system }) => system.currentMember
    }
  },

  data () {
    return {
      model: {
        name: '',
        text: '',
        status: 0
      },
      submitting: false,
      loadingData: false
    }
  },

  computed: {
    // 表单参数
    formParams () {
      var params = {
        name: this.model.name,
        text: this.model.text,
        status: parseInt(this.model.status),
        creator: this.currentMember.name
      }
      return params
    }
  },

  ready () {
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
          var data = res.data.list[0] ? res.data.list[0] : null
          this.model = data
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
    onContentChange (content) {
      this.model.text = content
    },

    /**
     * 提交表单
     * @author shengzhi
     */
    onArticleSubmit () {
      if (this.$validation.invalid || this.submitting) return

      let process
      let noticeCont = ({
        add: '文章添加成功！',
        edit: '文章修改成功！'
      })[this.type]

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
          this.$route.router.go(`/operation/plugins/content/${this.$route.params.app_id}`)
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 预览文章
     * @author shengzhi
     */
    previewArticle () {}
  }
}
</script>

<style lang="stylus">
.form
  max-width 800px
</style>
