<template>
  <div class="form ml30">
    <validator name="validation">
      <form autocomplete="off" @submit.prevent="onSubmit" novalidate>
        <div class="form-row row">
          <label class="form-control col-3">{{ $t('operation.user.major.columns.name') }}:</label>
          <div class="controls col-18">
            <div v-placeholder="$t('operation.user.major.placeholders.name')" class="input-text-wrap">
              <input v-model="model.username" type="text" name="model.username" v-validate:username="{required: true, minlength: 2, maxlength: 32}" lazy class="input-text"/>
            </div>
            <div class="form-tips form-tips-error">
              <span v-if="$validation.username.touched && $validation.username.required">{{ $t('common.validation.required', {field: $t('operation.user.major.columns.name')}) }}</span>
              <span v-if="$validation.username.touched && $validation.username.modified && $validation.username.minlength">{{ $t('common.validation.minlength', [$t('operation.user.major.columns.name'), 2]) }}</span>
              <span v-if="$validation.username.touched && $validation.username.modified && $validation.username.maxlength">{{ $t('common.validation.maxlength', [$t('operation.user.major.columns.name'), 32]) }}</span>
            </div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-3">{{ $t('operation.user.major.columns.contacter') }}:</label>
          <div class="controls col-18">
            <div v-placeholder="$t('operation.user.major.placeholders.contacter')" class="input-text-wrap">
              <input v-model="model.contacter" type="text" name="model.contacter" v-validate:contacter="{required: false, minlength: 2, maxlength: 32}" class="input-text"/>
            </div>
            <div class="form-tips form-tips-error">
              <span v-if="$validation.contacter.touched && $validation.contacter.required">{{ $t('common.validation.required', {field: $t('operation.user.major.columns.contacter')}) }}</span>
              <span v-if="$validation.contacter.touched && $validation.contacter.modified && $validation.contacter.minlength">{{ $t('common.validation.minlength', [$t('operation.user.major.columns.contacter'), 2]) }}</span>
              <span v-if="$validation.contacter.touched && $validation.contacter.modified && $validation.contacter.maxlength">{{ $t('common.validation.maxlength', [$t('operation.user.major.columns.contacter'), 32]) }}</span>
            </div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-3">{{ $t('account.members.phone_number') }}:</label>
          <div class="controls col-18">
            <div v-placeholder="$t('auth.fields.phone')" class="input-text-wrap">
              <input type="text" v-model="model.phone" v-validate:phone="{required: true, format: 'phone'}" name="model.phone" lazy class="input-text"/>
            </div>
            <div class="form-tips form-tips-error">
              <span v-if="$validation.phone.touched && $validation.phone.required">{{ $t('common.validation.required', {field: $t('auth.fields.phone')}) }}</span>
              <span v-if="$validation.phone.modified && $validation.phone.format">{{ $t('common.validation.format', {field: $t('auth.fields.phone')}) }}</span>
            </div>
          </div>
        </div>
        <!-- <div class="form-row row">
          <label class="form-control col-3">{{ $t("account.members.fields.email") }}:</label>
          <div class="controls col-18">
            <div v-placeholder="$t('account.members.placeholders.email')" class="input-text-wrap">
              <input v-model="model.email" type="email" name="model.email" v-validate:email="{required: true, format: 'email'}"  maxlength="32" required lazy class="input-text"/>
            </div>
            <div class="form-tips form-tips-error">
              <span v-if="$validation.email.touched && $validation.email.required">{{ $t('common.validation.required', {field: $t('auth.fields.email')}) }}</span>
              <span v-if="$validation.email.modified && $validation.email.format">{{ $t('common.validation.format', {field: $t('auth.fields.email')}) }}</span>
            </div>
          </div>
        </div> -->
        <div class="form-row row">
          <label class="form-control col-3">{{ $t('operation.user.major.columns.industry') }}:</label>
          <div class="controls filter-group-item col-18">
            <x-select :label="model.industry" size="small" width="110px">
              <select v-model="model.industry">
                <option v-for="industry in industrys" :value="industry">{{industry}}</option>
              </select>
            </x-select>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-3">{{ $t('operation.user.major.columns.locality') }}:</label>
          <div class="controls col-18">
            <div class="clearfix">
              <div class="filter-group-item">
                <loc-select :showregion="false"
                            :default-country-code="defaultCountryCode"
                            :default-state-code="defaultStateCode"
                            :default-city-code="defaultCityCode"
                            @country-change="handleCountryChange"
                            @state-change="handleStateChange"
                            @city-change="handleCityChange">
                </loc-select>
              </div>
            </div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-3">{{ $t('operation.user.major.columns.location') }}:</label>
          <div class="controls col-18">
            <!-- 地址 -->
            <div v-placeholder="$t('operation.user.major.placeholders.location')" class="input-text-wrap">
              <textarea v-model="model.location" type="text" name="model.location" v-validate:location="{required: true, minlength: 6, maxlength: 240}" class="input-text"></textarea>
            </div>
            <div class="form-tips form-tips-error">
              <span v-if="$validation.location.touched && $validation.location.required">{{ $t('common.validation.required', {field: $t('operation.user.major.columns.location')}) }}</span>
              <span v-if="$validation.location.touched && $validation.location.modified && $validation.location.minlength">{{ $t('common.validation.minlength', [$t('operation.user.major.placeholders.location'), 6]) }}</span>
              <span v-if="$validation.location.touched && $validation.location.modified && $validation.location.maxlength">{{ $t('common.validation.maxlength', [$t('operation.user.major.placeholders.location'), 240]) }}</span>
            </div>
          </div>
        </div>
        <div class="form-row row" v-if="type==='edit'">
          <div class="col-21 col-offset-3">
            <label class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/> {{ $t('common.del') }}
            </label>
          </div>
        </div>
        <div class="form-actions row">
          <div class="col-21 col-offset-3">
            <button :disabled="(submitting || $validation.invalid) && !delChecked" :class="{'disabled':(submitting || $validation.invalid) && !delChecked}" class="btn btn-primary" @click.prevent="onSubmit">{{ $t('common.ok') }}</button>
          </div>
        </div>
      </form>
    </validator>
  </div>
