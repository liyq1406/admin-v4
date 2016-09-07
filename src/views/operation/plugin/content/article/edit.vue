<template>
  <div class="main">
    <div class="main-title">
      <h2>内容管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>

    <div class="panel">
      <div class="panel-bd">
        <article-form type="edit"></article-form>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import Breadcrumb from 'components/Breadcrumb'
import ArticleForm from './components/ArticleForm'

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
  }
}
</script>
