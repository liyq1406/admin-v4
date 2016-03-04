<template lang="jade">
div
  .panel
    .panel-bd
      // 编辑微信应用
      modal
        //- h3(slot="header") 编辑应用({{editModel4.type | typeLabel}})
        .form.form-edit-apk
          form(v-form, name="editValidation4")
            .form-row
              label.form-control {{ $t("datapoint.fields.type") }}:
              .controls
                .select
                  select(name="type")
                    option(v-for="type in ['type1','type2','type3']", :value="$index + 1") {{type}}
            .form-row
              label.form-control {{ $t("app.fields.name") }}:
              .controls
                .input-text-wrap(v-placeholder="$t('app.placeholders.name')")
                  input.input-text(type="text", name="name", minlength="2", maxlength="32", required, lazy)
            .form-row
              label.form-control {{ $t("app.fields.wechat_id") }}:
              .controls
                .input-text-wrap(v-placeholder="$t('app.placeholders.wechat_id')")
                  input.input-text(type="text", name="wechat_id", lazy)
            .form-row
              label.form-control {{ $t("rule.fields.scope") }}:
              .controls
                .radio-group
                  label.radio(v-for="type in ['选择1', '选择2', '选择3']")
                    input(type="radio", name="addModel.scope", :value="$index+1", number)
                    | {{type}}
            .form-row
              label.form-control {{ $t("app.fields.wechat_app_id") }}:
              .controls
                .input-text-wrap(v-placeholder="$t('app.placeholders.wechat_app_id')")
                  input.input-text(type="text", name="wechat_app_id", lazy)
            .form-row
              label.form-control {{ $t("app.fields.wechat_app_secret") }}:
              .controls
                .input-text-wrap(v-placeholder="$t('app.placeholders.wechat_app_secret')")
                  input.input-text(type="text", name="wechat_app_secret", lazy)
            .form-row
              label.form-control {{ $t("app.fields.wechat_encrypt") }}:
              .controls
                .radio-group.radio-group-v
                  template(v-for="type in encryptTypes")
                    label.radio
                      input(type="radio", name="wechat_encrypt", :value="$index+1")
                      | {{ type.label }}
                    p {{ type.info }}
            .form-row
              label.form-control {{ $t("app.fields.wechat_key") }}:
              .controls
                .input-text-wrap(v-placeholder="$t('app.placeholders.wechat_key')")
                  textarea.input-text(type="text", name="wechat_key", lazy)
            .form-row
              label.form-control {{ $t("app.fields.app_url") }}:
              .controls
                .input-text-wrap(v-placeholder="$t('app.placeholders.app_url')")
                  input.input-text(type="text", name="app_url", lazy)
            .form-actions
              label.del-check
                input(type="checkbox", name="del", v-model="delChecked")
                | {{ $t("app.del_app") }}
              button.btn.btn-default(@click.prevent.stop="onEditCancel4") {{ $t("common.cancel") }}
              //- {{ '取消' }}
              button.btn.btn-primary(type="submit", :disabled="editing", :class="{'disabled':editing}", v-text="editing ? $t('common.handling') : $t('common.ok')")
</template>
