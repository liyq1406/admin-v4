<template>
  <!-- 应用配置 -->
  <div class="form configure">
    <form novalidate class="clearfix">

      <!-- <pre> {{ app | json }} </pre> -->
      <div class="form-row row">
        <label class="form-control col-7">
          应用名称:
        </label>
        <div class="controls col-17">
          <div class="input-text-wrap" v-placeholder="'请填写应用名称'">
            <input type="text" class="input-text">
          </div>
        </div>
      </div>

      <div class="form-row row">
        <label class="form-control col-7">
          消息通知:
        </label>
        <div class="controls col-17">
          <label class="checkbox">
            <input type="checkbox">
            启用苹果APN服务
          </label>
        </div>
      </div>

      <div class="form-row row">
        <label class="form-control col-7">
          APN授权文件:
        </label>
        <div class="controls col-17">
          <button class="btn btn-ghost">
            <i class="fa fa-reply-all"></i>
            上传P12文件
          </button>
        </div>
      </div>

      <div class="form-row row">
        <label class="form-control col-7">
          文件密码:
        </label>
        <div class="controls col-17">
          <div class="input-text-wrap" v-placeholder="'请输入授权文件的密码'">
            <input type="text" class="input-text">
          </div>
        </div>
      </div>

      <div class="form-row row">
        <div class="controls col-offset-7">
          <label class="checkbox">
            <input type="checkbox">
            正式发布APN密钥文件
          </label>
        </div>
      </div>

      <div class="form-actions">
        <div class="col-offset-7 w100 fl">
          <button class="btn btn-primary w100">确定</button>
        </div>
        <div class="fr mr10">
          <label class="checkbox">
            <input type="checkbox">
            删除应用
          </label>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  // import api from 'api'
  // import Select from 'components/Select'
  import { globalMixins } from 'src/mixins'
  import { createPlugin, updatePlugin, removePlugin } from 'store/actions/plugins'
  import { pluginFactoryMixin } from '../mixins'
  import Modal from 'components/Modal'
  // import _ from 'lodash'

  export default {
    name: 'confogure',

    layout: 'admin',

    mixins: [globalMixins, pluginFactoryMixin],

    vuex: {
      actions: {
        createPlugin,
        updatePlugin,
        removePlugin
      }
    },

    components: {
      Modal
    },

    props: {
      app: {
        type: Object,
        default () {
          return {}
        }
      }
    },

    data () {
      return {
      }
    },

    methods: {

    }
  }
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
</style>
