<template>
  <div class="main">
    <div class="main-title">
      <h2>文章管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>

    <div class="panel">
      <div class="panel-bd">
        <article-form type="edit"></article-form>
      </div>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <button @click.prevent="deleteArticle" class="btn btn-primary btn-lg mt10 mb10">删除</button>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import Breadcrumb from 'components/Breadcrumb'
import ArticleForm from './components/ArticleForm'
import api from 'api'

export default {
  name: 'EditArticle',

  layout: 'admin',

  mixins: [globalMixins],

  vuex: {
    getters: {
      currentMember: ({ system }) => system.currentMember
    }
  },

  components: {
    Breadcrumb,
    ArticleForm
  },

  data () {
    return {
      breadcrumbNav: [{
        label: '全部文章',
        link: `/operation/plugins/content/${this.$route.params.app_id}`
      }, {
        label: '编辑文章'
      }]
    }
  },

  methods: {
    /**
     * 删除文章
     */
    deleteArticle () {
      if (!window.confirm('确定要删除该篇文章吗？')) return

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
    }
  }
}
</script>
