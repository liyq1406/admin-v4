<template>
  <!-- 应用配置 -->
  <div class="form">
    <form v-form name="validation" @submit.prevent="onEditSubmit">
      <div class="form-row row">
        <label class="form-control col-6">{{ '应用名称' }}:</label>
        <div class="controls col-18">
          <div v-placeholder="$t('ui.app.placeholders.name')" class="input-text-wrap">
            <input v-model="model.name" type="text" name="name" minlength="2" maxlength="32" v-form-ctrl required lazy class="input-text"/>
          </div>
          <div v-if="validation.$submitted && validation.name.$pristine" class="form-tips form-tips-error"><span v-if="validation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.app.fields.name')}) }}</span></div>
          <div v-if="validation.name.$dirty" class="form-tips form-tips-error"><span v-if="validation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.app.fields.name')}) }}</span><span v-if="validation.name.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.app.fields.name'), 2]) }}</span><span v-if="validation.name.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.app.fields.name'), 32]) }}</span></div>
        </div>
      </div>
      <div class="form-row row">
        <label class="form-control col-6">{{ $t("ui.app.inform") }}:</label>
        <div class="controls col-18">
          <div class="checkbox-group">
            <label class="checkbox">
              <input type="checkbox" name="gcm_enable" v-model="model.config.gcm.enable"/>{{ '启用GooglePlay服务' }}
            </label>
          </div>
        </div>
      </div>
      <div v-show="model.config.gcm.enable" class="form-row row">
        <label class="form-control col-6">Server API Key:</label>
        <div class="controls col-18">
          <div v-placeholder="$t('ui.app.placeholders.apn_license_pwd')" class="input-text-wrap">
            <input v-model="model.config.gcm.api_key" type="text" v-form-ctrl name="api_key" class="input-text"/>
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
    name: 'androidForm',

    layout: 'admin',

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
        default (a) {
          return {}
        }
      }
    },

    data () {
      return {
        model: {
          type: 2,
          config: {
            gcm: {
              api_key: '',
              enable: false
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
      init () {
        if (!this.app) {
          return
        }
        this.model = _.cloneDeep(this.app)
      },
      // 获取 APP 详细信息
      getAppInfo () {
        api.plugin.get(this.app.id).then((res) => {
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
            api.plugin.remove(this.app.id).then((res) => {
              if (res.status === 200) {
                this.$emit('update-curr-app')
                // this.removePlugin(this.model)
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
          api.plugin.update(this.app.id, this.model).then((res) => {
            if (res.status === 200) {
              this.showNotice({
                type: 'success',
                content: '配置成功'
              })
              this.$emit('update-curr-app')
              this.editing = false
              // this.updatePlugin(res.data)
              // this.$route.router.go('/plugins/customize')
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

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
</style>
