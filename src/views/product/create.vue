<template lang="jade">
  section.main-wrap
    .main
      .panel
        .panel-hd
          h2 添加产品
        .panel-bd
          .form
            form(v-form, name="validation", @submit.prevent="onSubmit")
              .form-row
                label.form-control 产品名称：
                .controls
                  .input-text(v-placeholder="'请输入产品名称'")
                    input(v-model="model.name", type="text", v-form-ctrl, name="name", required)
                  .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
                    span(v-if="validation.name.$error.required") 请输入产品名称
                  .form-tips.form-tips-error(v-if="validation.name.$dirty")
                    span(v-if="validation.name.$error.required") 请输入产品名称
              .form-row
                label.form-control 产品描述：
                .controls
                  .input-text(v-placeholder="'请输入产品描述'")
                    input(v-model="model.description", type="text", v-form-ctrl, name="description", required)
                  .form-tips.form-tips-error(v-if="validation.$submitted && validation.description.$pristine")
                    span(v-if="validation.description.$error.required") 请输入产品描述
                  .form-tips.form-tips-error(v-if="validation.description.$dirty")
                    span(v-if="validation.description.$error.required") 请输入产品描述
              .form-row
                label.form-control 设备类型：
                .controls
                  .select
                    select(v-model="model.link_type", v-form-ctrl, name="link_type", custom-validator="checkTypeValid")
                      option(value="1", selected) wifi设备
                      option(value="2") Zigbee网关
                      option(value="3") 蓝牙设备
                  .form-tips.form-tips-error(v-if="validation.$submitted")
                    span(v-if="validation.link_type.$error.customValidator") 请选择设备连接类型
              .form-actions
                button.btn.btn-primary.btn-lg(type="submit") 添加

</template>

<style lang="stylus">

</style>

<script>
  module.exports = {
    documentTitle: "添加产品",

    data: function () {
      return {
        model: {},
        validation: {}
      }
    },

    methods: {
      checkTypeValid: function (value) {
        return Number(value) > 0;
      },

      onSubmit: function () {
        if (this.validation.$valid) {
          console.log(1111111);
        }
      }
    }
  };
</script>
