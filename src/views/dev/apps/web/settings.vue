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
        <label class="form-control col-6">应用URL</label>
        <div class="controls col-18">
          <div v-placeholder="'请输入应用URL'" class="input-text-wrap">
            <input v-model="model.config.url" type="text" name="url" lazy class="input-text"/>
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
    name: 'webSettings',

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
            url: ''
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
        this.currApp = this.app
        this.model.name = this.currApp.name
        this.model.enable = this.currApp.enable
        this.model.config.url = this.currApp.config.url
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
                this.removePlugin(this.currApp)
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
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
</style>
