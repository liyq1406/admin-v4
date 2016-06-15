<template>
  <div>
    <div class="panel">
      <div class="panel-bd">
        <div class="form">
          <validator name="editValidation">
            <form novalidate @submit.prevent="onEditSubmit">
              <!-- <pre>{{$editValidation|json}}</pre> -->
              <div class="form-row row">
                <label class="form-control col-6">下载路径:</label>
                <div class="controls col-18">
                  <div v-placeholder="$t('ui.version.placeholders.url')" class="input-text-wrap">
                    <input v-model="editModel.url" type="text" name="url" v-validate:url="{required: true, format: 'url'}" class="input-text" lazy/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$editValidation.url.touched && $editValidation.url.required">{{ $t('ui.validation.required', {field: $t('ui.version.url')}) }}</span>
                    <span v-if="$editValidation.url.modified && $editValidation.url.format">{{ $t('ui.validation.url') }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">版本号:</label>
                <div class="controls col-18">
                  <div v-placeholder="$t('ui.version.placeholders.version')" class="input-text-wrap">
                    <input v-model="editModel.version" type="text" name="version" v-validate:version="{required: true, numberic: true}" class="input-text" lazy/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$editValidation.version.touched && $editValidation.version.required">{{ $t('ui.validation.required', {field: $t('ui.version.version')}) }}</span>
                    <span v-if="$editValidation.version.modified && $editValidation.version.numberic">{{ $t('ui.validation.numberic') }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">说明信息:</label>
                <div class="controls col-18">
                  <div v-placeholder="$t('ui.version.placeholders.illustration')" class="input-text-wrap">
                    <textarea v-model="editModel.illustration" type="text" name="illustration" v-validate:illustration="{maxlength: 250}" class="input-text" lazy></textarea>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$editValidation.illustration.modified && $editValidation.illustration.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.version.illustration'), 250]) }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">md5校验值:</label>
                <div class="controls col-18">
                  <div v-placeholder="$t('ui.version.placeholders.md5')" class="input-text-wrap">
                    <input v-model="editModel.md5" type="text" name="md5" v-validate:md5="{required: true, numberic: true}" class="input-text" lazy/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$editValidation.md5.touched && $editValidation.md5.required">{{ $t('ui.validation.required', {field: $t('ui.version.md5')}) }}</span>
                    <span v-if="$editValidation.md5.modified && $editValidation.md5.numberic">{{ $t('ui.validation.numberic') }}</span>
                  </div>
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
              </div>
            </form>
          </validator>
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
        editModel: {},
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
          api.plugin.update(this.$route.params.id, this.model).then((res) => {
            if (res.status === 200) {
              this.updatePlugin(res.data)
              this.$route.router.go('/plugins/customize')
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        }
      }
    }
  }
</script>
