<template lang="jade">
  div
    .row
      .col-20
        // Start: 产品简介
        .panel
          .product-card
            .thumb
              img(src="../../assets/images/dummies/180x180.png")
            .info
              .col-9.summary
                h3
                  | {{ product.name }}
                  a.fa.fa-edit(href="#", @click.prevent="showModal = true")
                p
                  em 产品描述：
                  span {{ product.description }}
                p
                  em 产品PID：
                  span {{ product.id }}
                p
                  em 产品密钥：
                  span
                    a.hl-red(href="#") 查看密钥
                .actions
                  a.btn.btn-primary(href="#")
                    i.fa.fa-plus
                    | 添加设备
                  a.btn.btn-primary(href="#")
                    i.fa.fa-reply-all
                    | 导入设备
              .col-11.status
                .status-item
                  em 8888
                  span 当前在线
                .status-item
                  em 8888
                  span 激活数
                .status-item
                  em 8888
                  span 设备数
        // Start: 产品简介

    .row
      .col-10
        // Start: 趋势
        .panel
          .panel-hd
            radio-group(:items="periods", :value="period", @check="setPeriod")
            h2 趋势
          .panel-bd
        // End: 趋势

      .col-10
        // Start: 设备分布
        .panel
          .panel-hd
            v-select(:options="regions", :value="region", @select="setRegion")
            h2 设备分布
          .panel-bd
        // End: 设备分布

    modal(:show.sync="showModal")
      h3(slot="header") 编辑产品
      .form(slot="body")
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
            button.btn.btn-default(@click.prevent.stop="showModal = false") 取消
            button.btn.btn-primary(type="submit") 添加
</template>

<script>
  var RadioGroup = require('../../components/radio-group.vue');
  var Select = require('../../components/select.vue');
  var Modal = require('../../components/modal.vue');

  module.exports = {
    components: {
      'radio-group': RadioGroup,
      'v-select': Select,
      'modal': Modal
    },

    props: {
      product: {
        type: Object,
        default: function () {
          return {};
        }
      }
    },

    data: function () {
      return {
        period: '周',
        periods: ['周', '月', '年'],
        region: '',
        regions: [
          { label: '广州', value: 'guangzhou' },
          { label: '深圳', value: 'shenzhen' },
          { label: '上海', value: 'shanghai' }
        ],
        showModal: false,
        model: {},
        validation: {}
      }
    },

    ready: function () {

    },

    methods: {
      setPeriod: function (value) {
        this.period = value;
        console.log("period: " + this.period);
      },

      setRegion: function (value) {
        this.region = value;
        console.log("region: " + this.region);
      },

      onSubmit: function () {
        /*var self = this;
        if (this.validation.$valid) {
          api.product.create(this.model).then(function (data) {
            if (__DEBUG__) {
              console.log(data);
            }
            productsStore.addProduct(data);
            self.$route.router.go({path: '/products/' + data.id});
          }).catch(function (error) {
            console.log(error);
          });
        }*/
      }
    }
  };
</script>

<style lang="stylus">
  @import '../../assets/stylus/common'

  .product-card
    clearfix()
    padding 40px 0

    .thumb
      float left
      size 180px

      img
        size 180px
        display block

    .info
      margin-left 210px

    .summary
      h3
        margin 0 0 15px
        font-size 20px

        .fa
          margin-left 5px

      p
        margin 0
        line-height 28px

        em
          display inline-block
          font-style normal
          width 72px

    .actions
      margin-top 15px

      .btn
        margin-right 10px

    .status
      clearfix()
      text-align right
      margin-top 50px

      .status-item
        float left
        width 30.33%
        border-left 1px solid #E4E4E4
        box-sizing border-box
        margin-left 3%

        &:first-child
          border none

        em
        span
          display block
          padding-right 10px

        em
          font-style normal
          font-size 35px
          color red
</style>
