<template>
  <div class="form">
    <div class="form-row row">
      <label class="form-control col-5">文章标题:</label>
      <div class="controls col-19">
        <div v-placeholder="'这里是标题'" class="input-text-wrap">
          <input v-model="model.title" type="text" lazy class="input-text"/>
        </div>
      </div>
    </div>
    <div class="form-row row">
      <label class="form-control col-5">正文:</label>
      <div class="controls col-19">
        <div class="radio-group mb10">
          <editor @change='contentChange'></editor>
        </div>
      </div>
    </div>
    <div class="form-row row">
      <label class="form-control col-5">状态:</label>
      <div class="controls col-19" style="line-height: 32px">
        <label><input v-model='model.status' type="radio" value="1" />已发布</label>
        <label><input v-model='model.status' type="radio" value="0" />待审核</label>
      </div>
    </div>
    <div class="form-actions row">
      <div class="col-offset-5">
        <button type="submit" class="btn btn-primary btn-lg">预览</button>
        <button type="submit" @click='submitArticle' class="btn btn-primary btn-lg">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
import Editor from 'components/Editor'

export default {
  name: 'ArticleForm',

  props: {
    type: {
      type: String,
      default: 'add'
    }
  },

  components: {
    Editor
  },

  data () {
    return {
      model: {
        title: '',
        content: '',
        status: ''
      }
    }
  },

  computed: {
    addParams () {
      var params = {
        name: this.model.title,
        status: parseInt(this.model.status),
        text: this.model.content,
        creator: this.currentMember.name
      }

      params.create_time = new Date()
      return params
    }
  },

  methods: {
    contentChange (content) {
      this.model.content = content
    },
    submitArticle () {
      api.content.addArticle(this.$route.params.app_id, this.addParams).then((res) => {
        this.$route.router.go(`/operation/plugins/content/${this.$route.params.app_id}`)
      }).catch((err) => {
        this.handleError(err)
      })
    }
  }
}
</script>
