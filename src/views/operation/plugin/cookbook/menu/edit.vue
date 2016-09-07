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
    <div class="panel">
      <div class="panel-bd">
        <button @click.prevent="deleteMenu" class="btn btn-primary btn-lg mt10 mb10">删除该菜单</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../../mixins'
import Breadcrumb from 'components/Breadcrumb'
import MenuForm from './components/MenuForm'

export default {
  name: 'AddMenu',

  mixins: [globalMixins, pluginMixins],

  components: {
    Breadcrumb,
    MenuForm
  },

  data () {
    return {
      breadcrumbNav: [{
        label: '菜单管理',
        link: `/operation/plugins/cookbook/${this.$route.params.app_id}/menus`
      }, {
        label: '编辑菜单'
      }]
    }
  },

  methods: {
    /**
     * 删除菜单
     */
    deleteMenu () {
      if (!window.confirm('确定要删除该菜单吗？')) return

      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      api.cookbook.delMenu(appId, this.$route.params.id, token).then((res) => {
        if (res.status === 200) {
          this.showNotice({
            type: 'success',
            content: '菜单删除成功'
          })
          this.$route.router.go({path: `/operation/plugins/cookbook/${this.$route.params.app_id}/menus`})
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>
