<template>
  <div class="main device-details">
    <div class="main-title">
      <h2>{{ $t('operation.product.device.edit_form.main_title') }}</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>

    <div class="panel">
      <div class="panel-bd">
        <div class="form ml20">
          <validator name="validation">
            <form autocomplete="off" novalidate @submit.prevent="onSubmit">
              <!-- 设备名称 -->
              <div class="form-row row">
                <label class="form-control col-4"><i class="hl-red">*</i>{{ $t("operation.product.device.fields.name") }}:</label>
                <div class="controls col-16">
                  <div class="input-text-wrap">
                    <input v-model="model.name" type="text" name="model.name" v-validate:name="{required: true, format: 'trim', maxlength: 30}" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.name.touched && $validation.name.required">{{ $t('common.validation.required', {field: $t('operation.product.device.fields.name')}) }}</span>
                    <span v-if="$validation.name.modified && $validation.name.format">{{ $t('common.validation.trim', {field: $t('operation.product.device.fields.name')}) }}</span>
                    <span v-if="$validation.name.modified && $validation.name.maxlength">{{ $t('common.validation.maxlength', [$t('operation.product.device.fields.name'), 30]) }}</span>
                  </div>
                </div>
              </div>
              <!-- MAC -->
              <div class="form-row row">
                <label class="form-control col-4">{{ $t("operation.product.device.fields.mac") }}:</label>
                <div class="controls col-16">
                  <div class="input-text-wrap">
                    <input v-model="model.mac" type="text" name="model.mac" readonly="readonly" class="input-text hl-gray"/>
                  </div>
                </div>
              </div>
              <!-- SN -->
              <div class="form-row row">
                <label class="form-control col-4">{{ $t("operation.product.device.fields.sn") }}:</label>
                <div class="controls col-16">
                  <div class="input-text-wrap">
                    <input v-model="model.sn" type="text" name="model.sn" v-validate:sn="{format: 'sn', maxlength: 32}" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.sn.modified && $validation.sn.format">{{ $t('common.validation.sn') }}</span>
                    <span v-if="$validation.sn.touched && $validation.sn.modified && $validation.sn.maxlength">{{ $t('common.validation.maxlength', [$t('operation.product.device.fields.sn'), 32]) }}</span>
                  </div>
                </div>
              </div>
              <!-- 以下内容为接口暂不支持，勿删 -->
              <!-- 地理位置 -->
              <!-- <div class="form-row row">
                <label class="form-control col-4"><i class="hl-red">*</i>{{ $t("operation.product.device.fields.location") }}:</label>
                <div class="controls col-16">
                  <loc-select
                    :showregion="false"
                    :default-country-code="model.country"
                    :default-state-code="model.province"
                    :default-city-code="model.city"
                    @country-change="onCountryChange"
                    @state-change="onStateChange"
                    @city-change="onCityChange">
                  </loc-select>
                  <input type="text" class="hidden" v-model="location" v-validate:location="{required: true}">
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.location.touched && $validation.location.required">{{ $t('common.validation.required', {field: $t('operation.product.device.fields.location')}) }}</span>
                  </div>
                </div>
              </div> -->
              <!-- 详细地址 -->
              <!-- <div class="form-row row">
                <label class="form-control col-4"><i class="hl-red">*</i>{{ $t("operation.product.device.fields.address") }}:</label>
                <div class="controls col-16">
                  <div class="input-text-wrap">
                    <input v-model="model.address" type="text" name="model.address" v-validate:address="{required: true, format: 'trim', maxlength: 200}" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.address.touched && $validation.address.required">{{ $t('common.validation.required', {field: $t('operation.product.device.fields.address')}) }}</span>
                    <span v-if="$validation.address.modified && $validation.address.format">{{ $t('common.validation.trim', {field: $t('operation.product.device.fields.address')}) }}</span>
                    <span v-if="$validation.address.modified && $validation.address.maxlength">{{ $t('common.validation.maxlength', [$t('operation.product.device.fields.address'), 200]) }}</span>
                  </div>
                </div>
              </div> -->
              <!-- 设备型号 -->
              <div class="form-row row">
                <label class="form-control col-4">{{ $t("operation.product.device.fields.mode") }}:</label>
                <div class="controls col-16">
                  <div class="input-text-wrap">
                    <input v-model="currentProduct.mode" type="text" name="model.mode" readonly="readonly" class="input-text hl-gray"/>
                  </div>
                </div>
              </div>
              <div class="form-actions">
                <label class="del-check">
                  <input type="checkbox" name="del" v-model="delChecked"/>{{ $t('operation.product.device.edit_form.del_device') }}
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
import { getCurrProduct } from 'store/actions/products'

export default {
  name: 'EditDeviceForm',

  vuex: {
    getters: {
      currentProduct: ({ products }) => products.curr
    },
    actions: {
      getCurrProduct
    }
  },

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
      let properties = ['name', 'country', 'province', 'city', 'address', 'sn']

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
      let productId = this.$route.params.product_id
      let deviceId = this.$route.params.device_id

      // 面包屑导航
      this.breadcrumbNav = [{
        label: this.$t('common.all'),
        link: `/operation/products/${productId}/devices`
      }, {
        label: this.$t('operation.product.device.edit_form.main_title')
      }]

      // 设置当前产品
      this.getCurrProduct(this.$route.params.product_id)

      // 获取目标设备信息
      api.device.getInfo(productId, deviceId).then((res) => {
        if (res.status !== 200) return

        let device = res.data
        device.country = res.data.country || ''
        device.province = res.data.province || ''
        device.city = res.data.city || ''
        this.model = device
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

      let productId = this.$route.params.product_id
      let deviceId = this.$route.params.device_id

      // 勾选了删除，直接执行删除操作
      if (this.delChecked && window.confirm(this.$t('operation.product.device.edit_form.del_confirm_info'))) {
        this.submitting = true
        return api.device.del(productId, deviceId).then((res) => {
          this.onSubmitSuccessful()
          this.$route.router.replace(`/operation/products/${productId}/devices`)
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
      api.product.updateDeviceMsg(productId, deviceId, this.formData).then((res) => {
        this.onSubmitSuccessful()
        this.$route.router.go('info')
      }).catch((res) => {
        this.onSubmitFailed()
      })
    }
  }
}
</script>
