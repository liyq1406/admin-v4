<template>
  <section class="main-wrap">
    <div class="main">
      <div class="breadcrumb"><a v-link="{path: '/plugins/helpdesk/' + $route.params.app_id + '/issues'}"><i class="fa fa-arrow-circle-left"></i>用户反馈</a></div>
      <div class="panel">
        <!-- Start: 反馈详情 -->
        <div class="panel-hd">
          <h2>反馈详情</h2>
        </div>
        <div class="panel-bd">
          <div class="panel-sub-hd mt20">登记信息</div>
          <ul class="info-details">
            <li class="row">
              <div class="col-3 label">反馈日期:</div>
              <div class="col-21 info">2016-01-15 10:43</div>
            </li>
            <li class="row">
              <div class="col-3 label">反馈类型:</div>
              <div class="col-21 info">使用咨询</div>
            </li>
            <li class="row">
              <div class="col-3 label">产品名称:</div>
              <div class="col-21 info">电炖锅</div>
            </li>
            <li class="row">
              <div class="col-3 label">固件版本:</div>
              <div class="col-21 info">1.0</div>
            </li>
            <li class="row">
              <div class="col-3 label">系统信息:</div>
              <div class="col-21 info">iPhone, OS8.2</div>
            </li>
            <li class="row">
              <div class="col-3 label">软件版本:</div>
              <div class="col-21 info">1.6</div>
            </li>
            <li class="row">
              <div class="col-3 label">系统语言:</div>
              <div class="col-21 info">简体中文</div>
            </li>
            <li class="split-line"></li>
            <li class="row">
              <div class="col-3 label">客户姓名:</div>
              <div class="col-21 info">张先生</div>
            </li>
            <li class="row">
              <div class="col-3 label">联系方式:</div>
              <div class="col-21 info">13800138000</div>
            </li>
            <li class="row">
              <div class="col-3 label">反馈信息:</div>
              <div class="col-21 info">这口锅买回来之后煮米一直煮不熟，到底要放多少水呢？我没找到使用指南</div>
            </li>
            <li class="row">
              <div class="col-3 label">图片信息:</div>
              <div class="col-21 info">
                <v-gallery :pics="pics" :curr="currPicIndex" :show="isShowGallery" @close="handleGalleryClose" @switch="handlePicSwitch">
                  <div class="pic-grid">
                    <div class="pic" v-for="pic in pics" track-by="$index">
                      <img :src="pic" alt="" @click="handleImgClick($index)">
                    </div>
                  </div>
                </v-gallery>
              </div>
            </li>
          </ul>
          <div class="panel-sub-hd">处理记录</div>
          <div class="form">
            <div class="form-row row">
              <div class="col-3 label">客服回复</div>
              <div class="col-16">
                <div class="input-text-wrap" v-placeholder="'请填写回复内容'">
                  <textarea class="input-text"></textarea>
                </div>
              </div>
            </div>
            <div class="form-actions row">
              <div class="col-offset-3">
                <button class="btn btn-primary">{{ $t('common.ok') }}</button>
              </div>
            </div>
          </div>
        </div>
        <!-- End: 反馈详情 -->
      </div>
    </div>
  </section>
</template>

<script>
  import { globalMixins } from '../../../mixins'
  import { pluginMixins } from '../mixins'
  import Gallery from '../../../components/Gallery'
  // import api from '../../../api'
  // import _ from 'lodash'

  export default {
    name: 'IssueDetails',

    layout: 'admin',

    mixins: [globalMixins, pluginMixins],

    data () {
      return {
        pics: [
          'https://ss2.bdstatic.com/kfoZeXSm1A5BphGlnYG/skin/729.jpg?2',
          'https://ss1.bdstatic.com/kvoZeXSm1A5BphGlnYG/skin/732.jpg?2'
        ],
        currPicIndex: 0,
        isShowGallery: false
      }
    },

    components: {
      'v-gallery': Gallery
    },

    ready () {
    },

    route: {
      data () {
      }
    },

    methods: {
      /**
       * 处理图片点击
       * @params {Number} index 图片索引
       */
      handleImgClick (index) {
        this.currPicIndex = index
        this.isShowGallery = true
      },

      /**
       * 处理画廊关闭
       * @param  {Boolean} visible 是否可见
       */
      handleGalleryClose (visible) {
        this.isShowGallery = visible
      },

      /**
       * 处理图片切换
       * @param  {Number} index 图片索引
       */
      handlePicSwitch (index) {
        this.currPicIndex = index
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'

  .form
    max-width none

    .label
      text-indent 10px

  // 图片列表
  .pic-grid
    clearfix()
    margin-top 10px

    .pic
      float left
      size 120px 80px
      margin-right 5px
      cursor pointer

      img
        display block
        size 100%
</style>
