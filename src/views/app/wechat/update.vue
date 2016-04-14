<template>
  <div>
    <div class="panel">
      <div class="panel-bd">
        <!-- 编辑微信应用-->
        <div class="form form-edit-apk">
          <form v-form name="editValidation4" @submit.prevent="onEditSubmit(editModel4)" hook="editAppHook4">
            <div class="form-row">
              <label class="form-control">{{ $t("app.fields.name") }}:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input type="text" placeholder="请输入应用名称" v-model="editModel4.name" name="name" minlength="2" maxlength="32" required lazy class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">{{ $t("app.fields.wechat_id") }}:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input type="text" placeholder="请输入微信公众号ID" v-model="editModel4.wechat.id" name="wechat_id" lazy class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">{{ $t("app.fields.wechat_app_id") }}:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input type="text" v-model="editModel4.wechat.app_id" placeholder="请输入微信公众号APPID" name="wechat_app_id" lazy class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">{{ $t("app.fields.wechat_app_secret") }}:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input type="text" v-model="editModel4.wechat.app_secret" placeholder="请输入微信公众号APPSecret" name="wechat_app_secret" lazy class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">{{ $t("app.fields.wechat_encrypt") }}:</label>
              <div class="controls">
                <div class="radio-group radio-group-v">
                  <template v-for="type in encryptTypes">
                    <label class="radio">
                      <input type="radio" v-model="editModel4.wechat.encrypt" name="wechat_encrypt" :value="$index+1"/>{{ type.label }}
                    </label>
                    <p>{{ type.info }}</p>
                  </template>
                </div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">{{ $t("app.fields.wechat_key") }}:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <textarea type="text" v-model="editModel4.wechat.key" placeholder="请输入43位微信密匙" name="wechat_key" lazy class="input-text"></textarea>
                </div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">{{ $t("app.fields.app_url") }}:</label>
              <div class="controls">
                <div class="input-text-wrap lh35">{{ editModel4.wechat.url }}
                </div>
              </div>
            </div>
            <div class="form-actions tsbt">
              <label class="del-check mr40">
                <input type="checkbox" name="del" v-model="delChecked"/>{{ $t("app.del_app") }}
              </label>
              <button v-link="{path: '../../'}" class="btn btn-default">{{ $t("common.cancel") }}</button>
              <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import locales from '../../../consts/locales/index'
  import api from '../../../api'
  // import Modal from '../../../components/Modal'
  import _ from 'lodash'
  import { globalMixins } from '../../../mixins'

  export default {
    name: 'Applications',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      // 'modal': Modal
    },

    data () {
      return {
        apps: [],
        appTypes: locales[Vue.config.lang].app.types,
        encryptTypes: locales[Vue.config.lang].app.encrypt_types,
        editModel4: {
          type: 2,
          name: '',
          wechat: {
            id: '',
            app_id: '',
            app_secret: '',
            encrypt: 1,
            key: '',
            url: ''
          }
        },
        originEditModel4: {},
        editValidation4: {},
        adding: false,
        editing: false,
        uploading: false,
        delChecked: false,
        loadingApps: false
      }
    },

    route: {
      data () {
        this.originAddModel = _.clone(this.addModel)
        // this.getApps()
      }
    },

    filters: {
      typeLabel (value) {
        return this.appTypes[value - 1].label
      }
    },
    ready () {
      this.getinfo()
    },
    methods: {
      // 获取 APP 详细信息
      getinfo () {
        api.app.getinfo(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            this.editModel4 = res.data
          }
        })
      },

      // 修改微信应用表单钩子
      editAppHook4 (form) {
        this.editForm4 = form
      },

      // 初始化应用编辑表单
      onEditApp (app) {
        this.editModel4 = _.cloneDeep(app)
        this.originEditModel4 = _.cloneDeep(app)
      },

      // 提交应用更新
      onEditSubmit (model) {
        if (this.delChecked && !this.editing) {
          this.editing = true
          var result = window.confirm('确认删除该应用吗?')
          if (result === true) {
            api.app.remove(this.$route.params.id).then((res) => {
              if (res.status === 200) {
                this.$route.router.go('../../')
                if (model.type === 4) {
                  this.resetEdit4()
                }
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
          this.editModel4.type = 4
          api.app.update(this.editModel4).then((res) => {
            if (res.status === 200) {
              this.$route.router.go('../../')
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
<style lang="stylus">
  .lh35
    line-height 35px!important
    height 35px!important
  .tsbt
    padding-left 0!important
  .mr40
    margin-right 40px
</style>
