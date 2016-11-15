<template>
  <div class="main">
    <div class="main-title">
      <h2>内容管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>

    <div class="panel">
      <div class="panel-bd">
        <article-form></article-form>
      </div>
    </div>
  </div>
</template>

<script>
import ArticleForm from './components/ArticleForm'

export default {
  name: 'addArticle',

  layout: 'admin',
  vuex: {
    getters: {
      currentMember: ({ system }) => system.currentMember
    }
  },

  components: {
    ArticleForm
  },

  data () {
    return {
      breadcrumbNav: [{
        label: '全部文章',
        link: `/operation/plugins/content/${this.$route.params.app_id}/articles`
      }, {
        label: '添加文章'
      }]
    }
  }
}
</script>
