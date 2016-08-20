<template>
  <div class="promote">
    <!-- <pre>{{app | json}}</pre> -->
    <div class="btn-box mt20 mb20">
      <button class="btn btn-primary w100" @click="onShowEditModal">编辑版本信息</button>
    </div>
    <c-table :headers="headers" :tables="tables" :bordered="false" @tbody-link="onShowLink"></c-table>

    <!-- 编辑版本信息 -->
    <modal :show.sync="showEditModal" :width="'550px'">
      <h3 slot="header">编辑版本信息</h3>
      <div slot="body">
        <div class="form">
          <form @submit.prevent="onSubmit">
            <div class="form-row row">
              <label class="form-control col-6">升级版本号:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入升级版本号'" class="input-text-wrap">
                  <input v-model="" type="text" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">下载地址:</label>
              <div class="controls col-18">
                <div v-placeholder="'下载地址URL'" class="input-text-wrap">
                  <input v-model="" type="text" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">HASH值:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入校验值'" class="input-text-wrap">
                  <input v-model="" type="text" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">更新日志:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入升级说明'" class="input-text-wrap">
                  <textarea class="input-text"></textarea>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
              <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </div>
      </div>
    </modal>

    <!-- Start: 查看链接-->
    <modal :show.sync="linkModal.show">
      <h3 slot="header">查看链接</h3>
      <div slot="body" class="tac">
        <p class="link-text">{{ linkModal.content }}</p>
      </div>
    </modal>
  </div>
</template>

<script>
  // import api from 'api'
  // import Select from 'components/Select'
  import { globalMixins } from 'src/mixins'
  import { createPlugin, updatePlugin, removePlugin } from 'store/actions/plugins'
  import { pluginFactoryMixin } from '../mixins'
  import Table from 'components/Table'
  import Modal from 'components/Modal'
  // import _ from 'lodash'

  export default {
    name: 'promote',

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
      Modal,
      'c-table': Table
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
        // 显示编辑浮层
        showEditModal: false,
        linkModal: {
          show: false,
          content: ''
        },
        editModal: {

        },
        versions: [
          {
            version: 'v1.0',
            logs: [],
            link: 'abcabcabsabcabcabsabcabcabsabcabcabsabcabcabsabcabcabsabcabcabsabcabcabsabcabcabsabcabcabsabcabcabsabcabcabsabcabcabsabcabcabsabcabcabsabcabcabsabcabcabsabcabcabsabcabcabsabcabcabsabcabcabs'
          }
        ],
        headers: [
          {
            key: 'version',
            title: '目标版本号',
            class: 'w150'
          },
          {
            key: 'logs',
            title: '更新日志'
          },
          {
            key: 'link',
            title: '下载链接',
            class: 'w80'
          }
        ]
      }
    },

    computed: {
      /**
       * 传入智能表格的数据对象
       * 国辉
       * @return {[type]} [description]
       */
      tables () {
        var result = []
        this.versions.forEach((item) => {
          var table = {
            version: '123',
            logs: 222,
            link: '<a class="hl-red">查看链接</a>',
            prototype: item
          }
          result.push(table)
        })
        return result
      }
    },

    ready () {
    },

    methods: {
      /**
       * 编辑浮层表单提交
       * @return {[type]} [description]
       */
      onSubmit () {
        console.log('表单提交')
      },
      /**
       * 编辑浮层取消事件
       * @return {[type]} [description]
       */
      onEditCancel () {
        this.showEditModal = false
      },
      /**
       * 显示编辑浮层
       * @return {[type]} [description]
       */
      onShowEditModal () {
        this.showEditModal = true
      },
      /**
       * 显示链接浮层
       * @param  {[type]} table [description]
       * @return {[type]}       [description]
       */
      onShowLink (table) {
        this.linkModal.show = true
        this.linkModal.content = table.prototype.link
      }
    }
  }
</script>

<style lang="stylus">
@import '../../../../assets/stylus/common'

  .promote
    min-height 400px
    .link-text
      color red
      word-break break-word

</style>
