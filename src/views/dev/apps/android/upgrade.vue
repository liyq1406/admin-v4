<template>
  <div class="promote">
    <div class="form">
      <form autocomplete="off" @submit.prevent="onSubmit">
        <div class="form-row row">
          <label class="form-control col-6">升级版本号:</label>
          <div class="controls col-18">
            <div v-placeholder="'请输入升级版本号'" class="input-text-wrap">
              <input v-model="apk.version" name="apk.version" type="text" class="input-text"/>
            </div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-6">下载地址:</label>
          <div class="controls col-18">
            <div v-placeholder="'下载地址URL'" class="input-text-wrap">
              <input v-model="apk.url" name="apk.url" type="text" class="input-text"/>
            </div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-6">HASH值:</label>
          <div class="controls col-18">
            <div v-placeholder="'请输入校验值'" class="input-text-wrap">
              <input v-model="apk.md5" name="apk.md5" type="text" class="input-text"/>
            </div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-6">更新日志:</label>
          <div class="controls col-18">
            <div v-placeholder="'请输入升级说明'" class="input-text-wrap">
              <textarea v-model="apk.illustration" name="apk.illustration" class="input-text"></textarea>
            </div>
          </div>
        </div>
        <div class="form-actions row">
          <div class="col-offset-6 col-18">
            <button type="submit" :disabled="submitting || loadingData" :class="{'disabled':submitting || loadingData}" v-text="submitting ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import api from 'api'
  // import Select from 'components/Select'
  import { globalMixins } from 'src/mixins'
  import { createPlugin, updatePlugin, removePlugin } from 'store/actions/plugins'
  import Table from 'components/Table'
  import Modal from 'components/Modal'
  // import _ from 'lodash'

  export default {
    name: 'AndroidUpgrade',

    mixins: [globalMixins],

    vuex: {
      getters: {
        corp: ({ system }) => system.corp
      },
      actions: {
        createPlugin,
        updatePlugin,
        removePlugin
      }
    },

    components: {
      Modal,
      'x-table': Table
    },

    props: {
      app: {
        type: Object,
        default () {
          return {}
        }
      }
    },

    data () {
      return {
        // 表单正在提交
        submitting: false,
        // 正在加载
        loadingData: false,
        apk: {
          url: '',
          version: '',
          illustration: '',
          md5: ''
        }
      }
    },

    ready () {
      // this.versions = this.app.config.gcm
      this.getVersion()
    },

    methods: {
      /**
       * 获取版本信息
       */
      getVersion () {
        this.loadingData = true
        api.plugin.getApk(this.app.id, this.corp.id).then((res) => {
          if (res.status === 200) {
            this.loadingData = false
            this.apk = res.data
          }
        }).catch((res) => {
          this.loadingData = false
          this.handleError(res)
        })
      },

      /**
       * 编辑浮层表单提交
       * @return {[type]} [description]
       */
      onSubmit () {
        if (this.submitting) return

        this.submitting = true
        api.plugin.setApk(this.app.id, this.apk).then((res) => {
          // this.$emit('update-curr-app')
          this.getVersion()
          this.showNotice({
            type: 'success',
            content: '设置成功'
          })
          this.submitting = false
        }).catch((res) => {
          this.showNotice({
            type: 'error',
            content: '设置失败'
          })
          this.submitting = false
        })
      }
    }
  }
</script>

<style lang="stylus">
@import '../../../../assets/stylus/common'

  .promote
    min-height 400px
    .link-text
      color red
      word-break break-word

</style>
