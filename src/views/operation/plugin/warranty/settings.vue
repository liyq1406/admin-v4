<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>{{ $t('operation.warranty.settings.main_title') }}</h2>
    </div>
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="x-intro">{{ $t('operation.warranty.settings.tips') }}</div>
        <div class="form">
          <div class="form-row">
            <div class="input-text-wrap">
              <textarea class="input-text" v-model="tags | formatTags"></textarea>
            </div>
          </div>
          <div class="form-action">
            <button class="btn btn-primary btn-xlg" @click.prevent="updateTags">{{ $t('common.save') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { pluginMixins } from '../mixins'
import { warrantyMixins } from './mixins'
import api from 'api'

export default {
  name: 'Settings',

  mixins: [pluginMixins, warrantyMixins],

  data () {
    return {
      token: JSON.parse(window.localStorage.pluginsToken)[this.$route.params.app_id].token,
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
      // token 不存在，无权限访问
      if (!this.token) {
        this.showNoTokenError()
        return
      }

      api.warranty.getWarrantyLabel(this.$route.params.app_id).then((res) => {
        console.log(res)
        this.tags = res.data.label
      }).catch((res) => {
        this.handleError(res)
      })
    },
    // 编辑标签
    updateTags () {
      // token 不存在，无权限访问
      if (!this.token) {
        this.showNoTokenError()
        return
      }

      var params = {
        label: []
      }
      params.label = this.tags
      api.warranty.saveWarrantyLabel(this.$route.params.app_id, params).then((res) => {
        console.log(res)
        this.showNotice({
          type: 'info',
          content: this.$t('common.action_success')
        })
        this.getTags()
      }).catch((res) => {
        this.showNotice({
          type: 'error',
          content: this.$t('common.action_fail')
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
