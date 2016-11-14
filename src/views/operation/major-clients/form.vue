<template>
  <div class="form ml30">
    <validator name="validation">
      <form autocomplete="off" @submit.prevent="onSubmit" novalidate>
        <div class="form-row row">
          <label class="form-control col-3">{{ $t('operation.user.major.columns.name') }}:</label>
          <div class="controls col-18">
            <div v-placeholder="$t('operation.user.major.placeholders.name')" class="input-text-wrap">
              <input v-model="model.username" type="text" name="model.username" v-validate:username="{required: true, minlength: 6, maxlength: 32, format: 'account'}" lazy class="input-text"/>
            </div>
            <div class="form-tips form-tips-error">
              <span v-if="$validation.username.touched && $validation.username.required">{{ $t('common.validation.required', {field: $t('operation.user.major.columns.name')}) }}</span>
              <span v-if="$validation.username.touched && $validation.username.modified && $validation.username.minlength">{{ $t('common.validation.minlength', [$t('operation.user.major.columns.name'), 6]) }}</span>
              <span v-if="$validation.username.touched && $validation.username.modified && $validation.username.maxlength">{{ $t('common.validation.maxlength', [$t('operation.user.major.columns.name'), 40]) }}</span>
              <span v-if="$validation.username.touched && $validation.username.modified && $validation.username.format">{{ $t('common.validation.account', {field: $t('operation.user.major.columns.name')}) }}</span>
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
              <span v-if="$validation.contacter.touched && $validation.contacter.modified && $validation.contacter.maxlength">{{ $t('common.validation.maxlength', [$t('operation.user.major.columns.contacter'), 40]) }}</span>
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
        <div class="form-row row">
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
        </div>
        <div class="form-row row">
          <label class="form-control col-3">{{ $t('operation.user.major.columns.industry') }}:</label>
          <div class="controls filter-group-item col-18">
            <x-select :label="selectedFilterIndustry || $t('common.all')" width='110px' size="small">
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
                <area-select :province.sync="curProvince" :city.sync="curCity" :district.sync="curDistrict" select-size="small"></area-select>
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
              <input type="checkbox" name="del" v-model="delChecked"/> 删除统计规则
            </label>
          </div>
        </div>
        <div class="form-actions row">
          <div class="col-21 col-offset-3">
            <button :disabled="submitting || $validation.invalid" :class="{'disabled':submitting || $validation.invalid }" class="btn btn-primary" @click.prevent="onSubmit">{{ $t('common.ok') }}</button>
          </div>
        </div>
      </form>
    </validator>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import AreaSelect from 'components/AreaSelect'
import api from 'api'

export default {
  name: 'StatisticRuleForm',

  mixins: [globalMixins],

  components: {
    AreaSelect
  },

  props: {
    type: {
      type: String,
      default: 'add'
    }
  },

  data () {
    return {
      model: {},
      delChecked: false,
      submitting: false,
      curProvince: {},
      curCity: {},
      curDistrict: {},
      industrys: [
        this.$t('operation.user.major.industrys.web'),
        this.$t('operation.user.major.industrys.security'),
        this.$t('operation.user.major.industrys.air'),
        this.$t('operation.user.major.industrys.game'),
        this.$t('operation.user.major.industrys.consumable'),
        this.$t('operation.user.major.industrys.communication')
      ],
      selectedFilterIndustry: ''
    }
  },

  computed: {
  },

  watch: {
  },

  ready () {},

  methods: {
    onSubmit () {
      if (this.submitting) return

      if (this.$validation.invalid) {
        this.$validate(true)
        return
      }

      if (this.delChecked && !window.confirm('您确定要删除该规则?')) {
        return
      }

      let model = {
        dp_mode: this.getDpMode(),
        fineness: this.getFineness(),
        name: this.name,
        describe: this.description,
        type: 2,
        status: this.status
      }

      let process

      this.submitting = true
      if (this.type === 'add') { // 添加
        process = api.snapshot.ceateStatisticRules(this.selectedSnapshot.productId, this.selectedSnapshot.id, model)
      } else {
        if (this.delChecked) { // 删除
          process = api.snapshot.delStatisticRules(this.selectedSnapshot.productId, this.selectedSnapshot.id, this.$route.params.rule_id)
        } else {
          model._id = this.$route.params.rule_id
          process = api.snapshot.editStatisticRule(this.selectedSnapshot.productId, this.selectedSnapshot.id, this.$route.params.rule_id, model)
        }
      }
      process.then((res) => {
        this.submitting = false
        if (res.status === 200) {
          this.$route.router.replace('/dev/data/statistics-rule/product')
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
