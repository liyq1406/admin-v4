<template>
  <section class="main-wrap">
    <div class="main">
      <div class="breadcrumb">
        <a v-link="{path: '/warranty/accounts/' + $route.params.account_id}">
          <i class="fa fa-arrow-circle-left"></i>网点详情
        </a>
      </div>
      <div class="panel">
        <div class="panel-hd">
          <h2>客服详情</h2>
        </div>
        <div class="panel-bd">
          <ul class="info-details">
            <li>
              <div class="label">创建日期:</div>
              <div class="info"></div>
            </li>
          </ul>
        </div>

        <!-- start: 客服信息 -->
        <div class="panel-hd">
          <div class="actions">
            <button @click="editModal = true" class="btn btn-ghost"><i class="fa fa-edit"></i>编辑客服</button>
          </div>
          <h2>客服信息</h2>
        </div>
        <div class="panel-bd">
          <ul class="info-details">
            <li>
              <div class="label">姓名:</div>
              <div class="info"></div>
            </li>
            <li>
              <div class="label">邮箱地址:</div>
              <div class="info"></div>
            </li>
            <li>
              <div class="label">联系电话:</div>
              <div class="info"></div>
            </li>
            <li>
              <div class="label">登陆密码:</div>
              <div class="info"></div>
            </li>
            <li>
              <div class="label">状态:</div>
              <div class="info"></div>
            </li>
          </ul>
        </div>
        <!-- end: 客服信息-->
      </div>

      <modal :show="editModal" width="600px">
        <h3 slot="header">编辑客服</h3>
        <div slot="body" class="form">
          <form v-form name="addValidation" @submit.prevent="onAddSubmit">
            <div class="form-row">
              <label class="form-control">姓名:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input v-model="" type="text" name="mac" required lazy class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">邮箱地址:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input v-model="" type="text" name="mac" required lazy class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">联系号码:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input v-model="" type="text" name="mac" required lazy class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">登陆密码:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input v-model="" type="text" name="mac" required lazy class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row">
              <v-select :label="addCustomOptions[0]" width="120px">
                <label slot="label">状态</label>
                <select>
                  <option v-for="customOption in addCustomOptions" value="customOption">{{customOption}}</option>
                </select>
              </v-select>
            </div>
            <div class="form-actions">
              <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
              <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </div>
      </modal>

    </div>
  </section>
</template>

<script>
  import { globalMixins } from '../../../mixins'
  import Modal from '../../../components/Modal'
  import Select from '../../../components/Select'

  export default {
    name: 'OrderDetails',

    layout: 'admin',

    mixins: [globalMixins],

    data () {
      return {
        editModal: false,
        addValidation: '',
        addCustomOptions: ['启用', '停用']
      }
    },

    components: {
      'modal': Modal,
      'v-select': Select
    },

    methods: {
      onAddSubmit () {

      },
      onAddCancel () {
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'
</style>
