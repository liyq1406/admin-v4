<template>
  <div class="promote">
    <!-- <pre>{{app | json}}</pre> -->
    <div class="btn-box mt20 mb20">
      <button class="btn btn-primary w100" @click="onShowEditModal">编辑版本信息</button>
    </div>
    <x-table :headers="headers" :tables="tables" :loading="loadingData" :bordered="false" @tbody-apk-url="onShowLink"></x-table>

    <!-- 编辑版本信息 -->
    <modal :show.sync="showEditModal" :width="'550px'">
      <h3 slot="header">编辑版本信息</h3>
      <div slot="body">
        <div class="form">
          <form @submit.prevent="onSubmit">
            <div class="form-row row">
              <label class="form-control col-6">升级版本号:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入升级版本号'" class="input-text-wrap">
                  <input v-model="editModal.version" type="text" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">下载地址:</label>
              <div class="controls col-18">
                <div v-placeholder="'下载地址URL'" class="input-text-wrap">
                  <input v-model="editModal.url" type="text" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">HASH值:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入校验值'" class="input-text-wrap">
                  <input v-model="editModal.md5" type="text" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">更新日志:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入升级说明'" class="input-text-wrap">
                  <textarea v-model="editModal.illustration" class="input-text"></textarea>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
              <button @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            </div>
          </form>
        </div>
      </div>
    </modal>

    <!-- Start: 查看链接-->
    <modal :show.sync="linkModal.show">
      <h3 slot="header">查看链接</h3>
      <div slot="body" class="tac">
        <p class="link-text">{{ linkModal.content }}</p>
      </div>
    </modal>
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
        // 显示编辑浮层
        showEditModal: false,
        // 表单正在提交
        adding: false,
        // 正在加载
        loadingData: false,
        linkModal: {
          show: false,
          content: ''
        },
        editModal: {
          'url': '安卓APK文件的下载URL',
          'version': 'APK的版本号',
          'illustration': 'APK的版本说明',
          'md5': '文件md5校验值'
        },
        versions: {
          api_key: '安卓调用推送所需要的api key',
          enable: false, // 'gcm推送是否启用'
          apk_version: 1,
          apk_illustration: '升级说明',
          apk_url: 'apk_url',
          apk_md5: 'apk的md5值'
        },
        headers: [
          {
            key: 'apk_version',
            title: '目标版本号',
            class: 'w150'
          },
          {
            key: 'apk_illustration',
            title: '更新日志'
          },
          {
            key: 'apk_url',
            title: '下载链接',
            class: 'w80'
          }
        ]
      }
    },

    computed: {
      /**
       * 传入智能表格的数据对象
       * 国辉
       * @return {[type]} [description]
       */
      tables () {
        var result = []
        var table = {
          apk_version: this.versions.version || '-',
          apk_illustration: this.versions.illustration || '-',
          apk_md5: this.md5 || '-',
          apk_url: '<a class="hl-red">查看链接</a>',
          prototype: this.versions
        }
        result.push(table)
        return result
      }
    },

    ready () {
      // this.versions = this.app.config.gcm
      this.getVersions()
    },

    methods: {
      /**
       * 获取版本信息
       */
      getVersions () {
        api.plugin.getAndVersion(this.app.id, this.corp.id).then((res) => {
          if (res.status === 200) {
            this.versions = res.data
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      /**
       * 编辑浮层表单提交
       * @return {[type]} [description]
       */
      onSubmit () {
        this.adding = true
        this.editModal.version = this.editModal.version
        api.plugin.setAndVersion(this.app.id, this.editModal).then((res) => {
          // this.$emit('update-curr-app')
          this.getVersions()
          this.adding = false
          this.showEditModal = false
        }).catch((res) => {
          this.handleError(res)
          this.adding = false
        })
      },
      /**
       * [onEditCancel description]
       * @return {[type]} [description]
       */
      onEditCancel () {
        this.showEditModal = false
      },
      /**
       * 显示编辑浮层
       * @return {[type]} [description]
       */
      onShowEditModal () {
        this.showEditModal = true
        this.editModal.illustration = this.versions.illustration
        this.editModal.md5 = this.versions.md5
        this.editModal.url = this.versions.url
        this.editModal.version = this.versions.version
      },
      /**
       * 显示链接浮层
       * @param  {[type]} table [description]
       * @return {[type]}       [description]
       */
      onShowLink (table) {
        if (table.prototype.url) {
          this.linkModal.show = true
          this.linkModal.content = table.prototype.url
        } else {
          this.showNotice({
            type: 'error',
            content: '暂无链接'
          })
        }
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
