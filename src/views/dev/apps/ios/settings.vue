<template>
  <!-- 应用配置 -->
  <div class="form">
    <form autocomplete="off" v-form name="validation" @submit.prevent="onEditSubmit">
      <div class="form-row row">
        <label class="form-control col-6">{{ $t("ui.app.fields.name") }}:</label>
        <div class="controls col-18">
          <div v-placeholder="$t('ui.app.placeholders.name')" class="input-text-wrap">
            <input v-model="model.name" type="text" v-form-ctrl name="name" minlength="2" maxlength="32" required lazy class="input-text"/>
          </div>
          <div v-if="validation.$submitted && validation.name.$pristine" class="form-tips form-tips-error"><span v-if="validation.name.$error.required">{{ $t('common.validation.required', {field: $t('ui.app.fields.name')}) }}</span></div>
          <div v-if="validation.name.$dirty" class="form-tips form-tips-error"><span v-if="validation.name.$error.required">{{ $t('common.validation.required', {field: $t('ui.app.fields.name')}) }}</span><span v-if="validation.name.$error.minlength">{{ $t('common.validation.minlength', [ $t('ui.app.fields.name'), 2]) }}</span><span v-if="validation.name.$error.maxlength">{{ $t('common.validation.maxlength', [ $t('ui.app.fields.name'), 32]) }}</span></div>
        </div>
      </div>
      <div class="form-row row">
        <label class="form-control col-6">{{ $t("ui.app.inform") }}:</label>
        <div class="controls col-18">
          <div class="checkbox-group">
            <label class="checkbox">
              <input type="checkbox" name="apn_enable" v-model="model.config.apn.enable"/>{{ $t("ui.app.fields.apn_enable") }}
            </label>
          </div>
        </div>
      </div>
      <div v-show="model.config.apn.enable" class="form-row row">
        <label class="form-control col-6">{{ $t("ui.app.apn_file") }}:</label>
        <div class="controls col-18">
          <label :class="{'disabled':uploading}" class="btn btn-ghost btn-upload">
            <input type="file" v-el:edit-apn-file="v-el:edit-apn-file" name="apnFile" @change.prevent="uploadApn('editApnFile', $event)" :disabled="uploading"/><i class="fa fa-reply-all"></i>{{ uploading ? $t('ui.app.uploading') : $t('ui.app.upload') }}
          </label>
          <div v-if="model.config.apn.license_url" class="file-url">url: {{ model.config.apn.license_url }}</div>
        </div>
      </div>
      <div v-show="model.config.apn.enable" class="form-row row">
        <label class="form-control col-6">{{ $t("ui.app.fields.apn_license_pwd") }}:</label>
        <div class="controls col-18">
          <div v-placeholder="$t('ui.app.placeholders.apn_license_pwd')" class="input-text-wrap">
            <input v-model="model.config.apn.license_pwd" type="text" v-form-ctrl name="apn_license_pwd" class="input-text"/>
          </div>
        </div>
      </div>
      <div v-show="model.config.apn.enable" class="form-row row">
        <div class="controls col-18 col-offset-6">
          <div class="checkbox-group">
            <label class="checkbox">
              <input type="checkbox" name="apn_license_production" v-model="model.config.apn.license_production"/>{{ $t("ui.app.is_release") }}
            </label>
          </div>
        </div>
      </div>
      <div class="form-actions row">
        <div class="col-offset-6 col-6">
          <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary w100"></button>
        </div>
        <div class="col-offset-8 col-4">
          <label class="del-check">
            <input type="checkbox" name="del" v-model="delChecked"/>{{ $t("ui.app.del_app") }}
          </label>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  import api from 'api'
  import _ from 'lodash'
  import { globalMixins } from 'src/mixins'
  import { updatePlugin, removePlugin } from 'store/actions/plugins'

  export default {
    name: 'IosSettings',

    mixins: [globalMixins],

    vuex: {
      actions: {
        updatePlugin,
        removePlugin
      }
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
        currApp: {},
        model: {
          name: '',
          enable: false,
          config: {
            apn: {
              enable: '',
              license_url: '',
              license_pwd: '',
              license_production: ''
            }
          }
        },
        originModel: {},
        validation: {},
        editing: false,
        uploading: false,
        delChecked: false
      }
    },

    watch: {
      app () {
        this.init()
      }
    },

    ready () {
      this.init()
    },

    methods: {
      /**
       * 初始化数据
       * @return {[type]} [description]
       */
      init () {
        if (!this.app) {
          return
        }
        this.currApp = this.app
        this.model.name = this.currApp.name
        this.model.config.apn.enable = this.currApp.config.apn.enable
        this.model.config.apn.license_url = this.currApp.config.apn.license_url
        this.model.config.apn.license_pwd = this.currApp.config.apn.license_pwd
        this.model.config.apn.license_production = this.currApp.config.apn.license_production
      },

      // 初始化应用编辑表单
      onEditApp (app) {
        this.model = _.cloneDeep(app)
        this.originModel = _.cloneDeep(app)
      },

      // 提交应用更新
      onEditSubmit () {
        if (this.delChecked && !this.editing) {
          this.editing = true
          var result = window.confirm('确认删除该应用吗?')
          if (result === true) {
            api.plugin.remove(this.currApp.id).then((res) => {
              if (res.status === 200) {
                this.$emit('update-curr-app')
                // this.removePlugin(this.currApp)
                // this.$route.router.go('/plugins/customize')
              }
            }).catch((res) => {
              this.handleError(res)
              this.editing = false
            })
          } else {
            this.editing = false
          }
        } else {
          this.editing = true
          api.plugin.update(this.currApp.id, this.model).then((res) => {
            if (res.status === 200) {
              this.showNotice({
                type: 'success',
                content: '配置成功'
              })
              this.$emit('update-curr-app')
              this.editing = false
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        }
      },

      // 上传APN文件
      uploadApn (apnFile, event) {
        var file = this.$els[apnFile].files[0]
        var input = event.target

        if (file && file.size > 1024 * 1024) {
          this.showNotice({
            type: 'error',
            content: this.$t('common.upload.compatiblity')
          })
          return
        }

        if (window.File && window.FileReader && window.FileList && window.Blob) {
          var reader = new window.FileReader()
          reader.onerror = (evt) => {
            this.showNotice({
              type: 'error',
              content: this.$t('common.upload.read_err')
            })
          }
          // 读取完成
          reader.onloadend = (evt) => {
            if (evt.target.readyState === window.FileReader.DONE) {
              if (!this.uploading) {
                this.uploading = true
                api.upload.apn(evt.target.result).then((res) => {
                  if (res.status === 200) {
                    input.value = ''
                    this.model.config.apn.license_url = res.data.url
                    this.uploading = false
                  }
                }).catch((res) => {
                  this.handleError(res)
                  this.uploading = false
                })
              }
            }
          }
          reader.readAsArrayBuffer(file)
        } else {
          this.showNotice({
            type: 'error',
            content: this.$t('common.upload.compatiblity')
          })
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
</style>