</template>

<script>
import api from 'api'

export default {
  name: 'vip-form',
  components: {
  },

  props: {
    type: {
      type: String,
      default: 'add'
    }
  },

  data () {
    return {
      model: {
        username: '',
        contacter: '',
        phone: '',
        location: '',
        industry: this.$t('operation.user.major.industrys.web')
      },
      areas: '',
      delChecked: false,
      submitting: false,
      cityCode: '',
      countryCode: '',
      stateCode: '',
      defaultCountryCode: '',
      defaultStateCode: '',
      defaultCityCode: '',
      industrys: [
        this.$t('operation.user.major.industrys.web'),
        this.$t('operation.user.major.industrys.security'),
        this.$t('operation.user.major.industrys.air'),
        this.$t('operation.user.major.industrys.game'),
        this.$t('operation.user.major.industrys.consumable'),
        this.$t('operation.user.major.industrys.communication')
      ]
    }
  },

  computed: {
  },

  ready () {
    if (this.type === 'edit') {
      this.getHeavyBuyerList()
    }
  },

  methods: {
    getHeavyBuyerList () {
      var condition = {
        filter: [
          'id',
          'name',
          'industry',
          'location',
          'contacter',
          'contact_way',
          'country',
          'province',
          'city'
        ],
        query: {
          id: {$in: [this.$route.params.id]}
        }
      }
      api.heavyBuyer.getHeavyBuyer(condition).then((res) => {
        if (res.status === 200 && res.data.list.length) {
          let vip = res.data.list[0]
          this.model.username = vip.name
          this.model.address = vip.location
          this.model.contacter = vip.contacter
          this.model.phone = vip.contact_way
          this.model.industry = vip.industry
          this.defaultCountryCode = vip.country
          this.defaultStateCode = vip.province
          this.defaultCityCode = vip.city
        }
      }).catch((err) => {
        this.handleError(err)
      })
    },
    handleCountryChange (countryCode) {
      this.countryCode = countryCode
    },
    handleStateChange (stateCode) {
      this.stateCode = stateCode
    },
    handleCityChange (cityCode) {
      this.cityCode = cityCode
    },
    onSubmit () {
      if (this.submitting) return

      if (this.delChecked && !window.confirm(this.$t('operation.user.major.comfirm_del'))) {
        return
      }

      if (this.$validation.invalid && !this.delChecked) {
        this.$validate(true)
        return
      }

      let params = {
        name: this.model.username,
        contacter: this.model.contacter,
        contact_way: this.model.phone,
        industry: this.model.industry,
        location: this.model.location
      }

      if (this.countryCode) { // 国家代码
        params.country = this.countryCode
      }
      if (this.stateCode) { // 省份代码
        params.province = this.stateCode
      }
      if (this.cityCode) { // 城市代码
        params.city = this.cityCode
      }

      let process

      this.submitting = true
      if (this.type === 'add') { // 添加
        process = api.heavyBuyer.addHeavyBuyer(params)
      } else {
        if (this.delChecked) { // 删除
          process = api.heavyBuyer.delHeavyBuyer(this.$route.params.id)
        } else {
          process = api.heavyBuyer.editHeavyBuyer(this.$route.params.id, params)
        }
      }
      process.then((res) => {
        this.submitting = false
        if (res.status === 200) {
          this.$route.router.replace('/operation/major-clients')
        }
      }).catch((res) => {
        this.submitting = false
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/stylus/common'

.form
  max-width 800px
  .input-lenght
    width 200px
.fineness-select
  display inline-block
  line-height 32px
.mutiple-select
  input, label
    vertical-align middle
  label
    margin-right 10px
</style>
