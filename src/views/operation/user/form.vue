<template>
  <div class="main device-details">
    <div class="main-title">
      <h2>{{ $t('operation.user.details.form.main_title') }}</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>

    <div class="panel">
      <div class="panel-bd">
        <div class="form ml20">
          <validator name="validation">
            <form autocomplete="off" novalidate @submit.prevent="onSubmit">
              <!-- 用户名 -->
              <div class="form-row row">
                <label class="form-control col-4"><i class="hl-red">*</i>{{ $t("operation.user.fields.nickname") }}:</label>
                <div class="controls col-16">
                  <div class="input-text-wrap">
                    <input v-model="model.nickname" type="text" name="model.nickname" v-validate:nickname="{required: true, format: 'trim', maxlength: 30}" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.nickname.touched && $validation.nickname.required">{{ $t('common.validation.required', {field: $t('operation.user.fields.nickname')}) }}</span>
                    <span v-if="$validation.nickname.modified && $validation.nickname.format">{{ $t('common.validation.trim', {field: $t('operation.user.fields.nickname')}) }}</span>
                    <span v-if="$validation.nickname.modified && $validation.nickname.maxlength">{{ $t('common.validation.maxlength', [$t('operation.user.fields.nickname'), 30]) }}</span>
                  </div>
                </div>
              </div>
              <!-- 地理位置 -->
              <div class="form-row row">
                <label class="form-control col-4"><i class="hl-red">*</i>{{ $t("operation.user.fields.location") }}:</label>
                <div class="controls col-16">
                  <loc-select
                    :showregion="false"
                    :default-country-code="model.country"
                    :default-state-code="model.province"
                    :default-city-code="model.city"
                    :default-option="{ name: $t('common.placeholder.select') }" 
                    @country-change="onCountryChange"
                    @state-change="onStateChange"
                    @city-change="onCityChange">
                  </loc-select>
                  <input type="text" class="hidden" v-model="location" v-validate:location="{required: true}">
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.location.touched && $validation.location.required">{{ $t('common.validation.required', {field: $t('operation.user.fields.location')}) }}</span>
                  </div>
                </div>
              </div>
              <!-- 详细地址 -->
              <div class="form-row row">
                <label class="form-control col-4"><i class="hl-red">*</i>{{ $t("operation.user.fields.address") }}:</label>
                <div class="controls col-16">
                  <div class="input-text-wrap">
                    <input v-model="model.address" type="text" name="model.address" v-validate:address="{required: true, format: 'trim', maxlength: 200}" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.address.touched && $validation.address.required">{{ $t('common.validation.required', {field: $t('operation.user.fields.address')}) }}</span>
                    <span v-if="$validation.address.modified && $validation.address.format">{{ $t('common.validation.trim', {field: $t('operation.user.fields.address')}) }}</span>
                    <span v-if="$validation.address.modified && $validation.address.maxlength">{{ $t('common.validation.maxlength', [$t('operation.user.fields.address'), 200]) }}</span>
                  </div>
                </div>
              </div>
              <!-- 性别 -->
              <div class="form-row row">
                <label class="form-control col-4"><i class="hl-red">*</i>{{ $t("operation.user.fields.gender") }}:</label>
                <div class="controls col-16">
                  <div class="radio-group">
                    <label class="radio">
                      <input type="radio" v-model="model.gender" name="model.gender" :value="1" v-validate:gender="{required: true}"/>{{ $t('common.gender_types.male') }}
                    </label>
                    <label class="radio">
                      <input type="radio" v-model="model.gender" name="model.gender" :value="2" v-validate:gender="{required: true}"/>{{ $t('common.gender_types.female') }}
                    </label>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.gender.touched && $validation.gender.required">{{ $t('common.validation.required', {field: $t('operation.user.fields.gender')}) }}</span>
                  </div>
                </div>
              </div>
              <!-- 用户ID -->
              <div class="form-row row">
                <label class="form-control col-4">{{ $t("operation.user.fields.id") }}:</label>
                <div class="controls col-16">
                  <div class="input-text-wrap">
                    <input v-model="model.id" type="text" name="model.id" readonly="readonly" class="input-text hl-gray"/>
                  </div>
                </div>
              </div>
              <div class="form-actions">
                <label class="del-check">
                  <input type="checkbox" name="del" v-model="delChecked"/>{{ $t('operation.user.details.form.del_user') }}
                </label>
                <button v-text="submitting ? $t('common.handling') : $t('common.ok')" :disabled="submitting" :class="{'disabled':submitting}" class="btn btn-primary btn-lg"></button>
              </div>
            </form>
          </validator>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'

export default {
  name: 'EditUserForm',

  data () {
    return {
      model: {},
      breadcrumbNav: [],
      submitting: false,
      delChecked: false
    }
  },

  computed: {
    // 用于提交的表单信息
    formData () {
      // if (this.model.phone) {
      //   result.phone = this.model.phone
      // }
      let properties = ['nickname', 'country', 'province', 'city', 'address', 'gender']

      return _.pickBy(this.model, (val, key) => {
        return val !== '' && _.indexOf(properties, key) >= 0
      })
    },

    // 用户位置，用于验证是否选择
    location () {
      return this.model.country + this.model.province + this.model.city
    }
  },

  route: {
    data () {
      this.breadcrumbNav = [{
        label: this.$t('common.all'),
        link: '/operation/users/list'
      }, {
        label: this.$t('operation.user.details.form.main_title')
      }]

      // 获取目标用户信息
      api.user.profile(this.$route.params.id).then((res) => {
        if (res.status !== 200) return

        let user = res.data
        user.country = res.data.country || ''
        user.province = res.data.province || ''
        user.city = res.data.city || ''
        this.model = user
      })
    }
  },

  methods: {
    /**
     * 处理省改变
     */
    onCountryChange (val) {
      this.model.country = val
      this.model.province = ''
      this.model.city = ''
    },

    /**
     * 处理市改变
     */
    onStateChange (val) {
      this.model.province = val
      this.model.city = ''
    },

    /**
     * 处理区改变
     */
    onCityChange (val) {
      this.model.city = val
    },

    /**
     * 处理提交成功
     */
    onSubmitSuccessful () {
      this.submitting = false
      this.showNotice({
        type: 'success',
        content: this.$t('common.action_success')
      })
    },

    /**
     * 处理提交失败
     */
    onSubmitFailed () {
      this.submitting = false
      this.showNotice({
        type: 'error',
        content: this.$t('common.action_fail')
      })
    },

    /**
     * 处理表单提交
     * @author shengzhi
     */
    onSubmit () {
      // 禁止二次提交
      if (this.submitting) return

      // 勾选了删除，直接执行删除操作
      if (this.delChecked && window.confirm(this.$t('operation.user.details.form.del_confirm_info'))) {
        this.submitting = true
        return api.user.del(this.$route.params.id).then((res) => {
          this.onSubmitSuccessful()
          this.$route.router.replace('/operation/users/list')
        }).catch((res) => {
          this.onSubmitFailed()
        })
      }

      // 表单验证不通过
      if (this.$validation.invalid) {
        this.$validate(true)
        return
      }

      // 执行修改操作
      this.submitting = true
      api.user.update(this.$route.params.id, this.formData).then((res) => {
        this.onSubmitSuccessful()
        this.$route.router.go(`/operation/users/details/${this.$route.params.id}`)
      }).catch(() => {
        this.onSubmitFailed()
      })
    }
  }
}
</script>
