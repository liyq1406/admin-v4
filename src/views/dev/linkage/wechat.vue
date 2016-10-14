<template>
  <div class="main">
    <div class="main-title">
      <h2>微信互联</h2>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="form form-edit-apk">
          <form autocomplete="off" v-form name="validation" @submit.prevent="onEditSubmit(model)">
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.app.fields.name") }}:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input type="text" placeholder="请输入应用名称" v-model="model.name" name="name" minlength="2" maxlength="32" required lazy class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.app.fields.wechat_id") }}:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input type="text" placeholder="请输入微信公众号ID" v-model="model.config.wechat.id" name="wechat_id" lazy class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.app.fields.wechat_app_id") }}:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input type="text" v-model="model.config.wechat.app_id" placeholder="请输入微信公众号APPID" name="wechat_app_id" lazy class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.app.fields.wechat_app_secret") }}:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input type="text" v-model="model.config.wechat.app_secret" placeholder="请输入微信公众号APPSecret" name="wechat_app_secret" lazy class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.app.fields.wechat_encrypt") }}:</label>
              <div class="controls col-18">
                <div class="radio-group radio-group-v">
                  <template v-for="type in encryptTypes">
                    <label class="radio">
                      <input type="radio" v-model="model.config.wechat.encrypt" name="wechat_encrypt" :value="$index+1"/>{{ type.label }}
                    </label>
                    <p>{{ type.info }}</p>
                  </template>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.app.fields.wechat_key") }}:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <textarea type="text" v-model="model.config.wechat.encoding_aes_key" placeholder="请输入43位微信密匙" name="wechat_key" lazy class="input-text"></textarea>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.app.fields.app_url") }}:</label>
              <div class="controls col-18 control-text">{{ model.config.url }}</div>
            </div>
            <div class="form-actions row">
              <!-- <div class="col-6">
                <label class="del-check">
                  <input type="checkbox" name="del" v-model="delChecked"/>{{ $t("ui.app.del_app") }}
                </label>
              </div> -->
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
  import Vue from 'vue'
  import locales from 'consts/locales/index'
  import api from 'api'
  // import Modal from 'components/Modal'
  import _ from 'lodash'
  import { globalMixins } from 'src/mixins'
  import { updatePlugin, removePlugin } from 'store/actions/plugins'

  export default {
    name: 'updateForm',

    mixins: [globalMixins],

    vuex: {
      actions: {
        updatePlugin,
        removePlugin
      }
    },

    data () {
      return {
        encryptTypes: locales[Vue.config.lang].data.APP_ENCRYPT_TYPES,
        model: {
          name: '',
          enable: false,
          config: {
            url: '',
            token: '',
            relay_url: '',
            wechat: {
              id: '',
              app_id: '',
              app_secret: '',
              encrypt: '',
              encoding_aes_key: ''
            }
          }
        },
        originModel: {},
        validation: {},
        editing: false,
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
      onEditSubmit (model) {
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
