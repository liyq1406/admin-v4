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
                  .input-text-wrap(v-placeholder="'请输入产品名称'")
                    input.input-text(v-model="model.name", type="text", v-form-ctrl, name="name", maxlength="32", required)
                  .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
                    span(v-if="validation.name.$error.required") 请输入产品名称
                  .form-tips.form-tips-error(v-if="validation.name.$dirty")
                    span(v-if="validation.name.$error.required") 请输入产品名称
                    span(v-if="validation.name.$error.maxlength") 产品名称最大不能超过32位
              .form-row
                label.form-control 产品描述：
                .controls
                  .input-text-wrap(v-placeholder="'请输入产品描述'")
                    textarea.input-text(v-model="model.description", type="text", v-form-ctrl, name="description", maxlength="250", required)
                  .form-tips.form-tips-error(v-if="validation.$submitted && validation.description.$pristine")
                    span(v-if="validation.description.$error.required") 请输入产品描述
                  .form-tips.form-tips-error(v-if="validation.description.$dirty")
                    span(v-if="validation.description.$error.required") 请输入产品描述
                    span(v-if="validation.description.$error.maxlength") 产品描述最大不能超过250字
              .form-row
                label.form-control 设备类型：
                .controls
                  .select
                    select(v-model="model.link_type", v-form-ctrl, name="link_type")
                      option(value="1", selected) wifi设备
                      option(value="2") Zigbee网关
                      option(value="3") 蓝牙设备
              .form-actions
                button.btn.btn-primary.btn-lg(type="submit") 添加

</template>

<style lang="stylus">

</style>

<script>
  var api = require('../../api');

  module.exports = {
    documentTitle: "添加产品",

    data: function () {
      return {
        model: {},
        validation: {}
      }
    },

    methods: {
      onSubmit: function () {
        var self = this;
        if (this.validation.$valid) {
          api.product.create(this.model).then(function (data) {
            if (__DEBUG__) {
              console.log(data);
            }
            self.$route.router.go({path: '/products/' + data.id});

          }).catch(function (error) {
            console.log(error);
          });
        }
      }
    }
  };
</script>
