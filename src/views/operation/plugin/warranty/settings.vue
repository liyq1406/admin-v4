<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>设置</h2>
    </div>
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="x-intro">提示：管理智能维保的问题类别。备注：每行设定一个问题类型，输入框为空时即默认为全部问题类型。</div>
        <div class="form">
          <div class="form-row">
            <div class="input-text-wrap">
              <textarea class="input-text" v-model="tags | formatTags"></textarea>
            </div>
          </div>
          <div class="form-action">
            <button class="btn btn-primary btn-lg" @click.prevent="updateTags">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../mixins'
import api from 'api'

export default {
  name: 'Settings',

  mixins: [globalMixins, pluginMixins],

  data () {
    return {
      tags: []
    }
  },

  route: {
    data () {
      this.getTags()
    }
  },

  methods: {
    // 获取标签
    getTags () {
      api.warranty.getWarrantyLabel(this.$route.params.app_id).then((res) => {
        console.log(res)
        this.tags = res.data.label
      }).catch((res) => {
        this.handleError(res)
      })
    },
    // 编辑标签
    updateTags () {
      var params = {
        label: []
      }
      params.label = this.tags
      api.warranty.saveWarrantyLabel(this.$route.params.app_id, params).then((res) => {
        console.log(res)
        this.showNotice({
          type: 'info',
          content: '已成功修改标签'
        })
        this.getTags()
      }).catch((res) => {
        this.showNotice({
          type: 'error',
          content: '修改标签失败'
        })
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'

.x-intro
  background #eaedf2
  padding 10px 15px
  color #62878F

.form
  padding-top 10px

textarea.input-text
  height 300px
</style>
