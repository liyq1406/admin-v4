<template>
  <div class="main">
    <div class="account-info">
      <h2>{{ corp.company }} <a href="#" @click.prevent="editCorp" class="fa fa-edit"></a></h2>
      <div class="details row">
        <div class="col-24">
          <div v-stretch="182">
            <info-list :info="corpInfo"></info-list>
          </div>
        </div>
        <!-- <div class="col-8">
          <div class="logo-info">
            <div class="mb5">企业Logo</div>
            <div class="thumbnail">
              <img :src="logo">
            </div>
            <div class="fr mt5">
              <a href="#" class="hl-red">重新上传</a>
            </div>
            <div class="hl-gray mt5">图片规格：200*55</div>
          </div>
        </div> -->
      </div>
    </div>

    <!-- 修改密码浮层 start -->
    <modal :show.sync="isShowModal" width="400px">
      <h3 slot="header">修改信息</h3>
      <div slot="body" class="form">
        <validator name="validation">
          <form novalidate @submit.prevent="onSubmit">
            <div class="form-row row">
              <label class="form-control col-6">企业名称</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input type="text" v-model="model.name" name="model.name" v-validate:name="{required: true, minlength: 2, maxlength: 250}" lazy class="input-text"/>
                </div>
                <!-- <div class="form-tips form-tips-error">
                  <span v-if="$validation.name.touched && $validation.name.required">{{ $t('ui.validation.required', {field: $t('ui.account.fields.old_password')}) }}</span>
                  <span v-if="$validation.name.touched && $validation.name.minlength">{{ $t('ui.validation.minlength', [$t('ui.account.fields.old_password'), 2]) }}</span>
                  <span v-if="$validation.name.touched && $validation.name.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.account.fields.old_password'), 250]) }}</span>
                </div> -->
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">联系人</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input type="text" v-model="model.contact" name="model.contact" v-validate:contact="{required: true, minlength: 2, maxlength: 32}" lazy class="input-text"/>
                </div>
                <!-- <div class="form-tips form-tips-error">
                  <span v-if="$validation.name.touched && $validation.name.required">{{ $t('ui.validation.required', {field: $t('ui.account.fields.old_password')}) }}</span>
                  <span v-if="$validation.name.touched && $validation.name.minlength">{{ $t('ui.validation.minlength', [$t('ui.account.fields.old_password'), 2]) }}</span>
                  <span v-if="$validation.name.touched && $validation.name.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.account.fields.old_password'), 250]) }}</span>
                </div> -->
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">手机</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input type="text" v-model="model.phone" name="model.phone" v-validate:phone="{required: true, format: 'phone'}" lazy class="input-text"/>
                </div>
                <!-- <div class="form-tips form-tips-error">
                  <span v-if="$validation.name.touched && $validation.name.required">{{ $t('ui.validation.required', {field: $t('ui.account.fields.old_password')}) }}</span>
                  <span v-if="$validation.name.touched && $validation.name.minlength">{{ $t('ui.validation.minlength', [$t('ui.account.fields.old_password'), 2]) }}</span>
                  <span v-if="$validation.name.touched && $validation.name.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.account.fields.old_password'), 250]) }}</span>
                </div> -->
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">邮箱</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input type="text" v-model="model.email" name="model.email" v-validate:email="{required: true, format: 'email'}" lazy class="input-text"/>
                </div>
                <!-- <div class="form-tips form-tips-error">
                  <span v-if="$validation.name.touched && $validation.name.required">{{ $t('ui.validation.required', {field: $t('ui.account.fields.old_password')}) }}</span>
                  <span v-if="$validation.name.touched && $validation.name.minlength">{{ $t('ui.validation.minlength', [$t('ui.account.fields.old_password'), 2]) }}</span>
                  <span v-if="$validation.name.touched && $validation.name.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.account.fields.old_password'), 250]) }}</span>
                </div> -->
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
              <button @click.prevent.stop="onEditPwdCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            </div>
          </form>
        </validator>
      </div>
    </modal>
    <!-- 修改密码浮层 end -->
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import { editPasswordMixin } from '../mixins'
import InfoList from 'components/InfoList'
import Modal from 'components/Modal'
import store from 'store'
import { formatDate } from 'src/filters'
import api from 'api'
import { isEmpty } from 'src/utils'
import defaultLogo from 'assets/images/logo.png'
import blankImg from 'assets/images/blank.png'
// import _ from 'lodash'

export default {
  name: 'Info',

  // editPasswordMixin提供编辑密码的逻辑
  mixins: [globalMixins, editPasswordMixin],

  store,

  vuex: {
    getters: {
      corp: ({ system }) => system.corp,
      currentMember: ({ system }) => system.currentMember
    }
  },

  components: {
    InfoList,
    Modal
  },

  data () {
    return {
      originModel: {
        oldpassword: '',
        newpassword: ''
      },
      model: {},
      isShowModal: false,
      loadingCorp: false
    }
  },

  computed: {
    // 企业信息
    corpInfo () {
      let result = {
        id: {
          label: '企业ID',
          value: ''
        },
        type: {
          label: '应用类型',
          value: ''
        },
        contact: {
          label: '联系人',
          value: ''
        },
        createTime: {
          label: '创建时间',
          value: ''
        },
        phone: {
          label: '手机',
          value: ''
        },
        email: {
          label: '邮箱',
          value: ''
        }
      }

      if (!isEmpty(this.corp)) {
        result.id.value = this.corp.id || '-'
        result.type.value = this.locales.data.ACCOUNT_TYPES.find((item) => {
          return item.value === this.corp.type
        }).label || '-'
        result.createTime.value = formatDate(this.corp.create_time) || '-'
        if (this.corp.member) {
          result.contact.value = this.corp.member.name || '-'
          result.phone.value = this.corp.member.phone || '-'
          result.email.value = this.corp.member.email || '-'
        }
      }

      return result
    },

    logo () {
      let result = blankImg
      if (!isEmpty(this.corp)) {
        result = this.corp.logo || defaultLogo
      }
      return result
    }
  },

  route: {
    data () {
    }
  },

  methods: {

    /**
     * 修改企业信息
     * @author shengzhi
     */
    editCorp () {
      this.isShowModal = true
    },

    /**
     * 提交信息修改
     * @author shengzhi
     */
    onSubmit () {
      if (this.$validation.valid && !this.editing) {
        this.editing = true
        api.corp.memberResetPwd(this.model).then((res) => {
          if (res.status === 200) {
            this.showNotice({
              type: 'success',
              content: this.$t('ui.account.password_msg')
            })
          }
          this.onEditPwdCancel()
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
@import '../account-info'

.logo-info
  width 200px
  margin 0 auto
  font-size 12px
</style>
