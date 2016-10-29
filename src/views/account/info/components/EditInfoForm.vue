<template>
  <div class="form-edit-info">
    <validator name="validation">
      <form autocomplete="off" novalidate @submit.prevent="onSubmit">
        <div class="form-row row">
          <label class="form-control col-6">{{ this.$t('account.info.name') }}</label>
          <div class="controls col-18">
            <div class="input-text-wrap">
              <input type="text" v-model="model.name" name="model.name" v-validate:name="{required: true}" class="input-text"/>
              <div class="form-tips form-tips-error">
                <span v-if="$validation.name.touched && $validation.name.required">{{ this.$t('account.info.required_name') }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button :disabled="submitting" :class="{'disabled':submitting}" v-text="submitting ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          <button @click.prevent.stop="onCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
        </div>
      </form>
    </validator>
  </div>
</template>

<script>
export default {
  props: ['model', 'submitting'],

  methods: {
    /**
     * 表单提交
     */
    onSubmit () {
      // 防止二次提交
      if (this.submitting) return

      if (this.$validation.invalid) {
        this.$validate(true)
        return
      }

      this.$emit('form-submit')
    },

    /**
     * 取消表单提交
     */
    onCancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="css">
</style>
