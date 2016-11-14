<template>
  <div class="main">
    <div class="main-title">
      <h2>菜单管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel">
      <div class="panel-bd">
        <menu-form type="edit"></menu-form>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../../mixins'
import MenuForm from './components/MenuForm'

export default {
  name: 'AddMenu',

  mixins: [globalMixins, pluginMixins],

  components: {
    MenuForm
  },

  data () {
    return {
      breadcrumbNav: [{
        label: '菜单管理',
        link: `/operation/plugins/recipes/${this.$route.params.app_id}/menus`
      }, {
        label: '编辑菜单'
      }]
    }
  }
}
</script>
