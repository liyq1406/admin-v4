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
                h3 {{ product.name }}
                p
                  em 产品描述：
                  span {{ product.description }}
                p
                  em 产品PID：
                  span {{ product.pid }}
                p
                  em 产品密钥：
                  span
                    a.highlight(href="#") 查看密钥
                .actions
                  a.btn.btn-primary(href="#") 添加设备
                  a.btn.btn-primary(href="#") 导入设备
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
</template>

<script>
  var RadioGroup = require('../../components/radio-group.vue')
  var Select = require('../../components/select.vue')

  module.exports = {
    components: {
      'radio-group': RadioGroup,
      'v-select': Select
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
        regions: ['广州', '深圳', '上海']
      }
    },

    methods: {
      setPeriod: function (value) {
        this.period = value;
        console.log("period: " + this.period);
      },

      setRegion: function (value) {
        this.region = value;
        console.log("region: " + this.region);
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