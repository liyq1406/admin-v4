<template>
  <div>
    <div class="panel">
      <div class="panel-bd">
        <div class="form">
          <form v-form name="validation" @submit.prevent="onEditSubmit">
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("app.fields.name") }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('app.placeholders.name')" class="input-text-wrap">
                  <input v-model="model.name" type="text" v-form-ctrl name="name" minlength="2" maxlength="32" required lazy class="input-text"/>
                </div>
                <div v-if="validation.$submitted && validation.name.$pristine" class="form-tips form-tips-error"><span v-if="validation.name.$error.required">{{ $t('validation.required', {field: $t('app.fields.name')}) }}</span></div>
                <div v-if="validation.name.$dirty" class="form-tips form-tips-error"><span v-if="validation.name.$error.required">{{ $t('validation.required', {field: $t('app.fields.name')}) }}</span><span v-if="validation.name.$error.minlength">{{ $t('validation.minlength', [ $t('app.fields.name'), 2]) }}</span><span v-if="validation.name.$error.maxlength">{{ $t('validation.maxlength', [ $t('app.fields.name'), 32]) }}</span></div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("app.inform") }}:</label>
              <div class="controls col-18">
                <div class="checkbox-group">
                  <label class="checkbox">
                    <input type="checkbox" name="apn_enable" v-model="model.apn_enable"/>{{ $t("app.fields.apn_enable") }}
                  </label>
                </div>
              </div>
            </div>
            <div v-show="model.apn_enable" class="form-row row">
              <label class="form-control col-6">{{ $t("app.apn_file") }}:</label>
              <div class="controls col-18">
                <div class="row">
                  <div class="col-8">
                    <label :class="{'disabled':uploading}" class="btn btn-success btn-upload">
                      <input type="file" v-el:edit-apn-file="v-el:edit-apn-file" name="apnFile" @change.prevent="uploadApn('editApnFile', $event)" :disabled="uploading"/><i class="fa fa-reply-all"></i>{{ uploading ? $t('app.uploading') : $t('app.upload') }}
                    </label>
                  </div>
                  <div class="col-16">
                    <div v-if="model.apn_license_url" class="file-url">url: {{ model.apn_license_url }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="model.apn_enable" class="form-row row">
              <label class="form-control col-6">{{ $t("app.fields.apn_license_pwd") }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('app.placeholders.apn_license_pwd')" class="input-text-wrap">
                  <input v-model="model.apn_license_pwd" type="text" v-form-ctrl name="apn_license_pwd" class="input-text"/>
                </div>
              </div>
            </div>
            <div v-show="model.apn_enable" class="form-row row">
              <div class="controls col-18 col-offset-6">
                <div class="checkbox-group">
                  <label class="checkbox">
                    <input type="checkbox" name="apn_license_production" v-model="model.apn_license_production"/>{{ $t("app.is_release") }}
                  </label>
                </div>
              </div>
            </div>
            <div class="form-actions row">
              <div class="col-6">
                <label class="del-check">
                  <input type="checkbox" name="del" v-model="delChecked"/>{{ $t("app.del_app") }}
                </label>
              </div>
              <div class="col-18">
                <a v-link="{path: '/plugins/customize'}" class="btn btn-default">{{ $t("common.cancel") }}</a>
                <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../../../api'
  import _ from 'lodash'
  import { globalMixins } from '../../../mixins'
  import { updatePlugin, removePlugin } from '../../../store/actions/plugins'

  export default {
    name: 'updateForm',

    layout: 'admin',

    mixins: [globalMixins],

    vuex: {
      actions: {
        updatePlugin,
        removePlugin
      }
    },

    data () {
      return {
        model: {
          type: 1
        },
        originModel: {},
        validation: {},
        editing: false,
        uploading: false,
        delChecked: false
      }
    },

    ready () {
      this.getAppInfo()
    },

    methods: {
      // 获取 APP 详细信息
      getAppInfo () {
        api.plugin.get(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            this.model = res.data
          }
        })
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
            api.plugin.remove(this.$route.params.id).then((res) => {
              if (res.status === 200) {
                this.removePlugin(this.model)
                this.$route.router.go('/plugins/customize')
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
          api.plugin.update(this.model).then((res) => {
            if (res.status === 200) {
              this.updatePlugin(this.model)
              this.$route.router.go('/plugins/customize')
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
            content: this.$t('upload.compatiblity')
          })
          return
        }

        if (window.File && window.FileReader && window.FileList && window.Blob) {
          var reader = new window.FileReader()
          reader.onerror = (evt) => {
            this.showNotice({
              type: 'error',
              content: this.$t('upload.read_err')
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
                    this.model.apn_license_url = res.data.url
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
            content: this.$t('upload.compatiblity')
          })
        }
      }
    }
  }
</script>
